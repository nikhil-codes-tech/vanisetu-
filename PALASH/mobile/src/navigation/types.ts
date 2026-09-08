/**
 * PALASH Navigation Types & Routes
 */

export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  TeacherProfile: undefined;
  School: undefined;
  Classes: undefined;
  Subjects: { classId: number; className: string };
  LearningOutcomes: { subjectId: number; subjectName: string };
  Lessons: { outcomeId: number; outcomeTitle: string };
  LessonDetail: { lessonId: number; lessonTitle: string };
  WorksheetList: { lessonId: number; lessonTitle?: string };
  WorksheetDetail: { worksheetId: number; worksheetTitle: string };
  Dictionary: { lessonId?: number; lessonTitle?: string } | undefined;
  StudentRoster: { schoolId?: number; className?: string } | undefined;
  StudentEvaluation: { studentId?: number; studentName?: string; assessmentId?: number; worksheetId?: number; title?: string };
  CreateWorksheet: { lessonId: number; lessonTitle: string };
  Attendance: { schoolId?: number; className?: string; date?: string } | undefined;
  SyncCenter: undefined;
};

export type ScreenName = keyof RootStackParamList;

export interface RouteStackItem<T extends ScreenName = ScreenName> {
  name: T;
  params?: RootStackParamList[T];
}
