import hashlib
from datetime import datetime, timedelta, timezone

import httpx
from tenacity import retry, retry_if_exception_type, stop_after_attempt, wait_exponential

from src.config import env
from src.db.postgres import SessionFactory
from src.models.user_integration import UserIntegration
from src.schemas.enrichment_result import CalendarEvent
from src.services.integration_repo import IntegrationRepo
from src.utils.credentials import decrypt_credentials, encrypt_credentials
from src.utils.logger import get_logger

logger = get_logger(__name__)

_TOKEN_URL = "https://oauth2.googleapis.com/token"
_EVENTS_URL = "https://www.googleapis.com/calendar/v3/calendars/primary/events"
_EVENT_DURATION_MINUTES = 60


def _ical_uid(event_title: str, event_datetime: str) -> str:
    raw = f"{event_title}:{event_datetime}"
    digest = hashlib.sha256(raw.encode()).hexdigest()[:16]
    return f"mindspace-{digest}@mindspace.ai"


def _end_datetime(start_iso: str) -> str:
    dt = datetime.fromisoformat(start_iso)
    return (dt + timedelta(minutes=_EVENT_DURATION_MINUTES)).isoformat()


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


async def _get_fresh_token(integration: UserIntegration) -> str:
    creds: dict = decrypt_credentials(integration.credentials)
    expires_at = datetime.fromisoformat(creds["expiresAt"])

    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if expires_at.timestamp() > datetime.now(tz=timezone.utc).timestamp() + 60:
        return creds["accessToken"]

    access_token, new_expires_at = await _refresh_token(creds["refreshToken"])
    updated = {**creds, "accessToken": access_token, "expiresAt": new_expires_at}

    async with SessionFactory() as session, session.begin():
        await IntegrationRepo.update_credentials(session, integration.id, encrypt_credentials(updated))

    return access_token


@retry(
    retry=retry_if_exception_type(httpx.HTTPStatusError),
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    reraise=True,
)
async def _create_event(access_token: str, event: CalendarEvent, tz_name: str) -> None:
    uid = _ical_uid(event.event_title, event.event_datetime)  # type: ignore[arg-type]
    end = _end_datetime(event.event_datetime)  # type: ignore[arg-type]

    body = {
        "iCalUID": uid,
        "summary": event.event_title,
        "description": event.event_description or "",
        "start": {"dateTime": event.event_datetime, "timeZone": tz_name},
        "end": {"dateTime": end, "timeZone": tz_name},
    }
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            _EVENTS_URL,
            json=body,
            headers={"Authorization": f"Bearer {access_token}"},
        )
        resp.raise_for_status()


async def sync_calendar_event(user_id: int, event: CalendarEvent, tz_name: str) -> None:
    if not event.has_deadline or not event.event_datetime or not event.event_title:
        return

    logger.info(
        "Deadline detected for user %d — title='%s' datetime='%s' tz='%s' — syncing to Google Calendar",
        user_id,
        event.event_title,
        event.event_datetime,
        tz_name,
    )

    try:
        async with SessionFactory() as session:
            integration = await IntegrationRepo.get_google_calendar(session, user_id)

        if integration is None:
            logger.info("User %d has no Google Calendar connected — skipping sync", user_id)
            return

        access_token = await _get_fresh_token(integration)
        await _create_event(access_token, event, tz_name)

        logger.info(
            "Successfully synced calendar event for user %d: '%s' at %s (%s)",
            user_id,
            event.event_title,
            event.event_datetime,
            tz_name,
        )
    except Exception:
        logger.exception(
            "Failed to sync calendar event for user %d: '%s' — skipping",
            user_id,
            event.event_title,
        )
