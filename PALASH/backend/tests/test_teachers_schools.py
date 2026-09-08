import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text
from app.main import app
from app.database.session import engine, SessionLocal
from app.models.user import User
from app.models.school import School
from app.models.teacher import Teacher
from app.core.security import hash_password

client = TestClient(app)


@pytest.fixture(autouse=True)
def cleanup_data():
    """Clean up test users, teachers, and schools created during tests."""
    yield
    with engine.begin() as conn:
        conn.execute(
            text(
                "DELETE FROM teachers WHERE user_id IN (SELECT id FROM users WHERE username LIKE 'test_user_%' OR username LIKE 'test_teacher_%')"
            )
        )
        conn.execute(
            text(
                "DELETE FROM teachers WHERE teacher_code LIKE 'TCH_TEST_%' OR teacher_code LIKE 'TCH-TEST-%' OR teacher_code LIKE 'TCH-TEST_%'"
            )
        )
        conn.execute(
            text(
                "DELETE FROM users WHERE username LIKE 'test_user_%' OR username LIKE 'test_teacher_%'"
            )
        )
        conn.execute(
            text(
                "DELETE FROM schools WHERE school_code LIKE 'SCH_TEST_%' OR school_code LIKE 'SCH-TEST-%'"
            )
        )


def _get_auth_token(username: str, password: str = "pass123456", role: str = "teacher") -> tuple[int, str]:
    """Helper to register/login a user and return (user_id, token)."""
    client.post(
        "/api/v1/auth/register",
        json={
            "username": username,
            "password": password,
            "email": f"{username}@example.com",
            "role": role,
        },
    )
    login_res = client.post(
        "/api/v1/auth/login",
        data={"username": username, "password": password},
    )
    token = login_res.json()["access_token"]
    
    with SessionLocal() as db:
        user = db.query(User).filter(User.username == username).first()
        user_id = user.id
        
    return user_id, token


def test_get_teacher_me_unauthorized():
    """1. GET /teachers/me without token -> 401."""
    res = client.get("/api/v1/teachers/me")
    assert res.status_code == 401


