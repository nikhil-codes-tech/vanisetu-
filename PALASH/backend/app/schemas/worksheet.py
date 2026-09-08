from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field


class WorksheetQuestionBase(BaseModel):
    question_number: int = Field(default=1, ge=1)
    question_text: str = Field(..., min_length=1)
    question_type: str = Field(..., min_length=1, max_length=50)
    options: Optional[str] = None
    correct_answer: Optional[str] = None
    explanation: Optional[str] = None
    marks: int = Field(default=1, ge=0)


class WorksheetQuestionCreate(WorksheetQuestionBase):
    pass


class WorksheetQuestionResponse(WorksheetQuestionBase):
    id: int
    worksheet_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class WorksheetBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    language_code: str = Field(default="hi", min_length=2, max_length=20)
    source_language: str = Field(default="hi", min_length=2, max_length=20)
    worksheet_type: str = Field(..., min_length=1, max_length=50)
    difficulty_level: Optional[str] = Field(default="beginner", max_length=50)
    instructions: Optional[str] = None
    content: Optional[str] = None
    answer_key: Optional[str] = None
    file_path: Optional[str] = Field(default=None, max_length=500)
    version: int = Field(default=1, ge=1)


class WorksheetCreate(WorksheetBase):
    lesson_id: int = Field(..., ge=1)


class WorksheetUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    language_code: Optional[str] = Field(None, min_length=2, max_length=20)
    source_language: Optional[str] = Field(None, min_length=2, max_length=20)
    worksheet_type: Optional[str] = Field(None, min_length=1, max_length=50)
    difficulty_level: Optional[str] = Field(None, max_length=50)
    instructions: Optional[str] = None
    content: Optional[str] = None
    answer_key: Optional[str] = None
    file_path: Optional[str] = Field(None, max_length=500)
    version: Optional[int] = Field(None, ge=1)
    is_active: Optional[bool] = None


class WorksheetListResponse(WorksheetBase):
    id: int
    lesson_id: int
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class WorksheetResponse(WorksheetBase):
    id: int
    lesson_id: int
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    questions: List[WorksheetQuestionResponse] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)
