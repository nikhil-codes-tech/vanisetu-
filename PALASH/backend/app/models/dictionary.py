from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import Integer, String, Text, Boolean, DateTime, ForeignKey, UniqueConstraint, Index, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base

if TYPE_CHECKING:
    from app.models.curriculum import Lesson


class DictionaryEntry(Base):
    __tablename__ = "dictionary_entries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    source_language: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    source_word: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    target_language: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    target_word: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    transliteration: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    part_of_speech: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    pronunciation: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    definition: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    example_source: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    example_target: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    audio_path: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    lesson_id: Mapped[Optional[int]] = mapped_column(
        Integer,
        ForeignKey("lessons.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )
    is_verified: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        server_default="false"
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
        server_default="true",
        index=True
    )
    version: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1,
        server_default="1"
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
    lesson: Mapped[Optional["Lesson"]] = relationship(
        "Lesson"
    )

    __table_args__ = (
        UniqueConstraint(
            "source_language",
            "source_word",
            "target_language",
            "target_word",
            name="uq_dictionary_translation_pair"
        ),
        Index(
            "ix_dictionary_lookup",
            "source_language",
            "source_word",
            "target_language"
        ),
    )
