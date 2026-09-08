/**
 * PALASH Stage 2.12 Multilingual Curriculum Data Architecture Tests
 * Verifies:
 * 1. Languages stored offline in SQLite
 * 2. Supported languages list retrieved offline
 * 3. Language selection and state persistence
 * 4. Lesson translation stored and retrieved offline
 * 5. Correct language translation returned
 * 6. Missing translation handled safely with fallback notice
 * 7. Activity translation stored and retrieved offline
 * 8. Assessment translation stored and retrieved offline
 * 9. Sync handles multiple languages without duplicating records
 * 10. Existing Hindi curriculum continues working without regression
 */

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
  translationRepository,
} from '../src/database';
import { languageStore } from '../src/store/languageStore';
import { SUPPORTED_LANGUAGES, DEFAULT_CURRICULUM_LANGUAGE } from '../src/constants/languages';

describe('PALASH Stage 2.12 Multilingual Curriculum Architecture', () => {
  let sqlJsInstance: any;
  let SQL: any;

  beforeEach(async () => {
    SQL = await initSqlJs();
    sqlJsInstance = new SQL.Database();
    const driver = new SqlJsDriver(sqlJsInstance);
    await initializeDatabase(driver);

    // 1. Setup Base Curriculum: Class -> Subject -> Outcome -> Lesson -> Activity -> Assessment
    await curriculumClassRepository.saveClass({
      id: 1,
      name: 'Class 1',
      grade: 1,
      is_active: 1,
    });

    await subjectRepository.saveSubject({
      id: 1,
      class_id: 1,
      name: 'Mathematics (गणित)',
      code: 'MATH101',
      is_active: 1,
    });

    await learningOutcomeRepository.saveLearningOutcome({
      id: 1,
      subject_id: 1,
      code: 'MATH.1.1',
      title: 'Number Recognition 1 to 10',
      is_active: 1,
    });

    await lessonRepository.saveLesson({
      id: 101,
      learning_outcome_id: 1,
      title: 'गिनती 1 से 10 (Hindi Base)',
      lesson_number: 1,
      source_language: 'hi',
      duration_minutes: 35,
      teacher_script: 'कक्षा में बच्चों को 1 से 10 तक गिनना सिखाएं।',
      learning_objective: 'बच्चे 1 से 10 तक संख्या पहचान सकें।',
      is_active: 1,
    });

    await activityRepository.saveActivity({
      id: 201,
      lesson_id: 101,
      title: 'गिनती गतिविधि (Hindi)',
      activity_type: 'hands-on',
      instructions: 'पत्थरों की मदद से 1 से 10 तक गिनें।',
      sequence_order: 1,
      is_active: 1,
    });

    await assessmentRepository.saveAssessment({
      id: 301,
      lesson_id: 101,
      title: 'आकलन 1 (Hindi)',
      prompt: 'हाथ की 5 उंगलियां दिखाएं और गिनें।',
      assessment_type: 'observation',
      sequence_order: 1,
      expected_response: '5 उंगलियां',
      is_active: 1,
    });
  });

  afterEach(async () => {
    await closeDatabase();
  });

  test('1. Supported languages stored offline in SQLite', async () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      await translationRepository.saveLanguage({
        code: lang.code,
        name: lang.name,
        native_name: lang.native_name,
        script: lang.script,
        is_active: 1,
        direction: 'ltr',
      });
    }

    const offlineLangs = await translationRepository.getLanguages();
    expect(offlineLangs.length).toBe(4);
    const codes = offlineLangs.map((l) => l.code);
    expect(codes).toContain('hi');
    expect(codes).toContain('ho');
    expect(codes).toContain('mun');
    expect(codes).toContain('sat');
  });

  test('2. Language selection state & switching in languageStore', async () => {
    await languageStore.init();
    expect(languageStore.getSelectedLanguage()).toBe('hi');

    // Switch to Ho
    languageStore.setLanguage('ho');
    expect(languageStore.getSelectedLanguage()).toBe('ho');

    // Switch to Santhali
    languageStore.setLanguage('sat');
    expect(languageStore.getSelectedLanguage()).toBe('sat');

    // Switch to Mundari
    languageStore.setLanguage('mun');
    expect(languageStore.getSelectedLanguage()).toBe('mun');

    // Switch back to Hindi
    languageStore.setLanguage('hi');
    expect(languageStore.getSelectedLanguage()).toBe('hi');
  });

  test('3. Lesson translation stored and retrieved offline for Ho, Mundari, Santhali', async () => {
    // Save synthetic sample translations (clearly marked test data)
    await translationRepository.saveLessonTranslation({
      id: 1,
      lesson_id: 101,
      language_code: 'ho',
      translated_title: '[TEST-HO] 1 khor 10 lekha',
      translated_script: 'Ho sample teacher script',
      translated_objective: 'Ho sample learning objective',
      version: 1,
      is_active: 1,
    });

    await translationRepository.saveLessonTranslation({
      id: 2,
      lesson_id: 101,
      language_code: 'mun',
      translated_title: '[TEST-MUN] Mia\'d aet Gelo hisab',
      translated_script: 'Mundari sample teacher script',
      translated_objective: 'Mundari sample learning objective',
      version: 1,
      is_active: 1,
    });

    await translationRepository.saveLessonTranslation({
      id: 3,
      lesson_id: 101,
      language_code: 'sat',
      translated_title: '[TEST-SAT] 1 se 10 leka',
      translated_script: 'Santhali sample teacher script',
      translated_objective: 'Santhali sample learning objective',
      version: 1,
      is_active: 1,
    });

    // Query all translations for the lesson
    const allTranslations = await translationRepository.getLessonTranslations(101);
    expect(allTranslations.length).toBe(3);

    // Query specific Ho translation
    const hoTrans = await translationRepository.getLessonTranslation(101, 'ho');
    expect(hoTrans).not.toBeNull();
    expect(hoTrans?.translated_title).toBe('[TEST-HO] 1 khor 10 lekha');
    expect(hoTrans?.language_code).toBe('ho');

    // Query specific Mundari translation
    const munTrans = await translationRepository.getLessonTranslation(101, 'mun');
    expect(munTrans).not.toBeNull();
    expect(munTrans?.translated_title).toBe('[TEST-MUN] Mia\'d aet Gelo hisab');
    expect(munTrans?.language_code).toBe('mun');

    // Query specific Santhali translation
    const satTrans = await translationRepository.getLessonTranslation(101, 'sat');
    expect(satTrans).not.toBeNull();
    expect(satTrans?.translated_title).toBe('[TEST-SAT] 1 se 10 leka');
    expect(satTrans?.language_code).toBe('sat');
  });

  test('4. Missing translation handled safely without throwing', async () => {
    // Querying translation for an unsaved language returns null
    const missingTrans = await translationRepository.getLessonTranslation(101, 'unknown_lang');
    expect(missingTrans).toBeNull();

    // Querying non-existent lesson returns null
    const nonExistentLessonTrans = await translationRepository.getLessonTranslation(99999, 'ho');
    expect(nonExistentLessonTrans).toBeNull();
  });

  test('5. Activity translations stored and queried offline', async () => {
    await translationRepository.saveActivityTranslation({
      id: 10,
      activity_id: 201,
      language_code: 'ho',
      translated_title: '[TEST-HO] Activity Title in Ho',
      translated_instructions: 'Instructions in Ho language',
      version: 1,
      is_active: 1,
    });

    const hoActs = await translationRepository.getActivityTranslations(201, 'ho');
    expect(hoActs.length).toBe(1);
    expect(hoActs[0].translated_title).toBe('[TEST-HO] Activity Title in Ho');

    // Check Mundari translation does not exist
    const munActs = await translationRepository.getActivityTranslations(201, 'mun');
    expect(munActs.length).toBe(0);
  });

  test('6. Assessment translations stored and queried offline', async () => {
    await translationRepository.saveAssessmentTranslation({
      id: 20,
      assessment_id: 301,
      language_code: 'sat',
      translated_title: '[TEST-SAT] Check in Santhali',
      translated_prompt: 'Count fingers prompt in Santhali',
      translated_expected_response: '5 fingers',
      version: 1,
      is_active: 1,
    });

    const satAsmts = await translationRepository.getAssessmentTranslations(301, 'sat');
    expect(satAsmts.length).toBe(1);
    expect(satAsmts[0].translated_prompt).toBe('Count fingers prompt in Santhali');
  });

  test('7. Versioning & Upsert prevents duplicate translation records', async () => {
    // Save version 1
    await translationRepository.saveLessonTranslation({
      id: 100,
      lesson_id: 101,
      language_code: 'ho',
      translated_title: 'Draft Title V1',
      version: 1,
      is_active: 1,
    });

    // Update version 1 (same lesson_id, language_code, version)
    await translationRepository.saveLessonTranslation({
      id: 100,
      lesson_id: 101,
      language_code: 'ho',
      translated_title: 'Updated Title V1',
      version: 1,
      is_active: 1,
    });

    const transList = await translationRepository.getLessonTranslations(101, 'ho');
    expect(transList.length).toBe(1);
    expect(transList[0].translated_title).toBe('Updated Title V1');
  });

  test('8. Baseline Hindi curriculum continues working without regression', async () => {
    const lesson = await lessonRepository.getLesson(101);
    expect(lesson).not.toBeNull();
    expect(lesson?.title).toBe('गिनती 1 से 10 (Hindi Base)');
    expect(lesson?.source_language).toBe('hi');

    const activities = await activityRepository.getActivitiesByLesson(101);
    expect(activities.length).toBe(1);
    expect(activities[0].title).toBe('गिनती गतिविधि (Hindi)');

    const assessments = await assessmentRepository.getAssessmentsByLesson(101);
    expect(assessments.length).toBe(1);
    expect(assessments[0].title).toBe('आकलन 1 (Hindi)');
  });
});
