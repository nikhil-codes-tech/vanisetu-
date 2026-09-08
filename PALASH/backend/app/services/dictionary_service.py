from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_

from app.models.dictionary import DictionaryEntry
from app.schemas.dictionary import DictionaryEntryCreate, DictionaryEntryUpdate


def get_dictionary_entry(db: Session, entry_id: int) -> DictionaryEntry:
    entry = db.query(DictionaryEntry).filter(DictionaryEntry.id == entry_id).first()
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Dictionary entry {entry_id} not found"
        )
    return entry


def list_dictionary_entries(
    db: Session,
    source_lang: Optional[str] = None,
    target_lang: Optional[str] = None,
    lesson_id: Optional[int] = None,
    limit: int = 100,
    skip: int = 0
) -> List[DictionaryEntry]:
    query = db.query(DictionaryEntry).filter(DictionaryEntry.is_active == True)
    if source_lang:
        query = query.filter(DictionaryEntry.source_language == source_lang)
    if target_lang:
        query = query.filter(DictionaryEntry.target_language == target_lang)
    if lesson_id:
        query = query.filter(DictionaryEntry.lesson_id == lesson_id)
    return query.order_by(DictionaryEntry.source_word.asc()).offset(skip).limit(limit).all()


def search_dictionary(
    db: Session,
    query_text: str,
    source_lang: Optional[str] = None,
    target_lang: Optional[str] = None,
    limit: int = 50
) -> List[DictionaryEntry]:
    search_pat = f"%{query_text.strip()}%"
    q = db.query(DictionaryEntry).filter(
        DictionaryEntry.is_active == True,
        or_(
            DictionaryEntry.source_word.ilike(search_pat),
            DictionaryEntry.target_word.ilike(search_pat),
            DictionaryEntry.transliteration.ilike(search_pat),
            DictionaryEntry.definition.ilike(search_pat)
        )
    )
    if source_lang:
        q = q.filter(DictionaryEntry.source_language == source_lang)
    if target_lang:
        q = q.filter(DictionaryEntry.target_language == target_lang)
    return q.limit(limit).all()


def create_dictionary_entry(db: Session, data: DictionaryEntryCreate) -> DictionaryEntry:
    # Check for existing unique pair
    existing = db.query(DictionaryEntry).filter(
        DictionaryEntry.source_language == data.source_language,
        DictionaryEntry.source_word == data.source_word,
        DictionaryEntry.target_language == data.target_language,
        DictionaryEntry.target_word == data.target_word
    ).first()
    if existing:
        return existing

    entry = DictionaryEntry(
        source_language=data.source_language,
        source_word=data.source_word,
        target_language=data.target_language,
        target_word=data.target_word,
        transliteration=data.transliteration,
        part_of_speech=data.part_of_speech,
        pronunciation=data.pronunciation,
        definition=data.definition,
        example_source=data.example_source,
        example_target=data.example_target,
        lesson_id=data.lesson_id,
        is_verified=data.is_verified,
        is_active=data.is_active,
        version=1
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


def update_dictionary_entry(db: Session, entry_id: int, data: DictionaryEntryUpdate) -> DictionaryEntry:
    entry = get_dictionary_entry(db, entry_id)
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(entry, field, value)
    entry.version += 1
    db.commit()
    db.refresh(entry)
    return entry
