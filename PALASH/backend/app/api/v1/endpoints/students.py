from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.student import (
    StudentCreate,
    StudentUpdate,
    StudentResponse,
)
from app.services.student_service import (
    get_student,
    list_students_by_school,
    create_student,
    update_student,
)

router = APIRouter()
schools_router = APIRouter()


@router.get(
    "",
    response_model=List[StudentResponse],
    summary="List students"
)
def list_students(
    school_id: int = Query(..., description="School ID to fetch students for"),
    class_name: Optional[str] = Query(None, description="Optional class filter"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> List[StudentResponse]:
    """Retrieve students enrolled in a school, optionally filtered by class."""
    return list_students_by_school(db=db, school_id=school_id, class_name=class_name)


@router.get(
    "/{student_id}",
    response_model=StudentResponse,
    summary="Get single student"
)
def get_student_by_id(
    student_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> StudentResponse:
    """Retrieve student profile by ID."""
    return get_student(db=db, student_id=student_id)


@router.post(
    "",
    response_model=StudentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create student"
)
def add_student(
    data: StudentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> StudentResponse:
    """Enroll a new student."""
    return create_student(db=db, data=data)


@router.put(
    "/{student_id}",
    response_model=StudentResponse,
    summary="Update student"
)
def modify_student(
    student_id: int,
    data: StudentUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> StudentResponse:
    """Update student information."""
    return update_student(db=db, student_id=student_id, data=data)


@schools_router.get(
    "/{school_id}/students",
    response_model=List[StudentResponse],
    summary="List students for a school"
)
def get_students_for_school(
    school_id: int,
    class_name: Optional[str] = Query(None, description="Optional class filter"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> List[StudentResponse]:
    """Retrieve all students belonging to a school."""
    return list_students_by_school(db=db, school_id=school_id, class_name=class_name)
