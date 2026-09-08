import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text
from app.main import app
from app.database.session import engine, SessionLocal
from app.database.seed_curriculum import seed_curriculum_data

client = TestClient(app)


@pytest.fixture(scope="module")
def seed_data():
    """Ensure baseline curriculum seed data exists for tests."""
    with SessionLocal() as db:
        data = seed_curriculum_data(db)
    return data


def _get_auth_headers(username: str = "test_teacher_curr_01", password: str = "pass123456") -> dict:
    """Helper to register/login a user and return authorization header."""
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


def test_unauthenticated_classes_request():
    """1. Unauthenticated classes request -> 401."""
    res = client.get("/api/v1/curriculum/classes")
    assert res.status_code == 401


def test_authenticated_classes_request(seed_data):
    """2. Authenticated classes request -> 200."""
    headers = _get_auth_headers("test_curr_user_01")
    res = client.get("/api/v1/curriculum/classes", headers=headers)
    assert res.status_code == 200
    classes = res.json()
    assert isinstance(classes, list)
    assert len(classes) >= 1
    assert classes[0]["name"] == "Class 1"
    assert classes[0]["grade"] == 1


def test_get_valid_class(seed_data):
    """3. Get valid class -> 200."""
    headers = _get_auth_headers("test_curr_user_02")
    class_id = seed_data["class_id"]
    res = client.get(f"/api/v1/curriculum/classes/{class_id}", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["id"] == class_id
    assert data["name"] == "Class 1"
    assert data["grade"] == 1


def test_get_invalid_class():
    """4. Invalid class ID -> 404."""
    headers = _get_auth_headers("test_curr_user_03")
    res = client.get("/api/v1/curriculum/classes/999999", headers=headers)
    assert res.status_code == 404
    assert "Curriculum class not found" in res.json()["detail"]


def test_list_subjects(seed_data):
    """5. List subjects -> 200."""
    headers = _get_auth_headers("test_curr_user_04")
    class_id = seed_data["class_id"]
    res = client.get(f"/api/v1/curriculum/classes/{class_id}/subjects", headers=headers)
    assert res.status_code == 200
    subjects = res.json()
    assert isinstance(subjects, list)
    assert len(subjects) >= 1
    assert subjects[0]["code"] == "FLN-LIT"
    assert subjects[0]["name"] == "Foundational Literacy"


def test_list_learning_outcomes(seed_data):
    """6. List learning outcomes -> 200."""
    headers = _get_auth_headers("test_curr_user_05")
    subject_id = seed_data["subject_id"]
    res = client.get(
        f"/api/v1/curriculum/subjects/{subject_id}/learning-outcomes",
        headers=headers
    )
    assert res.status_code == 200
    outcomes = res.json()
    assert isinstance(outcomes, list)
    assert len(outcomes) >= 1
    assert outcomes[0]["code"] == "FLN-LIT-001"
    assert outcomes[0]["nipun_domain"] == "Foundational Literacy"


def test_list_lessons(seed_data):
    """7. List lessons -> 200."""
    headers = _get_auth_headers("test_curr_user_06")
    outcome_id = seed_data["outcome_id"]
    res = client.get(
        f"/api/v1/curriculum/learning-outcomes/{outcome_id}/lessons",
        headers=headers
    )
    assert res.status_code == 200
    lessons = res.json()
    assert isinstance(lessons, list)
    assert len(lessons) >= 1
    assert lessons[0]["lesson_number"] == 1
    assert lessons[0]["title"] == "Recognizing Simple Words"


def test_get_valid_lesson(seed_data):
    """8. Get valid lesson -> 200."""
    headers = _get_auth_headers("test_curr_user_07")
    lesson_id = seed_data["lesson_id"]
    res = client.get(f"/api/v1/curriculum/lessons/{lesson_id}", headers=headers)
    assert res.status_code == 200
    lesson = res.json()
    assert lesson["id"] == lesson_id
    assert lesson["title"] == "Recognizing Simple Words"
    assert lesson["source_language"] == "hi"


def test_get_invalid_lesson():
    """9. Invalid lesson ID -> 404."""
    headers = _get_auth_headers("test_curr_user_08")
    res = client.get("/api/v1/curriculum/lessons/999999", headers=headers)
    assert res.status_code == 404
    assert "Lesson not found" in res.json()["detail"]


def test_activities_ordered_by_sequence(seed_data):
    """10. Activities are ordered by sequence_order."""
    headers = _get_auth_headers("test_curr_user_09")
    lesson_id = seed_data["lesson_id"]
    res = client.get(
        f"/api/v1/curriculum/lessons/{lesson_id}/activities",
        headers=headers
    )
    assert res.status_code == 200
    activities = res.json()
    assert len(activities) >= 2
    sequence_orders = [act["sequence_order"] for act in activities]
    assert sequence_orders == sorted(sequence_orders)
    assert activities[0]["activity_type"] == "matching"
    assert activities[1]["activity_type"] == "story"


def test_assessments_ordered_by_sequence(seed_data):
    """11. Assessments are ordered by sequence_order."""
    headers = _get_auth_headers("test_curr_user_10")
    lesson_id = seed_data["lesson_id"]
    res = client.get(
        f"/api/v1/curriculum/lessons/{lesson_id}/assessments",
        headers=headers
    )
    assert res.status_code == 200
    assessments = res.json()
    assert len(assessments) >= 2
    sequence_orders = [ass["sequence_order"] for ass in assessments]
    assert sequence_orders == sorted(sequence_orders)
    assert assessments[0]["assessment_type"] == "oral"
    assert assessments[1]["assessment_type"] == "quiz"


def test_authenticated_lesson_detail_structure(seed_data):
    """12. Authenticated lesson response contains lesson, learning outcome, activities, assessments."""
    headers = _get_auth_headers("test_curr_user_11")
    lesson_id = seed_data["lesson_id"]
    res = client.get(f"/api/v1/curriculum/lessons/{lesson_id}", headers=headers)
    assert res.status_code == 200
    data = res.json()

    # Lesson information
    assert data["id"] == lesson_id
    assert data["title"] == "Recognizing Simple Words"
    assert data["lesson_number"] == 1
    assert "teacher_script" in data
    assert "learning_objective" in data

    # Nested Learning Outcome
    assert data["learning_outcome"] is not None
    assert data["learning_outcome"]["code"] == "FLN-LIT-001"
    assert data["learning_outcome"]["nipun_domain"] == "Foundational Literacy"

    # Nested Activities
    assert isinstance(data["activities"], list)
    assert len(data["activities"]) >= 2
    assert data["activities"][0]["title"] == "Word Card Matching Activity"

    # Nested Assessments
    assert isinstance(data["assessments"], list)
    assert len(data["assessments"]) >= 2
    assert data["assessments"][0]["title"] == "Oral Word Recognition Assessment"
