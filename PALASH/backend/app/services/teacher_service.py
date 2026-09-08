from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models.teacher import Teacher
from app.models.user import User
from app.schemas.school import SchoolResponse
from app.schemas.teacher import TeacherUpdate, TeacherResponse
from app.services.auth_service import _get_or_create_default_school, _generate_teacher_code


def _build_languages_list(preferred: str, target: str) -> List[str]:
    """Helper to build a unified list of teacher languages."""
    langs = []
    if preferred:
        langs.append(preferred)
    if target and target not in langs:
        langs.append(target)
    return langs


def _to_teacher_response(teacher: Teacher, email: str | None) -> TeacherResponse:
    """Helper to convert Teacher ORM entity to TeacherResponse."""
    school_resp = None
    if teacher.school:
        school_resp = SchoolResponse.model_validate(teacher.school)

    languages = _build_languages_list(
        teacher.preferred_language,
        teacher.target_language
    )

    return TeacherResponse(
        id=teacher.id,
        user_id=teacher.user_id,
        teacher_code=teacher.teacher_code,
        full_name=teacher.full_name,
        email=email,
        phone=teacher.phone,
        languages=languages,
        preferred_language=teacher.preferred_language,
        target_language=teacher.target_language,
        school_id=teacher.school_id,
        school=school_resp,
        created_at=teacher.created_at,
        updated_at=teacher.updated_at
    )


def _get_or_create_teacher_for_user(db: Session, current_user: User) -> Optional[Teacher]:
    """Retrieve existing Teacher profile or automatically provision one if user has role='teacher'."""
    teacher = db.execute(
        select(Teacher)
        .options(joinedload(Teacher.school))
        .where(Teacher.user_id == current_user.id)
    ).scalar_one_or_none()

    if teacher:
        return teacher

    # Non-teacher users must NOT receive an automatic Teacher profile
    if current_user.role != "teacher":
        return None

    try:
        school = _get_or_create_default_school(db)
        teacher_code = _generate_teacher_code(db, current_user.username, current_user.id)
        full_name = current_user.username

        new_teacher = Teacher(
            user_id=current_user.id,
            school_id=school.id,
            teacher_code=teacher_code,
            full_name=full_name,
            preferred_language="hi",
            target_language="ho"
        )
        db.add(new_teacher)
        db.commit()

        # Re-query with eager joinedload for school relationship
        teacher = db.execute(
            select(Teacher)
            .options(joinedload(Teacher.school))
            .where(Teacher.id == new_teacher.id)
        ).scalar_one_or_none()
        return teacher
    except Exception:
        db.rollback()
        raise


def get_teacher_profile(db: Session, current_user: User) -> TeacherResponse:
    """Get the authenticated teacher's profile, automatically provisioning if role is teacher."""
    teacher = _get_or_create_teacher_for_user(db, current_user)

    if not teacher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Teacher profile not found"
        )

    return _to_teacher_response(teacher, current_user.email)


def update_teacher_profile(
    db: Session,
    current_user: User,
    teacher_in: TeacherUpdate
) -> TeacherResponse:
    """Update the authenticated teacher's own profile."""
    teacher = _get_or_create_teacher_for_user(db, current_user)

    if not teacher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Teacher profile not found"
        )

    if teacher_in.full_name is not None:
        teacher.full_name = teacher_in.full_name
    if teacher_in.phone is not None:
        teacher.phone = teacher_in.phone
    if teacher_in.preferred_language is not None:
        teacher.preferred_language = teacher_in.preferred_language
    if teacher_in.target_language is not None:
        teacher.target_language = teacher_in.target_language
    if teacher_in.languages is not None and len(teacher_in.languages) > 0:
        if teacher_in.preferred_language is None:
            teacher.preferred_language = teacher_in.languages[0]
        if len(teacher_in.languages) > 1 and teacher_in.target_language is None:
            teacher.target_language = teacher_in.languages[1]

    db.commit()
    db.refresh(teacher)

    return _to_teacher_response(teacher, current_user.email)
