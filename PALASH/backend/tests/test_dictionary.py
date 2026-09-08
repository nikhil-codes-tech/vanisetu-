import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database.session import SessionLocal, engine
from app.database.seed_curriculum import seed_curriculum_data
from app.models.dictionary import DictionaryEntry

client = TestClient(app)


@pytest.fixture(scope="module", autouse=True)
def setup_dictionary_table():
    """Ensure dictionary_entries table exists and seed curriculum data exists."""
    DictionaryEntry.__table__.create(bind=engine, checkfirst=True)
    with SessionLocal() as db:
        data = seed_curriculum_data(db)
    return data


def _get_auth_headers(username: str = "test_dict_teacher", password: str = "pass123456") -> dict:
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


def test_unauthenticated_dictionary_request():
    """Unauthenticated dictionary requests return 401."""
    res = client.get("/api/v1/dictionary")
    assert res.status_code == 401


def test_create_and_list_dictionary_entry():
    """Authenticated user can create, list, and filter dictionary entries."""
    headers = _get_auth_headers("dict_tester_01")
    with SessionLocal() as db:
        data = seed_curriculum_data(db)
    lesson_id = data["lesson_id"]

    payload = {
        "source_language": "hi",
        "source_word": "पानी",
        "target_language": "ho",
        "target_word": "दाः",
        "transliteration": "Dah",
        "part_of_speech": "noun",
        "pronunciation": "daah",
        "definition": "Water / जल",
        "example_source": "मुझे पानी चाहिए।",
        "example_target": "अइञ् के दाः दरकार।",
        "lesson_id": lesson_id,
        "is_verified": True,
        "is_active": True,
    }

    res = client.post("/api/v1/dictionary", json=payload, headers=headers)
    assert res.status_code == 201
    entry = res.json()
    assert entry["source_word"] == "पानी"
    assert entry["target_word"] == "दाः"
    entry_id = entry["id"]

    # List entries
    list_res = client.get("/api/v1/dictionary", headers=headers)
    assert list_res.status_code == 200
    entries = list_res.json()
    assert len(entries) >= 1
    assert any(e["id"] == entry_id for e in entries)

    # Search
    search_res = client.get("/api/v1/dictionary/search?q=पानी", headers=headers)
    assert search_res.status_code == 200
    results = search_res.json()
    assert any(r["source_word"] == "पानी" for r in results)

    # Lesson vocabulary
    lesson_res = client.get(f"/api/v1/lessons/{lesson_id}/dictionary", headers=headers)
    assert lesson_res.status_code == 200
    assert any(r["id"] == entry_id for r in lesson_res.json())
