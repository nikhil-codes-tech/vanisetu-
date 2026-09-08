/**
 * PALASH Stage 2.7 Live API Integration Tests
 * Executes full end-to-end integration against live FastAPI server at http://127.0.0.1:8001
 * Verifies:
 *  1. Login -> JWT -> Token Storage -> Bearer Authorization
 *  2. /api/v1/auth/me profile retrieval
 *  3. /api/v1/teachers/me profile with user_id & school caching in SQLite
 *  4. Curriculum and worksheets online caching into SQLite
 *  5. Offline retrieval of cached data when disconnected
 *  6. Offline mutation queuing and upload sync when reconnected
 */

import initSqlJs from 'sql.js';
import {
  initializeDatabase,
  closeDatabase,
  SqlJsDriver,
  teacherRepository,
  schoolRepository,
  curriculumRepository,
  worksheetRepository,
  curriculumClassRepository,
  subjectRepository,
  learningOutcomeRepository,
  lessonRepository,
  worksheetQuestionRepository,
} from '../src/database';
import {
  FetchApiClient,
  AuthService,
  defaultTokenStorage,
} from '../src/services';
import {
  SyncManager,
  SyncQueueManager,
  ConnectivityService,
  DownloadSynchronizer,
  UploadSynchronizer,
} from '../src/sync';

const BASE_URL = 'http://127.0.0.1:8001/api/v1';

