from datetime import datetime, timezone

import httpx
from sqlalchemy.ext.asyncio import AsyncSession
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

from src.config import env
from src.models.user_integration import UserIntegration
from src.schemas.enrichment_result import CalendarEvent
from src.services.integration_repo import IntegrationRepo
from src.utils.logger import get_logger

logger = get_logger(__name__)

_TOKEN_URL = "https://oauth2.googleapis.com/token"
_EVENTS_URL = "https://www.googleapis.com/calendar/v3/calendars/primary/events"


async def _refresh_token(refresh_token: str) -> tuple[str, str]:
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            _TOKEN_URL,
            data={
                "refresh_token": refresh_token,
                "client_id": env.GOOGLE_CLIENT_ID,
                "client_secret": env.GOOGLE_CLIENT_SECRET,
                "grant_type": "refresh_token",
            },
        )
        resp.raise_for_status()
        data = resp.json()
        expires_at = datetime.fromtimestamp(
            datetime.now(tz=timezone.utc).timestamp() + data["expires_in"],
            tz=timezone.utc,
        ).isoformat()
        return data["access_token"], expires_at


async def _get_fresh_token(session: AsyncSession, integration: UserIntegration) -> str:
    creds: dict = integration.credentials
    expires_at = datetime.fromisoformat(creds["expiresAt"])

    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if expires_at.timestamp() > datetime.now(tz=timezone.utc).timestamp() + 60:
        return creds["accessToken"]

    access_token, new_expires_at = await _refresh_token(creds["refreshToken"])
    updated = {**creds, "accessToken": access_token, "expiresAt": new_expires_at}
    await IntegrationRepo.update_credentials(session, integration.id, updated)
    return access_token


@retry(
    retry=retry_if_exception_type(httpx.HTTPStatusError),
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    reraise=True,
)
async def _create_event(access_token: str, event: CalendarEvent) -> None:
    body = {
        "summary": event.event_title,
        "description": event.event_description or "",
        "start": {"dateTime": event.event_datetime, "timeZone": "UTC"},
        "end": {"dateTime": event.event_datetime, "timeZone": "UTC"},
    }
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            _EVENTS_URL,
            json=body,
            headers={"Authorization": f"Bearer {access_token}"},
        )
        resp.raise_for_status()


async def sync_calendar_event(session: AsyncSession, user_id: int, event: CalendarEvent) -> None:
    if not event.has_deadline or not event.event_datetime or not event.event_title:
        return

    logger.info(
        "Deadline detected for user %d — title='%s' datetime='%s' — syncing to Google Calendar",
        user_id,
        event.event_title,
        event.event_datetime,
    )

    try:
        integration = await IntegrationRepo.get_google_calendar(session, user_id)
        if integration is None:
            logger.info("User %d has no Google Calendar connected — skipping sync", user_id)
            return

        access_token = await _get_fresh_token(session, integration)
        await _create_event(access_token, event)

        logger.info(
            "Successfully synced calendar event for user %d: '%s' at %s",
            user_id,
            event.event_title,
            event.event_datetime,
        )
    except Exception:
        logger.exception(
            "Failed to sync calendar event for user %d: '%s' — skipping",
            user_id,
            event.event_title,
        )
