from datetime import datetime, timezone

import zoneinfo


def utc_now_naive() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


def now_in_tz(tz_name: str) -> datetime:
    try:
        tz = zoneinfo.ZoneInfo(tz_name)
    except (zoneinfo.ZoneInfoNotFoundError, KeyError):
        tz = zoneinfo.ZoneInfo("UTC")
    return datetime.now(tz=tz)


def format_for_prompt(dt: datetime) -> str:
    return dt.strftime("%Y-%m-%dT%H:%M:%S %Z")
