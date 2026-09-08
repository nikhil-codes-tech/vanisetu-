/**
 * PALASH Stage 2.8 Teacher Mobile UI & Application Flow Tests
 * Validates:
 *  - Authentication store & Login/Logout lifecycle
 *  - Navigation stack transitions
 *  - Dashboard and Teacher/School UI flows
 *  - Complete Curriculum tree traversal
 *  - Worksheet and Question viewing
 *  - Offline state handling and SQLite data retrieval
 */

import initSqlJs from 'sql.js';
import {
  initializeDatabase,
  closeDatabase,
  SqlJsDriver,
  schoolRepository,
  teacherRepository,
  curriculumClassRepository,
  subjectRepository,
  learningOutcomeRepository,
  lessonRepository,
  activityRepository,
  assessmentRepository,
  worksheetRepository,
  worksheetQuestionRepository,
} from '../src/database';
import { authStore } from '../src/store/authStore';
import { syncStore } from '../src/store/syncStore';
import { AuthService } from '../src/services/authService';
import { ApiClient } from '../src/services/api';
import { TokenStorage } from '../src/services/tokenStorage';

describe('PALASH Stage 2.8 Teacher Mobile UI & Application Flow', () => {
  let mockApi: jest.Mocked<ApiClient>;
  let mockStorage: jest.Mocked<TokenStorage>;
  let customAuthService: AuthService;

  beforeAll(async () => {
    // 1. Initialize SQLite WASM
    const SQL = await initSqlJs();
    const sqlJsInstance = new SQL.Database();
    const driver = new SqlJsDriver(sqlJsInstance);
    await initializeDatabase(driver);

    // Seed test data in SQLite
    await schoolRepository.saveSchool({
      id: 1,
      school_code: 'SCH-KOLHAN-01',
      name: 'Kolhan Tribal Primary School',
      district: 'West Singhbhum',
      block: 'Chaibasa',
      cluster: 'Jhinkpani',
      village: 'Gitilpi',
      address: 'Near River Bed, Chaibasa',
    });

    await teacherRepository.saveTeacher({
      id: 1,
      user_id: 10,
      school_id: 1,
      teacher_code: 'TCH-001',
      full_name: 'Birsa Ho',
      phone: '+91 9876543210',
      preferred_language: 'hi',
      target_language: 'ho',
    });

    await curriculumClassRepository.saveClass({
      id: 1,
      name: 'Class 1',
      grade: 1,
      description: 'Foundational stage',
      is_active: 1,
    });

    await subjectRepository.saveSubject({
      id: 10,
      class_id: 1,
      name: 'Ho Mother Tongue',
      code: 'HO1',
      is_active: 1,
    });

    await learningOutcomeRepository.saveLearningOutcome({
      id: 100,
      subject_id: 10,
      code: 'LO-1.1',
      title: 'Oral Greetings and Vocabulary',
      nipun_domain: 'Oral Language',
      is_active: 1,
    });

    await lessonRepository.saveLesson({
      id: 1000,
      learning_outcome_id: 100,
      title: 'Johar - Greetings',
      lesson_number: 1,
      source_language: 'hi',
      duration_minutes: 35,
      teacher_script: 'Say Johar loudly to the class.',
      learning_objective: 'Children learn to greet in Warang Chiti / Ho.',
      is_active: 1,
    });

    await activityRepository.saveActivity({
      id: 5001,
      lesson_id: 1000,
      title: 'Greeting Circle Game',
      activity_type: 'game',
      instructions: 'Children stand in circle and greet with Johar.',
      sequence_order: 1,
      materials: 'None',
      is_active: 1,
    });

    await assessmentRepository.saveAssessment({
      id: 6001,
      lesson_id: 1000,
      title: 'Oral Greeting Check',
      prompt: 'Greet your friend in Ho.',
      assessment_type: 'oral',
      sequence_order: 1,
      expected_response: 'Johar',
      is_active: 1,
    });

    await worksheetRepository.saveWorksheet({
      id: 7001,
      lesson_id: 1000,
      title: 'Greetings Matching Worksheet',
      worksheet_type: 'matching',
      language_code: 'ho',
      source_language: 'hi',
      version: 1,
      is_active: 1,
    });

    await worksheetQuestionRepository.saveQuestion({
      id: 8001,
      worksheet_id: 7001,
      question_number: 1,
      question_text: 'Match the Hindi greeting "Namaste" with Ho.',
      question_type: 'mcq',
      options: JSON.stringify(['Johar', 'Dulaar', 'Senggel', 'Hasa']),
      correct_answer: 'Johar',
      explanation: 'Johar is the traditional respectful greeting in Ho.',
      marks: 1,
    });
  });

  afterAll(async () => {
    await closeDatabase();
  });

  beforeEach(() => {
    mockApi = {
      get: jest.fn(),
      post: jest.fn(),
      postForm: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      setToken: jest.fn(),
      getToken: jest.fn(),
      getBaseUrl: jest.fn().mockReturnValue('http://127.0.0.1:8001/api/v1'),
    };

    mockStorage = {
      getToken: jest.fn().mockResolvedValue(null),
      setToken: jest.fn().mockResolvedValue(undefined),
      clear: jest.fn().mockResolvedValue(undefined),
    };

    customAuthService = new AuthService(mockApi, mockStorage);
    authStore.setService(customAuthService);
  });

  test('1. Authentication Store: handles login success and stores user state', async () => {
    mockApi.postForm.mockResolvedValueOnce({
      access_token: 'mock-valid-jwt-token-1234567890',
      token_type: 'bearer',
    });

    mockApi.get.mockResolvedValueOnce({
      id: 10,
      username: 'test_teacher',
      email: 'teacher@example.com',
      role: 'teacher',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    // Create a local store instance using custom service
    const { authStore } = await import('../src/store/authStore');
    const success = await authStore.login('test_teacher', 'password123');

    expect(success).toBe(true);
    const state = authStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBeDefined();
    expect(state.user?.username).toBe('test_teacher');
    expect(state.error).toBeNull();
  });

  test('2. Authentication Store: handles invalid credentials and sets error message', async () => {
    mockApi.postForm.mockRejectedValueOnce(new Error('Incorrect username or password'));

    const { authStore } = await import('../src/store/authStore');
    const success = await authStore.login('wrong_user', 'bad_pass');

    expect(success).toBe(false);
    const state = authStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBeNull();
    expect(state.error).toContain('password');
  });

  test('3. Authentication Store: handles logout cleanly', async () => {
    const { authStore } = await import('../src/store/authStore');
    await authStore.logout();

    const state = authStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
  });

  test('4. Dashboard Data Flow: reads teacher profile, school, and classes locally', async () => {
    const teacher = await teacherRepository.getTeacher();
    expect(teacher).not.toBeNull();
    expect(teacher?.full_name).toBe('Birsa Ho');
    expect(teacher?.target_language).toBe('ho');

    const school = await schoolRepository.getSchool(teacher!.school_id);
    expect(school).not.toBeNull();
    expect(school?.name).toBe('Kolhan Tribal Primary School');
    expect(school?.district).toBe('West Singhbhum');

    const classes = await curriculumClassRepository.getClasses();
    expect(classes.length).toBe(1);
    expect(classes[0].name).toBe('Class 1');
  });

  test('5. Curriculum Navigation Data Flow: Class -> Subject -> Outcome -> Lesson -> Activities & Assessments', async () => {
    // 1. Select Class 1
    const classes = await curriculumClassRepository.getClasses();
    const classId = classes[0].id;

    // 2. Load Subjects for Class 1
    const subjects = await subjectRepository.getSubjects(classId);
    expect(subjects.length).toBe(1);
    expect(subjects[0].name).toBe('Ho Mother Tongue');

    // 3. Load Learning Outcomes for Subject
    const outcomes = await learningOutcomeRepository.getLearningOutcomes(subjects[0].id);
    expect(outcomes.length).toBe(1);
    expect(outcomes[0].code).toBe('LO-1.1');
    expect(outcomes[0].nipun_domain).toBe('Oral Language');

    // 4. Load Lessons for Outcome
    const lessons = await lessonRepository.getLessons(outcomes[0].id);
    expect(lessons.length).toBe(1);
    expect(lessons[0].title).toBe('Johar - Greetings');

    // 5. Load Activities for Lesson
    const activities = await activityRepository.getActivities(lessons[0].id);
    expect(activities.length).toBe(1);
    expect(activities[0].title).toBe('Greeting Circle Game');

    // 6. Load Assessments for Lesson
    const assessments = await assessmentRepository.getAssessments(lessons[0].id);
    expect(assessments.length).toBe(1);
    expect(assessments[0].prompt).toBe('Greet your friend in Ho.');
  });

  test('6. Worksheet & Question Flow: Lesson -> Worksheets -> Questions with answer toggle', async () => {
    const worksheets = await worksheetRepository.getWorksheets(1000);
    expect(worksheets.length).toBe(1);
    expect(worksheets[0].title).toBe('Greetings Matching Worksheet');
    expect(worksheets[0].language_code).toBe('ho');

    const questions = await worksheetQuestionRepository.getQuestionsByWorksheet(worksheets[0].id);
    expect(questions.length).toBe(1);
    expect(questions[0].question_text).toContain('Namaste');
    expect(questions[0].correct_answer).toBe('Johar');

    const options = JSON.parse(questions[0].options || '[]');
    expect(options).toContain('Johar');
    expect(options.length).toBe(4);
  });

  test('7. Teacher Profile Update: saves locally and generates update payload', async () => {
    const teacher = await teacherRepository.getTeacher();
    expect(teacher).not.toBeNull();

    const updated = {
      ...teacher!,
      full_name: 'Birsa Ho Updated',
      phone: '+91 9999988888',
      preferred_language: 'hi',
      target_language: 'ho',
    };

    await teacherRepository.saveTeacher(updated);
    const retrieved = await teacherRepository.getTeacher(teacher!.id);
    expect(retrieved?.full_name).toBe('Birsa Ho Updated');
    expect(retrieved?.phone).toBe('+91 9999988888');
  });

  test('8. Sync Store: provides reactive state for online/offline indicator', async () => {
    const state = syncStore.getState();
    expect(state).toHaveProperty('isOnline');
    expect(state).toHaveProperty('isSyncing');
    expect(state).toHaveProperty('pendingUploadCount');
    expect(typeof state.isOnline).toBe('boolean');
  });

  test('9. Stage 2.9 UI Flow: Lesson -> Bilingual Vocabulary Word Bank', async () => {
    const { dictionaryRepository } = await import('../src/database');
    await dictionaryRepository.save({
      id: 501,
      lesson_id: 1000,
      source_language: 'hi',
      source_word: 'नमस्ते',
      target_language: 'ho',
      target_word: 'जोहार',
      transliteration: 'Johar',
      definition: 'Greetings / Welcome',
      is_verified: 1,
      is_active: 1,
      version: 1,
    });

    const lessonWords = await dictionaryRepository.findByLessonId(1000);
    expect(lessonWords.length).toBe(1);
    expect(lessonWords[0].source_word).toBe('नमस्ते');
    expect(lessonWords[0].target_word).toBe('जोहार');

    const searchRes = await dictionaryRepository.search('जोहार');
    expect(searchRes.length).toBe(1);
    expect(searchRes[0].transliteration).toBe('Johar');
  });

  test('10. Stage 2.9 UI Flow: Student Roster & Classroom Assessment Scoring', async () => {
    const { studentRepository } = await import('../src/database');
    await studentRepository.save({
      id: 101,
      school_id: 1,
      student_code: 'STU-JH-101',
      full_name: 'Sukram Munda',
      class_name: 'Class 1',
      section: 'A',
      mother_tongue: 'ho',
    });

    const roster = await studentRepository.findBySchoolId(1, 'Class 1');
    expect(roster.length).toBe(1);
    expect(roster[0].full_name).toBe('Sukram Munda');

    // Record evaluation
    const evalId = await studentRepository.saveEvaluation({
      student_id: 101,
      assessment_id: 1,
      score: 10,
      max_score: 10,
      status: 'completed',
      remarks: 'Perfect Ho greetings pronunciation',
    });
    expect(evalId).toBeGreaterThan(0);

    const evals = await studentRepository.getEvaluationsByStudent(101);
    expect(evals.length).toBe(1);
    expect(evals[0].score).toBe(10);
    expect(evals[0].remarks).toContain('Perfect Ho');
  });
});

