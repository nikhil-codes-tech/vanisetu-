# PALASH Offline Architecture & Local Database Foundation

## 1. Executive Summary

PALASH is designed for Mother Tongue-Based Multilingual Education (MTB-MLE) in rural and tribal primary schools across Jharkhand. Many targeted schools operate in remote areas with intermittent, slow, or nonexistent internet connectivity. 

To ensure continuous, uninterrupted classroom learning, the PALASH mobile application operates on an **Offline-First Architecture**. The application relies exclusively on a local **SQLite** database for normal classroom interactions (curriculum navigation, lesson scripts, classroom activities, oral assessments, worksheets, and dictionary lookups). When an internet connection becomes available, a synchronization layer will reconcile changes with the centralized **FastAPI + PostgreSQL** backend.

---

## 2. Why SQLite is Required for PALASH

In rural school environments, requiring a round-trip network call to PostgreSQL for every lesson page or worksheet view causes immediate failure when connectivity drops. 

SQLite provides:
1. **Zero-Latency Local Queries**: Instant access to lesson plans, teacher guides, activities, and questions directly from device storage.
2. **True Offline Resilience**: Teachers can complete full lessons, conduct assessments, and administer worksheets without cellular data or Wi-Fi.
3. **Embedded Reliability**: SQLite is self-contained, ACID-compliant, requires zero server configuration, and stores data in a single local database file (`palash_local.db`) on the Android device.
4. **Relational Integrity**: Supports foreign keys (`PRAGMA foreign_keys = ON;`), compound indices, and cascade operations to mirror backend domain relationships.

---

## 3. PostgreSQL vs. SQLite Architectural Comparison

| Dimension | PostgreSQL (Backend Cloud) | SQLite (Local Android Device) |
| :--- | :--- | :--- |
| **Role** | Centralized System of Record | Local Offline-First Cache & Workspace |
| **Storage Engine** | Client-Server SQL Database (Remote) | Embedded Serverless Engine (In-App) |
| **Availability Requirement** | Requires Active Internet Connection | Always Available (100% Offline) |
| **Concurrency Model** | Multi-user concurrent writes across all schools | Single-user concurrent access per device |
| **Primary Keys** | Auto-increment sequence / BigInt | Auto-increment Integer mapped to backend IDs |
| **Data Scope** | Global state for all schools, teachers, and curriculum | Local state for the authenticated teacher, school, and active grades |
| **Foreign Key Enforcement** | Enforced by default | Enforced via `PRAGMA foreign_keys = ON;` |

---

## 4. Local Database Schema & Stored Entities

The local SQLite database (`palash_local.db`) implements the normalized schema of the PALASH platform:

```
[schools]
   └── [teachers]

[curriculum_classes]
   └── [subjects]
          └── [learning_outcomes]
                 └── [lessons]
                        ├── [activities]
                        ├── [assessments]
                        └── [worksheets]
                               └── [worksheet_questions]
```

### Table Definitions:

1. **`schools`**:
   - `id` (INTEGER PRIMARY KEY), `school_code` (TEXT UNIQUE), `name` (TEXT), `district` (TEXT), `block`, `cluster`, `village`, `address`, `created_at`, `updated_at`.
2. **`teachers`**:
   - `id` (INTEGER PRIMARY KEY), `user_id` (INTEGER UNIQUE), `school_id` (INTEGER REFERENCES schools(id)), `teacher_code` (TEXT UNIQUE), `full_name` (TEXT), `phone`, `preferred_language`, `target_language`, `created_at`, `updated_at`.
3. **`curriculum_classes`**:
   - `id` (INTEGER PRIMARY KEY), `name` (TEXT), `grade` (INTEGER), `description`, `is_active` (INTEGER DEFAULT 1), `created_at`, `updated_at`.
4. **`subjects`**:
   - `id` (INTEGER PRIMARY KEY), `class_id` (INTEGER REFERENCES curriculum_classes(id) ON DELETE CASCADE), `name` (TEXT), `code` (TEXT), `description`, `is_active`, `created_at`, `updated_at`.
5. **`learning_outcomes`**:
   - `id` (INTEGER PRIMARY KEY), `subject_id` (INTEGER REFERENCES subjects(id) ON DELETE CASCADE), `code` (TEXT), `title` (TEXT), `description`, `nipun_domain`, `is_active`, `created_at`, `updated_at`.
6. **`lessons`**:
   - `id` (INTEGER PRIMARY KEY), `learning_outcome_id` (INTEGER REFERENCES learning_outcomes(id) ON DELETE CASCADE), `title` (TEXT), `lesson_number` (INTEGER), `source_language`, `duration_minutes`, `teacher_script` (TEXT), `learning_objective` (TEXT), `is_active`, `created_at`, `updated_at`.
7. **`activities`**:
   - `id` (INTEGER PRIMARY KEY), `lesson_id` (INTEGER REFERENCES lessons(id) ON DELETE CASCADE), `title` (TEXT), `activity_type` (TEXT), `instructions` (TEXT), `sequence_order` (INTEGER), `materials` (TEXT), `is_active`, `created_at`, `updated_at`.
8. **`assessments`**:
   - `id` (INTEGER PRIMARY KEY), `lesson_id` (INTEGER REFERENCES lessons(id) ON DELETE CASCADE), `title` (TEXT), `prompt` (TEXT), `assessment_type` (TEXT), `sequence_order` (INTEGER), `expected_response` (TEXT), `is_active`, `created_at`, `updated_at`.
