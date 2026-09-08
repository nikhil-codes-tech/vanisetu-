from datetime import date
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.models.attendance import StudentAttendance
from app.models.student import Student
from app.schemas.attendance import (
    AttendanceCreate,
    AttendanceBulkCreate,
    AttendanceSummaryResponse,
)


def record_attendance(db: Session, data: AttendanceCreate) -> StudentAttendance:
    existing = db.query(StudentAttendance).filter(
        and_(
            StudentAttendance.student_id == data.student_id,
            StudentAttendance.attendance_date == data.attendance_date
        )
    ).first()

    if existing:
        existing.status = data.status
        existing.remarks = data.remarks
        db.commit()
        db.refresh(existing)
        return existing

    record = StudentAttendance(
        student_id=data.student_id,
        school_id=data.school_id,
        attendance_date=data.attendance_date,
        status=data.status,
        remarks=data.remarks
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def record_bulk_attendance(db: Session, data: AttendanceBulkCreate) -> List[StudentAttendance]:
    results = []
    for item in data.records:
        rec = record_attendance(
            db=db,
            data=AttendanceCreate(
                student_id=item.student_id,
                school_id=data.school_id,
                attendance_date=data.attendance_date,
                status=item.status,
                remarks=item.remarks
            )
        )
        results.append(rec)
    return results


def get_attendance_by_date(
    db: Session,
    school_id: int,
    attendance_date: date,
    class_name: Optional[str] = None
) -> List[StudentAttendance]:
    query = db.query(StudentAttendance).filter(
        and_(
            StudentAttendance.school_id == school_id,
            StudentAttendance.attendance_date == attendance_date
        )
    )
    if class_name:
        query = query.join(Student, Student.id == StudentAttendance.student_id).filter(
            Student.class_name == class_name
        )
    return query.all()


def get_student_attendance(db: Session, student_id: int) -> List[StudentAttendance]:
    return db.query(StudentAttendance).filter(
        StudentAttendance.student_id == student_id
    ).order_by(StudentAttendance.attendance_date.desc()).all()


def get_attendance_summary(
    db: Session,
    school_id: int,
    attendance_date: date
) -> AttendanceSummaryResponse:
    records = get_attendance_by_date(db, school_id=school_id, attendance_date=attendance_date)
    total = len(records)
    present = sum(1 for r in records if r.status == "present")
    absent = sum(1 for r in records if r.status == "absent")
    rate = (present / total * 100.0) if total > 0 else 0.0

    return AttendanceSummaryResponse(
        attendance_date=attendance_date,
        school_id=school_id,
        total_students=total,
        present_count=present,
        absent_count=absent,
        attendance_rate=round(rate, 1)
    )
