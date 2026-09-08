from app.services.auth_service import register_user, authenticate_user, create_user_token
from app.services.school_service import get_school, create_school, update_school
from app.services.teacher_service import get_teacher_profile, update_teacher_profile
from app.services.curriculum_service import (
    get_classes,
    get_class_by_id,
    get_subjects_by_class,
    get_learning_outcomes_by_subject,
    get_lessons_by_outcome,
    get_lesson_by_id,
    get_activities_by_lesson,
    get_assessments_by_lesson,
)
from app.services.worksheet_service import (
    create_worksheet,
    get_worksheet,
    list_worksheets_by_lesson,
    update_worksheet,
    deactivate_worksheet,
    create_worksheet_question,
    list_worksheet_questions,
)
from app.services.dictionary_service import (
    get_dictionary_entry,
    list_dictionary_entries,
    search_dictionary,
    create_dictionary_entry,
    update_dictionary_entry,
)
from app.services.student_service import (
    get_student,
    list_students_by_school,
    create_student,
    update_student,
)

__all__ = [
    "register_user",
    "authenticate_user",
    "create_user_token",
    "get_school",
    "create_school",
    "update_school",
    "get_teacher_profile",
    "update_teacher_profile",
    "get_classes",
    "get_class_by_id",
    "get_subjects_by_class",
    "get_learning_outcomes_by_subject",
    "get_lessons_by_outcome",
    "get_lesson_by_id",
    "get_activities_by_lesson",
    "get_assessments_by_lesson",
    "create_worksheet",
    "get_worksheet",
    "list_worksheets_by_lesson",
    "update_worksheet",
    "deactivate_worksheet",
    "create_worksheet_question",
    "list_worksheet_questions",
    "get_dictionary_entry",
    "list_dictionary_entries",
    "search_dictionary",
    "create_dictionary_entry",
    "update_dictionary_entry",
    "get_student",
    "list_students_by_school",
    "create_student",
    "update_student",
]
