from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field


class AttendanceBase(BaseModel):
    student_id: int = Field(..., description="Student ID")
    school_id: int = Field(..., description="School ID")
    attendance_date: date = Field(..., description="Date of attendance")
    status: str = Field(default="present", description="Status: present, absent, late, excused")
    remarks: Optional[str] = Field(default=None, description="Optional teacher remarks")


class AttendanceCreate(AttendanceBase):
    pass


class AttendanceBulkItem(BaseModel):
    student_id: int
    status: str = "present"
    remarks: Optional[str] = None


class AttendanceBulkCreate(BaseModel):
    school_id: int
    attendance_date: date
    records: List[AttendanceBulkItem]


class AttendanceResponse(AttendanceBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class AttendanceSummaryResponse(BaseModel):
    attendance_date: date
    school_id: int
    total_students: int
    present_count: int
    absent_count: int
    attendance_rate: float
