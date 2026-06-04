from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.user_integration import UserIntegration
from src.utils.datetimes import utc_now_naive


class IntegrationRepo:
    @staticmethod
    async def get_google_calendar(session: AsyncSession, user_id: int) -> UserIntegration | None:
        stmt = select(UserIntegration).where(
            UserIntegration.user_id == user_id,
            UserIntegration.provider == "google_calendar",
        )
        result = await session.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def update_credentials(session: AsyncSession, integration_id: int, credentials: dict) -> None:
        stmt = (
            update(UserIntegration)
            .where(UserIntegration.id == integration_id)
            .values(credentials=credentials, updated_at=utc_now_naive())
        )
        await session.execute(stmt)
