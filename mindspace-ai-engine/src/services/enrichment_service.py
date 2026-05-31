from dataclasses import dataclass
from uuid import UUID

from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from src.config import env
from src.llm import EmbedRequest, StructuredRequest, get_provider
from src.models import MemoryEntity, MemoryStatus
from src.prompts.enrich import ENRICH_SYSTEM, build_enrich_prompt
from src.schemas.enrichment_gemini_schema import build_enrichment_gemini_schema
from src.schemas.enrichment_result import EnrichmentResult
from src.services.entity_service import EntityService, EntityUpsertInput
from src.services.memory_service import MemoryService
from src.utils.logger import get_logger

logger = get_logger(__name__)


@dataclass(slots=True)
class EnrichmentBundle:
    result: EnrichmentResult
    entity_embeddings: list[list[float]]
    model: str


class EnrichmentService:
    @staticmethod
    async def enrich(
        content: str,
        provider_name: str | None = None,
    ) -> EnrichmentBundle:
        text = content.strip()
        if not text:
            raise ValueError("Cannot enrich empty content")

        provider = get_provider(provider_name)
        structured = await provider.complete_structured(
            StructuredRequest(
                prompt=build_enrich_prompt(text),
                schema=EnrichmentResult,
                wire_schema=build_enrichment_gemini_schema(),
                system=ENRICH_SYSTEM,
                temperature=0.2,
            )
        )
        result = structured.parsed

        entity_embeddings: list[list[float]] = []
        if result.entities:
            embed_resp = await provider.embed(
                EmbedRequest(texts=[e.name for e in result.entities])
            )
            if embed_resp.dim != env.EMBED_DIM:
                raise RuntimeError(
                    f"Entity embedding dim mismatch: provider={embed_resp.dim}, expected={env.EMBED_DIM}"
                )
            entity_embeddings = embed_resp.vectors

        logger.info(
            "Enriched memory: title='%s' topics=%d entities=%d via %s",
            result.title,
            len(result.topics),
            len(result.entities),
            structured.model,
        )
        return EnrichmentBundle(
            result=result,
            entity_embeddings=entity_embeddings,
            model=structured.model,
        )

    @staticmethod
    async def persist(
        session: AsyncSession,
        memory_id: UUID,
        user_id: int,
        bundle: EnrichmentBundle,
    ) -> int:
        result = bundle.result

        entity_ids: list[tuple[UUID, float]] = []
        for index, raw_entity in enumerate(result.entities):
            embedding = bundle.entity_embeddings[index]
            entity = await EntityService.upsert(
                session,
                user_id,
                EntityUpsertInput(
                    name=raw_entity.name,
                    entity_type=raw_entity.entity_type.value,
                    embedding=embedding,
                ),
            )
            entity_ids.append((entity.id, raw_entity.salience))

        if entity_ids:
            await EnrichmentService._link_memory_entities(
                session, memory_id, user_id, entity_ids
            )

        await MemoryService.set_enrichment(
            session=session,
            memory_id=memory_id,
            title=result.title,
            summary=result.summary,
            topics=result.topics,
            status=MemoryStatus.ENRICHED,
        )
        await session.flush()

        logger.info(
            "Persisted enrichment for memory %s (entities=%d, topics=%d)",
            memory_id,
            len(entity_ids),
            len(result.topics),
        )
        return len(entity_ids)

    @staticmethod
    async def _link_memory_entities(
        session: AsyncSession,
        memory_id: UUID,
        user_id: int,
        entities: list[tuple[UUID, float]],
    ) -> None:
        rows = [
            {
                "memory_id": memory_id,
                "entity_id": entity_id,
                "user_id": user_id,
                "salience": salience,
            }
            for entity_id, salience in entities
        ]
        stmt = insert(MemoryEntity).values(rows)
        stmt = stmt.on_conflict_do_update(
            index_elements=[MemoryEntity.memory_id, MemoryEntity.entity_id],
            set_={MemoryEntity.salience: stmt.excluded.salience},
        )
        await session.execute(stmt)
