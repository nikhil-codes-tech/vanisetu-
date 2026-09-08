from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.school import SchoolCreate, SchoolUpdate, SchoolResponse
from app.services.school_service import get_school, create_school, update_school

router = APIRouter()


@router.post(
    "",
    response_model=SchoolResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new school"
)
def create_new_school(
    school_in: SchoolCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> SchoolResponse:
    """Create a new school with a unique school code."""
    return create_school(db=db, school_in=school_in)


@router.get(
    "/{school_id}",
    response_model=SchoolResponse,
    summary="Get school details by ID"
)
def get_school_by_id(
    school_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> SchoolResponse:
    """Retrieve school information by its ID."""
    return get_school(db=db, school_id=school_id)


@router.put(
    "/{school_id}",
    response_model=SchoolResponse,
    summary="Update school details"
)
def update_school_by_id(
    school_id: int,
    school_in: SchoolUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> SchoolResponse:
    """Update school details if authorized (admin or teacher assigned to the school)."""
    return update_school(
        db=db,
        school_id=school_id,
        school_in=school_in,
        current_user=current_user
    )