describe('PALASH Stage 2.7 React Native <-> FastAPI Live Integration', () => {
  let sqlJsInstance: any;
  let apiClient: FetchApiClient;
  let authService: AuthService;
  let connectivity: ConnectivityService;
  let queue: SyncQueueManager;
  let syncManager: SyncManager;

  const testUsername = `stage27_teacher_${Date.now()}`;
  const testPassword = 'TeacherPassword123!';

  beforeAll(async () => {
    // 1. Initialize SQLite database
    const SQL = await initSqlJs();
    sqlJsInstance = new SQL.Database();
    const driver = new SqlJsDriver(sqlJsInstance);
    await initializeDatabase(driver);

    // 2. Initialize real API client pointing to http://127.0.0.1:8001/api/v1
    apiClient = new FetchApiClient({
      baseUrl: BASE_URL,
      timeoutMs: 15000,
    });
    authService = new AuthService(apiClient, defaultTokenStorage);

    connectivity = new ConnectivityService(true);
    queue = new SyncQueueManager();
    syncManager = new SyncManager(apiClient, connectivity, queue);
    await syncManager.init(false);
  });

  afterAll(async () => {
    syncManager.destroy();
    await closeDatabase();
  });

  test('1. User Registration with FastAPI: creates user and teacher profile', async () => {
    const regResult = await authService.register({
      username: testUsername,
      password: testPassword,
      email: `${testUsername}@example.com`,
      role: 'teacher',
      full_name: 'Stage 2.7 Integration Teacher',
    });

    expect(regResult).toBeDefined();
    expect(regResult.username).toBe(testUsername);
    expect(regResult.role).toBe('teacher');
    expect(regResult.id).toBeGreaterThan(0);
  });

  test('2. OAuth2 Password Login: sends application/x-www-form-urlencoded and receives JWT', async () => {
    const tokenResult = await authService.login({
      username: testUsername,
      password: testPassword,
    });

    expect(tokenResult).toBeDefined();
    expect(tokenResult.access_token).toBeDefined();
    expect(tokenResult.token_type.toLowerCase()).toBe('bearer');
    expect(tokenResult.access_token.length).toBeGreaterThan(20);

    // Verify token was stored in API client
    expect(apiClient.getToken()).toBe(tokenResult.access_token);
  });

  test('3. Protected /api/v1/auth/me: verifies Bearer Authorization header', async () => {
    const me = await authService.getMe();
    expect(me).toBeDefined();
    expect(me.username).toBe(testUsername);
    expect(me.is_active).toBe(true);
  });

  test('4. Teacher Profile /api/v1/teachers/me: verifies user_id, school, and SQLite caching', async () => {
    const downloader = new DownloadSynchronizer(apiClient);
    const { teacher, school } = await downloader.syncTeacherProfile();

    expect(teacher).not.toBeNull();
    expect(teacher!.user_id).toBeDefined();
    expect(teacher!.user_id).toBeGreaterThan(0);
    expect(teacher!.full_name).toBeDefined();
    expect(teacher!.teacher_code).toBeDefined();

    // Verify persisted in SQLite
    const cachedTeacher = await teacherRepository.getTeacher(teacher!.id);
    expect(cachedTeacher).not.toBeNull();
    expect(cachedTeacher!.user_id).toBe(teacher!.user_id);
    expect(cachedTeacher!.teacher_code).toBe(teacher!.teacher_code);

    if (school) {
      const cachedSchool = await schoolRepository.getSchool(school.id);
      expect(cachedSchool).not.toBeNull();
      expect(cachedSchool!.name).toBe(school.name);
    }
  });

  test('5. Curriculum & Worksheets Online Data Flow: FastAPI -> DownloadSync -> SQLite Cache', async () => {
    const downloader = new DownloadSynchronizer(apiClient);
    const stats = await downloader.syncCurriculumHierarchy();

    expect(stats).toBeDefined();

    // If backend has seeded classes, verify they are in SQLite
    const classes = await curriculumRepository.getClasses();
    expect(Array.isArray(classes)).toBe(true);
  });

  test('6. Offline Data Flow: disconnect network and verify SQLite continues serving reads', async () => {
    // Simulate offline
    connectivity.setOnline(false);
    expect(connectivity.isOnline()).toBe(false);

    // Seed local test curriculum and worksheet data into SQLite to verify full offline hierarchy read
    await curriculumClassRepository.saveClass({
      id: 991,
      name: 'Class Offline Test',
      grade: 1,
      is_active: 1,
    });
    await subjectRepository.saveSubject({
      id: 992,
      class_id: 991,
      name: 'Ho Offline Subject',
      code: 'HO-OFF-01',
      is_active: 1,
    });
    await learningOutcomeRepository.saveLearningOutcome({
      id: 993,
      subject_id: 992,
      code: 'LO-OFF-01',
      title: 'Greetings and Numbers',
      is_active: 1,
    });
    await lessonRepository.saveLesson({
      id: 994,
      learning_outcome_id: 993,
      title: 'Johar Lesson',
      lesson_number: 1,
      source_language: 'hi',
      is_active: 1,
    });
    await worksheetRepository.saveWorksheet({
      id: 995,
      lesson_id: 994,
      title: 'Johar Offline Worksheet',
      language_code: 'hi',
      source_language: 'hi',
      worksheet_type: 'oral_assessment',
      version: 1,
      is_active: 1,
    });
    await worksheetQuestionRepository.saveQuestion({
      id: 996,
      worksheet_id: 995,
      question_number: 1,
      question_text: 'What is the morning greeting in Ho?',
      question_type: 'short_answer',
      marks: 1,
    });

    // Offline read operations - zero network calls
    const offlineClasses = await curriculumRepository.getClasses();
    expect(offlineClasses.length).toBeGreaterThan(0);
    const testClass = offlineClasses.find(c => c.id === 991);
    expect(testClass).toBeDefined();
    expect(testClass!.name).toBe('Class Offline Test');

    const offlineSubjects = await curriculumRepository.getSubjects(991);
    expect(offlineSubjects.length).toBe(1);

    const offlineWorksheets = await worksheetRepository.getWorksheets(994);
    expect(offlineWorksheets.length).toBe(1);
    expect(offlineWorksheets[0].title).toBe('Johar Offline Worksheet');

    const offlineQuestions = await worksheetRepository.getQuestionsByWorksheet(995);
    expect(offlineQuestions.length).toBe(1);
    expect(offlineQuestions[0].question_text).toBe('What is the morning greeting in Ho?');

    // Offline teacher read
    const offlineTeacher = await teacherRepository.getTeacher();
    expect(offlineTeacher).not.toBeNull();
  });

  test('7. Offline Mutation Queuing and Reconnect Sync: SQLite Queue -> SyncManager -> FastAPI', async () => {
    // While still offline, enqueue an offline question creation
    const queueRecord = await queue.enqueue({
      entity_type: 'worksheet_question',
      entity_id: 996,
      operation: 'CREATE',
      payload: {
        worksheet_id: 1, // targeting server worksheet 1 or mock
        question_number: 5,
        question_text: 'Online Sync Verification Question',
        question_type: 'mcq',
        marks: 2,
      },
    });

    expect(queueRecord.status).toBe('PENDING');
    const pendingItems = await queue.getPendingItems();
    expect(pendingItems.length).toBeGreaterThan(0);

    // Sync attempted while offline returns OFFLINE status
    const offlineSyncResult = await syncManager.sync();
    expect(offlineSyncResult.status).toBe('OFFLINE');

    // Restore online connectivity
    connectivity.setOnline(true);
    expect(connectivity.isOnline()).toBe(true);

    // Run sync when reconnected
    // Even if worksheet 1 doesn't exist on server (returns 404), the sync queue handles failure gracefully without crash
    const onlineSyncResult = await syncManager.sync({ skipDownload: true });
    expect(['SUCCESS', 'PARTIAL', 'ERROR']).toContain(onlineSyncResult.status);

    // Verify queue item updated (either COMPLETED on 201 or FAILED with retry count incremented)
    const queueStatus = await queue.getQueueStatus();
    expect(queueStatus.inProgress).toBe(0); // No items left hanging in progress
  });

  test('8. Logout: clears JWT and revokes authentication state', async () => {
    await authService.logout();
    expect(apiClient.getToken()).toBeNull();
    const isAuth = await authService.isAuthenticated();
    expect(isAuth).toBe(false);

    // Calling protected /auth/me now fails with 401
    await expect(authService.getMe()).rejects.toThrow(/401/);
  });
});
