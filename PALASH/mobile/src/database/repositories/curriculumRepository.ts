/**
 * PALASH Curriculum Local Repository
 * Pure local SQLite data access for Classes, Subjects, Learning Outcomes,
 * Lessons, Activities, and Assessments.
 */

import { getDatabase } from '../db';
import {
  CurriculumClassRecord,
  SubjectRecord,
  LearningOutcomeRecord,
  LessonRecord,
  ActivityRecord,
  AssessmentRecord,
  LanguageRecord,
  LessonTranslationRecord,
  ActivityTranslationRecord,
  AssessmentTranslationRecord,
} from '../types/database';

export const curriculumRepository = {
  /**
   * Retrieves all active curriculum classes ordered by grade.
   */
  async getClasses(): Promise<CurriculumClassRecord[]> {
    const db = getDatabase();
    const res = await db.execute(
      'SELECT * FROM curriculum_classes WHERE is_active = 1 ORDER BY grade ASC, name ASC;'
    );
    return res.rows as CurriculumClassRecord[];
  },

  /**
   * Saves or updates a curriculum class in SQLite.
   */
  async saveClass(item: CurriculumClassRecord): Promise<void> {
    const db = getDatabase();
    await db.execute(
      `INSERT INTO curriculum_classes (id, name, grade, description, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, COALESCE(?, datetime('now')), COALESCE(?, datetime('now')))
       ON CONFLICT(id) DO UPDATE SET
         name = excluded.name,
         grade = excluded.grade,
         description = excluded.description,
         is_active = excluded.is_active,
         updated_at = datetime('now');`,
      [
        item.id,
        item.name,
        item.grade,
        item.description ?? null,
        item.is_active ?? 1,
        item.created_at ?? null,
        item.updated_at ?? null,
      ]
    );
  },

  /**
   * Retrieves all active subjects for a given class.
   */
  async getSubjects(classId: number): Promise<SubjectRecord[]> {
    const db = getDatabase();
    const res = await db.execute(
      'SELECT * FROM subjects WHERE class_id = ? AND is_active = 1 ORDER BY name ASC;',
      [classId]
    );
    return res.rows as SubjectRecord[];
  },

  /**
   * Alias for getSubjects to match domain naming.
   */
  async getSubjectsByClass(classId: number): Promise<SubjectRecord[]> {
    return curriculumRepository.getSubjects(classId);
  },

  /**
   * Saves or updates a subject in SQLite.
   */
  async saveSubject(item: SubjectRecord): Promise<void> {
    const db = getDatabase();
    await db.execute(
      `INSERT INTO subjects (id, class_id, name, code, description, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, COALESCE(?, datetime('now')), COALESCE(?, datetime('now')))
       ON CONFLICT(id) DO UPDATE SET
         class_id = excluded.class_id,
         name = excluded.name,
         code = excluded.code,
         description = excluded.description,
         is_active = excluded.is_active,
         updated_at = datetime('now');`,
      [
        item.id,
        item.class_id,
        item.name,
        item.code,
        item.description ?? null,
        item.is_active ?? 1,
        item.created_at ?? null,
        item.updated_at ?? null,
      ]
    );
  },

  /**
   * Retrieves all active learning outcomes for a subject.
   */
  async getLearningOutcomes(subjectId: number): Promise<LearningOutcomeRecord[]> {
    const db = getDatabase();
    const res = await db.execute(
      'SELECT * FROM learning_outcomes WHERE subject_id = ? AND is_active = 1 ORDER BY code ASC;',
      [subjectId]
    );
    return res.rows as LearningOutcomeRecord[];
  },

  /**
   * Alias for getLearningOutcomes to match domain naming.
   */
  async getLearningOutcomesBySubject(subjectId: number): Promise<LearningOutcomeRecord[]> {
    return curriculumRepository.getLearningOutcomes(subjectId);
  },

  /**
   * Saves or updates a learning outcome in SQLite.
   */
  async saveLearningOutcome(item: LearningOutcomeRecord): Promise<void> {
    const db = getDatabase();
    await db.execute(
      `INSERT INTO learning_outcomes (id, subject_id, code, title, description, nipun_domain, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, COALESCE(?, datetime('now')), COALESCE(?, datetime('now')))
       ON CONFLICT(id) DO UPDATE SET
         subject_id = excluded.subject_id,
         code = excluded.code,
         title = excluded.title,
         description = excluded.description,
         nipun_domain = excluded.nipun_domain,
         is_active = excluded.is_active,
         updated_at = datetime('now');`,
      [
        item.id,
        item.subject_id,
        item.code,
        item.title,
        item.description ?? null,
        item.nipun_domain ?? null,
        item.is_active ?? 1,
        item.created_at ?? null,
        item.updated_at ?? null,
      ]
    );
  },

  /**
   * Retrieves all active lessons for a learning outcome.
   */
  async getLessons(outcomeId: number): Promise<LessonRecord[]> {
    const db = getDatabase();
    const res = await db.execute(
      'SELECT * FROM lessons WHERE learning_outcome_id = ? AND is_active = 1 ORDER BY lesson_number ASC;',
      [outcomeId]
    );
    return res.rows as LessonRecord[];
  },

  /**
   * Alias for getLessons to match domain naming.
   */
  async getLessonsByOutcome(outcomeId: number): Promise<LessonRecord[]> {
    return curriculumRepository.getLessons(outcomeId);
  },

  /**
   * Retrieves a single lesson by ID.
   */
  async getLessonById(lessonId: number): Promise<LessonRecord | null> {
    const db = getDatabase();
    const res = await db.execute('SELECT * FROM lessons WHERE id = ? LIMIT 1;', [lessonId]);
    if (res.rows.length === 0) {
      return null;
    }
    return res.rows[0] as LessonRecord;
  },

  /**
   * Alias for getLessonById.
   */
  async getLesson(lessonId: number): Promise<LessonRecord | null> {
    return curriculumRepository.getLessonById(lessonId);
  },

  /**
   * Saves or updates a lesson in SQLite.
   */
  async saveLesson(item: LessonRecord): Promise<void> {
    const db = getDatabase();
    await db.execute(
      `INSERT INTO lessons (
        id, learning_outcome_id, title, lesson_number, source_language,
        duration_minutes, teacher_script, learning_objective, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, datetime('now')), COALESCE(?, datetime('now')))
      ON CONFLICT(id) DO UPDATE SET
        learning_outcome_id = excluded.learning_outcome_id,
        title = excluded.title,
        lesson_number = excluded.lesson_number,
        source_language = excluded.source_language,
        duration_minutes = excluded.duration_minutes,
        teacher_script = excluded.teacher_script,
        learning_objective = excluded.learning_objective,
        is_active = excluded.is_active,
        updated_at = datetime('now');`,
      [
        item.id,
        item.learning_outcome_id,
        item.title,
        item.lesson_number,
        item.source_language || 'hi',
        item.duration_minutes ?? 30,
        item.teacher_script ?? null,
        item.learning_objective ?? null,
        item.is_active ?? 1,
        item.created_at ?? null,
        item.updated_at ?? null,
      ]
    );
  },

  /**
   * Retrieves all active activities for a lesson ordered by sequence.
   */
  async getActivities(lessonId: number): Promise<ActivityRecord[]> {
    const db = getDatabase();
    const res = await db.execute(
      'SELECT * FROM activities WHERE lesson_id = ? AND is_active = 1 ORDER BY sequence_order ASC;',
      [lessonId]
    );
    return res.rows as ActivityRecord[];
  },

  /**
   * Alias for getActivities to match domain naming.
   */
  async getActivitiesByLesson(lessonId: number): Promise<ActivityRecord[]> {
    return curriculumRepository.getActivities(lessonId);
  },

  /**
   * Saves or updates an activity in SQLite.
   */
  async saveActivity(item: ActivityRecord): Promise<void> {
    const db = getDatabase();
    await db.execute(
      `INSERT INTO activities (
        id, lesson_id, title, activity_type, instructions, sequence_order,
        materials, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, datetime('now')), COALESCE(?, datetime('now')))
      ON CONFLICT(id) DO UPDATE SET
        lesson_id = excluded.lesson_id,
        title = excluded.title,
        activity_type = excluded.activity_type,
        instructions = excluded.instructions,
        sequence_order = excluded.sequence_order,
        materials = excluded.materials,
        is_active = excluded.is_active,
        updated_at = datetime('now');`,
      [
        item.id,
        item.lesson_id,
        item.title,
        item.activity_type,
        item.instructions ?? null,
        item.sequence_order ?? 1,
        item.materials ?? null,
        item.is_active ?? 1,
        item.created_at ?? null,
        item.updated_at ?? null,
      ]
    );
  },

  /**
   * Retrieves all active assessments for a lesson ordered by sequence.
   */
  async getAssessments(lessonId: number): Promise<AssessmentRecord[]> {
    const db = getDatabase();
    const res = await db.execute(
      'SELECT * FROM assessments WHERE lesson_id = ? AND is_active = 1 ORDER BY sequence_order ASC;',
      [lessonId]
    );
    return res.rows as AssessmentRecord[];
  },

  /**
   * Alias for getAssessments to match domain naming.
   */
  async getAssessmentsByLesson(lessonId: number): Promise<AssessmentRecord[]> {
    return curriculumRepository.getAssessments(lessonId);
  },

  /**
   * Saves or updates an assessment in SQLite.
   */
  async saveAssessment(item: AssessmentRecord): Promise<void> {
    const db = getDatabase();
    await db.execute(
      `INSERT INTO assessments (
        id, lesson_id, title, prompt, assessment_type, sequence_order,
        expected_response, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, datetime('now')), COALESCE(?, datetime('now')))
      ON CONFLICT(id) DO UPDATE SET
        lesson_id = excluded.lesson_id,
        title = excluded.title,
        prompt = excluded.prompt,
        assessment_type = excluded.assessment_type,
        sequence_order = excluded.sequence_order,
        expected_response = excluded.expected_response,
        is_active = excluded.is_active,
        updated_at = datetime('now');`,
      [
        item.id,
        item.lesson_id,
        item.title,
        item.prompt,
        item.assessment_type,
        item.sequence_order ?? 1,
        item.expected_response ?? null,
        item.is_active ?? 1,
        item.created_at ?? null,
        item.updated_at ?? null,
      ]
    );
  },

  /**
   * Counts total active lessons in the curriculum.
   */
  async countLessons(): Promise<number> {
    const db = getDatabase();
    const res = await db.execute('SELECT COUNT(*) as total FROM lessons WHERE is_active = 1;');
    return (res.rows[0] as { total?: number })?.total || 0;
  },

  /**
   * Counts total active subjects in the curriculum.
   */
  async countSubjects(): Promise<number> {
    const db = getDatabase();
    const res = await db.execute('SELECT COUNT(*) as total FROM subjects WHERE is_active = 1;');
    return (res.rows[0] as { total?: number })?.total || 0;
  },

  // ==========================================
  // STAGE 2.12 MULTILINGUAL CURRICULUM METHODS
  // ==========================================

  /**
   * Retrieves all supported active languages.
   */
  async getLanguages(): Promise<LanguageRecord[]> {
    const db = getDatabase();
    const res = await db.execute('SELECT * FROM languages WHERE is_active = 1 ORDER BY code ASC;');
    return res.rows as LanguageRecord[];
  },

  /**
   * Saves or updates a supported language in SQLite.
   */
  async saveLanguage(item: LanguageRecord): Promise<void> {
    const db = getDatabase();
    await db.execute(
      `INSERT INTO languages (code, name, native_name, script, is_active, direction, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, COALESCE(?, datetime('now')), COALESCE(?, datetime('now')))
       ON CONFLICT(code) DO UPDATE SET
         name = excluded.name,
         native_name = excluded.native_name,
         script = excluded.script,
         is_active = excluded.is_active,
         direction = excluded.direction,
         updated_at = datetime('now');`,
      [
        item.code,
        item.name,
        item.native_name,
        item.script,
        item.is_active ?? 1,
        item.direction ?? 'ltr',
        item.created_at ?? null,
        item.updated_at ?? null,
      ]
    );
  },

  /**
   * Retrieves translations for a lesson, optionally filtered by language_code.
   */
  async getLessonTranslations(lessonId: number, languageCode?: string): Promise<LessonTranslationRecord[]> {
    const db = getDatabase();
    if (languageCode) {
      const res = await db.execute(
        `SELECT * FROM lesson_translations 
         WHERE lesson_id = ? AND language_code = ? AND is_active = 1 
         ORDER BY version DESC;`,
        [lessonId, languageCode.toLowerCase().trim()]
      );
      return res.rows as LessonTranslationRecord[];
    }
    const res = await db.execute(
      `SELECT * FROM lesson_translations 
       WHERE lesson_id = ? AND is_active = 1 
       ORDER BY language_code ASC, version DESC;`,
      [lessonId]
    );
    return res.rows as LessonTranslationRecord[];
  },

  /**
   * Retrieves the latest active translation for a lesson in a specific language.
   */
  async getLessonTranslation(lessonId: number, languageCode: string): Promise<LessonTranslationRecord | null> {
    const db = getDatabase();
    const res = await db.execute(
      `SELECT * FROM lesson_translations 
       WHERE lesson_id = ? AND language_code = ? AND is_active = 1 
       ORDER BY version DESC LIMIT 1;`,
      [lessonId, languageCode.toLowerCase().trim()]
    );
    return (res.rows[0] as LessonTranslationRecord) || null;
  },

  /**
   * Saves or updates a lesson translation in SQLite.
   */
  async saveLessonTranslation(item: LessonTranslationRecord): Promise<void> {
    const db = getDatabase();
    await db.execute(
      `INSERT INTO lesson_translations (
        id, lesson_id, language_code, translated_title, translated_script,
        translated_objective, translated_content, audio_path, version, is_active,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, datetime('now')), COALESCE(?, datetime('now')))
      ON CONFLICT(lesson_id, language_code, version) DO UPDATE SET
        translated_title = excluded.translated_title,
        translated_script = excluded.translated_script,
        translated_objective = excluded.translated_objective,
        translated_content = excluded.translated_content,
        audio_path = excluded.audio_path,
        is_active = excluded.is_active,
        updated_at = datetime('now');`,
      [
        item.id,
        item.lesson_id,
        item.language_code.toLowerCase().trim(),
        item.translated_title,
        item.translated_script ?? null,
        item.translated_objective ?? null,
        item.translated_content ?? null,
        item.audio_path ?? null,
        item.version ?? 1,
        item.is_active ?? 1,
        item.created_at ?? null,
        item.updated_at ?? null,
      ]
    );
  },

  /**
   * Retrieves translations for an activity, optionally filtered by language_code.
   */
  async getActivityTranslations(activityId: number, languageCode?: string): Promise<ActivityTranslationRecord[]> {
    const db = getDatabase();
    if (languageCode) {
      const res = await db.execute(
        `SELECT * FROM activity_translations 
         WHERE activity_id = ? AND language_code = ? AND is_active = 1 
         ORDER BY version DESC;`,
        [activityId, languageCode.toLowerCase().trim()]
      );
      return res.rows as ActivityTranslationRecord[];
    }
    const res = await db.execute(
      `SELECT * FROM activity_translations 
       WHERE activity_id = ? AND is_active = 1 
       ORDER BY language_code ASC, version DESC;`,
      [activityId]
    );
    return res.rows as ActivityTranslationRecord[];
  },

  /**
   * Saves or updates an activity translation in SQLite.
   */
  async saveActivityTranslation(item: ActivityTranslationRecord): Promise<void> {
    const db = getDatabase();
    await db.execute(
      `INSERT INTO activity_translations (
        id, activity_id, language_code, translated_title, translated_instructions,
        audio_path, version, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, datetime('now')), COALESCE(?, datetime('now')))
      ON CONFLICT(activity_id, language_code, version) DO UPDATE SET
        translated_title = excluded.translated_title,
        translated_instructions = excluded.translated_instructions,
        audio_path = excluded.audio_path,
        is_active = excluded.is_active,
        updated_at = datetime('now');`,
      [
        item.id,
        item.activity_id,
        item.language_code.toLowerCase().trim(),
        item.translated_title,
        item.translated_instructions ?? null,
        item.audio_path ?? null,
        item.version ?? 1,
        item.is_active ?? 1,
        item.created_at ?? null,
        item.updated_at ?? null,
      ]
    );
  },

  /**
   * Retrieves translations for an assessment, optionally filtered by language_code.
   */
  async getAssessmentTranslations(assessmentId: number, languageCode?: string): Promise<AssessmentTranslationRecord[]> {
    const db = getDatabase();
    if (languageCode) {
      const res = await db.execute(
        `SELECT * FROM assessment_translations 
         WHERE assessment_id = ? AND language_code = ? AND is_active = 1 
         ORDER BY version DESC;`,
        [assessmentId, languageCode.toLowerCase().trim()]
      );
      return res.rows as AssessmentTranslationRecord[];
    }
    const res = await db.execute(
      `SELECT * FROM assessment_translations 
       WHERE assessment_id = ? AND is_active = 1 
       ORDER BY language_code ASC, version DESC;`,
      [assessmentId]
    );
    return res.rows as AssessmentTranslationRecord[];
  },

  /**
   * Saves or updates an assessment translation in SQLite.
   */
  async saveAssessmentTranslation(item: AssessmentTranslationRecord): Promise<void> {
    const db = getDatabase();
    await db.execute(
      `INSERT INTO assessment_translations (
        id, assessment_id, language_code, translated_title, translated_prompt,
        translated_expected_response, audio_path, version, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, datetime('now')), COALESCE(?, datetime('now')))
      ON CONFLICT(assessment_id, language_code, version) DO UPDATE SET
        translated_title = excluded.translated_title,
        translated_prompt = excluded.translated_prompt,
        translated_expected_response = excluded.translated_expected_response,
        audio_path = excluded.audio_path,
        is_active = excluded.is_active,
        updated_at = datetime('now');`,
      [
        item.id,
        item.assessment_id,
        item.language_code.toLowerCase().trim(),
        item.translated_title,
        item.translated_prompt,
        item.translated_expected_response ?? null,
        item.audio_path ?? null,
        item.version ?? 1,
        item.is_active ?? 1,
        item.created_at ?? null,
        item.updated_at ?? null,
      ]
    );
  },
};

