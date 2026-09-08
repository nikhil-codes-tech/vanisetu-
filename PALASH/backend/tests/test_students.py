import pytest
import uuid
from fastapi.testclient import TestClient
from sqlalchemy import text
from app.main import app
from app.database.session import SessionLocal, engine
from app.models.school import School

client = TestClient(app)


@pytest.fixture(autouse=True)
def cleanup_students():
    """Clean up test students before and after tests."""
    with engine.begin() as conn:
        conn.execute(text("DELETE FROM students WHERE student_code LIKE 'STU_TEST_%'"))
    yield
    with engine.begin() as conn:
        conn.execute(text("DELETE FROM students WHERE student_code LIKE 'STU_TEST_%'"))


def _get_auth_headers(username: str = "test_student_teacher", password: str = "pass123456") -> dict:
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


def test_unauthenticated_students_request():
    """Unauthenticated students requests return 401."""
    res = client.get("/api/v1/students?school_id=1")
    assert res.status_code == 401


def test_create_and_list_students():
    """Authenticated user can enroll and list students for a school."""
    headers = _get_auth_headers("student_tester_01")
    
    with SessionLocal() as db:
        school = db.query(School).first()
        if not school:
            school = School(
                name="Primary School Chaibasa",
                school_code="SCH_CHAI_001",
                district="West Singhbhum"
            )
            db.add(school)
            db.commit()
            db.refresh(school)
        school_id = school.id

    student_code = f"STU_TEST_{uuid.uuid4().hex[:6].upper()}"
    payload = {
        "school_id": school_id,
        "student_code": student_code,
        "full_name": "Soma Kui",
        "class_name": "Class 1",
        "section": "A",
        "mother_tongue": "ho",
        "date_of_birth": "2018-04-15"
    }

    res = client.post("/api/v1/students", json=payload, headers=headers)
    assert res.status_code == 201
    stu = res.json()
    assert stu["student_code"] == student_code
    assert stu["full_name"] == "Soma Kui"
    stu_id = stu["id"]

    # List by school
    list_res = client.get(f"/api/v1/students?school_id={school_id}", headers=headers)
    assert list_res.status_code == 200
    students = list_res.json()
    assert any(s["id"] == stu_id for s in students)

    # Get single student
    get_res = client.get(f"/api/v1/students/{stu_id}", headers=headers)
    assert get_res.status_code == 200
    assert get_res.json()["full_name"] == "Soma Kui"

    # Update student
    update_res = client.put(
        f"/api/v1/students/{stu_id}",
        json={"section": "B"},
        headers=headers
    )
    assert update_res.status_code == 200
    assert update_res.json()["section"] == "B"
