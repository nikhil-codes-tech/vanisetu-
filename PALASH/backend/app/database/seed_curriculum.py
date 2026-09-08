"""Seed script for sample foundational curriculum and worksheet data."""
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.session import SessionLocal
from app.models.curriculum import (
    CurriculumClass,
    Subject,
    LearningOutcome,
    Lesson,
    Activity,
    Assessment,
)
from app.models.worksheet import Worksheet
from app.models.worksheet_question import WorksheetQuestion


def seed_curriculum_data(db: Session) -> dict:
    """Safely seed initial sample foundational curriculum and worksheet if not already present."""
    # 1. Class 1
    cls1 = db.execute(
        select(CurriculumClass).where(CurriculumClass.grade == 1)
    ).scalar_one_or_none()
    if not cls1:
        cls1 = CurriculumClass(
            name="Class 1",
            grade=1,
            description="Foundational learning - Class 1",
            is_active=True
        )
        db.add(cls1)
        db.flush()

    # 2. Subject: Foundational Literacy
    sub1 = db.execute(
        select(Subject).where(
            Subject.class_id == cls1.id,
            Subject.code == "FLN-LIT"
        )
    ).scalar_one_or_none()
    if not sub1:
        sub1 = Subject(
            class_id=cls1.id,
            name="Foundational Literacy",
            code="FLN-LIT",
            description="Foundational Hindi language & literacy skills",
            is_active=True
        )
        db.add(sub1)
        db.flush()

    # 3. Learning Outcome: FLN-LIT-001
    lo1 = db.execute(
        select(LearningOutcome).where(
            LearningOutcome.subject_id == sub1.id,
            LearningOutcome.code == "FLN-LIT-001"
        )
    ).scalar_one_or_none()
    if not lo1:
        lo1 = LearningOutcome(
            subject_id=sub1.id,
            code="FLN-LIT-001",
            title="Recognize basic words and sounds",
            description="Student can identify basic two-letter and three-letter words and sounds.",
            nipun_domain="Foundational Literacy",
            is_active=True
        )
        db.add(lo1)
        db.flush()

    # 4. Lesson: Lesson 1 - Recognizing Simple Words
    lesson1 = db.execute(
        select(Lesson).where(
            Lesson.learning_outcome_id == lo1.id,
            Lesson.lesson_number == 1
        )
    ).scalar_one_or_none()
    if not lesson1:
        lesson1 = Lesson(
            learning_outcome_id=lo1.id,
            title="Recognizing Simple Words",
            lesson_number=1,
            source_language="hi",
            duration_minutes=30,
            teacher_script="नमस्ते बच्चों! आज हम कुछ नए और सरल शब्दों को पहचानना सीखेंगे। चित्रों को ध्यान से देखें और मेरे साथ दोहराएं।",
            learning_objective="Students will be able to orally identify and pronounce 5 basic everyday words.",
            is_active=True
        )
        db.add(lesson1)
        db.flush()

    # 5. Activities for Lesson 1
    act1 = db.execute(
        select(Activity).where(
            Activity.lesson_id == lesson1.id,
            Activity.sequence_order == 1
        )
    ).scalar_one_or_none()
    if not act1:
        act1 = Activity(
            lesson_id=lesson1.id,
            title="Word Card Matching Activity",
            activity_type="matching",
            instructions="Show flashcards with pictures and corresponding simple Hindi words. Ask students to match the picture to the word.",
            sequence_order=1,
            materials="Flashcards with pictures of common objects (फल, घर, जल, नल)",
            is_active=True
        )
        db.add(act1)

    act2 = db.execute(
        select(Activity).where(
            Activity.lesson_id == lesson1.id,
            Activity.sequence_order == 2
        )
    ).scalar_one_or_none()
    if not act2:
        act2 = Activity(
            lesson_id=lesson1.id,
            title="Oral Story Listening & Repetition",
            activity_type="story",
            instructions="Read a 3-sentence micro-story emphasizing the target vocabulary words. Have students repeat in chorus.",
            sequence_order=2,
            materials="Story poster board",
            is_active=True
        )
        db.add(act2)

    # 6. Assessments for Lesson 1
    ass1 = db.execute(
        select(Assessment).where(
            Assessment.lesson_id == lesson1.id,
            Assessment.sequence_order == 1
        )
    ).scalar_one_or_none()
    if not ass1:
        ass1 = Assessment(
            lesson_id=lesson1.id,
            title="Oral Word Recognition Assessment",
            prompt="Point to the card for 'घर' and ask the child to pronounce it aloud.",
            assessment_type="oral",
            sequence_order=1,
            expected_response="Child correctly says 'घर' (Ghar) within 5 seconds.",
            is_active=True
        )
        db.add(ass1)

    ass2 = db.execute(
        select(Assessment).where(
            Assessment.lesson_id == lesson1.id,
            Assessment.sequence_order == 2
        )
    ).scalar_one_or_none()
    if not ass2:
        ass2 = Assessment(
            lesson_id=lesson1.id,
            title="Picture-Word Association Quiz",
            prompt="Which picture represents 'जल'?",
            assessment_type="quiz",
            sequence_order=2,
            expected_response="Child points to the glass of water.",
            is_active=True
        )
        db.add(ass2)

    # 7. Worksheet for Lesson 1: Hindi Letter & Word Recognition
    ws1 = db.execute(
        select(Worksheet).where(
            Worksheet.lesson_id == lesson1.id,
            Worksheet.title == "Hindi Letter Recognition Worksheet"
        )
    ).scalar_one_or_none()
    if not ws1:
        ws1 = Worksheet(
            lesson_id=lesson1.id,
            title="Hindi Letter Recognition Worksheet",
            description="Practice worksheet for identifying foundational letters and words.",
            language_code="hi",
            source_language="hi",
            worksheet_type="reading",
            difficulty_level="beginner",
            instructions="नीचे दिए गए प्रश्नों को पढ़ें और सही उत्तर चुनें।",
            content="अक्षर पहचान अभ्यास: क, ख, ग, घ",
            answer_key="1: A, 2: B",
            version=1,
            is_active=True
        )
        db.add(ws1)
        db.flush()

    # 8. Questions for Worksheet
    q1 = db.execute(
        select(WorksheetQuestion).where(
            WorksheetQuestion.worksheet_id == ws1.id,
            WorksheetQuestion.question_number == 1
        )
    ).scalar_one_or_none()
    if not q1:
        q1 = WorksheetQuestion(
            worksheet_id=ws1.id,
            question_number=1,
            question_text="'क' से शुरू होने वाले शब्द को पहचानें:",
            question_type="mcq",
            options="A) कमल, B) नल, C) जल, D) घर",
            correct_answer="A",
            explanation="कमल 'क' अक्षर से शुरू होता है।",
            marks=1
        )
        db.add(q1)

    q2 = db.execute(
        select(WorksheetQuestion).where(
            WorksheetQuestion.worksheet_id == ws1.id,
            WorksheetQuestion.question_number == 2
        )
    ).scalar_one_or_none()
    if not q2:
        q2 = WorksheetQuestion(
            worksheet_id=ws1.id,
            question_number=2,
            question_text="'घर' शब्द में पहला अक्षर 'घ' है। (सत्य/असत्य)",
            question_type="true_false",
            options="A) सत्य, B) असत्य",
            correct_answer="A",
            explanation="घर शब्द 'घ' से शुरू होता है।",
            marks=1
        )
        db.add(q2)

    db.commit()
    db.refresh(cls1)
    db.refresh(sub1)
    db.refresh(lo1)
    db.refresh(lesson1)
    db.refresh(ws1)

    return {
        "class_id": cls1.id,
        "subject_id": sub1.id,
        "outcome_id": lo1.id,
        "lesson_id": lesson1.id,
        "worksheet_id": ws1.id,
    }


if __name__ == "__main__":
    with SessionLocal() as session:
        result = seed_curriculum_data(session)
        print("Curriculum & Worksheet sample seed complete:", result)
