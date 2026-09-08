from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.school import School
from app.models.user import User
from app.schemas.school import SchoolCreate, SchoolUpdate


def get_school(db: Session, school_id: int) -> School:
    """Retrieve a school by its ID or raise 404."""
    school = db.execute(
        select(School).where(School.id == school_id)
    ).scalar_one_or_none()
    
    if not school:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="School not found"
        )
    return school


def create_school(db: Session, school_in: SchoolCreate) -> School:
    """Create a new school ensuring unique school_code."""
    existing = db.execute(
        select(School).where(School.school_code == school_in.school_code)
    ).scalar_one_or_none()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="School code already exists"
        )
    
    new_school = School(
        name=school_in.name,
        school_code=school_in.school_code,
        district=school_in.district,
        block=school_in.block,
        cluster=school_in.cluster,
        village=school_in.village,
        address=school_in.address
    )
    db.add(new_school)
    db.commit()
    db.refresh(new_school)
    return new_school


def update_school(
    db: Session,
    school_id: int,
    school_in: SchoolUpdate,
    current_user: User
) -> School:
    """Update school details if current user is authorized."""
    school = get_school(db, school_id)
    
    # Authorization: Admin or teacher assigned to this school
    is_admin = current_user.role == "admin"
    is_assigned_teacher = (
        current_user.teacher is not None and current_user.teacher.school_id == school_id
    )
    
    if not (is_admin or is_assigned_teacher):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this school"
        )
    
    # If school_code is being changed, verify uniqueness
    if school_in.school_code and school_in.school_code != school.school_code:
        duplicate = db.execute(
            select(School).where(
                School.school_code == school_in.school_code,
                School.id != school_id
            )
        ).scalar_one_or_none()
        if duplicate:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="School code already exists"
            )
        school.school_code = school_in.school_code

    if school_in.name is not None:
        school.name = school_in.name
    if school_in.district is not None:
        school.district = school_in.district
    if school_in.block is not None:
        school.block = school_in.block
    if school_in.cluster is not None:
        school.cluster = school_in.cluster
    if school_in.village is not None:
        school.village = school_in.village
    if school_in.address is not None:
        school.address = school_in.address

    db.commit()
    db.refresh(school)
    return school
