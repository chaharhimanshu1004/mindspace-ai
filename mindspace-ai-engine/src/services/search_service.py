from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from src.config import env
from src.llm import EmbedRequest, get_provider
from src.models import Memory, MemoryChunk, MemoryStatus
from src.schemas.search import SearchHit
from src.utils.logger import get_logger

logger = get_logger(__name__)


class SearchService:
    @staticmethod
    async def _embed_query(query: str) -> list[float]:
        provider = get_provider()
        result = await provider.embed(EmbedRequest(texts=[query]))
        if result.dim != env.EMBED_DIM:
            raise RuntimeError(
                f"Query embedding dim mismatch: provider={result.dim}, expected={env.EMBED_DIM}"
            )
        return result.vectors[0]

    @staticmethod
    async def search(
        session: AsyncSession,
        user_id: int,
        query: str,
        limit: int,
    ) -> list[SearchHit]:
        embedding = await SearchService._embed_query(query)
        distance = MemoryChunk.embedding.cosine_distance(embedding)

        best_chunk = (
            select(
                MemoryChunk.memory_id,
                func.min(distance).label("best_distance"),
            )
            .where(MemoryChunk.embedding.is_not(None))
            .group_by(MemoryChunk.memory_id)
            .subquery()
        )

        stmt = (
            select(
                Memory.id.label("memory_id"),
                Memory.title,
                Memory.summary,
                Memory.content,
                Memory.created_at,
                best_chunk.c.best_distance.label("distance"),
            )
            .join(best_chunk, best_chunk.c.memory_id == Memory.id)
            .where(
                Memory.user_id == user_id,
                Memory.status != MemoryStatus.FAILED.value,
            )
            .order_by(best_chunk.c.best_distance)
            .limit(limit)
        )

        rows = (await session.execute(stmt)).all()
        hits: list[SearchHit] = []
        for row in rows:
            similarity = 1.0 - float(row.distance)
            hits.append(
                SearchHit(
                    memoryId=row.memory_id,
                    score=similarity,
                    title=row.title,
                    summary=row.summary,
                    content=row.content,
                    createdAt=row.created_at,
                )
            )

        logger.info(
            "search user=%d query_len=%d returned=%d",
            user_id,
            len(query),
            len(hits),
        )
        return hits
