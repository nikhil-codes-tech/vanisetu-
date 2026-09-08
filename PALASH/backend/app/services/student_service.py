from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.student import Student
from app.schemas.student import StudentCreate, StudentUpdate


def get_student(db: Session, student_id: int) -> Student:
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student {student_id} not found"
        )
    return student


def list_students_by_school(
    db: Session,
    school_id: int,
    class_name: Optional[str] = None
) -> List[Student]:
    query = db.query(Student).filter(Student.school_id == school_id)
    if class_name:
        query = query.filter(Student.class_name == class_name)
    return query.order_by(Student.full_name.asc()).all()


def create_student(db: Session, data: StudentCreate) -> Student:
    existing = db.query(Student).filter(Student.student_code == data.student_code).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Student with code {data.student_code} already exists"
        )
    student = Student(
        school_id=data.school_id,
        student_code=data.student_code,
        full_name=data.full_name,
        class_name=data.class_name,
        section=data.section,
        mother_tongue=data.mother_tongue,
        date_of_birth=data.date_of_birth
    )
    db.add(student)
    db.commit()
    db.refresh(student)
    return student


def update_student(db: Session, student_id: int, data: StudentUpdate) -> Student:
    student = get_student(db, student_id)
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(student, field, value)
    db.commit()
    db.refresh(student)
    return student
