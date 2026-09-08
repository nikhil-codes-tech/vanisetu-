/**
 * PALASH Downstream Synchronization Service (Server -> SQLite)
 * Downloads curriculum hierarchy, teacher/school data, worksheets and questions,
 * strictly preserving foreign-key insertion order and transaction boundaries.
 */

import { ApiClient } from '../services/api';
import {
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
  dictionaryRepository,
  studentRepository,
  translationRepository,
} from '../database';
import {
  SchoolRecord,
  TeacherRecord,
  CurriculumClassRecord,
  SubjectRecord,
  LearningOutcomeRecord,
  LessonRecord,
  ActivityRecord,
  AssessmentRecord,
  WorksheetRecord,
  WorksheetQuestionRecord,
  DictionaryEntryRecord,
  StudentRecord,
} from '../database/types/database';

export interface DownloadSyncStats {
  schools: number;
  teachers: number;
  classes: number;
  subjects: number;
  learningOutcomes: number;
  lessons: number;
  activities: number;
  assessments: number;
  worksheets: number;
  questions: number;
  dictionary?: number;
  students?: number;
  languages?: number;
  translations?: number;
}

export class DownloadSynchronizer {
  private api: ApiClient;

  constructor(api: ApiClient) {
    this.api = api;
  }

  /**
   * Synchronizes teacher profile and school from backend /teachers/me.
   * Ensures School is saved BEFORE Teacher to maintain foreign key integrity.
   */
  async syncTeacherProfile(): Promise<{ teacher: TeacherRecord | null; school: SchoolRecord | null }> {
    try {
      const data = await this.api.get<any>('/teachers/me');
      if (!data) return { teacher: null, school: null };

      let schoolRecord: SchoolRecord | null = null;
      if (data.school) {
        schoolRecord = {
          id: data.school.id,
          school_code: data.school.school_code,
          name: data.school.name,
          district: data.school.district,
          block: data.school.block ?? null,
          cluster: data.school.cluster ?? null,
          village: data.school.village ?? null,
          address: data.school.address ?? null,
        };
        await schoolRepository.saveSchool(schoolRecord);
      }

      const teacherRecord: TeacherRecord = {
        id: data.id,
        user_id: data.user_id !== undefined && data.user_id !== null ? data.user_id : (data.id || 1),
        school_id: data.school_id,
        teacher_code: data.teacher_code,
        full_name: data.full_name,
        phone: data.phone ?? null,
        preferred_language: data.preferred_language || 'hi',
        target_language: data.target_language || 'ho',
      };
      await teacherRepository.saveTeacher(teacherRecord);

      return { teacher: teacherRecord, school: schoolRecord };
    } catch (err) {
      throw new Error(`Failed to sync teacher profile: ${(err as Error).message}`);
    }
  }

