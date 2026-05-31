from datetime import datetime
from uuid import UUID

from pgvector.sqlalchemy import Vector
from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from src.config import env

from .base import Base


class Entity(Base):
    __tablename__ = "entities"

    id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True)
    user_id: Mapped[int] = mapped_column("userId", Integer, nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=False)
    entity_type: Mapped[str] = mapped_column("entityType", String, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    embedding: Mapped[list[float] | None] = mapped_column(Vector(env.EMBED_DIM), nullable=True)
    mention_count: Mapped[int] = mapped_column("mentionCount", Integer, nullable=False, default=1)
    first_seen: Mapped[datetime] = mapped_column("firstSeen", DateTime, nullable=False)
    last_seen: Mapped[datetime] = mapped_column("lastSeen", DateTime, nullable=False)
