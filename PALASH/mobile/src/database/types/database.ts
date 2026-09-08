/**
 * PALASH Local SQLite Database Types
 * Compatible with backend FastAPI models and optimized for offline storage.
 */

export interface SchoolRecord {
  id: number;
  school_code: string;
  name: string;
  district: string;
  block?: string | null;
  cluster?: string | null;
  village?: string | null;
  address?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface TeacherRecord {
  id: number;
  user_id: number;
  school_id: number;
  teacher_code: string;
  full_name: string;
  phone?: string | null;
  preferred_language: string;
  target_language: string;
  created_at?: string;
  updated_at?: string;
}

export interface CurriculumClassRecord {
  id: number;
  name: string;
  grade: number;
  description?: string | null;
  is_active: number; // 1 = active, 0 = inactive in SQLite
  created_at?: string;
  updated_at?: string;
}

export interface SubjectRecord {
  id: number;
  class_id: number;
  name: string;
  code: string;
  description?: string | null;
  is_active: number;
  created_at?: string;
  updated_at?: string;
}

export interface LearningOutcomeRecord {
  id: number;
  subject_id: number;
  code: string;
  title: string;
  description?: string | null;
  nipun_domain?: string | null;
  is_active: number;
  created_at?: string;
  updated_at?: string;
}

export interface LessonRecord {
  id: number;
  learning_outcome_id: number;
  title: string;
  lesson_number: number;
  source_language: string;
  duration_minutes?: number | null;
  teacher_script?: string | null;
  learning_objective?: string | null;
  is_active: number;
  created_at?: string;
  updated_at?: string;
}

export interface ActivityRecord {
  id: number;
  lesson_id: number;
  title: string;
  activity_type: string;
  instructions?: string | null;
  sequence_order: number;
  materials?: string | null;
  is_active: number;
  created_at?: string;
  updated_at?: string;
}

export interface AssessmentRecord {
  id: number;
  lesson_id: number;
  title: string;
  prompt: string;
  assessment_type: string;
  sequence_order: number;
  expected_response?: string | null;
  is_active: number;
  created_at?: string;
  updated_at?: string;
}

export interface LanguageRecord {
  code: string;
  name: string;
  native_name: string;
  script: string;
  is_active: number;
  direction?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LessonTranslationRecord {
  id: number;
  lesson_id: number;
  language_code: string;
  translated_title: string;
  translated_script?: string | null;
  translated_objective?: string | null;
  translated_content?: string | null;
  audio_path?: string | null;
  version: number;
  is_active: number;
  created_at?: string;
  updated_at?: string;
}

export interface ActivityTranslationRecord {
  id: number;
  activity_id: number;
  language_code: string;
  translated_title: string;
  translated_instructions?: string | null;
  audio_path?: string | null;
  version: number;
  is_active: number;
  created_at?: string;
  updated_at?: string;
}

export interface AssessmentTranslationRecord {
  id: number;
  assessment_id: number;
  language_code: string;
  translated_title: string;
  translated_prompt: string;
  translated_expected_response?: string | null;
  audio_path?: string | null;
  version: number;
  is_active: number;
  created_at?: string;
  updated_at?: string;
}

export interface WorksheetRecord {
  id: number;
  lesson_id: number;
  title: string;
  description?: string | null;
  language_code: string;
  source_language: string;
  worksheet_type: string;
  difficulty_level?: string | null;
  instructions?: string | null;
  content?: string | null;
  answer_key?: string | null;
  file_path?: string | null;
  version: number;
  is_active: number;
  created_at?: string;
  updated_at?: string;
}

export interface WorksheetQuestionRecord {
  id: number;
  worksheet_id: number;
  question_number: number;
  question_text: string;
  question_type: string;
  options?: string | null;
  correct_answer?: string | null;
  explanation?: string | null;
  marks: number;
  created_at?: string;
  updated_at?: string;
}

export interface DictionaryEntryRecord {
  id: number;
  source_language: string;
  source_word: string;
  target_language: string;
  target_word: string;
  transliteration?: string | null;
  part_of_speech?: string | null;
  pronunciation?: string | null;
  definition?: string | null;
  example_source?: string | null;
  example_target?: string | null;
  audio_path?: string | null;
  lesson_id?: number | null;
  is_verified: number; // 1 = true, 0 = false
  is_active: number;
  version: number;
  created_at?: string;
  updated_at?: string;
}

export interface StudentRecord {
  id: number;
  school_id: number;
  student_code: string;
  full_name: string;
  class_name?: string | null;
  section?: string | null;
  mother_tongue: string;
  date_of_birth?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface StudentEvaluationRecord {
  id?: number;
  student_id: number;
  assessment_id?: number | null;
  worksheet_id?: number | null;
  score: number;
  max_score: number;
  status: string;
  remarks?: string | null;
  created_at?: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface StudentAttendanceRecord {
  id?: number;
  student_id: number;
  school_id: number;
  attendance_date: string;
  status: AttendanceStatus | string;
  remarks?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type SyncOperation = 'CREATE' | 'UPDATE' | 'DELETE';
export type SyncStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';

export interface SyncQueueRecord {
  id: number;
  entity_type: string;
  entity_id: number;
  operation: SyncOperation;
  payload: string;
  status: SyncStatus;
  retry_count: number;
  error_message?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SyncMetadataRecord {
  entity_type: string;
  last_synced_at?: string | null;
  last_sync_status: string;
}

export interface EvaluationSummary {
  total: number;
  completed: number;
  averageScore: number;
}

export interface RecentEvaluationItem extends StudentEvaluationRecord {
  student_name?: string;
  student_code?: string;
}

export interface DashboardMetrics {
  totalStudents: number;
  attendanceToday: {
    total: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    attendanceRate: number;
  };
  evaluationSummary: EvaluationSummary;
  totalClasses: number;
  totalSubjects: number;
  totalLessons: number;
  totalWorksheets: number;
  totalDictionaryWords: number;
  recentEvaluations: RecentEvaluationItem[];
}

/**
 * Database Driver abstraction interface.
 * Allows using @op-engineering/op-sqlite at runtime on Android/iOS
 * and BetterSqliteDriver in test environments.
 */
export interface QueryResult<T = unknown> {
  rows: T[];
  rowsAffected: number;
  insertId?: number;
}

export interface DatabaseDriver {
  execute(query: string, params?: unknown[]): Promise<QueryResult>;
  executeBatch(queries: { query: string; params?: unknown[] }[]): Promise<void>;
  transaction<T>(action: (tx: DatabaseDriver) => Promise<T>): Promise<T>;
  close(): Promise<void>;
}

