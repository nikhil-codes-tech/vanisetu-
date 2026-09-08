import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database.session import SessionLocal
from app.database.seed_curriculum import seed_curriculum_data

client = TestClient(app)


@pytest.fixture(scope="module")
def seed_data():
    """Ensure baseline curriculum and worksheet seed data exists for tests."""
    with SessionLocal() as db:
        data = seed_curriculum_data(db)
    return data


def _get_auth_headers(username: str = "test_teacher_ws_01", password: str = "pass123456") -> dict:
    """Helper to register/login a teacher user and return authorization header."""
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


def test_unauthenticated_worksheet_request():
    """1. Unauthenticated request -> 401."""
    res = client.get("/api/v1/worksheets/1")
    assert res.status_code == 401

    res_post = client.post("/api/v1/worksheets", json={"title": "Test", "lesson_id": 1, "worksheet_type": "reading"})
    assert res_post.status_code == 401


def test_authenticated_worksheet_creation(seed_data):
    """2. Authenticated worksheet creation -> 201."""
    headers = _get_auth_headers("test_ws_user_01")
    lesson_id = seed_data["lesson_id"]

    payload = {
        "lesson_id": lesson_id,
        "title": "Hindi Vocabulary Practice",
        "description": "Vocabulary practice worksheet for foundational words.",
        "language_code": "hi",
        "source_language": "hi",
        "worksheet_type": "vocabulary",
        "difficulty_level": "beginner",
        "instructions": "Match the words with their meanings.",
        "content": "Word list: कमल, जल, घर",
        "answer_key": "1-A, 2-B",
        "version": 1,
    }

    res = client.post("/api/v1/worksheets", json=payload, headers=headers)
    assert res.status_code == 201
    data = res.json()
    assert data["title"] == "Hindi Vocabulary Practice"
    assert data["lesson_id"] == lesson_id
    assert data["worksheet_type"] == "vocabulary"
    assert data["is_active"] is True


