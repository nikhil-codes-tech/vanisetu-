import pytest
import uuid
from datetime import date
from fastapi.testclient import TestClient
from sqlalchemy import text
from app.main import app
from app.database.session import SessionLocal, engine
from app.models.school import School
from app.models.student import Student
from app.models.attendance import StudentAttendance

client = TestClient(app)


@pytest.fixture(scope="module", autouse=True)
def setup_attendance_table():
    """Ensure student_attendance table exists in PostgreSQL test database."""
    StudentAttendance.__table__.create(bind=engine, checkfirst=True)
    yield


@pytest.fixture(autouse=True)
def cleanup_attendance():
    """Clean up test attendance records before and after tests."""
    with engine.begin() as conn:
        conn.execute(text("DELETE FROM student_attendance"))
    yield
    with engine.begin() as conn:
        conn.execute(text("DELETE FROM student_attendance"))


def _get_auth_headers(username: str = "test_att_teacher", password: str = "pass123456") -> dict:
    client.post(
        "/api/v1/auth/register",
        json={
            "username": username,
            "password": password,
            "email": f"{username}@example.com",
            "role": "teacher",
        },
    )
    login_res = client.post(
        "/api/v1/auth/login",
        data={"username": username, "password": password},
    )
    token = login_res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_unauthenticated_attendance_request():
    """Unauthenticated attendance requests return 401."""
    res = client.get("/api/v1/attendance?school_id=1")
    assert res.status_code == 401


def test_mark_and_list_daily_attendance():
    """Authenticated teacher can record and view daily attendance."""
    headers = _get_auth_headers("att_tester_01")

    with SessionLocal() as db:
        school = db.query(School).first()
        if not school:
            school = School(name="Test School", school_code="SCH_ATT_01", district="Singhbhum")
            db.add(school)
            db.commit()
            db.refresh(school)
        school_id = school.id

        stu_code = f"STU_ATT_{uuid.uuid4().hex[:6].upper()}"
        student = Student(
            school_id=school_id,
            student_code=stu_code,
            full_name="Jolen Kui",
            class_name="Class 1",
            mother_tongue="ho"
        )
        db.add(student)
        db.commit()
        db.refresh(student)
        student_id = student.id

    today_str = date.today().isoformat()
    payload = {
        "student_id": student_id,
        "school_id": school_id,
        "attendance_date": today_str,
        "status": "present",
        "remarks": "उपस्थित (Present in class)"
    }

    res = client.post("/api/v1/attendance", json=payload, headers=headers)
    assert res.status_code == 201
    rec = res.json()
    assert rec["student_id"] == student_id
    assert rec["status"] == "present"

    # List attendance by date
    list_res = client.get(f"/api/v1/attendance?school_id={school_id}&attendance_date={today_str}", headers=headers)
    assert list_res.status_code == 200
    records = list_res.json()
    assert len(records) >= 1
    assert any(r["student_id"] == student_id for r in records)

    # Get summary
    sum_res = client.get(f"/api/v1/attendance/summary?school_id={school_id}&attendance_date={today_str}", headers=headers)
    assert sum_res.status_code == 200
    summary = sum_res.json()
    assert summary["total_students"] >= 1
    assert summary["present_count"] >= 1
    assert summary["attendance_rate"] > 0
