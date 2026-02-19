import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Document(Base):
    __tablename__ = "documents"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id: Mapped[str] = mapped_column(String, ForeignKey("cases.id"))

    name: Mapped[str] = mapped_column(String(200))
    doc_key: Mapped[str] = mapped_column(String(100))  # e.g. "conservative-therapy"
    status: Mapped[str] = mapped_column(String(20), default="missing")  # found, missing, recommended, na
    source: Mapped[str | None] = mapped_column(String(100))
    date: Mapped[str | None] = mapped_column(String(100))
    required: Mapped[bool] = mapped_column(Boolean, default=True)
    file_path: Mapped[str | None] = mapped_column(String(500))

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    case: Mapped["Case"] = relationship(back_populates="documents")  # noqa: F821
