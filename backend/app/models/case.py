import uuid
from datetime import datetime

from sqlalchemy import JSON, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Case(Base):
    __tablename__ = "cases"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    case_number: Mapped[str] = mapped_column(String(20), unique=True, index=True)
    status: Mapped[str] = mapped_column(String(30), default="draft")  # draft, in-progress, submitted, approved, denied
    current_step: Mapped[str] = mapped_column(String(30), default="patient")
    priority: Mapped[str] = mapped_column(String(20), default="medium")  # urgent, high, medium, low

    # Foreign keys
    patient_id: Mapped[str | None] = mapped_column(String, ForeignKey("patients.id"))
    payer_id: Mapped[str | None] = mapped_column(String, ForeignKey("payers.id"))
    assigned_coordinator_id: Mapped[str | None] = mapped_column(String)

    # Approval tracking
    approval_likelihood: Mapped[int] = mapped_column(Integer, default=0)
    approval_factors: Mapped[list | None] = mapped_column(JSON, default=list)

    # Step states
    steps: Mapped[list | None] = mapped_column(JSON, default=list)

    # Metadata
    department: Mapped[str | None] = mapped_column(String(100))
    deadline: Mapped[str | None] = mapped_column(String(30))
    auth_number: Mapped[str | None] = mapped_column(String(50))
    denial_reason: Mapped[str | None] = mapped_column(String)
    notes: Mapped[str | None] = mapped_column(String)

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
    submitted_at: Mapped[datetime | None] = mapped_column(DateTime)
    decided_at: Mapped[datetime | None] = mapped_column(DateTime)
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime)

    # Relationships
    patient: Mapped["Patient"] = relationship(back_populates="cases")  # noqa: F821
    procedure: Mapped["Procedure | None"] = relationship(back_populates="case", uselist=False)  # noqa: F821
    documents: Mapped[list["Document"]] = relationship(back_populates="case")  # noqa: F821
    submissions: Mapped[list["Submission"]] = relationship(back_populates="case")  # noqa: F821
    appeals: Mapped[list["Appeal"]] = relationship(back_populates="case")  # noqa: F821
    payer: Mapped["Payer | None"] = relationship(back_populates="cases")  # noqa: F821
