from fastapi import Header, HTTPException, status

from src.config import env


async def require_internal_token(
    x_api_key: str | None = Header(default=None, alias="x-api-key"),
) -> None:
    if not x_api_key or x_api_key != env.INTERNAL_API_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API key",
        )
