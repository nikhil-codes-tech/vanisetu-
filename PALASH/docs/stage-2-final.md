# PALASH Stage 2 Capstone: Offline-First Educational Architecture & Classroom Operations

## Milestone Overview
Stage 2 establishes the complete offline-first mobile architecture, bilingual curriculum management, classroom student operations, and bidirectional synchronization between the React Native client and FastAPI backend.

Teachers in remote tribal schools of Jharkhand (West Singhbhum, Chaibasa) can conduct classes, record evaluations, manage bilingual vocabularies (Ho ↔ Hindi), track daily attendance, and author local worksheets—all completely offline without mobile network connectivity. When network connectivity is re-established, the platform automatically queues, retries, and synchronizes mutations.

---

## Completed Architecture Modules

### 1. Database & Local Offline Storage (`mobile/src/database`)
- **Engine**: SQLite (via `@op-engineering/op-sqlite` on mobile devices, `sql.js` WASM driver for high-speed deterministic unit & integration tests).
- **Enforced Constraints**: `PRAGMA foreign_keys = ON;`, cascade deletions on curriculum hierarchies, idempotent schema creation and version tracking.
- **Entities & Tables (17 Tables)**:
  1. `schools`
  2. `teachers`
  3. `curriculum_classes`
  4. `subjects`
  5. `learning_outcomes`
  6. `lessons`
  7. `activities`
  8. `assessments`
  9. `worksheets`
  10. `worksheet_questions`
  11. `sync_queue`
  12. `sync_metadata`
  13. `dictionary_entries` (Bilingual Ho ↔ Hindi vocabulary)
  14. `students` (Enrolled student roster)
  15. `student_evaluations` (Classroom assessment scoring)
  16. `student_attendance` (Daily roll call with status & remarks)
  17. `schema_version`

### 2. Synchronization Layer (`mobile/src/sync`)
- **Queue Manager**: `SyncQueueManager` for durable mutation queuing in `sync_queue`.
- **Upstream Sync (`uploadSync.ts`)**: Batched HTTP POST/PUT/DELETE requests for offline modifications with retry counters and error tracking.
- **Downstream Sync (`downloadSync.ts`)**: Full curriculum, school, teacher, worksheet, and student data downloads adhering strictly to relational foreign key insertion order.
- **Conflict Handling (`conflictHandler.ts`)**: Deterministic conflict resolution preserving local unsynced edits with server timestamp fallback.
- **Connectivity Monitoring (`connectivity.ts`)**: Auto-detection of network connectivity transitions and auto-sync triggers.
- **Sync Center & Diagnostics (`SyncCenterScreen.tsx`)**: UI for queue inspection, manual retry of failed items, completed item purging, and storage telemetry.

### 3. Classroom Student Operations
- **Student Roster (`StudentRosterScreen.tsx`)**: Offline search and class/section filtering of enrolled students.
- **Classroom Evaluation (`StudentEvaluationScreen.tsx`)**: Rubric scoring (numeric score / max score, status, teacher remarks) linked to lessons and worksheets.
- **Daily Classroom Attendance (`AttendanceScreen.tsx` & `attendanceRepository.ts`)**:
  - Roll-call interface with one-tap statuses: `Present` (green), `Absent` (red), `Late` (amber), `Excused` (blue).
  - Quick action to mark all present.
  - Per-student optional notes/remarks.
  - Real-time summary counts.
  - Offline upsert idempotency (`UNIQUE(student_id, attendance_date)`).
  - Backend integration at `/api/v1/attendance` with bulk ingestion support.

### 4. Bilingual Dictionary & Word Bank (`DictionaryScreen.tsx`)
- Ho (Warang Chiti / Latin script) ↔ Hindi bilingual dictionary with search across words, translations, transliterations, and lesson associations.

### 5. Teacher Application Flow (`mobile/src/navigation` & `screens`)
- Dynamic navigation router supporting complete teacher workflow:
  `Login` → `Dashboard` → `TeacherProfile` → `School` → `Classes` → `Subjects` → `LearningOutcomes` → `Lessons` → `LessonDetail` → `WorksheetList` → `WorksheetDetail` → `CreateWorksheet` → `Dictionary` → `StudentRoster` → `StudentEvaluation` → `Attendance` → `SyncCenter`.

---

## Verification & Test Metrics
- **Mobile Test Suite**: 65 tests passing across 9 test suites (`npm test -- --runInBand`).
- **Mobile TypeScript**: 0 errors (`npx tsc --noEmit`).
- **Backend Test Suite**: 59 tests passing (`pytest -q`).
- **Live Integration**: React Native ↔ FastAPI OAuth2 password flow, JWT authentication, offline SQLite caching, mutation queuing, and server sync verified.
