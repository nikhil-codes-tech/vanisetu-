import { ClassGrade, SubjectCategory, SupportedLanguage } from './models';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  Dictionary: { categoryFilter?: string };
  Flashcards: undefined;
  Curriculum: { grade?: ClassGrade; subject?: SubjectCategory };
  Progress: undefined;
  VoiceBridge: { targetLanguage?: SupportedLanguage };
  Worksheet: { grade?: ClassGrade; subject?: SubjectCategory };
  Profile: undefined;
};
