"""
PALASH Multilingual Translation Schemas.
Stage 2.12 - Multilingual Curriculum Data Architecture.
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field


class LanguageResponse(BaseModel):
    code: str
    name: str
    native_name: str
    script: str
    is_active: bool = True
    direction: str = "ltr"

    model_config = ConfigDict(from_attributes=True)


class LessonTranslationResponse(BaseModel):
    id: int
    lesson_id: int
    language_code: str
    translated_title: str
    translated_script: Optional[str] = None
    translated_objective: Optional[str] = None
    translated_content: Optional[str] = None
    audio_path: Optional[str] = None
    version: int = 1
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class LessonTranslationCreate(BaseModel):
    lesson_id: int
    language_code: str
    translated_title: str
    translated_script: Optional[str] = None
    translated_objective: Optional[str] = None
    translated_content: Optional[str] = None
    audio_path: Optional[str] = None
    version: int = 1
    is_active: bool = True


class ActivityTranslationResponse(BaseModel):
    id: int
    activity_id: int
    language_code: str
    translated_title: str
    translated_instructions: Optional[str] = None
    audio_path: Optional[str] = None
    version: int = 1
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class ActivityTranslationCreate(BaseModel):
    activity_id: int
    language_code: str
    translated_title: str
    translated_instructions: Optional[str] = None
    audio_path: Optional[str] = None
    version: int = 1
    is_active: bool = True


class AssessmentTranslationResponse(BaseModel):
    id: int
    assessment_id: int
    language_code: str
    translated_title: str
    translated_prompt: str
    translated_expected_response: Optional[str] = None
    audio_path: Optional[str] = None
    version: int = 1
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class AssessmentTranslationCreate(BaseModel):
    assessment_id: int
    language_code: str
    translated_title: str
    translated_prompt: str
    translated_expected_response: Optional[str] = None
    audio_path: Optional[str] = None
    version: int = 1
    is_active: bool = True
