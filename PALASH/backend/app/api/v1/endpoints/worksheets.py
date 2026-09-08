from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.worksheet import (
    WorksheetCreate,
    WorksheetUpdate,
    WorksheetResponse,
    WorksheetListResponse,
    WorksheetQuestionCreate,
    WorksheetQuestionResponse,
)
from app.services.worksheet_service import (
    create_worksheet,
    get_worksheet,
    list_worksheets_by_lesson,
    update_worksheet,
    deactivate_worksheet,
    create_worksheet_question,
    list_worksheet_questions,
)

router = APIRouter()
lessons_router = APIRouter()


@router.post(
    "",
    response_model=WorksheetResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new worksheet"
)
def create_new_worksheet(
    data: WorksheetCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> WorksheetResponse:
    """Create a new worksheet aligned to a lesson."""
    return create_worksheet(db=db, data=data)


@router.get(
    "/{worksheet_id}",
    response_model=WorksheetResponse,
    summary="Get worksheet with questions"
)
def get_worksheet_by_id(
    worksheet_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> WorksheetResponse:
    """Retrieve detailed worksheet including questions."""
    return get_worksheet(db=db, worksheet_id=worksheet_id, load_questions=True)


@router.put(
    "/{worksheet_id}",
    response_model=WorksheetResponse,
    summary="Update worksheet"
)
def update_worksheet_by_id(
    worksheet_id: int,
    data: WorksheetUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> WorksheetResponse:
    """Update worksheet metadata or content."""
    return update_worksheet(db=db, worksheet_id=worksheet_id, data=data)


@router.delete(
    "/{worksheet_id}",
    response_model=WorksheetResponse,
    summary="Deactivate worksheet"
)
def deactivate_worksheet_by_id(
    worksheet_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> WorksheetResponse:
    """Deactivate / soft delete a worksheet."""
    return deactivate_worksheet(db=db, worksheet_id=worksheet_id)


@router.post(
    "/{worksheet_id}/questions",
    response_model=WorksheetQuestionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add a question to a worksheet"
)
def add_question(
    worksheet_id: int,
    data: WorksheetQuestionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> WorksheetQuestionResponse:
    """Add a question to an existing worksheet."""
    return create_worksheet_question(db=db, worksheet_id=worksheet_id, data=data)


@router.get(
    "/{worksheet_id}/questions",
    response_model=List[WorksheetQuestionResponse],
    summary="List questions for a worksheet"
)
def list_questions(
    worksheet_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> List[WorksheetQuestionResponse]:
    """Retrieve all questions for a worksheet ordered by question number."""
    return list_worksheet_questions(db=db, worksheet_id=worksheet_id)


@lessons_router.get(
    "/{lesson_id}/worksheets",
    response_model=List[WorksheetListResponse],
    summary="List worksheets for a lesson"
)
def get_worksheets_for_lesson(
    lesson_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> List[WorksheetListResponse]:
    """Retrieve all active worksheets associated with a lesson."""
    return list_worksheets_by_lesson(db=db, lesson_id=lesson_id)
