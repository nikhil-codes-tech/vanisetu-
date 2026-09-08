# PALASH Stage 2.6 Completion Checkpoint: Offline-First Architecture & Online ↔ Offline Synchronization

**Status:** COMPLETED & VERIFIED  
**Date:** September 2026  
**Stages Included:**
- Stage 2.6.1: SQLite Local Offline Database Foundation — **PASS**
- Stage 2.6.2: Offline Repository Layer — **PASS**
- Stage 2.6.3: Online ↔ Offline Synchronization Layer — **PASS**
- Stage 2.6.4: Real Offline ↔ Online End-to-End Verification — **PASS**

---

## 1. Verified Architecture Overview

PALASH is built around an **Offline-First Data Architecture** tailored for tribal primary schools across Jharkhand with intermittent or nonexistent internet access:

```
[ React Native Mobile UI ]
            │
            ▼
 [ Local SQLite Repositories ]
            │
            ▼
    [ SQLite Database ] ────────┐
   (Source of Truth Offline)    │ (Offline Writes Queued)
                                ▼
                         [ Sync Queue ]
                                │
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
                    (Source of Truth Online)
```

1. **SQLite as the Mobile Offline Source of Truth**:
   - While offline, the mobile app interacts strictly with local SQLite (`palash_local.db`).
   - Normal reads and writes execute with zero network calls and zero dependency on PostgreSQL or cloud servers.
2. **PostgreSQL as the Server Source of Truth**:
   - While online, PostgreSQL (`palash_db`) serves as the authoritative central system of record for all schools, curriculum standards, and synchronized worksheets.
3. **SyncManager for Seamless Reconciliation**:
   - `SyncManager` under `mobile/src/sync/SyncManager.ts` coordinates connectivity monitoring, upload synchronization, download synchronization, conflict resolution, and in-flight mutex locking.
4. **Curriculum and Worksheets Available 100% Offline**:
   - Classes, Subjects, Learning Outcomes, Lessons, Activities, Assessments, Worksheets, and Questions are cached locally in SQLite for instant classroom access.
5. **Offline Writes Retained and Flushed Later**:
   - Local mutations (e.g. newly created or edited worksheets, question banks, or profile changes) are written to SQLite and enqueued into `sync_queue`.
   - When network connectivity is restored, the `SyncManager` automatically detects the transition and uploads pending records to FastAPI.
6. **Strict Foreign-Key Dependency Ordering**:
   - `PRAGMA foreign_keys = ON;` is enforced at all times.
   - Downstream download synchronization synchronizes parent entities before child entities:
     1. School
     2. Teacher
     3. Curriculum Classes
     4. Subjects
     5. Learning Outcomes
     6. Lessons
     7. Activities
     8. Assessments
     9. Worksheets
     10. Worksheet Questions
7. **Duplicate Prevention & Retry Handling**:
   - In-flight lock (`isSyncing` flag and active sync promise sharing) prevents concurrent duplicate synchronization runs.
   - Failed upload attempts increment `retry_count`, log error messages, and remain stored in `sync_queue` as `FAILED` until the next retry cycle.
   - No offline data is lost or corrupted due to network errors.
8. **Deterministic Conflict Handling**:
   - Central Curriculum Master Data: Server Wins.
   - Worksheets: Local pending changes take precedence; otherwise version comparison (`server.version > local.version` -> Server Wins) followed by Last-Write-Wins (LWW) timestamp evaluation.
   - Teacher Profile: Last-Write-Wins (LWW) based on ISO timestamp.

---

## 2. Test Verification Summary

### Mobile Test Suite (`npm test -- --runInBand`)
- **Total Test Suites:** 3 passed, 3 total
- **Total Tests:** 27 passed, 27 total (0 failed)
  - `__tests__/sync.test.ts`: 11 passed
    - Offline write operation
    - Sync queue creation and state tracking
    - Successful synchronization and completion
    - Failed sync retention without data loss
    - Retry synchronization
    - Duplicate sync prevention
    - Complete server -> SQLite download in FK order
    - Worksheet and question upload
    - Sync state reporting (`isSyncing`, `lastSyncTime`, `pendingCount`)
    - Deterministic conflict handling
    - Auto-sync on connectivity restoration
  - `__tests__/repositories.test.ts`: 8 passed
    - Teacher offline storage
    - School offline storage
    - Curriculum hierarchy offline storage
    - Worksheet offline storage
    - Worksheet question offline storage
    - State persistence across SQLite restarts
    - Foreign key constraints enforcement
    - Strict offline-only execution (0 network calls)
  - `__tests__/database.test.ts`: 8 passed
    - Database initialization and table creation
    - Version tracking
    - Idempotency
    - Teacher and school data roundtrip
    - Curriculum hierarchy data roundtrip
    - Worksheets and questions roundtrip
    - Foreign key validation (`PRAGMA foreign_keys = ON;`)
    - Cascade delete validation

### Mobile Type Check (`npx tsc --noEmit`)
- **Status:** PASS (0 errors, 0 warnings)

### Backend Regression Tests (`pytest tests/`)
- **Status:** 53 passed, 0 failed

### Stage 2.6.4 Real E2E Verification
- Live FastAPI backend verified on `http://127.0.0.1:8001`.
- PostgreSQL database (`palash_db`) connection verified active.
- Online authentication via `/api/v1/auth/login` verified.
- Online retrieval of School, Class, Subject, Learning Outcome, Lesson, Activities, Assessments, and Worksheets verified.
- Offline decoupling verified: SQLite functions 100% independently when disconnected.

---

## 3. Final Checkpoint Status

| Sub-Stage | Description | Status |
| :--- | :--- | :--- |
| **Stage 2.6.1** | SQLite Local Offline Database Foundation | **PASS / VERIFIED** |
| **Stage 2.6.2** | Offline Repository Layer | **PASS / VERIFIED** |
| **Stage 2.6.3** | Online ↔ Offline Synchronization Layer | **PASS / VERIFIED** |
| **Stage 2.6.4** | Real Offline ↔ Online End-to-End Testing | **PASS / VERIFIED** |
| **STAGE 2.6** | **COMPLETE OFFLINE DATA & SYNC FOUNDATION** | **COMPLETED / VERIFIED** |
