import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Procedure(Base):
    __tablename__ = "procedures"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id: Mapped[str] = mapped_column(String, ForeignKey("cases.id"), unique=True)

    cpt_code: Mapped[str | None] = mapped_column(String(10))
    cpt_description: Mapped[str | None] = mapped_column(String(500))
    icd10_code: Mapped[str | None] = mapped_column(String(10))
    icd10_description: Mapped[str | None] = mapped_column(String(500))
    ordering_physician: Mapped[str | None] = mapped_column(String(200))
    cpt_valid: Mapped[bool | None] = mapped_column(Boolean)
    icd10_valid: Mapped[bool | None] = mapped_column(Boolean)

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    case: Mapped["Case"] = relationship(back_populates="procedure")  # noqa: F821
