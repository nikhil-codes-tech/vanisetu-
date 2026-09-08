from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field


class StudentBase(BaseModel):
    school_id: int = Field(..., description="School ID")
    student_code: str = Field(..., min_length=1, max_length=50, description="Unique student code/ID")
    full_name: str = Field(..., min_length=1, max_length=100, description="Student full name")
    class_name: Optional[str] = Field(default=None, max_length=50, description="Enrolled class or grade")
    section: Optional[str] = Field(default=None, max_length=10, description="Class section")
    mother_tongue: str = Field(default="ho", max_length=20, description="Student's mother tongue (e.g. ho, santhali, mundari)")
    date_of_birth: Optional[date] = Field(default=None, description="Date of birth")


class StudentCreate(StudentBase):
    pass


class StudentUpdate(BaseModel):
    school_id: Optional[int] = Field(default=None)
    student_code: Optional[str] = Field(default=None, min_length=1, max_length=50)
    full_name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    class_name: Optional[str] = Field(default=None, max_length=50)
    section: Optional[str] = Field(default=None, max_length=10)
    mother_tongue: Optional[str] = Field(default=None, max_length=20)
    date_of_birth: Optional[date] = Field(default=None)


class StudentResponse(StudentBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class StudentAssessmentRecord(BaseModel):
    student_id: int
    assessment_id: Optional[int] = None
    worksheet_id: Optional[int] = None
    score: float
    max_score: float = 10.0
    status: str = "completed"
    remarks: Optional[str] = None
