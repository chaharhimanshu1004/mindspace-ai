from enum import StrEnum

from pydantic import BaseModel, Field, field_validator


class EntityType(StrEnum):
    CONCEPT = "concept"
    PERSON = "person"
    PROJECT = "project"
    PLACE = "place"
    TOOL = "tool"


class EnrichedEntity(BaseModel):
    name: str
    entity_type: EntityType = Field(alias="entityType")
    salience: float = Field(default=0.5)

    @field_validator("name")
    @classmethod
    def _strip_name(cls, v: str) -> str:
        cleaned = v.strip()
        if not cleaned:
            raise ValueError("name cannot be empty after trim")
        return cleaned[:120]

    @field_validator("salience")
    @classmethod
    def _clamp_salience(cls, v: float) -> float:
        return max(0.0, min(1.0, v))


class EnrichmentResult(BaseModel):
    title: str
    summary: str
    topics: list[str] = Field(default_factory=list)
    entities: list[EnrichedEntity] = Field(default_factory=list)

    @field_validator("title", "summary")
    @classmethod
    def _strip_text(cls, v: str) -> str:
        cleaned = v.strip()
        if not cleaned:
            raise ValueError("must not be empty after trim")
        return cleaned

    @field_validator("topics")
    @classmethod
    def _normalize_topics(cls, v: list[str]) -> list[str]:
        seen: set[str] = set()
        out: list[str] = []
        for raw in v:
            t = raw.strip().lower()
            if not t or t in seen:
                continue
            seen.add(t)
            out.append(t)
        return out