def test_get_teacher_me_no_profile():
    """3. GET /teachers/me with valid token for non-teacher user (no teacher profile) -> 404."""
    _, token = _get_auth_token("test_user_not_teacher_01", role="admin")
    res = client.get(
        "/api/v1/teachers/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res.status_code == 404
    assert "Teacher profile not found" in res.json()["detail"]


def test_get_teacher_me_auto_created_on_registration():
    """Verify teacher registration automatically creates teacher profile and GET /teachers/me returns 200."""
    _, token = _get_auth_token("test_teacher_auto_01", role="teacher")
    res = client.get(
        "/api/v1/teachers/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["teacher_code"] == "TCH-TEST_TEACHER_AUTO_01"
    assert data["full_name"] == "test_teacher_auto_01"
    assert data["preferred_language"] == "hi"
    assert data["target_language"] == "ho"
    assert data["school_id"] is not None
    assert data["school"] is not None


def test_get_teacher_me_creates_profile_if_missing():
    """B. Existing teacher without profile: GET /teachers/me auto-creates profile and returns 200."""
    # Create user directly without teacher record
    with SessionLocal() as db:
        user = User(
            username="test_teacher_orphan_01",
            email="test_teacher_orphan_01@example.com",
            password_hash="fake_hash",
            role="teacher",
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        orphan_id = user.id

    from app.services.auth_service import create_user_token
    token = create_user_token(user).access_token

    # Verify initially no teacher record exists
    with SessionLocal() as db:
        assert db.query(Teacher).filter(Teacher.user_id == orphan_id).first() is None

    # Call GET /teachers/me -> should self-heal and return 200
    res = client.get(
        "/api/v1/teachers/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["full_name"] == "test_teacher_orphan_01"
    assert data["school_id"] is not None

    # Verify teacher record was persisted in database
    with SessionLocal() as db:
        teacher = db.query(Teacher).filter(Teacher.user_id == orphan_id).first()
        assert teacher is not None
        assert teacher.user_id == orphan_id


def test_get_teacher_me_idempotent_no_duplicates():
    """C. Calling GET /teachers/me again returns 200 and does NOT create a duplicate teacher record."""
    _, token = _get_auth_token("test_teacher_idem_01", role="teacher")

    # First call
    res1 = client.get("/api/v1/teachers/me", headers={"Authorization": f"Bearer {token}"})
    assert res1.status_code == 200
    t1_id = res1.json()["id"]

    # Second call
    res2 = client.get("/api/v1/teachers/me", headers={"Authorization": f"Bearer {token}"})
    assert res2.status_code == 200
    assert res2.json()["id"] == t1_id

    # Verify only 1 teacher record exists in DB for this user
    with SessionLocal() as db:
        user = db.query(User).filter(User.username == "test_teacher_idem_01").first()
        teachers = db.query(Teacher).filter(Teacher.user_id == user.id).all()
        assert len(teachers) == 1


def test_existing_teacher02_profile_access():
    """Verify existing user teacher02 has teacher profile and can access GET /teachers/me -> 200."""
    with SessionLocal() as db:
        user = db.query(User).filter(User.username == "teacher02").first()
        assert user is not None, "teacher02 must exist in database"
        teacher = db.query(Teacher).filter(Teacher.user_id == user.id).first()
        assert teacher is not None, "teacher02 must have a linked Teacher row"

    from app.services.auth_service import create_user_token
    token_obj = create_user_token(user)
    res = client.get(
        "/api/v1/teachers/me",
        headers={"Authorization": f"Bearer {token_obj.access_token}"},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["teacher_code"] == "TCH-TEACHER02"
    assert data["email"] == "teacher02@example.com"
    assert data["full_name"] == "Teacher 02"


def test_existing_teacher03_profile_access():
    """F. Verify existing user teacher03 has teacher profile and can access GET /teachers/me -> 200."""
    with SessionLocal() as db:
        user = db.query(User).filter(User.username == "teacher03").first()
        assert user is not None, "teacher03 must exist in database"
        teacher = db.query(Teacher).filter(Teacher.user_id == user.id).first()
        assert teacher is not None, "teacher03 must have a linked Teacher row"

    from app.services.auth_service import create_user_token
    token_obj = create_user_token(user)
    res = client.get(
        "/api/v1/teachers/me",
        headers={"Authorization": f"Bearer {token_obj.access_token}"},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["teacher_code"] == "TCH-TEACHER03"
    assert data["full_name"] == "teacher03"


def test_get_teacher_me_success():
    """2. GET /teachers/me with valid teacher token -> 200."""
    user_id, token = _get_auth_token("test_teacher_prof_01", role="teacher")

    # Seed school & update teacher
    with SessionLocal() as db:
        school = School(
            name="Primary School Chaibasa",
            school_code="SCH-TEST-001",
            district="West Singhbhum",
            block="Chaibasa",
            cluster="Chaibasa North",
            address="Near Bus Stand",
        )
        db.add(school)
        db.commit()
        db.refresh(school)

        teacher = db.query(Teacher).filter(Teacher.user_id == user_id).first()
        teacher.school_id = school.id
        teacher.teacher_code = "TCH-TEST-001"
        teacher.full_name = "Rajesh Birua"
        teacher.phone = "9876543210"
        teacher.preferred_language = "hi"
        teacher.target_language = "ho"
        db.commit()

    res = client.get(
        "/api/v1/teachers/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["teacher_code"] == "TCH-TEST-001"
    assert data["full_name"] == "Rajesh Birua"
    assert data["email"] == "test_teacher_prof_01@example.com"
    assert data["phone"] == "9876543210"
    assert "hi" in data["languages"]
    assert "ho" in data["languages"]
    assert data["school"] is not None
    assert data["school"]["school_code"] == "SCH-TEST-001"
    assert data["school"]["name"] == "Primary School Chaibasa"


def test_put_teacher_me_success():
    """4. PUT /teachers/me with valid token -> 200."""
    user_id, token = _get_auth_token("test_teacher_update_01", role="teacher")

    with SessionLocal() as db:
        school = School(
            name="Primary School Khunti",
            school_code="SCH-TEST-002",
            district="Khunti",
            block="Murhu",
        )
        db.add(school)
        db.commit()
        db.refresh(school)

        teacher = db.query(Teacher).filter(Teacher.user_id == user_id).first()
        teacher.school_id = school.id
        teacher.teacher_code = "TCH-TEST-002"
        teacher.full_name = "Anjali Munda"
        teacher.phone = "9876500000"
        teacher.preferred_language = "hi"
        teacher.target_language = "mundari"
        db.commit()

    update_payload = {
        "full_name": "Anjali Munda Hembrom",
        "phone": "9998887776",
        "languages": ["hi", "mundari", "ho"],
        "preferred_language": "mundari",
        "target_language": "ho",
    }
    res = client.put(
        "/api/v1/teachers/me",
        json=update_payload,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["full_name"] == "Anjali Munda Hembrom"
    assert data["phone"] == "9998887776"
    assert data["preferred_language"] == "mundari"
    assert data["target_language"] == "ho"


def test_post_school_success():
    """7. POST /schools with valid data -> 201."""
    _, token = _get_auth_token("test_user_sch_creator_01")

    payload = {
        "school_code": "SCH-TEST-003",
        "name": "Upgraded Middle School Torpa",
        "district": "Khunti",
        "block": "Torpa",
        "cluster": "Torpa Central",
        "village": "Torpa",
        "address": "Main Road Torpa",
    }
    res = client.post(
        "/api/v1/schools",
        json=payload,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res.status_code == 201
    data = res.json()
    assert data["school_code"] == "SCH-TEST-003"
    assert data["name"] == "Upgraded Middle School Torpa"
    assert data["district"] == "Khunti"
    assert data["cluster"] == "Torpa Central"
    assert "id" in data


def test_post_duplicate_school_code():
    """8. POST duplicate school_code -> 409."""
    _, token = _get_auth_token("test_user_sch_dup_01")

    payload = {
        "school_code": "SCH-TEST-004",
        "name": "Original School",
        "district": "Ranchi",
    }
    res1 = client.post(
        "/api/v1/schools",
        json=payload,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res1.status_code == 201

    # Attempt duplicate school_code
    res2 = client.post(
        "/api/v1/schools",
        json=payload,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res2.status_code == 409
    assert "School code already exists" in res2.json()["detail"]


def test_get_school_by_id_success():
    """5. GET /schools/{school_id} with valid token -> 200."""
    _, token = _get_auth_token("test_user_sch_getter_01")

    with SessionLocal() as db:
        school = School(
            name="Primary School Dumka",
            school_code="SCH-TEST-005",
            district="Dumka",
            block="Dumka Sadar",
            cluster="Dumka East",
            address="Kutchery Road",
        )
        db.add(school)
        db.commit()
        db.refresh(school)
        school_id = school.id

    res = client.get(
        f"/api/v1/schools/{school_id}",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["id"] == school_id
    assert data["school_code"] == "SCH-TEST-005"
    assert data["name"] == "Primary School Dumka"


def test_get_school_invalid_id():
    """6. GET /schools/{invalid_id} -> 404."""
    _, token = _get_auth_token("test_user_sch_invalid_01")

    res = client.get(
        "/api/v1/schools/999999",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res.status_code == 404
    assert "School not found" in res.json()["detail"]


def test_unauthorized_school_update():
    """9. Unauthorized school update -> 403."""
    user_id_1, token1 = _get_auth_token("test_teacher_sch_01", role="teacher")
    user_id_2, token2 = _get_auth_token("test_teacher_sch_02", role="teacher")

    with SessionLocal() as db:
        school1 = School(
            name="School One",
            school_code="SCH-TEST-006",
            district="Ranchi",
        )
        school2 = School(
            name="School Two",
            school_code="SCH-TEST-007",
            district="Ranchi",
        )
        db.add_all([school1, school2])
        db.commit()
        db.refresh(school1)
        db.refresh(school2)

        # Teacher 1 belongs to School 1
        t1 = db.query(Teacher).filter(Teacher.user_id == user_id_1).first()
        t1.school_id = school1.id
        t1.teacher_code = "TCH-TEST-006"
        t1.full_name = "Teacher One"
        t1.preferred_language = "hi"
        t1.target_language = "ho"

        # Teacher 2 belongs to School 2
        t2 = db.query(Teacher).filter(Teacher.user_id == user_id_2).first()
        t2.school_id = school2.id
        t2.teacher_code = "TCH-TEST-007"
        t2.full_name = "Teacher Two"
        t2.preferred_language = "hi"
        t2.target_language = "santhali"

        db.commit()

        school1_id = school1.id

    # Teacher 2 tries to update School 1
    res = client.put(
        f"/api/v1/schools/{school1_id}",
        json={"name": "Malicious Name Update"},
        headers={"Authorization": f"Bearer {token2}"},
    )
    assert res.status_code == 403
    assert "Not authorized to update this school" in res.json()["detail"]

    # Teacher 1 (assigned to School 1) updates School 1 -> should succeed
    res_ok = client.put(
        f"/api/v1/schools/{school1_id}",
        json={"name": "Authorized Name Update"},
        headers={"Authorization": f"Bearer {token1}"},
    )
    assert res_ok.status_code == 200
    assert res_ok.json()["name"] == "Authorized Name Update"
