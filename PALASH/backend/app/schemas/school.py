from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class SchoolBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="School name")
    school_code: str = Field(..., min_length=1, max_length=50, description="Unique school code")
    district: str = Field(..., min_length=1, max_length=100, description="District name")
    block: Optional[str] = Field(default=None, max_length=100, description="Block name")
    cluster: Optional[str] = Field(default=None, max_length=100, description="Cluster name")
    village: Optional[str] = Field(default=None, max_length=100, description="Village name")
    address: Optional[str] = Field(default=None, max_length=255, description="Full address")


class SchoolCreate(SchoolBase):
    pass


class SchoolUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=255)
    school_code: Optional[str] = Field(default=None, min_length=1, max_length=50)
    district: Optional[str] = Field(default=None, min_length=1, max_length=100)
    block: Optional[str] = Field(default=None, max_length=100)
    cluster: Optional[str] = Field(default=None, max_length=100)
    village: Optional[str] = Field(default=None, max_length=100)
    address: Optional[str] = Field(default=None, max_length=255)


class SchoolResponse(BaseModel):
    id: int
    school_code: str
    name: str
    district: str
    block: Optional[str] = None
    cluster: Optional[str] = None
    village: Optional[str] = None
    address: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
