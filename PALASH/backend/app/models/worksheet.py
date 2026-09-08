from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import Integer, String, Text, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base

if TYPE_CHECKING:
    from app.models.curriculum import Lesson
    from app.models.worksheet_question import WorksheetQuestion


class Worksheet(Base):
    __tablename__ = "worksheets"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    lesson_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("lessons.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    language_code: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="hi",
        server_default="hi",
        index=True
    )
    source_language: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="hi",
        server_default="hi"
    )
    worksheet_type: Mapped[str] = mapped_column(String(50), nullable=False)
    difficulty_level: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
        default="beginner",
        server_default="beginner"
    )
    instructions: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    content: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    answer_key: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    file_path: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    version: Mapped[int] = mapped_column(Integer, nullable=False, default=1, server_default="1")
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, server_default="true", index=True)
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
    lesson: Mapped["Lesson"] = relationship(
        "Lesson",
        back_populates="worksheets"
    )
    questions: Mapped[List["WorksheetQuestion"]] = relationship(
        "WorksheetQuestion",
        back_populates="worksheet",
        cascade="all, delete-orphan",
        order_by="WorksheetQuestion.question_number"
    )