/**
 * Granular repositories for specific curriculum domain entities
 */
export const curriculumClassRepository = {
  getClasses: curriculumRepository.getClasses,
  saveClass: curriculumRepository.saveClass,
};

export const classRepository = curriculumClassRepository;


export const subjectRepository = {
  getSubjectsByClass: curriculumRepository.getSubjectsByClass,
  getSubjects: curriculumRepository.getSubjects,
  saveSubject: curriculumRepository.saveSubject,
  countSubjects: curriculumRepository.countSubjects,
};

export const learningOutcomeRepository = {
  getLearningOutcomesBySubject: curriculumRepository.getLearningOutcomesBySubject,
  getLearningOutcomes: curriculumRepository.getLearningOutcomes,
  saveLearningOutcome: curriculumRepository.saveLearningOutcome,
};

export const lessonRepository = {
  getLessonsByOutcome: curriculumRepository.getLessonsByOutcome,
  getLessons: curriculumRepository.getLessons,
  getLesson: curriculumRepository.getLesson,
  getLessonById: curriculumRepository.getLessonById,
  saveLesson: curriculumRepository.saveLesson,
  countLessons: curriculumRepository.countLessons,
};

export const activityRepository = {
  getActivitiesByLesson: curriculumRepository.getActivitiesByLesson,
  getActivities: curriculumRepository.getActivities,
  saveActivity: curriculumRepository.saveActivity,
};

export const assessmentRepository = {
  getAssessmentsByLesson: curriculumRepository.getAssessmentsByLesson,
  getAssessments: curriculumRepository.getAssessments,
  saveAssessment: curriculumRepository.saveAssessment,
};

export const translationRepository = {
  getLanguages: curriculumRepository.getLanguages,
  saveLanguage: curriculumRepository.saveLanguage,
  getLessonTranslations: curriculumRepository.getLessonTranslations,
  getLessonTranslation: curriculumRepository.getLessonTranslation,
  saveLessonTranslation: curriculumRepository.saveLessonTranslation,
  getActivityTranslations: curriculumRepository.getActivityTranslations,
  saveActivityTranslation: curriculumRepository.saveActivityTranslation,
  getAssessmentTranslations: curriculumRepository.getAssessmentTranslations,
  saveAssessmentTranslation: curriculumRepository.saveAssessmentTranslation,
};

