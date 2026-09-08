from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import Integer, String, Text, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base

if TYPE_CHECKING:
    from app.models.worksheet import Worksheet
    from app.models.dictionary import DictionaryEntry
    from app.models.translation import LessonTranslation, ActivityTranslation, AssessmentTranslation


class CurriculumClass(Base):
    __tablename__ = "curriculum_classes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    grade: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    description: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, server_default="true")
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
    subjects: Mapped[List["Subject"]] = relationship(
        "Subject",
        back_populates="curriculum_class",
        cascade="all, delete-orphan",
        order_by="Subject.name"
    )


class Subject(Base):
    __tablename__ = "subjects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    class_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("curriculum_classes.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    code: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    description: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, server_default="true")
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
    curriculum_class: Mapped["CurriculumClass"] = relationship(
        "CurriculumClass",
        back_populates="subjects"
    )
    learning_outcomes: Mapped[List["LearningOutcome"]] = relationship(
        "LearningOutcome",
        back_populates="subject",
        cascade="all, delete-orphan",
        order_by="LearningOutcome.code"
    )


class LearningOutcome(Base):
    __tablename__ = "learning_outcomes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    subject_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("subjects.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    code: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    nipun_domain: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, server_default="true")
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
    subject: Mapped["Subject"] = relationship(
        "Subject",
        back_populates="learning_outcomes"
    )
    lessons: Mapped[List["Lesson"]] = relationship(
        "Lesson",
        back_populates="learning_outcome",
        cascade="all, delete-orphan",
        order_by="Lesson.lesson_number"
    )


class Lesson(Base):
    __tablename__ = "lessons"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    learning_outcome_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("learning_outcomes.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    lesson_number: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    source_language: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="hi",
        server_default="hi"
    )
    duration_minutes: Mapped[Optional[int]] = mapped_column(Integer, nullable=True, default=30)
    teacher_script: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    learning_objective: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, server_default="true")
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
    learning_outcome: Mapped["LearningOutcome"] = relationship(
        "LearningOutcome",
        back_populates="lessons"
    )
    activities: Mapped[List["Activity"]] = relationship(
        "Activity",
        back_populates="lesson",
        cascade="all, delete-orphan",
        order_by="Activity.sequence_order"
    )
    assessments: Mapped[List["Assessment"]] = relationship(
        "Assessment",
        back_populates="lesson",
        cascade="all, delete-orphan",
        order_by="Assessment.sequence_order"
    )
    worksheets: Mapped[List["Worksheet"]] = relationship(
        "Worksheet",
        back_populates="lesson",
        cascade="all, delete-orphan",
        order_by="Worksheet.id"
    )
    translations: Mapped[List["LessonTranslation"]] = relationship(
        "LessonTranslation",
        back_populates="lesson",
        cascade="all, delete-orphan",
        order_by="LessonTranslation.language_code"
    )


class Activity(Base):
    __tablename__ = "activities"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    lesson_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("lessons.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    activity_type: Mapped[str] = mapped_column(String(50), nullable=False)
    instructions: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    sequence_order: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    materials: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, server_default="true")
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
        back_populates="activities"
    )
    translations: Mapped[List["ActivityTranslation"]] = relationship(
        "ActivityTranslation",
        back_populates="activity",
        cascade="all, delete-orphan",
        order_by="ActivityTranslation.language_code"
    )


class Assessment(Base):
    __tablename__ = "assessments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    lesson_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("lessons.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    prompt: Mapped[str] = mapped_column(Text, nullable=False)
    assessment_type: Mapped[str] = mapped_column(String(50), nullable=False)
    sequence_order: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    expected_response: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, server_default="true")
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
        back_populates="assessments"
    )
    translations: Mapped[List["AssessmentTranslation"]] = relationship(
        "AssessmentTranslation",
        back_populates="assessment",
        cascade="all, delete-orphan",
        order_by="AssessmentTranslation.language_code"
    )