def test_get_worksheet(seed_data):
    """3. Get worksheet -> 200."""
    headers = _get_auth_headers("test_ws_user_02")
    worksheet_id = seed_data["worksheet_id"]

    res = client.get(f"/api/v1/worksheets/{worksheet_id}", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["id"] == worksheet_id
    assert data["title"] == "Hindi Letter Recognition Worksheet"
    assert "questions" in data
    assert len(data["questions"]) >= 2


def test_list_worksheets_for_lesson(seed_data):
    """4. List worksheets for lesson -> 200."""
    headers = _get_auth_headers("test_ws_user_03")
    lesson_id = seed_data["lesson_id"]

    res = client.get(f"/api/v1/lessons/{lesson_id}/worksheets", headers=headers)
    assert res.status_code == 200
    worksheets = res.json()
    assert isinstance(worksheets, list)
    assert len(worksheets) >= 1

    # Also test curriculum nested endpoint
    res_curr = client.get(f"/api/v1/curriculum/lessons/{lesson_id}/worksheets", headers=headers)
    assert res_curr.status_code == 200
    assert len(res_curr.json()) == len(worksheets)


def test_update_worksheet(seed_data):
    """5. Update worksheet -> 200."""
    headers = _get_auth_headers("test_ws_user_04")
    worksheet_id = seed_data["worksheet_id"]

    update_payload = {
        "title": "Hindi Letter Recognition Worksheet (Updated)",
        "difficulty_level": "intermediate",
    }
    res = client.put(f"/api/v1/worksheets/{worksheet_id}", json=update_payload, headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["title"] == "Hindi Letter Recognition Worksheet (Updated)"
    assert data["difficulty_level"] == "intermediate"


def test_deactivate_worksheet(seed_data):
    """6. Deactivate worksheet -> 200."""
    headers = _get_auth_headers("test_ws_user_05")
    lesson_id = seed_data["lesson_id"]

    # Create a worksheet to deactivate
    create_res = client.post(
        "/api/v1/worksheets",
        json={
            "lesson_id": lesson_id,
            "title": "Temporary Worksheet To Deactivate",
            "worksheet_type": "numeracy",
            "language_code": "hi",
        },
        headers=headers,
    )
    ws_id = create_res.json()["id"]

    del_res = client.delete(f"/api/v1/worksheets/{ws_id}", headers=headers)
    assert del_res.status_code == 200
    assert del_res.json()["is_active"] is False

    # Check that active list does not return it
    list_res = client.get(f"/api/v1/lessons/{lesson_id}/worksheets", headers=headers)
    active_ids = [w["id"] for w in list_res.json()]
    assert ws_id not in active_ids


def test_invalid_lesson_returns_404():
    """7. Invalid lesson returns 404."""
    headers = _get_auth_headers("test_ws_user_06")

    res_get = client.get("/api/v1/lessons/999999/worksheets", headers=headers)
    assert res_get.status_code == 404
    assert "Lesson not found" in res_get.json()["detail"]

    res_post = client.post(
        "/api/v1/worksheets",
        json={
            "lesson_id": 999999,
            "title": "Invalid Lesson Worksheet",
            "worksheet_type": "reading",
        },
        headers=headers,
    )
    assert res_post.status_code == 404
    assert "Lesson not found" in res_post.json()["detail"]


def test_create_worksheet_question(seed_data):
    """8. Create question -> 201."""
    headers = _get_auth_headers("test_ws_user_07")
    worksheet_id = seed_data["worksheet_id"]

    payload = {
        "question_number": 3,
        "question_text": "'जल' का क्या अर्थ है?",
        "question_type": "mcq",
        "options": "A) पानी, B) आग, C) हवा",
        "correct_answer": "A",
        "explanation": "जल का अर्थ पानी होता है।",
        "marks": 2,
    }
    res = client.post(f"/api/v1/worksheets/{worksheet_id}/questions", json=payload, headers=headers)
    assert res.status_code == 201
    data = res.json()
    assert data["worksheet_id"] == worksheet_id
    assert data["question_number"] == 3
    assert data["marks"] == 2
    assert data["question_type"] == "mcq"


def test_list_worksheet_questions(seed_data):
    """9. List questions -> 200."""
    headers = _get_auth_headers("test_ws_user_08")
    worksheet_id = seed_data["worksheet_id"]

    res = client.get(f"/api/v1/worksheets/{worksheet_id}/questions", headers=headers)
    assert res.status_code == 200
    questions = res.json()
    assert isinstance(questions, list)
    assert len(questions) >= 2
    nums = [q["question_number"] for q in questions]
    assert nums == sorted(nums)


def test_invalid_worksheet_returns_404():
    """10. Invalid worksheet returns 404."""
    headers = _get_auth_headers("test_ws_user_09")

    res_get = client.get("/api/v1/worksheets/999999", headers=headers)
    assert res_get.status_code == 404
    assert "Worksheet not found" in res_get.json()["detail"]

    res_put = client.put("/api/v1/worksheets/999999", json={"title": "New Title"}, headers=headers)
    assert res_put.status_code == 404

    res_del = client.delete("/api/v1/worksheets/999999", headers=headers)
    assert res_del.status_code == 404

    res_q_post = client.post(
        "/api/v1/worksheets/999999/questions",
        json={"question_text": "Sample", "question_type": "short_answer", "question_number": 1},
        headers=headers,
    )
    assert res_q_post.status_code == 404

    res_q_get = client.get("/api/v1/worksheets/999999/questions", headers=headers)
    assert res_q_get.status_code == 404


def test_question_belongs_to_correct_worksheet(seed_data):
    """11. Question belongs to correct worksheet."""
    headers = _get_auth_headers("test_ws_user_10")
    lesson_id = seed_data["lesson_id"]

    # Create two separate worksheets
    ws1_res = client.post(
        "/api/v1/worksheets",
        json={"lesson_id": lesson_id, "title": "WS Alpha", "worksheet_type": "reading"},
        headers=headers,
    )
    ws1_id = ws1_res.json()["id"]

    ws2_res = client.post(
        "/api/v1/worksheets",
        json={"lesson_id": lesson_id, "title": "WS Beta", "worksheet_type": "writing"},
        headers=headers,
    )
    ws2_id = ws2_res.json()["id"]

    # Add question to WS1
    client.post(
        f"/api/v1/worksheets/{ws1_id}/questions",
        json={"question_number": 1, "question_text": "Alpha Q1", "question_type": "mcq"},
        headers=headers,
    )

    # Add question to WS2
    client.post(
        f"/api/v1/worksheets/{ws2_id}/questions",
        json={"question_number": 1, "question_text": "Beta Q1", "question_type": "short_answer"},
        headers=headers,
    )

    ws1_questions = client.get(f"/api/v1/worksheets/{ws1_id}/questions", headers=headers).json()
    ws2_questions = client.get(f"/api/v1/worksheets/{ws2_id}/questions", headers=headers).json()

    assert all(q["worksheet_id"] == ws1_id for q in ws1_questions)
    assert all(q["worksheet_id"] == ws2_id for q in ws2_questions)
    assert ws1_questions[0]["question_text"] == "Alpha Q1"
    assert ws2_questions[0]["question_text"] == "Beta Q1"


def test_validation_errors(seed_data):
    """12. Validation errors return 422."""
    headers = _get_auth_headers("test_ws_user_11")
    worksheet_id = seed_data["worksheet_id"]

    # Missing required title and worksheet_type
    res1 = client.post("/api/v1/worksheets", json={"lesson_id": 1}, headers=headers)
    assert res1.status_code == 422

    # Negative question_number
    res2 = client.post(
        f"/api/v1/worksheets/{worksheet_id}/questions",
        json={"question_number": -1, "question_text": "Test", "question_type": "mcq"},
        headers=headers,
    )
    assert res2.status_code == 422

    # Negative marks
    res3 = client.post(
        f"/api/v1/worksheets/{worksheet_id}/questions",
        json={"question_number": 1, "question_text": "Test", "question_type": "mcq", "marks": -5},
        headers=headers,
    )
    assert res3.status_code == 422

    # Version < 1
    res4 = client.post(
        "/api/v1/worksheets",
        json={"lesson_id": 1, "title": "Test", "worksheet_type": "reading", "version": 0},
        headers=headers,
    )
    assert res4.status_code == 422
