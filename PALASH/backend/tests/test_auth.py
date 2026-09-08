import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text
from app.main import app
from app.database.session import engine


from app.models.user import User
from app.models.teacher import Teacher
from app.database.session import SessionLocal


client = TestClient(app)


@pytest.fixture(autouse=True)
def cleanup_test_users():
    """Clean up any test users and associated teacher profiles created during test runs."""
    yield
    with engine.begin() as conn:
        conn.execute(
            text("DELETE FROM teachers WHERE user_id IN (SELECT id FROM users WHERE username LIKE 'test_user_%')")
        )
        conn.execute(
            text("DELETE FROM users WHERE username LIKE 'test_user_%'")
        )


def test_successful_registration():
    """Test successful user registration creates both User and Teacher profile for teacher role."""
    payload = {
        "username": "test_user_reg_01",
        "password": "strongPassword123!",
        "email": "test_user_reg_01@example.com",
        "role": "teacher"
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "test_user_reg_01"
    assert data["email"] == "test_user_reg_01@example.com"
    assert data["role"] == "teacher"
    assert data["is_active"] is True
    assert "id" in data
    assert "created_at" in data
    assert "password" not in data
    assert "password_hash" not in data

    # Verify corresponding Teacher profile was created and points to the created User
    with SessionLocal() as db:
        teacher = db.query(Teacher).filter(Teacher.user_id == data["id"]).first()
        assert teacher is not None
        assert teacher.user_id == data["id"]
        assert teacher.full_name == "test_user_reg_01"
        assert teacher.preferred_language == "hi"
        assert teacher.target_language == "ho"


def test_non_teacher_registration_no_teacher_profile():
    """Test registering a non-teacher (e.g. admin) creates User but does NOT create Teacher profile."""
    payload = {
        "username": "test_user_admin_01",
        "password": "strongAdminPassword123!",
        "email": "test_user_admin_01@example.com",
        "role": "admin"
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["role"] == "admin"

    with SessionLocal() as db:
        teacher = db.query(Teacher).filter(Teacher.user_id == data["id"]).first()
        assert teacher is None


def test_duplicate_username_registration():
    """Test duplicate username registration returns 400."""
    payload = {
        "username": "test_user_dup_01",
        "password": "password123",
        "email": "test_user_dup_01@example.com"
    }
    first_res = client.post("/api/v1/auth/register", json=payload)
    assert first_res.status_code == 201

    # Second registration with same username
    second_res = client.post("/api/v1/auth/register", json=payload)
    assert second_res.status_code == 400
    assert "Username already registered" in second_res.json()["detail"]


def test_duplicate_email_registration():
    """Test duplicate email registration returns 400."""
    user1 = {
        "username": "test_user_email_01",
        "password": "password123",
        "email": "shared_email@example.com"
    }
    user2 = {
        "username": "test_user_email_02",
        "password": "password123",
        "email": "shared_email@example.com"
    }
    first_res = client.post("/api/v1/auth/register", json=user1)
    assert first_res.status_code == 201

    second_res = client.post("/api/v1/auth/register", json=user2)
    assert second_res.status_code == 400
    assert "Email already registered" in second_res.json()["detail"]


def test_successful_login():
    """Test successful OAuth2 password flow login returns JWT access token."""
    reg_payload = {
        "username": "test_user_login_01",
        "password": "validPassword123"
    }
    reg_res = client.post("/api/v1/auth/register", json=reg_payload)
    assert reg_res.status_code == 201

    # Login using form data (application/x-www-form-urlencoded)
    login_form = {
        "username": "test_user_login_01",
        "password": "validPassword123"
    }
    login_res = client.post("/api/v1/auth/login", data=login_form)
    assert login_res.status_code == 200
    token_data = login_res.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"
    assert len(token_data["access_token"]) > 20


def test_oauth2_form_login():
    """Test explicit OAuth2PasswordRequestForm compatibility for Swagger Authorize."""
    reg_payload = {
        "username": "test_user_oauth2_01",
        "password": "oauthPassword123"
    }
    reg_res = client.post("/api/v1/auth/register", json=reg_payload)
    assert reg_res.status_code == 201

    # Form payload as sent by Swagger Authorize dialog
    form_data = {
        "grant_type": "password",
        "username": "test_user_oauth2_01",
        "password": "oauthPassword123",
        "scope": ""
    }
    login_res = client.post("/api/v1/auth/login", data=form_data)
    assert login_res.status_code == 200
    data = login_res.json()
    assert data["token_type"] == "bearer"
    assert "access_token" in data


def test_login_invalid_password():
    """Test login with wrong password returns 401."""
    reg_payload = {
        "username": "test_user_wrong_pw",
        "password": "correctPassword"
    }
    reg_res = client.post("/api/v1/auth/register", json=reg_payload)
    assert reg_res.status_code == 201

    login_form = {
        "username": "test_user_wrong_pw",
        "password": "incorrectPassword"
    }
    login_res = client.post("/api/v1/auth/login", data=login_form)
    assert login_res.status_code == 401
    assert "Incorrect username or password" in login_res.json()["detail"]


def test_login_invalid_username():
    """Test login with non-existent username returns 401."""
    login_form = {
        "username": "test_user_nonexistent",
        "password": "somePassword123"
    }
    login_res = client.post("/api/v1/auth/login", data=login_form)
    assert login_res.status_code == 401
    assert "Incorrect username or password" in login_res.json()["detail"]


def test_authenticated_me():
    """Test accessing protected /auth/me with valid Bearer token."""
    reg_payload = {
        "username": "test_user_me_01",
        "password": "securePassword456",
        "email": "test_user_me_01@example.com"
    }
    reg_res = client.post("/api/v1/auth/register", json=reg_payload)
    assert reg_res.status_code == 201

    login_res = client.post("/api/v1/auth/login", data={
        "username": "test_user_me_01",
        "password": "securePassword456"
    })
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]

    # Request /auth/me with Bearer token
    headers = {"Authorization": f"Bearer {token}"}
    me_res = client.get("/api/v1/auth/me", headers=headers)
    assert me_res.status_code == 200
    me_data = me_res.json()
    assert me_data["username"] == "test_user_me_01"
    assert me_data["email"] == "test_user_me_01@example.com"
    assert me_data["is_active"] is True
    assert "password" not in me_data
    assert "password_hash" not in me_data


def test_unauthenticated_me_missing_token():
    """Test accessing /auth/me without Authorization header returns 401."""
    me_res = client.get("/api/v1/auth/me")
    assert me_res.status_code == 401


def test_unauthenticated_me_invalid_token():
    """Test accessing /auth/me with invalid token returns 401."""
    headers = {"Authorization": "Bearer invalid.fake.token.value"}
    me_res = client.get("/api/v1/auth/me", headers=headers)
    assert me_res.status_code == 401
    assert "Could not validate credentials" in me_res.json()["detail"]


def test_registration_rollback_on_teacher_creation_error(monkeypatch):
    """Test that if teacher profile creation fails, the entire transaction rolls back and no orphan user is created."""
    from unittest.mock import patch

    def broken_teacher_code(db, username, user_id):
        raise RuntimeError("Simulated teacher creation failure")

    with patch("app.services.auth_service._generate_teacher_code", side_effect=broken_teacher_code):
        with pytest.raises(RuntimeError, match="Simulated teacher creation failure"):
            client.post("/api/v1/auth/register", json={
                "username": "test_user_fail_rollback",
                "password": "password123",
                "role": "teacher"
            })

    # Verify user was NOT persisted in DB
    with SessionLocal() as db:
        user = db.query(User).filter(User.username == "test_user_fail_rollback").first()
        assert user is None

