/**
 * PALASH FastAPI Types & Schemas for React Native
 * Strictly aligned with backend FastAPI Pydantic models.
 */

// --- Auth Schemas ---

export interface UserRegisterRequest {
  username: string;
  password: string;
  email?: string | null;
  role?: string;
  full_name?: string | null;
}

export interface UserLoginRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email?: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// --- School Schemas ---

export interface SchoolResponse {
  id: number;
  school_code: string;
  name: string;
  district: string;
  block?: string | null;
  cluster?: string | null;
  village?: string | null;
  address?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

// --- Teacher Schemas ---

export interface TeacherUpdate {
  full_name?: string;
  phone?: string;
  languages?: string[];
  preferred_language?: string;
  target_language?: string;
}

export interface TeacherResponse {
  id: number;
  user_id: number;
  teacher_code: string;
  full_name: string;
  email?: string | null;
  phone?: string | null;
  languages: string[];
  preferred_language: string;
  target_language: string;
  school_id: number;
  school?: SchoolResponse | null;
  created_at?: string | null;
  updated_at?: string | null;
}

// --- Curriculum Schemas ---

export interface ClassResponse {
  id: number;
  name: string;
  grade: number;
  description?: string | null;
  is_active: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface SubjectResponse {
  id: number;
  class_id: number;
  name: string;
  code: string;
  description?: string | null;
  is_active: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface LearningOutcomeResponse {
  id: number;
  subject_id: number;
  code: string;
  title: string;
  description?: string | null;
  nipun_domain?: string | null;
  is_active: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ActivityResponse {
  id: number;
  lesson_id: number;
  title: string;
  activity_type: string;
  instructions?: string | null;
  sequence_order: number;
  materials?: string | null;
  is_active: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface AssessmentResponse {
  id: number;
  lesson_id: number;
  title: string;
  prompt: string;
  assessment_type: string;
  sequence_order: number;
  expected_response?: string | null;
  is_active: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface LessonResponse {
  id: number;
  learning_outcome_id: number;
  title: string;
  lesson_number: number;
  source_language: string;
  duration_minutes?: number | null;
  teacher_script?: string | null;
  learning_objective?: string | null;
  is_active: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface LessonDetailResponse extends LessonResponse {
  learning_outcome?: LearningOutcomeResponse | null;
  activities: ActivityResponse[];
  assessments: AssessmentResponse[];
}

// --- Worksheet Schemas ---

export interface WorksheetQuestionResponse {
  id: number;
  worksheet_id: number;
  question_number: number;
  question_text: string;
  question_type: string;
  options?: string | null;
  correct_answer?: string | null;
  explanation?: string | null;
  marks: number;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface WorksheetQuestionCreate {
  question_number?: number;
  question_text: string;
  question_type: string;
  options?: string | null;
  correct_answer?: string | null;
  explanation?: string | null;
  marks?: number;
}

export interface WorksheetListResponse {
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
  is_active: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface WorksheetResponse extends WorksheetListResponse {
  questions: WorksheetQuestionResponse[];
}

export interface WorksheetCreate {
  lesson_id: number;
  title: string;
  description?: string | null;
  language_code?: string;
  source_language?: string;
  worksheet_type: string;
  difficulty_level?: string | null;
  instructions?: string | null;
  content?: string | null;
  answer_key?: string | null;
  file_path?: string | null;
  version?: number;
}

export interface WorksheetUpdate {
  title?: string;
  description?: string | null;
  language_code?: string;
  source_language?: string;
  worksheet_type?: string;
  difficulty_level?: string | null;
  instructions?: string | null;
  content?: string | null;
  answer_key?: string | null;
  file_path?: string | null;
  version?: number;
  is_active?: boolean;
}

// --- Dictionary Schemas ---

export interface DictionaryEntryResponse {
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
  lesson_id?: number | null;
  is_verified: boolean;
  is_active: boolean;
  version: number;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface DictionaryLookupQuery {
  q?: string;
  source_lang?: string;
  target_lang?: string;
  lesson_id?: number;
}

// --- Student Schemas ---

export interface StudentResponse {
  id: number;
  school_id: number;
  student_code: string;
  full_name: string;
  class_name?: string | null;
  section?: string | null;
  mother_tongue: string;
  date_of_birth?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface StudentCreate {
  school_id: number;
  student_code: string;
  full_name: string;
  class_name?: string | null;
  section?: string | null;
  mother_tongue?: string;
  date_of_birth?: string | null;
}

export interface StudentAssessmentRecord {
  id?: number;
  student_id: number;
  assessment_id?: number | null;
  worksheet_id?: number | null;
  score: number;
  max_score?: number;
  status?: string;
  remarks?: string | null;
  created_at?: string;
}

