/**
 * PALASH App Navigator Router
 * Dynamically mounts screens based on the current stack route.
 */

import React from 'react';
import { useNavigation } from './NavigationContext';
import {
  LoginScreen,
  DashboardScreen,
  TeacherProfileScreen,
  SchoolScreen,
  ClassesScreen,
  SubjectsScreen,
  LearningOutcomesScreen,
  LessonsScreen,
  LessonDetailScreen,
  WorksheetListScreen,
  WorksheetDetailScreen,
  CreateWorksheetScreen,
  DictionaryScreen,
  StudentRosterScreen,
  StudentEvaluationScreen,
  AttendanceScreen,
  SyncCenterScreen,
} from '../screens';

export const AppNavigator: React.FC = () => {
  const { currentRoute } = useNavigation();

  switch (currentRoute.name) {
    case 'Login':
      return <LoginScreen />;
    case 'Dashboard':
      return <DashboardScreen />;
    case 'TeacherProfile':
      return <TeacherProfileScreen />;
    case 'School':
      return <SchoolScreen />;
    case 'Classes':
      return <ClassesScreen />;
    case 'Subjects':
      return <SubjectsScreen />;
    case 'LearningOutcomes':
      return <LearningOutcomesScreen />;
    case 'Lessons':
      return <LessonsScreen />;
    case 'LessonDetail':
      return <LessonDetailScreen />;
    case 'WorksheetList':
      return <WorksheetListScreen />;
    case 'WorksheetDetail':
      return <WorksheetDetailScreen />;
    case 'CreateWorksheet':
      return <CreateWorksheetScreen />;
    case 'Dictionary':
      return <DictionaryScreen />;
    case 'StudentRoster':
      return <StudentRosterScreen />;
    case 'StudentEvaluation':
      return <StudentEvaluationScreen />;
    case 'Attendance':
      return <AttendanceScreen />;
    case 'SyncCenter':
      return <SyncCenterScreen />;
    default:
      return <DashboardScreen />;
  }
};
