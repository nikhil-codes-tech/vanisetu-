from datetime import datetime, date
from typing import Optional, TYPE_CHECKING
from sqlalchemy import Integer, String, Text, Date, DateTime, ForeignKey, UniqueConstraint, Index, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base

if TYPE_CHECKING:
    from app.models.student import Student
    from app.models.school import School


class StudentAttendance(Base):
    __tablename__ = "student_attendance"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    student_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("students.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    school_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("schools.id", ondelete="RESTRICT"),
        nullable=False,
        index=True
    )
    attendance_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="present")
    remarks: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
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

    # Relationships (unidirectional to prevent circular mapper configuration)
    student: Mapped[Optional["Student"]] = relationship("Student")
    school: Mapped[Optional["School"]] = relationship("School")

    __table_args__ = (
        UniqueConstraint("student_id", "attendance_date", name="uq_student_daily_attendance"),
        Index("ix_school_date_attendance", "school_id", "attendance_date"),
    )
