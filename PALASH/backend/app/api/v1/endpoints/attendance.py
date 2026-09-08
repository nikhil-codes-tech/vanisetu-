from datetime import date
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.attendance import (
    AttendanceCreate,
    AttendanceBulkCreate,
    AttendanceResponse,
    AttendanceSummaryResponse,
)
from app.services.attendance_service import (
    record_attendance,
    record_bulk_attendance,
    get_attendance_by_date,
    get_student_attendance,
    get_attendance_summary,
)

router = APIRouter()


@router.post(
    "",
    response_model=AttendanceResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Record student attendance"
)
def mark_attendance(
    data: AttendanceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> AttendanceResponse:
    """Record daily attendance status for a student."""
    return record_attendance(db=db, data=data)


@router.post(
    "/bulk",
    response_model=List[AttendanceResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Record bulk classroom attendance"
)
def mark_bulk_attendance(
    data: AttendanceBulkCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> List[AttendanceResponse]:
    """Record roll call attendance for multiple students simultaneously."""
    return record_bulk_attendance(db=db, data=data)


@router.get(
    "",
    response_model=List[AttendanceResponse],
    summary="List attendance records by date"
)
def list_attendance(
    school_id: int = Query(..., description="School ID"),
    attendance_date: date = Query(default_factory=date.today, description="Date (YYYY-MM-DD)"),
    class_name: Optional[str] = Query(None, description="Optional class filter"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> List[AttendanceResponse]:
    """Retrieve all student attendance records for a school on a specific date."""
    return get_attendance_by_date(
        db=db,
        school_id=school_id,
        attendance_date=attendance_date,
        class_name=class_name
    )


@router.get(
    "/summary",
    response_model=AttendanceSummaryResponse,
    summary="Get daily attendance summary"
)
def get_daily_summary(
    school_id: int = Query(..., description="School ID"),
    attendance_date: date = Query(default_factory=date.today, description="Date (YYYY-MM-DD)"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> AttendanceSummaryResponse:
    """Retrieve summary attendance rates and counts for reporting."""
    return get_attendance_summary(db=db, school_id=school_id, attendance_date=attendance_date)


@router.get(
    "/student/{student_id}",
    response_model=List[AttendanceResponse],
    summary="Get attendance history for a student"
)
def get_student_history(
    student_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> List[AttendanceResponse]:
    """Retrieve historical attendance records for an individual student."""
    return get_student_attendance(db=db, student_id=student_id)
