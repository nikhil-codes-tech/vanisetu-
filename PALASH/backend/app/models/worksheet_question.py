from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import Integer, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base

if TYPE_CHECKING:
    from app.models.worksheet import Worksheet


class WorksheetQuestion(Base):
    __tablename__ = "worksheet_questions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    worksheet_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("worksheets.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    question_number: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    question_text: Mapped[str] = mapped_column(Text, nullable=False)
    question_type: Mapped[str] = mapped_column(String(50), nullable=False)
    options: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    correct_answer: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    explanation: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    marks: Mapped[int] = mapped_column(Integer, nullable=False, default=1, server_default="1")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now()
    )

    # Relationships
    worksheet: Mapped["Worksheet"] = relationship(
        "Worksheet",
        back_populates="questions"
    )
