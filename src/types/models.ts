export type SupportedLanguage = 'ho' | 'santhali' | 'mundari';

export type ClassGrade = '1' | '2' | '3' | '4' | '5';

export type SubjectCategory = 'math' | 'science' | 'hindi' | 'english' | 'evs';

export interface TeacherProfile {
  id: string;
  name: string;
  teacherCode: string; // TCH-JH-XXXX
  district: string;
  block: string;
  schoolName: string;
  udiseCode: string;
  assignedClass: ClassGrade;
  preferredLanguage: SupportedLanguage;
  qualification: string;
  experienceYears: number;
  nipunCertified: boolean;
  token?: string; // JWT Auth Token
}

export interface SchoolInfo {
  udiseCode: string;
  name: string;
  district: string;
  block: string;
  teachers: string[];
}

export interface DistrictData {
  id: string;
  name: string;
  primaryLanguage: SupportedLanguage;
  schools: SchoolInfo[];
}

export interface VocabularyWord {
  id: number;
  english: string;
  hindi: string;
  ho: string;
  hoScript: string; // Warang Chiti
  santhali: string;
  santhaliScript: string; // Ol Chiki
  mundari: string;
  category: 'Math' | 'EVS' | 'Hindi' | 'Science' | 'General';
  phoneticAudioUrl?: string;
  learned?: boolean;
}

export interface FlashcardAnimal {
  id: string;
  nameEnglish: string;
  nameHindi: string;
  nameHo: string;
  nameSanthali: string;
  nameMundari: string;
  scriptHo: string;
  scriptSanthali: string;
  scriptMundari: string;
  category: string;
  emoji: string;
  audioClipKey: string;
  quizOptions: {
    questionText: string;
    options: string[];
    correctIndex: number;
  };
}

export interface SyllabusChapter {
  id: string;
  grade: ClassGrade;
  subject: SubjectCategory;
  chapterNumber: number;
  titleHindi: string;
  titleTribal: {
    ho: string;
    santhali: string;
    mundari: string;
  };
  nipunCompetencyCode: string; // e.g. M1.4, H2.1
  description: string;
  completed: boolean;
  masteryPercentage: number;
}

export interface StudentProgressRecord {
  id: string;
  studentId: string;
  studentName: string;
  grade: ClassGrade;
  subject: SubjectCategory;
  competencyCode: string;
  score: number; // 0 to 100
  lastAssessedAt: string;
  synced: boolean;
}

export interface WorksheetQuestion {
  id: string;
  type: 'tracing' | 'matching' | 'fillBlank' | 'counting' | 'translation';
  questionPromptHindi: string;
  questionPromptTribal: {
    ho: string;
    santhali: string;
    mundari: string;
  };
  leftItems?: string[];
  rightItems?: string[];
  tracingText?: string;
  correctAnswer: string;
  points: number;
}

export interface GeneratedWorksheet {
  id: string;
  grade: ClassGrade;
  subject: SubjectCategory;
  chapterTitle: string;
  targetLanguage: SupportedLanguage;
  questions: WorksheetQuestion[];
  generatedAt: string;
}

export interface SyncQueueItem {
  id: string;
  eventType: 'PROGRESS_UPDATE' | 'LESSON_COMPLETE' | 'WORKSHEET_GENERATE' | 'PROFILE_UPDATE';
  payloadJson: string;
  createdAt: string;
  attempts: number;
  status: 'PENDING' | 'SYNCED' | 'FAILED';
}
