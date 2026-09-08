/**
 * PALASH Local SQLite Database Schema Definitions
 * Includes table creation DDL, indices, and foreign key relationships.
 */

export const DATABASE_NAME = 'palash_local.db';
export const CURRENT_DATABASE_VERSION = 1;

export const CREATE_TABLES_SQL = [
  // 1. Database version tracking table
  `CREATE TABLE IF NOT EXISTS schema_migrations (
    version INTEGER PRIMARY KEY,
    applied_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`,

  // 2. Schools
  `CREATE TABLE IF NOT EXISTS schools (
    id INTEGER PRIMARY KEY,
    school_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    district TEXT NOT NULL,
    block TEXT,
    cluster TEXT,
    village TEXT,
    address TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`,

  // 3. Teachers
  `CREATE TABLE IF NOT EXISTS teachers (
    id INTEGER PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,
    school_id INTEGER NOT NULL,
    teacher_code TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    preferred_language TEXT NOT NULL DEFAULT 'hi',
    target_language TEXT NOT NULL DEFAULT 'ho',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE RESTRICT
  );`,

  // 4. Curriculum Classes
  `CREATE TABLE IF NOT EXISTS curriculum_classes (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    grade INTEGER NOT NULL,
    description TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`,

  // 5. Subjects
  `CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY,
    class_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    description TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (class_id) REFERENCES curriculum_classes(id) ON DELETE CASCADE
  );`,

  // 6. Learning Outcomes
  `CREATE TABLE IF NOT EXISTS learning_outcomes (
    id INTEGER PRIMARY KEY,
    subject_id INTEGER NOT NULL,
    code TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    nipun_domain TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
  );`,

  // 7. Lessons
  `CREATE TABLE IF NOT EXISTS lessons (
    id INTEGER PRIMARY KEY,
    learning_outcome_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    lesson_number INTEGER NOT NULL DEFAULT 1,
    source_language TEXT NOT NULL DEFAULT 'hi',
    duration_minutes INTEGER DEFAULT 30,
    teacher_script TEXT,
    learning_objective TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (learning_outcome_id) REFERENCES learning_outcomes(id) ON DELETE CASCADE
  );`,

  // 8. Activities
  `CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY,
    lesson_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    activity_type TEXT NOT NULL,
    instructions TEXT,
    sequence_order INTEGER NOT NULL DEFAULT 1,
    materials TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
  );`,

  // 9. Assessments
  `CREATE TABLE IF NOT EXISTS assessments (
    id INTEGER PRIMARY KEY,
    lesson_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    prompt TEXT NOT NULL,
    assessment_type TEXT NOT NULL,
    sequence_order INTEGER NOT NULL DEFAULT 1,
    expected_response TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
  );`,

  // 10. Worksheets
  `CREATE TABLE IF NOT EXISTS worksheets (
    id INTEGER PRIMARY KEY,
    lesson_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    language_code TEXT NOT NULL DEFAULT 'hi',
    source_language TEXT NOT NULL DEFAULT 'hi',
    worksheet_type TEXT NOT NULL,
    difficulty_level TEXT DEFAULT 'beginner',
    instructions TEXT,
    content TEXT,
    answer_key TEXT,
    file_path TEXT,
    version INTEGER NOT NULL DEFAULT 1,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
  );`,

  // 11. Worksheet Questions
  `CREATE TABLE IF NOT EXISTS worksheet_questions (
    id INTEGER PRIMARY KEY,
    worksheet_id INTEGER NOT NULL,
    question_number INTEGER NOT NULL DEFAULT 1,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL,
    options TEXT,
    correct_answer TEXT,
    explanation TEXT,
    marks INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (worksheet_id) REFERENCES worksheets(id) ON DELETE CASCADE
  );`,

  // 12. Local Sync Queue
  `CREATE TABLE IF NOT EXISTS sync_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_type TEXT NOT NULL,
    entity_id INTEGER NOT NULL,
    operation TEXT NOT NULL,
    payload TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    retry_count INTEGER NOT NULL DEFAULT 0,
    error_message TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`,

  // 13. Sync Metadata
  `CREATE TABLE IF NOT EXISTS sync_metadata (
    entity_type TEXT PRIMARY KEY,
    last_synced_at TEXT,
    last_sync_status TEXT NOT NULL DEFAULT 'IDLE'
  );`,

  // 14. Bilingual Dictionary Entries (Ho <-> Hindi)
  `CREATE TABLE IF NOT EXISTS dictionary_entries (
    id INTEGER PRIMARY KEY,
    source_language TEXT NOT NULL,
    source_word TEXT NOT NULL,
    target_language TEXT NOT NULL,
    target_word TEXT NOT NULL,
    transliteration TEXT,
    part_of_speech TEXT,
    pronunciation TEXT,
    definition TEXT,
    example_source TEXT,
    example_target TEXT,
    audio_path TEXT,
    lesson_id INTEGER,
    is_verified INTEGER NOT NULL DEFAULT 1,
    is_active INTEGER NOT NULL DEFAULT 1,
    version INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE SET NULL
  );`,

  // 15. Students (Classroom Roster)
  `CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY,
    school_id INTEGER NOT NULL,
    student_code TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    class_name TEXT,
    section TEXT,
    mother_tongue TEXT NOT NULL DEFAULT 'ho',
    date_of_birth TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE RESTRICT
  );`,

  // 16. Student Classroom Evaluations
  `CREATE TABLE IF NOT EXISTS student_evaluations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    assessment_id INTEGER,
    worksheet_id INTEGER,
    score REAL NOT NULL,
    max_score REAL NOT NULL DEFAULT 10.0,
    status TEXT NOT NULL DEFAULT 'completed',
    remarks TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
  );`,

  // 17. Student Daily Classroom Attendance
  `CREATE TABLE IF NOT EXISTS student_attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    school_id INTEGER NOT NULL,
    attendance_date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'present',
    remarks TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE RESTRICT,
    UNIQUE(student_id, attendance_date)
  );`,

  // 18. Supported Languages Registry (Stage 2.12)
  `CREATE TABLE IF NOT EXISTS languages (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    native_name TEXT NOT NULL,
    script TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    direction TEXT NOT NULL DEFAULT 'ltr',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`,

  // 19. Lesson Translations (Stage 2.12)
  `CREATE TABLE IF NOT EXISTS lesson_translations (
    id INTEGER PRIMARY KEY,
    lesson_id INTEGER NOT NULL,
    language_code TEXT NOT NULL,
    translated_title TEXT NOT NULL,
    translated_script TEXT,
    translated_objective TEXT,
    translated_content TEXT,
    audio_path TEXT,
    version INTEGER NOT NULL DEFAULT 1,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    UNIQUE(lesson_id, language_code, version)
  );`,

  // 20. Activity Translations (Stage 2.12)
  `CREATE TABLE IF NOT EXISTS activity_translations (
    id INTEGER PRIMARY KEY,
    activity_id INTEGER NOT NULL,
    language_code TEXT NOT NULL,
    translated_title TEXT NOT NULL,
    translated_instructions TEXT,
    audio_path TEXT,
    version INTEGER NOT NULL DEFAULT 1,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    UNIQUE(activity_id, language_code, version)
  );`,

  // 21. Assessment Translations (Stage 2.12)
  `CREATE TABLE IF NOT EXISTS assessment_translations (
    id INTEGER PRIMARY KEY,
    assessment_id INTEGER NOT NULL,
    language_code TEXT NOT NULL,
    translated_title TEXT NOT NULL,
    translated_prompt TEXT NOT NULL,
    translated_expected_response TEXT,
    audio_path TEXT,
    version INTEGER NOT NULL DEFAULT 1,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
    UNIQUE(assessment_id, language_code, version)
  );`
];

