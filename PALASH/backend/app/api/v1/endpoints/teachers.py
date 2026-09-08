from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.teacher import TeacherUpdate, TeacherResponse
from app.services.teacher_service import get_teacher_profile, update_teacher_profile

router = APIRouter()


@router.get(
    "/me",
    response_model=TeacherResponse,
    summary="Get current authenticated teacher profile"
)
def get_my_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> TeacherResponse:
    """Retrieve the profile and school information of the currently authenticated teacher."""
    return get_teacher_profile(db=db, current_user=current_user)


@router.put(
    "/me",
    response_model=TeacherResponse,
    summary="Update current authenticated teacher profile"
)
def update_my_profile(
    teacher_in: TeacherUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> TeacherResponse:
    """Update profile information (e.g. name, phone, languages) for the authenticated teacher."""
    return update_teacher_profile(db=db, current_user=current_user, teacher_in=teacher_in)
