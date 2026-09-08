from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.dictionary import (
    DictionaryEntryCreate,
    DictionaryEntryUpdate,
    DictionaryEntryResponse,
)
from app.services.dictionary_service import (
    get_dictionary_entry,
    list_dictionary_entries,
    search_dictionary,
    create_dictionary_entry,
    update_dictionary_entry,
)

router = APIRouter()
lessons_router = APIRouter()


@router.get(
    "",
    response_model=List[DictionaryEntryResponse],
    summary="List dictionary entries"
)
def list_entries(
    source_lang: Optional[str] = Query(None, description="Source language filter"),
    target_lang: Optional[str] = Query(None, description="Target language filter"),
    lesson_id: Optional[int] = Query(None, description="Lesson ID filter"),
    limit: int = Query(100, ge=1, le=500),
    skip: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> List[DictionaryEntryResponse]:
    """Retrieve bilingual dictionary entries with optional filters."""
    return list_dictionary_entries(
        db=db,
        source_lang=source_lang,
        target_lang=target_lang,
        lesson_id=lesson_id,
        limit=limit,
        skip=skip
    )


@router.get(
    "/search",
    response_model=List[DictionaryEntryResponse],
    summary="Search bilingual dictionary"
)
def search_entries(
    q: str = Query(..., min_length=1, description="Search query string"),
    source_lang: Optional[str] = Query(None, description="Optional source language filter"),
    target_lang: Optional[str] = Query(None, description="Optional target language filter"),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> List[DictionaryEntryResponse]:
    """Search for words, transliterations, or meanings across the dictionary."""
    return search_dictionary(
        db=db,
        query_text=q,
        source_lang=source_lang,
        target_lang=target_lang,
        limit=limit
    )


@router.get(
    "/{entry_id}",
    response_model=DictionaryEntryResponse,
    summary="Get single dictionary entry"
)
def get_entry(
    entry_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> DictionaryEntryResponse:
    """Retrieve detailed information for a dictionary entry."""
    return get_dictionary_entry(db=db, entry_id=entry_id)


@router.post(
    "",
    response_model=DictionaryEntryResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create dictionary entry"
)
def create_entry(
    data: DictionaryEntryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> DictionaryEntryResponse:
    """Add a new bilingual vocabulary entry."""
    return create_dictionary_entry(db=db, data=data)


@router.put(
    "/{entry_id}",
    response_model=DictionaryEntryResponse,
    summary="Update dictionary entry"
)
def update_entry(
    entry_id: int,
    data: DictionaryEntryUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> DictionaryEntryResponse:
    """Update an existing bilingual vocabulary entry."""
    return update_dictionary_entry(db=db, entry_id=entry_id, data=data)


@lessons_router.get(
    "/{lesson_id}/dictionary",
    response_model=List[DictionaryEntryResponse],
    summary="List dictionary entries for a lesson"
)
def get_lesson_vocabulary(
    lesson_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> List[DictionaryEntryResponse]:
    """Retrieve all bilingual vocabulary entries attached to a specific lesson."""
    return list_dictionary_entries(db=db, lesson_id=lesson_id)
