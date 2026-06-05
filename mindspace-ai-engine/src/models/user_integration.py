from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base


class UserIntegration(Base):
    __tablename__ = "user_integrations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column("userId", Integer, nullable=False)
    provider: Mapped[str] = mapped_column(String, nullable=False)
    credentials: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column("createdAt", DateTime, nullable=False)
    updated_at: Mapped[datetime] = mapped_column("updatedAt", DateTime, nullable=False)