  /**
   * Synchronizes the complete Curriculum Hierarchy in strict foreign-key order:
   * 1. Classes
   * 2. Subjects
   * 3. Learning Outcomes
   * 4. Lessons
   * 5. Activities
   * 6. Assessments
   * 7. Worksheets
   * 8. Worksheet Questions
   */
  async syncCurriculumHierarchy(): Promise<DownloadSyncStats> {
    const stats: DownloadSyncStats = {
      schools: 0,
      teachers: 0,
      classes: 0,
      subjects: 0,
      learningOutcomes: 0,
      lessons: 0,
      activities: 0,
      assessments: 0,
      worksheets: 0,
      questions: 0,
    };

    // 0. Languages Registry (Stage 2.12)
    try {
      const languages = await this.api.get<any[]>('/curriculum/languages');
      if (Array.isArray(languages)) {
        for (const lang of languages) {
          await translationRepository.saveLanguage({
            code: lang.code,
            name: lang.name,
            native_name: lang.native_name,
            script: lang.script,
            is_active: lang.is_active ? 1 : 0,
            direction: lang.direction || 'ltr',
          });
          stats.languages = (stats.languages || 0) + 1;
        }
      }
    } catch {
      // Non-blocking language sync
    }

    // 1. Classes
    const classes = await this.api.get<any[]>('/curriculum/classes');
    if (!Array.isArray(classes)) return stats;

    for (const c of classes) {
      await curriculumClassRepository.saveClass({
        id: c.id,
        name: c.name,
        grade: c.grade,
        description: c.description ?? null,
        is_active: c.is_active ? 1 : 0,
      });
      stats.classes++;

      // 2. Subjects for this class
      try {
        const subjects = await this.api.get<any[]>(`/curriculum/classes/${c.id}/subjects`);
        if (Array.isArray(subjects)) {
          for (const s of subjects) {
            await subjectRepository.saveSubject({
              id: s.id,
              class_id: s.class_id,
              name: s.name,
              code: s.code,
              description: s.description ?? null,
              is_active: s.is_active ? 1 : 0,
            });
            stats.subjects++;

            // 3. Learning Outcomes for this subject
            const outcomes = await this.api.get<any[]>(`/curriculum/subjects/${s.id}/learning-outcomes`);
            if (Array.isArray(outcomes)) {
              for (const lo of outcomes) {
                await learningOutcomeRepository.saveLearningOutcome({
                  id: lo.id,
                  subject_id: lo.subject_id,
                  code: lo.code,
                  title: lo.title,
                  description: lo.description ?? null,
                  nipun_domain: lo.nipun_domain ?? null,
                  is_active: lo.is_active ? 1 : 0,
                });
                stats.learningOutcomes++;

                // 4. Lessons for this outcome
                const lessons = await this.api.get<any[]>(`/curriculum/learning-outcomes/${lo.id}/lessons`);
                if (Array.isArray(lessons)) {
                  for (const l of lessons) {
                    await lessonRepository.saveLesson({
                      id: l.id,
                      learning_outcome_id: l.learning_outcome_id,
                      title: l.title,
                      lesson_number: l.lesson_number,
                      source_language: l.source_language || 'hi',
                      duration_minutes: l.duration_minutes ?? 30,
                      teacher_script: l.teacher_script ?? null,
                      learning_objective: l.learning_objective ?? null,
                      is_active: l.is_active ? 1 : 0,
                    });
                    stats.lessons++;

                    // 5. Activities for lesson
                    const activities = await this.api.get<any[]>(`/curriculum/lessons/${l.id}/activities`);
                    if (Array.isArray(activities)) {
                      for (const a of activities) {
                        await activityRepository.saveActivity({
                          id: a.id,
                          lesson_id: a.lesson_id,
                          title: a.title,
                          activity_type: a.activity_type,
                          instructions: a.instructions ?? null,
                          sequence_order: a.sequence_order ?? 1,
                          materials: a.materials ?? null,
                          is_active: a.is_active ? 1 : 0,
                        });
                        stats.activities++;
                      }
                    }

                    // 6. Assessments for lesson
                    const assessments = await this.api.get<any[]>(`/curriculum/lessons/${l.id}/assessments`);
                    if (Array.isArray(assessments)) {
                      for (const asmt of assessments) {
                        await assessmentRepository.saveAssessment({
                          id: asmt.id,
                          lesson_id: asmt.lesson_id,
                          title: asmt.title,
                          prompt: asmt.prompt,
                          assessment_type: asmt.assessment_type,
                          sequence_order: asmt.sequence_order ?? 1,
                          expected_response: asmt.expected_response ?? null,
                          is_active: asmt.is_active ? 1 : 0,
                        });
                        stats.assessments++;
                      }
                    }

                    // 6b. Translations for lesson (Stage 2.12)
                    try {
                      const translations = await this.api.get<any[]>(`/curriculum/lessons/${l.id}/translations`);
                      if (Array.isArray(translations)) {
                        for (const trans of translations) {
                          await translationRepository.saveLessonTranslation({
                            id: trans.id,
                            lesson_id: trans.lesson_id,
                            language_code: trans.language_code,
                            translated_title: trans.translated_title,
                            translated_script: trans.translated_script ?? null,
                            translated_objective: trans.translated_objective ?? null,
                            translated_content: trans.translated_content ?? null,
                            audio_path: trans.audio_path ?? null,
                            version: trans.version ?? 1,
                            is_active: trans.is_active ? 1 : 0,
                          });
                          stats.translations = (stats.translations || 0) + 1;
                        }
                      }
                    } catch {
                      // Non-blocking translation sync
                    }

                    // 7. Worksheets for lesson
                    const worksheets = await this.api.get<any[]>(`/lessons/${l.id}/worksheets`);
                    if (Array.isArray(worksheets)) {
                      for (const ws of worksheets) {
                        await worksheetRepository.saveWorksheet({
                          id: ws.id,
                          lesson_id: ws.lesson_id,
                          title: ws.title,
                          description: ws.description ?? null,
                          language_code: ws.language_code || 'hi',
                          source_language: ws.source_language || 'hi',
                          worksheet_type: ws.worksheet_type,
                          difficulty_level: ws.difficulty_level ?? 'beginner',
                          instructions: ws.instructions ?? null,
                          content: ws.content ?? null,
                          answer_key: ws.answer_key ?? null,
                          file_path: ws.file_path ?? null,
                          version: ws.version ?? 1,
                          is_active: ws.is_active ? 1 : 0,
                        });
                        stats.worksheets++;

                        // 8. Questions for worksheet
                        const questions = await this.api.get<any[]>(`/worksheets/${ws.id}/questions`);
                        if (Array.isArray(questions)) {
                          for (const q of questions) {
                            await worksheetQuestionRepository.saveQuestion({
                              id: q.id,
                              worksheet_id: q.worksheet_id,
                              question_number: q.question_number,
                              question_text: q.question_text,
                              question_type: q.question_type,
                              options: typeof q.options === 'string' ? q.options : JSON.stringify(q.options || []),
                              correct_answer: q.correct_answer ?? null,
                              explanation: q.explanation ?? null,
                              marks: q.marks ?? 1,
                            });
                            stats.questions++;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      } catch (err) {
        // Continue downloading remaining branches
      }
    }

    // 9. Sync Dictionary entries
    try {
      stats.dictionary = await this.syncDictionary();
    } catch {
      stats.dictionary = 0;
    }

    return stats;
  }

  /**
   * Synchronizes bilingual dictionary entries.
   */
  async syncDictionary(): Promise<number> {
    try {
      const entries = await this.api.get<any[]>('/dictionary');
      if (Array.isArray(entries)) {
        for (const e of entries) {
          await dictionaryRepository.save({
            id: e.id,
            source_language: e.source_language,
            source_word: e.source_word,
            target_language: e.target_language,
            target_word: e.target_word,
            transliteration: e.transliteration ?? null,
            part_of_speech: e.part_of_speech ?? null,
            pronunciation: e.pronunciation ?? null,
            definition: e.definition ?? null,
            example_source: e.example_source ?? null,
            example_target: e.example_target ?? null,
            audio_path: e.audio_path ?? null,
            lesson_id: e.lesson_id ?? null,
            is_verified: e.is_verified ? 1 : 0,
            is_active: e.is_active ? 1 : 0,
            version: e.version ?? 1,
            created_at: e.created_at ?? null,
            updated_at: e.updated_at ?? null,
          });
        }
        return entries.length;
      }
      return 0;
    } catch {
      return 0;
    }
  }

  /**
   * Synchronizes students for a school.
   */
  async syncStudents(schoolId: number): Promise<number> {
    try {
      const students = await this.api.get<any[]>(`/students?school_id=${schoolId}`);
      if (Array.isArray(students)) {
        for (const s of students) {
          await studentRepository.save({
            id: s.id,
            school_id: s.school_id,
            student_code: s.student_code,
            full_name: s.full_name,
            class_name: s.class_name ?? null,
            section: s.section ?? null,
            mother_tongue: s.mother_tongue || 'ho',
            date_of_birth: s.date_of_birth ?? null,
            created_at: s.created_at ?? null,
            updated_at: s.updated_at ?? null,
          });
        }
        return students.length;
      }
      return 0;
    } catch {
      return 0;
    }
  }
}

