from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Env(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    APP_ENV: Literal["development", "production"] = "development"
    PORT: int = 5001

    DATABASE_URL: str
    DIRECT_URL: str | None = None

    REDIS_URL: str = "redis://localhost:6379"

    LLM_PROVIDER: Literal["gemini", "openai"] = "gemini"
    GEMINI_API_KEY: str
    GEMINI_CHAT_MODEL: str = "gemini-2.5-flash"
    GEMINI_EMBED_MODEL: str = "text-embedding-004"

    EMBED_DIM: int = Field(default=768, gt=0)

    STREAM_BLOCK_MS: int = Field(default=5000, gt=0)
    STREAM_BATCH_SIZE: int = Field(default=1, gt=0)
    MAX_DELIVERIES: int = Field(default=5, gt=0)
    STAGE_TIMEOUT_SECONDS: int = Field(default=90, gt=0)

    PEL_RECOVERY_INTERVAL_SECONDS: int = Field(default=300, gt=0)
    PEL_RECOVERY_MIN_IDLE_SECONDS: int = Field(default=120, gt=0)
    PEL_RECOVERY_BATCH_SIZE: int = Field(default=50, gt=0)

    ENTITY_DEDUP_COSINE: float = Field(default=0.85, ge=0.0, le=1.0)

    INTERNAL_API_TOKEN: str
    SEARCH_TOP_K: int = Field(default=8, gt=0, le=50)

    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    CREDENTIALS_SECRET: str


env = Env()  # type: ignore[call-arg]