export const CREATE_INDEXES_SQL = [
  'CREATE INDEX IF NOT EXISTS ix_teachers_school_id ON teachers(school_id);',
  'CREATE INDEX IF NOT EXISTS ix_subjects_class_id ON subjects(class_id);',
  'CREATE INDEX IF NOT EXISTS ix_learning_outcomes_subject_id ON learning_outcomes(subject_id);',
  'CREATE INDEX IF NOT EXISTS ix_lessons_learning_outcome_id ON lessons(learning_outcome_id);',
  'CREATE INDEX IF NOT EXISTS ix_activities_lesson_id ON activities(lesson_id);',
  'CREATE INDEX IF NOT EXISTS ix_assessments_lesson_id ON assessments(lesson_id);',
  'CREATE INDEX IF NOT EXISTS ix_worksheets_lesson_id ON worksheets(lesson_id);',
  'CREATE INDEX IF NOT EXISTS ix_worksheet_questions_worksheet_id ON worksheet_questions(worksheet_id);',
  'CREATE INDEX IF NOT EXISTS ix_sync_queue_status ON sync_queue(status);',
  'CREATE INDEX IF NOT EXISTS ix_sync_queue_entity ON sync_queue(entity_type, entity_id);',
  'CREATE INDEX IF NOT EXISTS ix_dict_source ON dictionary_entries(source_language, source_word);',
  'CREATE INDEX IF NOT EXISTS ix_dict_target ON dictionary_entries(target_language, target_word);',
  'CREATE INDEX IF NOT EXISTS ix_dict_lesson ON dictionary_entries(lesson_id);',
  'CREATE INDEX IF NOT EXISTS ix_students_school ON students(school_id);',
  'CREATE INDEX IF NOT EXISTS ix_students_code ON students(student_code);',
  'CREATE INDEX IF NOT EXISTS ix_eval_student ON student_evaluations(student_id);',
  'CREATE INDEX IF NOT EXISTS ix_attendance_date ON student_attendance(attendance_date);',
  'CREATE INDEX IF NOT EXISTS ix_attendance_student ON student_attendance(student_id);',
  'CREATE INDEX IF NOT EXISTS ix_attendance_school_date ON student_attendance(school_id, attendance_date);',
  'CREATE INDEX IF NOT EXISTS ix_lesson_trans_lookup ON lesson_translations(lesson_id, language_code, is_active);',
  'CREATE INDEX IF NOT EXISTS ix_activity_trans_lookup ON activity_translations(activity_id, language_code, is_active);',
  'CREATE INDEX IF NOT EXISTS ix_assessment_trans_lookup ON assessment_translations(assessment_id, language_code, is_active);'
];

