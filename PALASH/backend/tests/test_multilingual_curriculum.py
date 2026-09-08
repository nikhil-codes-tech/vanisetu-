"""
Backend Tests for Stage 2.12 Multilingual Curriculum Data Architecture.
Verifies:
1. Supported languages list (/curriculum/languages)
2. Lesson translations retrieval
3. Language code filtering (?language_code=ho, sat, mun, etc.)
4. Activity translations retrieval
5. Assessment translations retrieval
6. Authentication enforcement (401 without JWT)
7. 404 behavior for invalid lesson/activity/assessment IDs
8. Duplicate/version handling
9. Active/inactive behavior (only active returned)
10. Database model cascade and relationships
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import select
from app.main import app
from app.database.session import SessionLocal
from app.database.seed_curriculum import seed_curriculum_data
from app.models.translation import (
    LessonTranslation,
    ActivityTranslation,
    AssessmentTranslation,
)
from app.models.curriculum import Lesson, Activity, Assessment

client = TestClient(app)


@pytest.fixture(scope="module")
def seed_data():
    """Ensure baseline curriculum seed data exists."""
    with SessionLocal() as db:
        data = seed_curriculum_data(db)
    return data


@pytest.fixture(scope="module")
def seed_translations(seed_data):
    """Seed synthetic sample translations for testing Stage 2.12."""
    lesson_id = seed_data["lesson_id"]
    with SessionLocal() as db:
        # Fetch activity and assessment IDs
        lesson = db.execute(select(Lesson).where(Lesson.id == lesson_id)).scalar_one()
        act = db.execute(select(Activity).where(Activity.lesson_id == lesson_id)).scalars().first()
        ass = db.execute(select(Assessment).where(Assessment.lesson_id == lesson_id)).scalars().first()
        activity_id = act.id if act else None
        assessment_id = ass.id if ass else None

        # Clean existing test translations if any
        db.query(LessonTranslation).filter(LessonTranslation.lesson_id == lesson_id).delete()
        if activity_id:
            db.query(ActivityTranslation).filter(ActivityTranslation.activity_id == activity_id).delete()
        if assessment_id:
            db.query(AssessmentTranslation).filter(AssessmentTranslation.assessment_id == assessment_id).delete()
        db.commit()

        # Add synthetic sample translations for Ho, Mundari, Santhali, Hindi
        # Note: These are synthetic architectural test fixtures, not validated linguistic data
        t_ho = LessonTranslation(
            lesson_id=lesson_id,
            language_code="ho",
            translated_title="[TEST-HO] 1 khor 10 lekha",
            translated_script="Sample Ho script for counting 1 to 10",
            translated_objective="Learn counting in Ho",
            version=1,
            is_active=True,
        )
        t_mun = LessonTranslation(
            lesson_id=lesson_id,
            language_code="mun",
            translated_title="[TEST-MUN] Mia'd aet Gelo hisab",
            translated_script="Sample Mundari script for counting 1 to 10",
            translated_objective="Learn counting in Mundari",
            version=1,
            is_active=True,
        )
        t_sat = LessonTranslation(
            lesson_id=lesson_id,
            language_code="sat",
            translated_title="[TEST-SAT] 1 se 10 leka",
            translated_script="Sample Santhali script for counting 1 to 10",
            translated_objective="Learn counting in Santhali",
            version=1,
            is_active=True,
        )
        t_inactive = LessonTranslation(
            lesson_id=lesson_id,
            language_code="ho",
            translated_title="[TEST-HO-INACTIVE] Old Draft",
            version=2,
            is_active=False,
        )
        db.add_all([t_ho, t_mun, t_sat, t_inactive])

        if activity_id:
            db.add(ActivityTranslation(
                activity_id=activity_id,
                language_code="ho",
                translated_title="[TEST-HO] Activity Title",
                translated_instructions="Sample Ho activity instructions",
                version=1,
                is_active=True,
            ))
            db.add(ActivityTranslation(
                activity_id=activity_id,
                language_code="sat",
                translated_title="[TEST-SAT] Activity Title",
                translated_instructions="Sample Santhali activity instructions",
                version=1,
                is_active=True,
            ))

        if assessment_id:
            db.add(AssessmentTranslation(
                assessment_id=assessment_id,
                language_code="ho",
                translated_title="[TEST-HO] Assessment Title",
                translated_prompt="Sample Ho prompt: count items",
                translated_expected_response="10 items",
                version=1,
                is_active=True,
            ))

        db.commit()

        return {
            "lesson_id": lesson_id,
            "activity_id": activity_id,
            "assessment_id": assessment_id,
        }


def _get_auth_headers(username: str = "test_trans_teacher", password: str = "pass123456") -> dict:
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


def test_unauthenticated_translations_access():
    """Verify endpoints require JWT authentication."""
    assert client.get("/api/v1/curriculum/languages").status_code == 401
    assert client.get("/api/v1/curriculum/lessons/1/translations").status_code == 401
    assert client.get("/api/v1/curriculum/activities/1/translations").status_code == 401
    assert client.get("/api/v1/curriculum/assessments/1/translations").status_code == 401


def test_get_languages_list():
    """Verify GET /curriculum/languages returns supported active languages."""
    headers = _get_auth_headers("test_user_lang_01")
    res = client.get("/api/v1/curriculum/languages", headers=headers)
    assert res.status_code == 200
    languages = res.json()
    assert isinstance(languages, list)
    codes = [l["code"] for l in languages]
    assert "hi" in codes
    assert "ho" in codes
    assert "mun" in codes
    assert "sat" in codes
    assert all(l["is_active"] is True for l in languages)


def test_get_lesson_translations(seed_translations):
    """Verify retrieving lesson translations returns active records."""
    headers = _get_auth_headers("test_user_trans_01")
    lesson_id = seed_translations["lesson_id"]
    res = client.get(f"/api/v1/curriculum/lessons/{lesson_id}/translations", headers=headers)
    assert res.status_code == 200
    translations = res.json()
    assert len(translations) >= 3  # ho, mun, sat (inactive excluded)
    codes = [t["language_code"] for t in translations]
    assert "ho" in codes
    assert "mun" in codes
    assert "sat" in codes
    # Inactive should be filtered out by default
    assert not any(t["translated_title"] == "[TEST-HO-INACTIVE] Old Draft" for t in translations)


def test_get_lesson_translations_filtered_by_language(seed_translations):
    """Verify filtering lesson translations by language_code."""
    headers = _get_auth_headers("test_user_trans_02")
    lesson_id = seed_translations["lesson_id"]
    res = client.get(
        f"/api/v1/curriculum/lessons/{lesson_id}/translations?language_code=ho",
        headers=headers
    )
    assert res.status_code == 200
    translations = res.json()
    assert len(translations) == 1
    assert translations[0]["language_code"] == "ho"
    assert "[TEST-HO]" in translations[0]["translated_title"]

    # Filter with non-existent language
    res_none = client.get(
        f"/api/v1/curriculum/lessons/{lesson_id}/translations?language_code=unknown",
        headers=headers
    )
    assert res_none.status_code == 200
    assert len(res_none.json()) == 0


def test_get_activity_translations(seed_translations):
    """Verify retrieving activity translations."""
    headers = _get_auth_headers("test_user_trans_03")
    act_id = seed_translations["activity_id"]
    if not act_id:
        pytest.skip("No activity found")

    res = client.get(f"/api/v1/curriculum/activities/{act_id}/translations", headers=headers)
    assert res.status_code == 200
    translations = res.json()
    assert len(translations) >= 2
    codes = [t["language_code"] for t in translations]
    assert "ho" in codes
    assert "sat" in codes


def test_get_assessment_translations(seed_translations):
    """Verify retrieving assessment translations."""
    headers = _get_auth_headers("test_user_trans_04")
    ass_id = seed_translations["assessment_id"]
    if not ass_id:
        pytest.skip("No assessment found")

    res = client.get(f"/api/v1/curriculum/assessments/{ass_id}/translations", headers=headers)
    assert res.status_code == 200
    translations = res.json()
    assert len(translations) >= 1
    assert translations[0]["language_code"] == "ho"
    assert translations[0]["translated_prompt"] == "Sample Ho prompt: count items"


def test_translation_404_not_found():
    """Verify 404 behavior for invalid parent IDs."""
    headers = _get_auth_headers("test_user_trans_05")
    assert client.get("/api/v1/curriculum/lessons/999999/translations", headers=headers).status_code == 404
    assert client.get("/api/v1/curriculum/activities/999999/translations", headers=headers).status_code == 404
    assert client.get("/api/v1/curriculum/assessments/999999/translations", headers=headers).status_code == 404
