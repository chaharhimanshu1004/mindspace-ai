from uuid import UUID

from sqlalchemy import Float, Integer
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base


class MemoryEntity(Base):
    __tablename__ = "memory_entities"

    memory_id: Mapped[UUID] = mapped_column(
        "memoryId", PG_UUID(as_uuid=True), primary_key=True
    )
    entity_id: Mapped[UUID] = mapped_column(
        "entityId", PG_UUID(as_uuid=True), primary_key=True
    )
    user_id: Mapped[int] = mapped_column("userId", Integer, nullable=False)
    salience: Mapped[float] = mapped_column(Float, nullable=False, default=0.5)
