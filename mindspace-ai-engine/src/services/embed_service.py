from dataclasses import dataclass
from uuid import UUID, uuid4

from sqlalchemy.ext.asyncio import AsyncSession

from src.config import env
from src.llm import EmbedRequest, get_provider
from src.models import MemoryChunk, MemoryStatus
from src.services.memory_service import MemoryService
from src.utils.datetimes import utc_now_naive
from src.utils.logger import get_logger

logger = get_logger(__name__)


@dataclass(slots=True)
class EmbedResult:
    chunks: list[str]
    vectors: list[list[float]]
    model: str


class EmbedService:
    @staticmethod
    def _chunk(content: str) -> list[str]:
        text = content.strip()
        return [text] if text else []

    @staticmethod
    async def embed(content: str, provider_name: str | None = None) -> EmbedResult:
        chunks = EmbedService._chunk(content) # for now -> only one chunk per memory, have to refactor later
        if not chunks:
            raise ValueError("Cannot embed empty content")

        provider = get_provider(provider_name)
        result = await provider.embed(EmbedRequest(texts=chunks))

        if result.dim != env.EMBED_DIM:
            raise RuntimeError(
                f"Embedding dim mismatch: provider={result.dim}, expected={env.EMBED_DIM}"
            )

        return EmbedResult(chunks=chunks, vectors=result.vectors, model=result.model)

    @staticmethod
    async def persist(
        session: AsyncSession,
        memory_id: UUID,
        user_id: int,
        result: EmbedResult,
    ) -> int:
        now = utc_now_naive()
        rows = [
            MemoryChunk(
                id=uuid4(),
                memory_id=memory_id,
                user_id=user_id,
                chunk_index=idx,
                content=text,
                embedding=vector,
                created_at=now,
            )
            for idx, (text, vector) in enumerate(
                zip(result.chunks, result.vectors, strict=True)
            )
        ]
        session.add_all(rows)
        await session.flush()

        await MemoryService.set_status(session, memory_id, MemoryStatus.EMBEDDED)

        logger.info(
            "Persisted %d chunk(s) for memory %s (model=%s)",
            len(rows),
            memory_id,
            result.model,
        )
        return len(rows)
