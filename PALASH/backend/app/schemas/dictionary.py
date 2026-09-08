from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field


class DictionaryEntryBase(BaseModel):
    source_language: str = Field(..., min_length=1, max_length=20, description="Source language code (e.g. hi or ho)")
    source_word: str = Field(..., min_length=1, max_length=255, description="Word in source language")
    target_language: str = Field(..., min_length=1, max_length=20, description="Target language code (e.g. ho or hi)")
    target_word: str = Field(..., min_length=1, max_length=255, description="Translated word in target language")
    transliteration: Optional[str] = Field(default=None, max_length=255, description="Transliteration/Phonetic text")
    part_of_speech: Optional[str] = Field(default=None, max_length=50, description="Part of speech (noun, verb, etc.)")
    pronunciation: Optional[str] = Field(default=None, max_length=255, description="Pronunciation guide")
    definition: Optional[str] = Field(default=None, description="Definition or meaning explanation")
    example_source: Optional[str] = Field(default=None, description="Example sentence in source language")
    example_target: Optional[str] = Field(default=None, description="Example sentence in target language")
    lesson_id: Optional[int] = Field(default=None, description="Associated curriculum lesson ID")
    is_verified: bool = Field(default=True, description="Editorial verification status")
    is_active: bool = Field(default=True, description="Active status")


class DictionaryEntryCreate(DictionaryEntryBase):
    pass


class DictionaryEntryUpdate(BaseModel):
    source_language: Optional[str] = Field(default=None, min_length=1, max_length=20)
    source_word: Optional[str] = Field(default=None, min_length=1, max_length=255)
    target_language: Optional[str] = Field(default=None, min_length=1, max_length=20)
    target_word: Optional[str] = Field(default=None, min_length=1, max_length=255)
    transliteration: Optional[str] = Field(default=None, max_length=255)
    part_of_speech: Optional[str] = Field(default=None, max_length=50)
    pronunciation: Optional[str] = Field(default=None, max_length=255)
    definition: Optional[str] = Field(default=None)
    example_source: Optional[str] = Field(default=None)
    example_target: Optional[str] = Field(default=None)
    lesson_id: Optional[int] = Field(default=None)
    is_verified: Optional[bool] = Field(default=None)
    is_active: Optional[bool] = Field(default=None)


class DictionaryEntryResponse(DictionaryEntryBase):
    id: int
    version: int = 1
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class DictionaryLookupQuery(BaseModel):
    word: str = Field(..., min_length=1, description="Word to look up")
    source_lang: Optional[str] = Field(default=None, description="Optional source language filter")
    target_lang: Optional[str] = Field(default=None, description="Optional target language filter")
