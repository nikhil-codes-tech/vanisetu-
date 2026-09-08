from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.school import SchoolResponse


class TeacherUpdate(BaseModel):
    full_name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    phone: Optional[str] = Field(default=None, max_length=20)
    languages: Optional[List[str]] = Field(default=None, description="Supported teaching languages")
    preferred_language: Optional[str] = Field(default=None, max_length=20)
    target_language: Optional[str] = Field(default=None, max_length=20)


class TeacherResponse(BaseModel):
    id: int
    user_id: int
    teacher_code: str
    full_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    languages: List[str] = Field(default_factory=list)
    preferred_language: str = "hi"
    target_language: str = "ho"
    school_id: int
    school: Optional[SchoolResponse] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
