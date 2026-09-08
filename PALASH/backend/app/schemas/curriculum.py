from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field


class ClassResponse(BaseModel):
    id: int
    name: str
    grade: int
    description: Optional[str] = None
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class SubjectResponse(BaseModel):
    id: int
    class_id: int
    name: str
    code: str
    description: Optional[str] = None
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class LearningOutcomeResponse(BaseModel):
    id: int
    subject_id: int
    code: str
    title: str
    description: Optional[str] = None
    nipun_domain: Optional[str] = None
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class ActivityResponse(BaseModel):
    id: int
    lesson_id: int
    title: str
    activity_type: str
    instructions: Optional[str] = None
    sequence_order: int = 1
    materials: Optional[str] = None
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class AssessmentResponse(BaseModel):
    id: int
    lesson_id: int
    title: str
    prompt: str
    assessment_type: str
    sequence_order: int = 1
    expected_response: Optional[str] = None
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class LessonResponse(BaseModel):
    id: int
    learning_outcome_id: int
    title: str
    lesson_number: int
    source_language: str = "hi"
    duration_minutes: Optional[int] = 30
    teacher_script: Optional[str] = None
    learning_objective: Optional[str] = None
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class LessonDetailResponse(LessonResponse):
    learning_outcome: Optional[LearningOutcomeResponse] = None
    activities: List[ActivityResponse] = Field(default_factory=list)
    assessments: List[AssessmentResponse] = Field(default_factory=list)
