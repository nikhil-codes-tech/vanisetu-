from fastapi import APIRouter
from app.api.v1.endpoints import auth, teachers, schools, curriculum, worksheets, dictionary, students, attendance

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(teachers.router, prefix="/teachers", tags=["teachers"])
api_router.include_router(schools.router, prefix="/schools", tags=["schools"])
api_router.include_router(schools.schools_router if hasattr(schools, "schools_router") else students.schools_router, prefix="/schools", tags=["schools"])
api_router.include_router(curriculum.router, prefix="/curriculum", tags=["Curriculum"])
api_router.include_router(worksheets.router, prefix="/worksheets", tags=["Worksheets"])
api_router.include_router(worksheets.lessons_router, prefix="/lessons", tags=["Worksheets"])
api_router.include_router(dictionary.router, prefix="/dictionary", tags=["Dictionary"])
api_router.include_router(dictionary.lessons_router, prefix="/lessons", tags=["Dictionary"])
api_router.include_router(students.router, prefix="/students", tags=["Students"])
api_router.include_router(attendance.router, prefix="/attendance", tags=["Attendance"])

