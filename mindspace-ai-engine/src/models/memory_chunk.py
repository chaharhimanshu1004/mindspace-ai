from datetime import datetime
from uuid import UUID

from pgvector.sqlalchemy import Vector
from sqlalchemy import DateTime, Integer, Text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from src.config import env

from .base import Base


class MemoryChunk(Base):
    __tablename__ = "memory_chunks"

    id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True)
    memory_id: Mapped[UUID] = mapped_column("memoryId", PG_UUID(as_uuid=True), nullable=False)
    user_id: Mapped[int] = mapped_column("userId", Integer, nullable=False)
    chunk_index: Mapped[int] = mapped_column("chunkIndex", Integer, nullable=False, default=0)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    embedding: Mapped[list[float] | None] = mapped_column(Vector(env.EMBED_DIM), nullable=True)
    created_at: Mapped[datetime] = mapped_column("createdAt", DateTime, nullable=False)
