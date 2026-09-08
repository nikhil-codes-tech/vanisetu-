from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password, create_access_token
from app.models.school import School
from app.models.teacher import Teacher
from app.models.user import User
from app.schemas.auth import UserRegister, Token


def _get_or_create_default_school(db: Session) -> School:
    """Retrieve existing default school or create one if none exist."""
    school = db.execute(
        select(School).order_by(School.id)
    ).scalars().first()

    if not school:
        school = School(
            name="Government Primary School Chaibasa",
            school_code="SCH-DEFAULT-001",
            district="West Singhbhum",
            block="Chaibasa",
            cluster="Chaibasa North",
            village="Chaibasa",
            address="Near Block Office, Chaibasa"
        )
        db.add(school)
        db.flush()
    return school


def _generate_teacher_code(db: Session, username: str, user_id: int) -> str:
    """Generate a unique teacher code."""
    clean_username = "".join(c for c in username if c.isalnum() or c in "_-").upper()
    code = f"TCH-{clean_username}"[:50]

    existing = db.execute(
        select(Teacher).where(Teacher.teacher_code == code)
    ).scalar_one_or_none()

    if not existing:
        return code

    code = f"TCH-{user_id:05d}"
    existing = db.execute(
        select(Teacher).where(Teacher.teacher_code == code)
    ).scalar_one_or_none()

    if not existing:
        return code

    return f"TCH-{user_id}-{clean_username}"[:50]


def register_user(db: Session, user_in: UserRegister) -> User:
    """Register a new user with hashed password and auto-create teacher profile if role is teacher."""
    # Check if username already exists
    existing_user = db.execute(
        select(User).where(User.username == user_in.username)
    ).scalar_one_or_none()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )

    # Check if email already exists (if email provided)
    if user_in.email:
        existing_email = db.execute(
            select(User).where(User.email == user_in.email)
        ).scalar_one_or_none()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

    # Hash the password
    hashed_pwd = hash_password(user_in.password)
    role = user_in.role or "teacher"

    # Create new user record
    new_user = User(
        username=user_in.username,
        email=user_in.email,
        password_hash=hashed_pwd,
        role=role,
        is_active=True
    )
    db.add(new_user)

    try:
        db.flush()

        # Auto-create Teacher profile in same transaction if role is teacher
        if role == "teacher":
            school = _get_or_create_default_school(db)
            teacher_code = _generate_teacher_code(db, new_user.username, new_user.id)
            full_name = getattr(user_in, "full_name", None) or user_in.username

            new_teacher = Teacher(
                user_id=new_user.id,
                school_id=school.id,
                teacher_code=teacher_code,
                full_name=full_name,
                preferred_language="hi",
                target_language="ho"
            )
            db.add(new_teacher)
            db.flush()

        db.commit()
        db.refresh(new_user)
        return new_user
    except Exception:
        db.rollback()
        raise


def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
    """Authenticate user credentials against stored hash."""
    user = db.execute(
        select(User).where(User.username == username)
    ).scalar_one_or_none()
    
    if not user:
        return None
    
    if not verify_password(password, user.password_hash):
        return None
    
    return user


def create_user_token(user: User) -> Token:
    """Generate JWT access token for an authenticated user."""
    access_token = create_access_token(
        data={
            "sub": user.username,
            "user_id": user.id,
            "role": user.role
        }
    )
    return Token(access_token=access_token, token_type="bearer")
