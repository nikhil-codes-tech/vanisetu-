from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.curriculum import (
    ClassResponse,
    SubjectResponse,
    LearningOutcomeResponse,
    LessonResponse,
    LessonDetailResponse,
    ActivityResponse,
    AssessmentResponse,
)
from app.schemas.worksheet import WorksheetListResponse
from app.schemas.translation import (
    LanguageResponse,
    LessonTranslationResponse,
    ActivityTranslationResponse,
    AssessmentTranslationResponse,
)
from app.services.curriculum_service import (
    get_classes,
    get_class_by_id,
    get_subjects_by_class,
    get_learning_outcomes_by_subject,
    get_lessons_by_outcome,
    get_lesson_by_id,
    get_activities_by_lesson,
    get_assessments_by_lesson,
    get_languages,
    get_translations_by_lesson,
    get_translations_by_activity,
    get_translations_by_assessment,
)
from app.services.worksheet_service import list_worksheets_by_lesson

router = APIRouter()


@router.get(
    "/classes",
    response_model=List[ClassResponse],
    summary="List curriculum classes"
)
def list_classes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> List[ClassResponse]:
    """Return all active curriculum classes ordered by grade."""
    return get_classes(db=db)


@router.get(
    "/classes/{class_id}",
    response_model=ClassResponse,
    summary="Get curriculum class"
)
def get_class(
    class_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> ClassResponse:
    """Return a single curriculum class by its ID."""
    return get_class_by_id(db=db, class_id=class_id)


@router.get(
    "/classes/{class_id}/subjects",
    response_model=List[SubjectResponse],
    summary="List subjects for class"
)
def list_subjects(
    class_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> List[SubjectResponse]:
    """Return all active subjects belonging to a curriculum class."""
    return get_subjects_by_class(db=db, class_id=class_id)


@router.get(
    "/subjects/{subject_id}/learning-outcomes",
    response_model=List[LearningOutcomeResponse],
    summary="List learning outcomes for subject"
)
def list_learning_outcomes(
    subject_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> List[LearningOutcomeResponse]:
    """Return all active learning outcomes for a subject."""
    return get_learning_outcomes_by_subject(db=db, subject_id=subject_id)


@router.get(
    "/learning-outcomes/{outcome_id}/lessons",
    response_model=List[LessonResponse],
    summary="List lessons for learning outcome"
)
def list_lessons(
    outcome_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> List[LessonResponse]:
    """Return all active lessons for a learning outcome."""
    return get_lessons_by_outcome(db=db, outcome_id=outcome_id)


@router.get(
    "/lessons/{lesson_id}",
    response_model=LessonDetailResponse,
    summary="Get lesson with activities and assessments"
)
def get_lesson_detail(
    lesson_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> LessonDetailResponse:
    """Return detailed lesson information including learning outcome, activities, and assessments."""
    return get_lesson_by_id(db=db, lesson_id=lesson_id)


@router.get(
    "/lessons/{lesson_id}/activities",
    response_model=List[ActivityResponse],
    summary="List lesson activities"
)
def list_lesson_activities(
    lesson_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> List[ActivityResponse]:
    """Return all active activities for a lesson ordered by sequence order."""
    return get_activities_by_lesson(db=db, lesson_id=lesson_id)


@router.get(
    "/lessons/{lesson_id}/assessments",
    response_model=List[AssessmentResponse],
    summary="List lesson assessments"
)
def list_lesson_assessments(
    lesson_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> List[AssessmentResponse]:
    """Return all active assessments for a lesson ordered by sequence order."""
    return get_assessments_by_lesson(db=db, lesson_id=lesson_id)


@router.get(
    "/lessons/{lesson_id}/worksheets",
    response_model=List[WorksheetListResponse],
    summary="List worksheets for a lesson"
)
def list_lesson_worksheets(
    lesson_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> List[WorksheetListResponse]:
    """Return all active worksheets for a lesson."""
    return list_worksheets_by_lesson(db=db, lesson_id=lesson_id)


# ==========================================
# STAGE 2.12 MULTILINGUAL TRANSLATION ENDPOINTS
# ==========================================

@router.get(
    "/languages",
    response_model=List[LanguageResponse],
    summary="List supported curriculum languages"
)
def list_languages(
    current_user: User = Depends(get_current_user),
) -> List[LanguageResponse]:
    """Return all configured active languages (Hindi, Ho, Mundari, Santhali)."""
    return get_languages(only_active=True)


@router.get(
    "/lessons/{lesson_id}/translations",
    response_model=List[LessonTranslationResponse],
    summary="List translations for a lesson"
)
def list_lesson_translations(
    lesson_id: int,
    language_code: Optional[str] = Query(None, description="Optional language filter (e.g. ho, mun, sat, hi)"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> List[LessonTranslationResponse]:
    """Return translations for a lesson, optionally filtered by language_code."""
    return get_translations_by_lesson(
        db=db,
        lesson_id=lesson_id,
        language_code=language_code,
        active_only=True
    )


@router.get(
    "/activities/{activity_id}/translations",
    response_model=List[ActivityTranslationResponse],
    summary="List translations for an activity"
)
def list_activity_translations(
    activity_id: int,
    language_code: Optional[str] = Query(None, description="Optional language filter"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> List[ActivityTranslationResponse]:
    """Return translations for an activity, optionally filtered by language_code."""
    return get_translations_by_activity(
        db=db,
        activity_id=activity_id,
        language_code=language_code,
        active_only=True
    )


@router.get(
    "/assessments/{assessment_id}/translations",
    response_model=List[AssessmentTranslationResponse],
    summary="List translations for an assessment"
)
def list_assessment_translations(
    assessment_id: int,
    language_code: Optional[str] = Query(None, description="Optional language filter"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> List[AssessmentTranslationResponse]:
    """Return translations for an assessment, optionally filtered by language_code."""
    return get_translations_by_assessment(
        db=db,
        assessment_id=assessment_id,
        language_code=language_code,
        active_only=True
    )

