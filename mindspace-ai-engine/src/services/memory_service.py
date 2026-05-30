from uuid import UUID

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from src.models import Memory, MemoryStatus
from src.utils.datetimes import utc_now_naive


class MemoryService:
    @staticmethod
    async def get(session: AsyncSession, memory_id: UUID, user_id: int) -> Memory | None:
        stmt = select(Memory).where(Memory.id == memory_id, Memory.user_id == user_id)
        result = await session.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def set_status(
        session: AsyncSession,
        memory_id: UUID,
        status: MemoryStatus,
    ) -> None:
        stmt = (
            update(Memory)
            .where(Memory.id == memory_id)
            .values(status=status.value, updated_at=utc_now_naive())
        )
        await session.execute(stmt)
