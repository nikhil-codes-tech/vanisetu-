from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.curriculum import (
    CurriculumClass,
    Subject,
    LearningOutcome,
    Lesson,
    Activity,
    Assessment,
)


def get_classes(db: Session, active_only: bool = True) -> List[CurriculumClass]:
    """Retrieve all curriculum classes ordered by grade."""
    query = select(CurriculumClass)
    if active_only:
        query = query.where(CurriculumClass.is_active.is_(True))
    query = query.order_by(CurriculumClass.grade.asc())
    return list(db.execute(query).scalars().all())


def get_class_by_id(db: Session, class_id: int) -> CurriculumClass:
    """Retrieve a single curriculum class by ID or raise 404."""
    curriculum_class = db.execute(
        select(CurriculumClass).where(CurriculumClass.id == class_id)
    ).scalar_one_or_none()

    if not curriculum_class:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Curriculum class not found"
        )
    return curriculum_class


def get_subjects_by_class(
    db: Session,
    class_id: int,
    active_only: bool = True
) -> List[Subject]:
    """Retrieve all subjects for a curriculum class ordered by name."""
    # Ensure the parent class exists
    get_class_by_id(db, class_id)

    query = select(Subject).where(Subject.class_id == class_id)
    if active_only:
        query = query.where(Subject.is_active.is_(True))
    query = query.order_by(Subject.name.asc())
    return list(db.execute(query).scalars().all())


def get_learning_outcomes_by_subject(
    db: Session,
    subject_id: int,
    active_only: bool = True
) -> List[LearningOutcome]:
    """Retrieve all learning outcomes for a subject ordered by code."""
    subject = db.execute(
        select(Subject).where(Subject.id == subject_id)
    ).scalar_one_or_none()

    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subject not found"
        )

    query = select(LearningOutcome).where(LearningOutcome.subject_id == subject_id)
    if active_only:
        query = query.where(LearningOutcome.is_active.is_(True))
    query = query.order_by(LearningOutcome.code.asc())
    return list(db.execute(query).scalars().all())


def get_lessons_by_outcome(
    db: Session,
    outcome_id: int,
    active_only: bool = True
) -> List[Lesson]:
    """Retrieve all lessons for a learning outcome ordered by lesson_number."""
    outcome = db.execute(
        select(LearningOutcome).where(LearningOutcome.id == outcome_id)
    ).scalar_one_or_none()

    if not outcome:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Learning outcome not found"
        )

    query = select(Lesson).where(Lesson.learning_outcome_id == outcome_id)
    if active_only:
        query = query.where(Lesson.is_active.is_(True))
    query = query.order_by(Lesson.lesson_number.asc())
    return list(db.execute(query).scalars().all())


def get_lesson_by_id(db: Session, lesson_id: int) -> Lesson:
    """Retrieve a detailed lesson including learning outcome, activities, and assessments."""
    lesson = db.execute(
        select(Lesson)
        .options(
            selectinload(Lesson.learning_outcome),
            selectinload(Lesson.activities),
            selectinload(Lesson.assessments),
        )
        .where(Lesson.id == lesson_id)
    ).scalar_one_or_none()

    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson not found"
        )
    return lesson


def get_activities_by_lesson(
    db: Session,
    lesson_id: int,
    active_only: bool = True
) -> List[Activity]:
    """Retrieve activities for a lesson ordered by sequence_order."""
    lesson = db.execute(
        select(Lesson).where(Lesson.id == lesson_id)
    ).scalar_one_or_none()

    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson not found"
        )

    query = select(Activity).where(Activity.lesson_id == lesson_id)
    if active_only:
        query = query.where(Activity.is_active.is_(True))
    query = query.order_by(Activity.sequence_order.asc())
    return list(db.execute(query).scalars().all())


def get_assessments_by_lesson(
    db: Session,
    lesson_id: int,
    active_only: bool = True
) -> List[Assessment]:
    """Retrieve assessments for a lesson ordered by sequence_order."""
    lesson = db.execute(
        select(Lesson).where(Lesson.id == lesson_id)
    ).scalar_one_or_none()

    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson not found"
        )

    query = select(Assessment).where(Assessment.lesson_id == lesson_id)
    if active_only:
        query = query.where(Assessment.is_active.is_(True))
    query = query.order_by(Assessment.sequence_order.asc())
    return list(db.execute(query).scalars().all())


# ==========================================
# STAGE 2.12 MULTILINGUAL TRANSLATION SERVICES
# ==========================================

from app.models.translation import (
    LessonTranslation,
    ActivityTranslation,
    AssessmentTranslation,
)
from app.core.languages import get_supported_languages, LanguageConfig


def get_languages(only_active: bool = True) -> List[LanguageConfig]:
    """Retrieve supported curriculum languages."""
    return get_supported_languages(only_active=only_active)


def get_translations_by_lesson(
    db: Session,
    lesson_id: int,
    language_code: Optional[str] = None,
    active_only: bool = True,
) -> List[LessonTranslation]:
    """Retrieve translations for a specific lesson, optionally filtered by language_code."""
    # Verify lesson exists
    get_lesson_by_id(db, lesson_id)

    query = select(LessonTranslation).where(LessonTranslation.lesson_id == lesson_id)
    if language_code:
        query = query.where(LessonTranslation.language_code == language_code.lower().strip())
    if active_only:
        query = query.where(LessonTranslation.is_active.is_(True))
    query = query.order_by(LessonTranslation.language_code.asc(), LessonTranslation.version.desc())
    return list(db.execute(query).scalars().all())


def get_translations_by_activity(
    db: Session,
    activity_id: int,
    language_code: Optional[str] = None,
    active_only: bool = True,
) -> List[ActivityTranslation]:
    """Retrieve translations for a specific activity, optionally filtered by language_code."""
    activity = db.execute(
        select(Activity).where(Activity.id == activity_id)
    ).scalar_one_or_none()
    if not activity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity not found"
        )

    query = select(ActivityTranslation).where(ActivityTranslation.activity_id == activity_id)
    if language_code:
        query = query.where(ActivityTranslation.language_code == language_code.lower().strip())
    if active_only:
        query = query.where(ActivityTranslation.is_active.is_(True))
    query = query.order_by(ActivityTranslation.language_code.asc(), ActivityTranslation.version.desc())
    return list(db.execute(query).scalars().all())


def get_translations_by_assessment(
    db: Session,
    assessment_id: int,
    language_code: Optional[str] = None,
    active_only: bool = True,
) -> List[AssessmentTranslation]:
    """Retrieve translations for a specific assessment, optionally filtered by language_code."""
    assessment = db.execute(
        select(Assessment).where(Assessment.id == assessment_id)
    ).scalar_one_or_none()
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found"
        )

    query = select(AssessmentTranslation).where(AssessmentTranslation.assessment_id == assessment_id)
    if language_code:
        query = query.where(AssessmentTranslation.language_code == language_code.lower().strip())
    if active_only:
        query = query.where(AssessmentTranslation.is_active.is_(True))
    query = query.order_by(AssessmentTranslation.language_code.asc(), AssessmentTranslation.version.desc())
    return list(db.execute(query).scalars().all())
