"""
PALASH Curriculum Multilingual Translation Models.
Stage 2.12 - Multilingual Curriculum Data Architecture.

Generic translation models for Lessons, Activities, and Assessments.
Allows supporting Hindi (hi), Ho (ho), Mundari (mun), Santhali (sat),
and future languages without schema restructuring.
"""
from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import Integer, String, Text, Boolean, DateTime, ForeignKey, UniqueConstraint, Index, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base

if TYPE_CHECKING:
    from app.models.curriculum import Lesson, Activity, Assessment


class LessonTranslation(Base):
    """
    Extensible translation entity for Curriculum Lessons.
    Stores translated title, script, objective, content, optional audio reference,
    versioning, and active status for any language_code.
    """
    __tablename__ = "lesson_translations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    lesson_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("lessons.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    language_code: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        index=True
    )
    translated_title: Mapped[str] = mapped_column(String(255), nullable=False)
    translated_script: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    translated_objective: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    translated_content: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    audio_path: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    version: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1,
        server_default="1"
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
        server_default="true",
        index=True
    )
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
        back_populates="translations"
    )

    __table_args__ = (
        UniqueConstraint("lesson_id", "language_code", "version", name="uq_lesson_translation_version"),
        Index("idx_lesson_trans_lang", "lesson_id", "language_code", "is_active"),
    )


class ActivityTranslation(Base):
    """
    Extensible translation entity for Lesson Activities.
    """
    __tablename__ = "activity_translations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    activity_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("activities.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    language_code: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        index=True
    )
    translated_title: Mapped[str] = mapped_column(String(255), nullable=False)
    translated_instructions: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    audio_path: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    version: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1,
        server_default="1"
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
        server_default="true",
        index=True
    )
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
    activity: Mapped["Activity"] = relationship(
        "Activity",
        back_populates="translations"
    )

    __table_args__ = (
        UniqueConstraint("activity_id", "language_code", "version", name="uq_activity_translation_version"),
        Index("idx_activity_trans_lang", "activity_id", "language_code", "is_active"),
    )


class AssessmentTranslation(Base):
    """
    Extensible translation entity for Lesson Assessments.
    """
    __tablename__ = "assessment_translations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    assessment_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("assessments.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    language_code: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        index=True
    )
    translated_title: Mapped[str] = mapped_column(String(255), nullable=False)
    translated_prompt: Mapped[str] = mapped_column(Text, nullable=False)
    translated_expected_response: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    audio_path: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    version: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1,
        server_default="1"
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
        server_default="true",
        index=True
    )
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
    assessment: Mapped["Assessment"] = relationship(
        "Assessment",
        back_populates="translations"
    )

    __table_args__ = (
        UniqueConstraint("assessment_id", "language_code", "version", name="uq_assessment_translation_version"),
        Index("idx_assessment_trans_lang", "assessment_id", "language_code", "is_active"),
    )
