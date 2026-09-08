import unittest
from datetime import date
from sqlalchemy.orm import Session
from app.database.base import Base
from app.database.session import SessionLocal, engine
from app.models.user import User
from app.models.school import School
from app.models.teacher import Teacher
from app.models.student import Student


class TestDatabaseModels(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.expected_tables = {"users", "schools", "teachers", "students"}

    def test_metadata_tables(self):
        """Verify that Base.metadata registers all four tables."""
        metadata_tables = set(Base.metadata.tables.keys())
        self.assertTrue(
            self.expected_tables.issubset(metadata_tables),
            f"Expected tables {self.expected_tables} to be in metadata, got {metadata_tables}"
        )

    def test_model_columns(self):
        """Verify required columns on models."""
        user_cols = {c.name for c in User.__table__.columns}
        self.assertTrue({"id", "username", "email", "password_hash", "role", "is_active", "created_at", "updated_at"}.issubset(user_cols))

        school_cols = {c.name for c in School.__table__.columns}
        self.assertTrue({"id", "name", "school_code", "district", "block", "village", "address", "created_at", "updated_at"}.issubset(school_cols))

        teacher_cols = {c.name for c in Teacher.__table__.columns}
        self.assertTrue({"id", "user_id", "school_id", "teacher_code", "full_name", "phone", "preferred_language", "target_language", "created_at", "updated_at"}.issubset(teacher_cols))

        student_cols = {c.name for c in Student.__table__.columns}
        self.assertTrue({"id", "school_id", "student_code", "full_name", "class_name", "section", "mother_tongue", "date_of_birth", "created_at", "updated_at"}.issubset(student_cols))

    def test_model_relationships_transactional(self):
        """Verify ORM relationships in a rolled-back transaction without persisting dummy data."""
        connection = engine.connect()
        transaction = connection.begin()
        db: Session = Session(bind=connection)

        try:
            # 1. Create a School
            school = School(
                name="Test Primary School",
                school_code="SCH_TEST_MODEL_001",
                district="West Singhbhum",
                block="Chaibasa",
                village="Test Village",
                address="Near Block Office"
            )
            db.add(school)
            db.flush()

            # 2. Create a User
            user = User(
                username="test_model_teacher_01",
                email="test_model_teacher01@example.com",
                password_hash="hashed_test_password",
                role="teacher",
                is_active=True
            )
            db.add(user)
            db.flush()

            # 3. Create a Teacher linked to User and School
            teacher = Teacher(
                user_id=user.id,
                school_id=school.id,
                teacher_code="TCH_TEST_MODEL_001",
                full_name="Birsa Munda",
                phone="9876543210",
                preferred_language="hi",
                target_language="ho"
            )
            db.add(teacher)
            db.flush()

            # 4. Create a Student linked to School
            student = Student(
                school_id=school.id,
                student_code="STU_TEST_MODEL_001",
                full_name="Jaipal Singh",
                class_name="Class 3",
                section="A",
                mother_tongue="ho",
                date_of_birth=date(2017, 5, 15)
            )
            db.add(student)
            db.flush()

            # Verify relationships
            self.assertEqual(user.teacher.teacher_code, "TCH_TEST_MODEL_001")
            self.assertEqual(teacher.user.username, "test_model_teacher_01")
            self.assertEqual(teacher.school.school_code, "SCH_TEST_MODEL_001")
            self.assertIn(teacher, school.teachers)
            self.assertIn(student, school.students)
            self.assertEqual(student.school.school_code, "SCH_TEST_MODEL_001")

        finally:
            db.close()
            transaction.rollback()
            connection.close()


if __name__ == "__main__":
    unittest.main()
