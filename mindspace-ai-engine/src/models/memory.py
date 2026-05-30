from datetime import datetime
from enum import StrEnum
from uuid import UUID

from sqlalchemy import ARRAY, DateTime, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base


class MemoryStatus(StrEnum):
    PENDING = "pending"
    EMBEDDED = "embedded"
    ENRICHED = "enriched"
    LINKED = "linked"
    FAILED = "failed"


class Memory(Base):
    __tablename__ = "memories"

    id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True)
    user_id: Mapped[int] = mapped_column("userId", Integer, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)

    title: Mapped[str | None] = mapped_column(String, nullable=True)
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    topics: Mapped[list[str]] = mapped_column(ARRAY(String), nullable=False, default=list)

    status: Mapped[str] = mapped_column(String, nullable=False, default=MemoryStatus.PENDING.value)

    created_at: Mapped[datetime] = mapped_column("createdAt", DateTime, nullable=False)
    updated_at: Mapped[datetime] = mapped_column("updatedAt", DateTime, nullable=False)
