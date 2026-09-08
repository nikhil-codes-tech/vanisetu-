import initSqlJs from 'sql.js';
import {
  initializeDatabase,
  closeDatabase,
  SqlJsDriver,
  curriculumClassRepository,
  subjectRepository,
  learningOutcomeRepository,
  lessonRepository,
  activityRepository,
  assessmentRepository,
  worksheetRepository,
  worksheetQuestionRepository,
  teacherRepository,
  schoolRepository,
} from '../src/database';
import {
  SyncManager,
  SyncQueueManager,
  ConnectivityService,
  conflictHandler,
} from '../src/sync';
import { ApiClient } from '../src/services/api';

describe('PALASH Stage 2.6.3 Online <-> Offline Synchronization', () => {
  let sqlJsInstance: any;
  let mockApi: jest.Mocked<ApiClient>;
  let connectivity: ConnectivityService;
  let queue: SyncQueueManager;
  let syncManager: SyncManager;

  beforeEach(async () => {
    // 1. Initialize SQLite WASM database in memory
    const SQL = await initSqlJs();
    sqlJsInstance = new SQL.Database();
    const driver = new SqlJsDriver(sqlJsInstance);
    await initializeDatabase(driver);

    // 2. Initialize mock API client
    mockApi = {
      get: jest.fn(),
      post: jest.fn(),
      postForm: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      setToken: jest.fn(),
      getToken: jest.fn().mockReturnValue(null),
      getBaseUrl: jest.fn().mockReturnValue('http://mock-api.local/api/v1'),
    };

    // 3. Initialize connectivity & queue
    connectivity = new ConnectivityService(true);
    queue = new SyncQueueManager();

    // 4. Initialize SyncManager
    syncManager = new SyncManager(mockApi, connectivity, queue);
    await syncManager.init(false);
  });

  afterEach(async () => {
    syncManager.destroy();
    await closeDatabase();
  });

  test('1. Offline write: local repositories work without network', async () => {
    connectivity.setOnline(false);

    // Local school write
    await schoolRepository.saveSchool({
      id: 10,
      school_code: 'SCH-OFFLINE-01',
      name: 'Chaibasa Offline Vidyalaya',
      district: 'West Singhbhum',
    });

    const school = await schoolRepository.getSchool(10);
    expect(school).not.toBeNull();
    expect(school?.name).toBe('Chaibasa Offline Vidyalaya');

    // Local worksheet write
    await curriculumClassRepository.saveClass({ id: 1, name: 'Class 1', grade: 1, is_active: 1 });
    await subjectRepository.saveSubject({ id: 1, class_id: 1, name: 'Ho Language', code: 'HO1', is_active: 1 });
    await learningOutcomeRepository.saveLearningOutcome({ id: 1, subject_id: 1, code: 'LO-1', title: 'Oral', is_active: 1 });
    await lessonRepository.saveLesson({ id: 1, learning_outcome_id: 1, title: 'Greetings', lesson_number: 1, source_language: 'hi', is_active: 1 });

    await worksheetRepository.saveWorksheet({
      id: 101,
      lesson_id: 1,
      title: 'Greetings Offline Worksheet',
      language_code: 'hi',
      source_language: 'hi',
      worksheet_type: 'oral_match',
      version: 1,
      is_active: 1,
    });

    const worksheet = await worksheetRepository.getWorksheet(101);
    expect(worksheet?.title).toBe('Greetings Offline Worksheet');
    expect(mockApi.get).not.toHaveBeenCalled();
    expect(mockApi.post).not.toHaveBeenCalled();
  });

  test('2. Queue creation: mutations are properly enqueued in sync_queue', async () => {
    // Enqueue a worksheet CREATE operation
    const item1 = await queue.enqueue({
      entity_type: 'worksheet',
      entity_id: 101,
      operation: 'CREATE',
      payload: {
        id: 101,
        lesson_id: 1,
        title: 'New Offline Worksheet',
        worksheet_type: 'mcq',
      },
    });

    expect(item1.id).toBeGreaterThan(0);
    expect(item1.status).toBe('PENDING');
    expect(item1.operation).toBe('CREATE');

    // Enqueue a worksheet UPDATE operation
    const item2 = await queue.enqueue({
      entity_type: 'worksheet',
      entity_id: 101,
      operation: 'UPDATE',
      payload: {
        title: 'Updated Offline Worksheet',
      },
    });

    expect(item2.id).toBeGreaterThan(0);
    expect(item2.operation).toBe('UPDATE');

    const pending = await queue.getPendingItems();
    expect(pending.length).toBe(2);

    const status = await queue.getQueueStatus();
    expect(status.pending).toBe(2);
    expect(status.failed).toBe(0);
  });

  test('3. Successful synchronization: queued items are uploaded and marked COMPLETED', async () => {
    mockApi.post.mockResolvedValueOnce({ id: 101, title: 'Server Created' });
    mockApi.put.mockResolvedValueOnce({ id: 101, title: 'Server Updated' });

    // Enqueue two operations
    await queue.enqueue({
      entity_type: 'worksheet',
      entity_id: 101,
      operation: 'CREATE',
      payload: { title: 'Worksheet 101', lesson_id: 1, worksheet_type: 'mcq' },
    });

    await queue.enqueue({
      entity_type: 'worksheet',
      entity_id: 101,
      operation: 'UPDATE',
      payload: { title: 'Worksheet 101 Updated' },
    });

    // Run sync (skip download to test upload independently)
    const result = await syncManager.sync({ skipDownload: true });

    expect(result.status).toBe('SUCCESS');
    expect(result.uploadResult?.succeeded).toBe(2);
    expect(result.uploadResult?.failed).toBe(0);

    // Verify queue status
    const status = await queue.getQueueStatus();
    expect(status.pending).toBe(0);
    expect(status.completed).toBe(2);
    expect(mockApi.post).toHaveBeenCalledWith('/worksheets', expect.any(Object));
    expect(mockApi.put).toHaveBeenCalledWith('/worksheets/101', expect.any(Object));
  });

  test('4. Failed synchronization: network error marks items FAILED and does not delete them', async () => {
    mockApi.post.mockRejectedValueOnce(new Error('Network request failed: 503 Service Unavailable'));

    const item = await queue.enqueue({
      entity_type: 'worksheet',
      entity_id: 202,
      operation: 'CREATE',
      payload: { title: 'Failing Worksheet', lesson_id: 1, worksheet_type: 'mcq' },
    });

    const result = await syncManager.sync({ skipDownload: true });

    expect(result.status).toBe('PARTIAL');
    expect(result.uploadResult?.failed).toBe(1);
    expect(result.uploadResult?.succeeded).toBe(0);

    // Failed item remains in the queue with incremented retry_count
    const pendingItems = await queue.getPendingItems();
    expect(pendingItems.length).toBe(1);
    expect(pendingItems[0].id).toBe(item.id);
    expect(pendingItems[0].status).toBe('FAILED');
    expect(pendingItems[0].retry_count).toBe(1);
    expect(pendingItems[0].error_message).toContain('503 Service Unavailable');
  });

  test('5. Retry: failed items can be retried successfully when network recovers', async () => {
    // 1. Initial attempt fails
    mockApi.post.mockRejectedValueOnce(new Error('Timeout'));

    await queue.enqueue({
      entity_type: 'worksheet',
      entity_id: 303,
      operation: 'CREATE',
      payload: { title: 'Retry Worksheet', lesson_id: 1, worksheet_type: 'mcq' },
    });

    const firstResult = await syncManager.sync({ skipDownload: true });
    expect(firstResult.status).toBe('PARTIAL');

    let status = await queue.getQueueStatus();
    expect(status.failed).toBe(1);

    // 2. Second attempt succeeds
    mockApi.post.mockResolvedValueOnce({ id: 303, title: 'Retry Worksheet Success' });

    const secondResult = await syncManager.sync({ skipDownload: true });
    expect(secondResult.status).toBe('SUCCESS');
    expect(secondResult.uploadResult?.succeeded).toBe(1);

    status = await queue.getQueueStatus();
    expect(status.failed).toBe(0);
    expect(status.completed).toBe(1);
  });

  test('6. Duplicate sync prevention: only one sync runs at a time', async () => {
    // Create a delayed API call
    let resolveDelay: (val: any) => void;
    const delayedPromise = new Promise((resolve) => {
      resolveDelay = resolve;
    });
    mockApi.get.mockImplementationOnce(() => delayedPromise as any);

    // Call sync twice concurrently
    const syncPromise1 = syncManager.sync({ skipUpload: true });
    const syncPromise2 = syncManager.sync({ skipUpload: true });

    // The second call immediately detects concurrent sync
    const [res1, res2] = await Promise.all([
      (async () => {
        resolveDelay!([]);
        return await syncPromise1;
      })(),
      syncPromise2,
    ]);

    expect(res1.status).toBe('SUCCESS');
    // Either second promise awaited the active sync or returned ALREADY_SYNCING
    expect(['SUCCESS', 'ALREADY_SYNCING']).toContain(res2.status);
  });

  test('7. Server -> SQLite download: complete curriculum hierarchy and foreign-key ordering', async () => {
    // Mock server data hierarchy
    mockApi.get.mockImplementation(async (path: string) => {
      if (path === '/teachers/me') {
        return {
          id: 1,
          user_id: 10,
          school_id: 1,
          teacher_code: 'TCH-001',
          full_name: 'Birsa Ho',
          preferred_language: 'hi',
          target_language: 'ho',
          school: {
            id: 1,
            school_code: 'SCH-001',
            name: 'Kolhan Tribal Primary School',
            district: 'West Singhbhum',
          },
        };
      }
      if (path === '/curriculum/classes') {
        return [{ id: 1, name: 'Class 1', grade: 1, is_active: true }];
      }
      if (path === '/curriculum/classes/1/subjects') {
        return [{ id: 10, class_id: 1, name: 'Language', code: 'LANG1', is_active: true }];
      }
      if (path === '/curriculum/subjects/10/learning-outcomes') {
        return [{ id: 100, subject_id: 10, code: 'LO-1.1', title: 'Oral Vocabulary', is_active: true }];
      }
      if (path === '/curriculum/learning-outcomes/100/lessons') {
        return [{ id: 1000, learning_outcome_id: 100, title: 'Greetings', lesson_number: 1, source_language: 'hi', is_active: true }];
      }
      if (path === '/curriculum/lessons/1000/activities') {
        return [{ id: 5001, lesson_id: 1000, title: 'Greeting Game', activity_type: 'game', sequence_order: 1, is_active: true }];
      }
      if (path === '/curriculum/lessons/1000/assessments') {
        return [{ id: 6001, lesson_id: 1000, title: 'Greeting Check', prompt: 'Say Johar', assessment_type: 'oral', is_active: true }];
      }
      if (path === '/lessons/1000/worksheets') {
        return [{ id: 7001, lesson_id: 1000, title: 'Greetings Match', worksheet_type: 'match', language_code: 'hi', source_language: 'hi', version: 1, is_active: true }];
      }
      if (path === '/worksheets/7001/questions') {
        return [{ id: 8001, worksheet_id: 7001, question_number: 1, question_text: 'What is Johar?', question_type: 'mcq', marks: 1 }];
      }
      return [];
    });

    const result = await syncManager.sync({ skipUpload: true });
    expect(result.status).toBe('SUCCESS');

    // Verify all records were stored in SQLite in strict foreign-key dependency order
    const school = await schoolRepository.getSchool(1);
    expect(school?.name).toBe('Kolhan Tribal Primary School');

    const teacher = await teacherRepository.getTeacher(1);
    expect(teacher?.full_name).toBe('Birsa Ho');

    const classes = await curriculumClassRepository.getClasses();
    expect(classes.length).toBe(1);
    expect(classes[0].name).toBe('Class 1');

    const subjects = await subjectRepository.getSubjectsByClass(1);
    expect(subjects.length).toBe(1);
    expect(subjects[0].name).toBe('Language');

    const outcomes = await learningOutcomeRepository.getLearningOutcomesBySubject(10);
    expect(outcomes.length).toBe(1);
    expect(outcomes[0].code).toBe('LO-1.1');

    const lessons = await lessonRepository.getLessonsByOutcome(100);
    expect(lessons.length).toBe(1);
    expect(lessons[0].title).toBe('Greetings');

    const activities = await activityRepository.getActivitiesByLesson(1000);
    expect(activities.length).toBe(1);

    const assessments = await assessmentRepository.getAssessmentsByLesson(1000);
    expect(assessments.length).toBe(1);

    const worksheets = await worksheetRepository.getWorksheetsByLesson(1000);
    expect(worksheets.length).toBe(1);
    expect(worksheets[0].title).toBe('Greetings Match');

    const questions = await worksheetQuestionRepository.getQuestionsByWorksheet(7001);
    expect(questions.length).toBe(1);
    expect(questions[0].question_text).toBe('What is Johar?');
  });

  test('8. Worksheet & Question synchronization: upload offline created questions to server', async () => {
    mockApi.post.mockResolvedValueOnce({ id: 9001, worksheet_id: 101, question_text: 'Sample Q' });

    await queue.enqueue({
      entity_type: 'worksheet_question',
      entity_id: 9001,
      operation: 'CREATE',
      payload: {
        worksheet_id: 101,
        question_number: 1,
        question_text: 'Offline Question 1',
        question_type: 'multiple_choice',
        marks: 1,
      },
    });

    const result = await syncManager.sync({ skipDownload: true });
    expect(result.status).toBe('SUCCESS');
    expect(result.uploadResult?.succeeded).toBe(1);
    expect(mockApi.post).toHaveBeenCalledWith('/worksheets/101/questions', expect.any(Object));
  });

  test('9. Sync state tracking: tracks isSyncing, lastSyncTime, and pending count', async () => {
    const initialState = await syncManager.getSyncState();
    expect(initialState.isSyncing).toBe(false);
    expect(initialState.isOnline).toBe(true);
    expect(initialState.pendingUploadCount).toBe(0);

    // Enqueue an item
    await queue.enqueue({
      entity_type: 'teacher',
      entity_id: 1,
      operation: 'UPDATE',
      payload: { preferred_language: 'ho' },
    });

    const stateWithQueue = await syncManager.getSyncState();
    expect(stateWithQueue.pendingUploadCount).toBe(1);

    // Perform sync
    mockApi.put.mockResolvedValueOnce({ id: 1 });
    mockApi.get.mockResolvedValue([]);

    await syncManager.sync();

    const finalState = await syncManager.getSyncState();
    expect(finalState.isSyncing).toBe(false);
    expect(finalState.lastSyncStatus).toBe('SUCCESS');
    expect(finalState.lastSyncTime).not.toBeNull();
    expect(finalState.pendingUploadCount).toBe(0);
  });

  test('10. Conflict Handling: deterministic version and timestamp comparison', () => {
    // Case A: Server version is higher -> Server wins
    const localWs = { id: 1, version: 1, updated_at: '2026-09-01T10:00:00Z' };
    const serverWs = { id: 1, version: 2, updated_at: '2026-09-02T10:00:00Z' };
    const resA = conflictHandler.resolveWorksheetConflict(localWs, serverWs, false);
    expect(resA.winner).toBe('SERVER');

    // Case B: Local has pending un-uploaded changes -> Local wins
    const resB = conflictHandler.resolveWorksheetConflict(localWs, serverWs, true);
    expect(resB.winner).toBe('LOCAL');

    // Case C: Same version, server timestamp newer -> Server wins
    const localWs2 = { id: 1, version: 1, updated_at: '2026-09-01T10:00:00Z' };
    const serverWs2 = { id: 1, version: 1, updated_at: '2026-09-03T10:00:00Z' };
    const resC = conflictHandler.resolveWorksheetConflict(localWs2, serverWs2, false);
    expect(resC.winner).toBe('SERVER');

    // Case D: Profile timestamp comparison
    const localProfile = { id: 1, updated_at: '2026-09-05T12:00:00Z' };
    const serverProfile = { id: 1, updated_at: '2026-09-05T11:00:00Z' };
    const resD = conflictHandler.resolveProfileConflict(localProfile, serverProfile, false);
    expect(resD.winner).toBe('LOCAL');
  });

  test('11. Auto-sync trigger on connectivity restored', async () => {
    let syncTriggered = false;
    // Create new manager with auto-sync enabled
    const autoSyncManager = new SyncManager(mockApi, connectivity, queue);
    mockApi.get.mockResolvedValue([]);

    await autoSyncManager.init(true);

    // Spy on sync
    jest.spyOn(autoSyncManager, 'sync').mockImplementation(async () => {
      syncTriggered = true;
      return { status: 'SUCCESS' };
    });

    // Simulate offline -> online transition
    connectivity.setOnline(false);
    expect(syncTriggered).toBe(false);

    connectivity.setOnline(true);
    expect(syncTriggered).toBe(true);

    autoSyncManager.destroy();
  });
});
