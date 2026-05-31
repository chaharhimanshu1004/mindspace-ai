from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class SearchRequest(BaseModel):
    user_id: int = Field(ge=1, alias="userId")
    query: str = Field(min_length=1, max_length=2000)
    limit: int = Field(default=8, ge=1, le=50)

    model_config = {"populate_by_name": True}


class SearchHit(BaseModel):
    memory_id: UUID = Field(alias="memoryId")
    score: float
    title: str | None
    summary: str | None
    content: str
    created_at: datetime = Field(alias="createdAt")

    model_config = {"populate_by_name": True, "from_attributes": True}


class SearchResponse(BaseModel):
    hits: list[SearchHit]
