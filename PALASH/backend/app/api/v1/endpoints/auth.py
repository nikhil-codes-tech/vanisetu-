from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.auth import UserRegister, Token, UserResponse
from app.services.auth_service import register_user, authenticate_user, create_user_token

router = APIRouter()


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user"
)
def register(
    user_in: UserRegister,
    db: Session = Depends(get_db)
) -> UserResponse:
    """Register a new user with username, password, and optional email."""
    user = register_user(db=db, user_in=user_in)
    return user


@router.post(
    "/login",
    response_model=Token,
    summary="Login and obtain access token"
)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
) -> Token:
    """Authenticate user with username/password form data (OAuth2 compatible) and return Bearer JWT token."""
    user = authenticate_user(
        db=db,
        username=form_data.username,
        password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    return create_user_token(user)


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current authenticated user profile"
)
def get_me(
    current_user: User = Depends(get_current_user)
) -> UserResponse:
    """Retrieve profile of the currently logged-in user."""
    return current_user
