from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import Integer, String, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base

if TYPE_CHECKING:
    from app.models.teacher import Teacher
    from app.models.student import Student


class School(Base):
    __tablename__ = "schools"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    school_code: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    district: Mapped[str] = mapped_column(String(100), nullable=False)
    block: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    cluster: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    village: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    address: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
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

    # 1 to many relationships
    teachers: Mapped[list["Teacher"]] = relationship(
        "Teacher",
        back_populates="school"
    )
    students: Mapped[list["Student"]] = relationship(
        "Student",
        back_populates="school"
    )
