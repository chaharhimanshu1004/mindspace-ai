from dataclasses import dataclass
from uuid import UUID, uuid4

from sqlalchemy import select, update
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from src.config import env
from src.models import Entity
from src.utils.datetimes import utc_now_naive
from src.utils.logger import get_logger

logger = get_logger(__name__)


@dataclass(slots=True)
class EntityUpsertInput:
    name: str
    entity_type: str
    embedding: list[float]


class EntityService:
    @staticmethod
    async def _find_exact(
        session: AsyncSession,
        user_id: int,
        name: str,
        entity_type: str,
    ) -> Entity | None:
        stmt = select(Entity).where(
            Entity.user_id == user_id,
            Entity.name == name,
            Entity.entity_type == entity_type,
        )
        return (await session.execute(stmt)).scalar_one_or_none()

    @staticmethod
    async def _find_by_cosine(
        session: AsyncSession,
        user_id: int,
        entity_type: str,
        embedding: list[float],
        threshold: float,
    ) -> Entity | None:
        distance = Entity.embedding.cosine_distance(embedding)
        stmt = (
            select(Entity, distance.label("distance"))
            .where(
                Entity.user_id == user_id,
                Entity.entity_type == entity_type,
                Entity.embedding.is_not(None),
            )
            .order_by(distance)
            .limit(1)
        )
        row = (await session.execute(stmt)).first()
        if row is None:
            return None
        entity, distance_value = row
        similarity = 1.0 - float(distance_value)
        if similarity < threshold:
            return None
        return entity

    @staticmethod
    async def _insert_new(
        session: AsyncSession,
        user_id: int,
        name: str,
        entity_type: str,
        embedding: list[float],
    ) -> Entity:
        now = utc_now_naive()
        new_id = uuid4()
        stmt = (
            insert(Entity)
            .values(
                id=new_id,
                user_id=user_id,
                name=name,
                entity_type=entity_type,
                embedding=embedding,
                mention_count=1,
                first_seen=now,
                last_seen=now,
            )
            .on_conflict_do_update(
                index_elements=[Entity.user_id, Entity.name, Entity.entity_type],
                set_={
                    Entity.mention_count: Entity.mention_count + 1,
                    Entity.last_seen: now,
                },
            )
            .returning(Entity)
        )
        return (await session.execute(stmt)).scalar_one()

    @staticmethod
    async def _bump_mention(
        session: AsyncSession,
        entity_id: UUID,
    ) -> None:
        now = utc_now_naive()
        stmt = (
            update(Entity)
            .where(Entity.id == entity_id)
            .values(mention_count=Entity.mention_count + 1, last_seen=now)
        )
        await session.execute(stmt)

    @staticmethod
    async def upsert(
        session: AsyncSession,
        user_id: int,
        input: EntityUpsertInput,
    ) -> Entity:
        exact = await EntityService._find_exact(
            session, user_id, input.name, input.entity_type
        )
        if exact is not None:
            await EntityService._bump_mention(session, exact.id)
            return exact

        nearest = await EntityService._find_by_cosine(
            session,
            user_id,
            input.entity_type,
            input.embedding,
            env.ENTITY_DEDUP_COSINE,
        )
        if nearest is not None:
            logger.info(
                "Entity dedup: '%s' merged into existing '%s' (%s)",
                input.name,
                nearest.name,
                input.entity_type,
            )
            await EntityService._bump_mention(session, nearest.id)
            return nearest

        return await EntityService._insert_new(
            session,
            user_id,
            input.name,
            input.entity_type,
            input.embedding,
        )
