from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.curriculum import Lesson
from app.models.worksheet import Worksheet
from app.models.worksheet_question import WorksheetQuestion
from app.schemas.worksheet import (
    WorksheetCreate,
    WorksheetUpdate,
    WorksheetQuestionCreate,
)


def _validate_lesson_exists(db: Session, lesson_id: int) -> Lesson:
    """Ensure parent lesson exists or raise 404."""
    lesson = db.execute(
        select(Lesson).where(Lesson.id == lesson_id)
    ).scalar_one_or_none()
    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson not found"
        )
    return lesson


def create_worksheet(db: Session, data: WorksheetCreate) -> Worksheet:
    """Create a new worksheet linked to an existing lesson."""
    _validate_lesson_exists(db, data.lesson_id)

    worksheet = Worksheet(
        lesson_id=data.lesson_id,
        title=data.title,
        description=data.description,
        language_code=data.language_code.lower().strip(),
        source_language=data.source_language.lower().strip(),
        worksheet_type=data.worksheet_type.lower().strip(),
        difficulty_level=data.difficulty_level,
        instructions=data.instructions,
        content=data.content,
        answer_key=data.answer_key,
        file_path=data.file_path,
        version=data.version,
        is_active=True
    )
    db.add(worksheet)
    db.commit()
    db.refresh(worksheet)
    return worksheet


def get_worksheet(db: Session, worksheet_id: int, load_questions: bool = True) -> Worksheet:
    """Retrieve a single worksheet by ID with optional eager loading of questions."""
    query = select(Worksheet).where(Worksheet.id == worksheet_id)
    if load_questions:
        query = query.options(selectinload(Worksheet.questions))

    worksheet = db.execute(query).scalar_one_or_none()
    if not worksheet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Worksheet not found"
        )
    return worksheet


def list_worksheets_by_lesson(
    db: Session,
    lesson_id: int,
    active_only: bool = True
) -> List[Worksheet]:
    """Retrieve all worksheets belonging to a lesson."""
    _validate_lesson_exists(db, lesson_id)

    query = select(Worksheet).where(Worksheet.lesson_id == lesson_id)
    if active_only:
        query = query.where(Worksheet.is_active.is_(True))
    query = query.order_by(Worksheet.id.asc())
    return list(db.execute(query).scalars().all())


def update_worksheet(
    db: Session,
    worksheet_id: int,
    data: WorksheetUpdate
) -> Worksheet:
    """Update fields on an existing worksheet."""
    worksheet = get_worksheet(db, worksheet_id, load_questions=True)

    update_dict = data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        if field in ("language_code", "source_language", "worksheet_type") and isinstance(value, str):
            value = value.lower().strip()
        setattr(worksheet, field, value)

    db.commit()
    db.refresh(worksheet)
    return worksheet


def deactivate_worksheet(db: Session, worksheet_id: int) -> Worksheet:
    """Soft delete / deactivate a worksheet."""
    worksheet = get_worksheet(db, worksheet_id, load_questions=True)
    worksheet.is_active = False
    db.commit()
    db.refresh(worksheet)
    return worksheet


def create_worksheet_question(
    db: Session,
    worksheet_id: int,
    data: WorksheetQuestionCreate
) -> WorksheetQuestion:
    """Create a new question for an existing worksheet."""
    get_worksheet(db, worksheet_id, load_questions=False)

    question = WorksheetQuestion(
        worksheet_id=worksheet_id,
        question_number=data.question_number,
        question_text=data.question_text,
        question_type=data.question_type.lower().strip(),
        options=data.options,
        correct_answer=data.correct_answer,
        explanation=data.explanation,
        marks=data.marks
    )
    db.add(question)
    db.commit()
    db.refresh(question)
    return question


def list_worksheet_questions(
    db: Session,
    worksheet_id: int
) -> List[WorksheetQuestion]:
    """Retrieve all questions for a worksheet ordered by question_number."""
    get_worksheet(db, worksheet_id, load_questions=False)

    query = (
        select(WorksheetQuestion)
        .where(WorksheetQuestion.worksheet_id == worksheet_id)
        .order_by(WorksheetQuestion.question_number.asc())
    )
    return list(db.execute(query).scalars().all())