9. **`worksheets`**:
   - `id` (INTEGER PRIMARY KEY), `lesson_id` (INTEGER REFERENCES lessons(id) ON DELETE CASCADE), `title` (TEXT), `description` (TEXT), `language_code` (TEXT), `source_language` (TEXT), `worksheet_type` (TEXT), `difficulty_level` (TEXT), `instructions` (TEXT), `content` (TEXT), `answer_key` (TEXT), `file_path` (TEXT), `version` (INTEGER), `is_active` (INTEGER), `created_at`, `updated_at`.
10. **`worksheet_questions`**:
    - `id` (INTEGER PRIMARY KEY), `worksheet_id` (INTEGER REFERENCES worksheets(id) ON DELETE CASCADE), `question_number` (INTEGER), `question_text` (TEXT), `question_type` (TEXT), `options` (TEXT / JSON), `correct_answer` (TEXT), `explanation` (TEXT), `marks` (INTEGER), `created_at`, `updated_at`.
11. **`schema_migrations`**:
    - `version` (INTEGER PRIMARY KEY), `applied_at` (TEXT).

---

## 5. Database Initialization Lifecycle

The database initialization is orchestrated via `initializeDatabase()` in `mobile/src/database/db.ts`:

1. **Connection & Driver Selection**:
   - In production on Android/iOS devices, it utilizes `@op-engineering/op-sqlite` (high-performance C++ JSI binding).
   - In Jest / Node automated testing environments, it utilizes `BetterSqliteDriver` as a pluggable adapter.
2. **Foreign Key Enforcement**:
   - Executes `PRAGMA foreign_keys = ON;` immediately upon opening the connection to guarantee relational integrity.
3. **Deterministic Migrations**:
   - Reads the current version from `schema_migrations` / `PRAGMA user_version`.
   - Executes pending migrations sequentially within ACID transactions.
4. **Idempotency**:
   - Safe to call multiple times without side effects or data loss.

---

## 6. Database Versioning & Migrations Strategy

Database versioning is managed via `mobile/src/database/migrations.ts`:

- **Baseline Version**: `DATABASE_VERSION = 1` creates all initial tables, columns, and performance indexes.
- **Future Versioning**: When schema modifications are required (e.g. adding new fields or offline tracking columns), a new migration entry (`version: 2`, `version: 3`, etc.) is appended to `MIGRATIONS`.
- **Non-Destructive Upgrades**: The migration runner executes `ALTER TABLE` or table migrations within transactions without dropping existing cached teacher or curriculum data.

---

## 7. Repository Layer Pattern

To isolate the user interface from direct SQL queries, PALASH uses dedicated repository modules:

- **`teacherRepository`**:
  - `getTeacher(id?: number)`: Retrieves the local active teacher record.
  - `saveTeacher(teacher: TeacherRecord)`: Upserts teacher details into SQLite.
  - `getSchool(id: number)`: Retrieves school information.
  - `saveSchool(school: SchoolRecord)`: Upserts school details.
- **`curriculumRepository`**:
  - `getClasses()`: Lists active curriculum grades/classes.
  - `getSubjects(classId)`: Lists subjects for a class.
  - `getLearningOutcomes(subjectId)`: Lists learning outcomes.
  - `getLessons(outcomeId)` & `getLessonById(lessonId)`: Retrieves lesson plans and teacher scripts.
  - `getActivities(lessonId)`: Lists step-by-step classroom activities.
  - `getAssessments(lessonId)`: Lists assessment prompts and expected responses.
- **`worksheetRepository`**:
  - `getWorksheets(lessonId)` & `getWorksheetById(worksheetId)`: Retrieves worksheet metadata.
  - `getWorksheetQuestions(worksheetId)`: Retrieves ordered worksheet questions.
  - `saveWorksheet(item)` & `saveWorksheetQuestions(questions)`: Upserts worksheets and questions.

> **Principle**: Repositories operate **strictly against local SQLite**. They do not make network calls to FastAPI.

---

## 8. Offline Operation & Verified Synchronization Layer (Stage 2.6)

### Production Synchronization Architecture:
```
[ UI Components ]
       │
       ▼
[ Local Repositories ]
       │
       ▼
[ SQLite Database ] ──▶ [ Sync Queue ]
(Offline Truth)                │
                     (Internet Restored)
                               │
                               ▼
                      [ Sync Manager ]
                               │
                               ▼
                      [ FastAPI Backend ]
                               │
                               ▼
                     [ PostgreSQL Database ]
                         (Online Truth)
```

As implemented and verified across Stages 2.6.1 – 2.6.4:
1. **Offline Mode**: UI components read from and write to local SQLite via domain repositories (`teacherRepository`, `curriculumRepository`, `worksheetRepository`). Mutations are recorded in `sync_queue`.
2. **Online Reconciliation**: When network connectivity returns, `SyncManager` executes:
   - **Upstream Sync**: Flushes queued mutations (`CREATE`, `UPDATE`, `DELETE`) to FastAPI endpoints (`/worksheets`, `/teachers/me`), marking successes as `COMPLETED` and retaining failures for safe retries.
   - **Downstream Sync**: Pulls server updates in strict foreign-key dependency order (`School` → `Teacher` → `Classes` → `Subjects` → `Learning Outcomes` → `Lessons` → `Activities/Assessments` → `Worksheets` → `Questions`).
3. **Conflict Resolution**: Deterministic evaluation based on version numbers and ISO timestamp comparisons (Last-Write-Wins), with local un-uploaded changes preserved.


---

## 9. Security & Credentials Policy

- **No Plaintext Passwords**: Passwords and cryptographic hashes are never stored in SQLite.
- **No Direct Token Storage in SQLite**: JWT authentication tokens and refresh tokens will be stored exclusively in Android `EncryptedSharedPreferences` / Secure Keystore in later stages.
- **Local Profile Isolation**: SQLite stores only user profiles and non-sensitive curriculum metadata needed for educational delivery.
