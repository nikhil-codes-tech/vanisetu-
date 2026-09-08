import initSqlJs from 'sql.js';
import {
  initializeDatabase,
  closeDatabase,
  getDatabase,
  SqlJsDriver,
  getCurrentVersion,
  teacherRepository,
  curriculumRepository,
  worksheetRepository,
} from '../src/database';

describe('PALASH Offline SQLite Database Foundation', () => {
  let sqlJsInstance: any;

  beforeEach(async () => {
    // Initialize pure WASM SQLite in memory for fast, deterministic unit tests
    const SQL = await initSqlJs();
    sqlJsInstance = new SQL.Database();
    const driver = new SqlJsDriver(sqlJsInstance);
    await initializeDatabase(driver);
  });

  afterEach(async () => {
    await closeDatabase();
  });

  test('1. Database initializes successfully and creates all required tables', async () => {
    const db = getDatabase();
    const res = await db.execute(
      "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name ASC;"
    );
    const tableNames = res.rows.map((row: any) => row.name);

    expect(tableNames).toContain('schema_migrations');
    expect(tableNames).toContain('schools');
    expect(tableNames).toContain('teachers');
    expect(tableNames).toContain('curriculum_classes');
    expect(tableNames).toContain('subjects');
    expect(tableNames).toContain('learning_outcomes');
    expect(tableNames).toContain('lessons');
    expect(tableNames).toContain('activities');
    expect(tableNames).toContain('assessments');
    expect(tableNames).toContain('worksheets');
    expect(tableNames).toContain('worksheet_questions');
  });

  test('2. Database version is tracked and recorded as 1', async () => {
    const db = getDatabase();
    const version = await getCurrentVersion(db);
    expect(version).toBe(1);

    const res = await db.execute('SELECT * FROM schema_migrations WHERE version = 1;');
    expect(res.rows.length).toBe(1);
  });

  test('3. Database initialization is idempotent and safe to call multiple times', async () => {
    const db = getDatabase();
    // Re-initialize
    await initializeDatabase(db);
    await initializeDatabase(db);

    const version = await getCurrentVersion(db);
    expect(version).toBe(1);

    const res = await db.execute('SELECT COUNT(*) as count FROM schema_migrations;');
    expect((res.rows[0] as any).count).toBe(1);
  });

  test('4. School and Teacher can be saved and retrieved', async () => {
    // 1. Save School
    await teacherRepository.saveSchool({
      id: 1,
      school_code: 'SCH-001',
      name: 'Chaibasa Tribal Primary School',
      district: 'West Singhbhum',
      block: 'Chaibasa Sadar',
      cluster: 'Cluster A',
      village: 'Tambu',
      address: 'Near Panchayat Bhawan',
    });

    const school = await teacherRepository.getSchool(1);
    expect(school).not.toBeNull();
    expect(school?.school_code).toBe('SCH-001');
    expect(school?.name).toBe('Chaibasa Tribal Primary School');
    expect(school?.district).toBe('West Singhbhum');

    // 2. Save Teacher linked to School
    await teacherRepository.saveTeacher({
      id: 1,
      user_id: 101,
      school_id: 1,
      teacher_code: 'TCH-001',
      full_name: 'Birsa Ho',
      phone: '9876543210',
      preferred_language: 'hi',
      target_language: 'ho',
    });

    const teacher = await teacherRepository.getTeacher(1);
    expect(teacher).not.toBeNull();
    expect(teacher?.teacher_code).toBe('TCH-001');
    expect(teacher?.full_name).toBe('Birsa Ho');
    expect(teacher?.preferred_language).toBe('hi');
    expect(teacher?.target_language).toBe('ho');

    // Update teacher
    await teacherRepository.saveTeacher({
      id: 1,
      user_id: 101,
      school_id: 1,
      teacher_code: 'TCH-001',
      full_name: 'Birsa Ho (Updated)',
      phone: '9876543210',
      preferred_language: 'hi',
      target_language: 'ho',
    });

    const updatedTeacher = await teacherRepository.getTeacher(1);
    expect(updatedTeacher?.full_name).toBe('Birsa Ho (Updated)');
  });

  test('5. Curriculum hierarchy (Class -> Subject -> Outcomes -> Lessons -> Activities & Assessments) works offline', async () => {
    // 1. Class
    await curriculumRepository.saveClass({
      id: 1,
      name: 'Class 1',
      grade: 1,
      description: 'Primary Grade 1',
      is_active: 1,
    });
    const classes = await curriculumRepository.getClasses();
    expect(classes.length).toBe(1);
    expect(classes[0].name).toBe('Class 1');

    // 2. Subject
    await curriculumRepository.saveSubject({
      id: 1,
      class_id: 1,
      name: 'Language (Bhasha)',
      code: 'LANG1',
      description: 'Language foundations',
      is_active: 1,
    });
    const subjects = await curriculumRepository.getSubjects(1);
    expect(subjects.length).toBe(1);
    expect(subjects[0].code).toBe('LANG1');

    // 3. Learning Outcome
    await curriculumRepository.saveLearningOutcome({
      id: 1,
      subject_id: 1,
      code: 'LO-1.1',
      title: 'Oral Expression and Vocabulary',
      description: 'Expresses thoughts in mother tongue and connects to target language',
      nipun_domain: 'Foundational Literacy',
      is_active: 1,
    });
    const outcomes = await curriculumRepository.getLearningOutcomes(1);
    expect(outcomes.length).toBe(1);
    expect(outcomes[0].code).toBe('LO-1.1');

    // 4. Lesson
    await curriculumRepository.saveLesson({
      id: 1,
      learning_outcome_id: 1,
      title: 'Greetings & Introduction',
      lesson_number: 1,
      source_language: 'hi',
      duration_minutes: 30,
      teacher_script: 'Say Johar to the children and ask their names in Ho.',
      learning_objective: 'Understand common classroom greetings.',
      is_active: 1,
    });
    const lessons = await curriculumRepository.getLessons(1);
    expect(lessons.length).toBe(1);
    expect(lessons[0].title).toBe('Greetings & Introduction');

    const lessonDetail = await curriculumRepository.getLessonById(1);
    expect(lessonDetail?.teacher_script).toContain('Johar');

    // 5. Activity
    await curriculumRepository.saveActivity({
      id: 1,
      lesson_id: 1,
      title: 'Greeting Circle Game',
      activity_type: 'oral_game',
      instructions: 'Form a circle and pass the ball while saying greeting words.',
      sequence_order: 1,
      materials: 'Small soft ball',
      is_active: 1,
    });
    const activities = await curriculumRepository.getActivities(1);
    expect(activities.length).toBe(1);
    expect(activities[0].activity_type).toBe('oral_game');

    // 6. Assessment
    await curriculumRepository.saveAssessment({
      id: 1,
      lesson_id: 1,
      title: 'Greeting Response Check',
      prompt: 'Respond to Johar with proper greeting.',
      assessment_type: 'oral_observation',
      sequence_order: 1,
      expected_response: 'Johar',
      is_active: 1,
    });
    const assessments = await curriculumRepository.getAssessments(1);
    expect(assessments.length).toBe(1);
    expect(assessments[0].expected_response).toBe('Johar');
  });

  test('6. Worksheets and Worksheet Questions can be saved, retrieved, and queried', async () => {
    // Setup parent hierarchy
    await curriculumRepository.saveClass({ id: 1, name: 'Class 1', grade: 1, is_active: 1 });
    await curriculumRepository.saveSubject({ id: 1, class_id: 1, name: 'Language', code: 'LANG1', is_active: 1 });
    await curriculumRepository.saveLearningOutcome({ id: 1, subject_id: 1, code: 'LO-1.1', title: 'Vocabulary', is_active: 1 });
    await curriculumRepository.saveLesson({ id: 1, learning_outcome_id: 1, title: 'Greetings', lesson_number: 1, source_language: 'hi', is_active: 1 });

    // Save Worksheet
    await worksheetRepository.saveWorksheet({
      id: 1,
      lesson_id: 1,
      title: 'Greetings Picture Match',
      description: 'Match words with images',
      language_code: 'hi',
      source_language: 'hi',
      worksheet_type: 'match_following',
      difficulty_level: 'beginner',
      instructions: 'Draw lines matching words to pictures.',
      version: 1,
      is_active: 1,
    });

    const worksheets = await worksheetRepository.getWorksheets(1);
    expect(worksheets.length).toBe(1);
    expect(worksheets[0].title).toBe('Greetings Picture Match');

    // Save Questions in Batch
    await worksheetRepository.saveWorksheetQuestions([
      {
        id: 1,
        worksheet_id: 1,
        question_number: 1,
        question_text: 'What does "Johar" mean?',
        question_type: 'multiple_choice',
        options: JSON.stringify(['Hello / Greetings', 'Goodbye', 'Thank you', 'Water']),
        correct_answer: 'Hello / Greetings',
        explanation: 'Johar is the traditional greeting in Ho and tribal languages of Jharkhand.',
        marks: 1,
      },
      {
        id: 2,
        worksheet_id: 1,
        question_number: 2,
        question_text: 'Match the greeting with morning.',
        question_type: 'single_choice',
        options: JSON.stringify(['Seta Johar', 'Ayu Johar']),
        correct_answer: 'Seta Johar',
        explanation: 'Seta means morning.',
        marks: 1,
      },
    ]);

    const questions = await worksheetRepository.getWorksheetQuestions(1);
    expect(questions.length).toBe(2);
    expect(questions[0].question_number).toBe(1);
    expect(questions[1].question_number).toBe(2);
    expect(questions[0].correct_answer).toBe('Hello / Greetings');
  });

  test('7. Foreign key constraints are enforced (PRAGMA foreign_keys = ON)', async () => {
    // Attempting to save a teacher with non-existent school_id should fail
    await expect(
      teacherRepository.saveTeacher({
        id: 99,
        user_id: 999,
        school_id: 9999, // Does not exist
        teacher_code: 'TCH-INVALID',
        full_name: 'Invalid Teacher',
        preferred_language: 'hi',
        target_language: 'ho',
      })
    ).rejects.toThrow();

    // Attempting to save a subject with non-existent class_id should fail
    await expect(
      curriculumRepository.saveSubject({
        id: 99,
        class_id: 9999, // Does not exist
        name: 'Invalid Subject',
        code: 'INV',
        is_active: 1,
      })
    ).rejects.toThrow();
  });

  test('8. Foreign key cascade delete works for curriculum hierarchy', async () => {
    const db = getDatabase();

    // Setup hierarchy
    await curriculumRepository.saveClass({ id: 1, name: 'Class 1', grade: 1, is_active: 1 });
    await curriculumRepository.saveSubject({ id: 1, class_id: 1, name: 'Language', code: 'LANG1', is_active: 1 });
    await curriculumRepository.saveLearningOutcome({ id: 1, subject_id: 1, code: 'LO-1.1', title: 'Vocabulary', is_active: 1 });
    await curriculumRepository.saveLesson({ id: 1, learning_outcome_id: 1, title: 'Greetings', lesson_number: 1, source_language: 'hi', is_active: 1 });
    await curriculumRepository.saveActivity({ id: 1, lesson_id: 1, title: 'Activity 1', activity_type: 'game', sequence_order: 1, is_active: 1 });

    // Verify activity exists
    const activitiesBefore = await curriculumRepository.getActivities(1);
    expect(activitiesBefore.length).toBe(1);

    // Delete the parent class
    await db.execute('DELETE FROM curriculum_classes WHERE id = 1;');

    // Cascading should have deleted subject, learning outcome, lesson, and activity
    const subjects = await curriculumRepository.getSubjects(1);
    expect(subjects.length).toBe(0);

    const outcomes = await curriculumRepository.getLearningOutcomes(1);
    expect(outcomes.length).toBe(0);

    const lessons = await curriculumRepository.getLessons(1);
    expect(lessons.length).toBe(0);

    const activitiesAfter = await curriculumRepository.getActivities(1);
    expect(activitiesAfter.length).toBe(0);
  });
});
