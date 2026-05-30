from uuid import UUID

from pydantic import BaseModel, Field


class EnrichJobPayload(BaseModel):
    memoryId: UUID
    userId: int = Field(ge=1)
    attempt: int = Field(default=0, ge=0)
    enqueuedAt: int | None = None

    @classmethod
    def from_stream_fields(cls, fields: dict[str, str]) -> "EnrichJobPayload":
        return cls.model_validate(fields)
