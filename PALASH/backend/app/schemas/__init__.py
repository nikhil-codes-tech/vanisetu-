from app.schemas.auth import UserRegister, UserLogin, Token, TokenData, UserResponse
from app.schemas.school import SchoolBase, SchoolCreate, SchoolUpdate, SchoolResponse
from app.schemas.teacher import TeacherUpdate, TeacherResponse
from app.schemas.curriculum import (
    ClassResponse,
    SubjectResponse,
    LearningOutcomeResponse,
    ActivityResponse,
    AssessmentResponse,
    LessonResponse,
    LessonDetailResponse,
)
from app.schemas.worksheet import (
    WorksheetCreate,
    WorksheetUpdate,
    WorksheetResponse,
    WorksheetListResponse,
    WorksheetQuestionCreate,
    WorksheetQuestionResponse,
)
from app.schemas.dictionary import (
    DictionaryEntryBase,
    DictionaryEntryCreate,
    DictionaryEntryUpdate,
    DictionaryEntryResponse,
    DictionaryLookupQuery,
)
from app.schemas.student import (
    StudentBase,
    StudentCreate,
    StudentUpdate,
    StudentResponse,
    StudentAssessmentRecord,
)

__all__ = [
    "UserRegister",
    "UserLogin",
    "Token",
    "TokenData",
    "UserResponse",
    "SchoolBase",
    "SchoolCreate",
    "SchoolUpdate",
    "SchoolResponse",
    "TeacherUpdate",
    "TeacherResponse",
    "ClassResponse",
    "SubjectResponse",
    "LearningOutcomeResponse",
    "ActivityResponse",
    "AssessmentResponse",
    "LessonResponse",
    "LessonDetailResponse",
    "WorksheetCreate",
    "WorksheetUpdate",
    "WorksheetResponse",
    "WorksheetListResponse",
    "WorksheetQuestionCreate",
    "WorksheetQuestionResponse",
    "DictionaryEntryBase",
    "DictionaryEntryCreate",
    "DictionaryEntryUpdate",
    "DictionaryEntryResponse",
    "DictionaryLookupQuery",
    "StudentBase",
    "StudentCreate",
    "StudentUpdate",
    "StudentResponse",
    "StudentAssessmentRecord",
]
