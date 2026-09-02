import React, { useState } from 'react';
import { Header } from './components/Header';
import { CurriculumScreen } from './screens/CurriculumScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { DictionaryScreen } from './screens/DictionaryScreen';
import { FlashcardsScreen } from './screens/FlashcardsScreen';
import { LoginScreen } from './screens/LoginScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { VoiceBridgeScreen } from './screens/VoiceBridgeScreen';
import { WorksheetScreen } from './screens/WorksheetScreen';
import { ClassGrade, SupportedLanguage, TeacherProfile } from './types/models';

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<string>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [teacher, setTeacher] = useState<TeacherProfile | null>({
    id: 'tch_default',
    name: 'सुनील मुंडा',
    teacherCode: 'TCH-JH-0182',
    district: 'खूंटी',
    block: 'तोरपा',
    schoolName: 'राजकीय उत्क्रमित प्राथमिक विद्यालय, तोरपा',
    udiseCode: '20190104201',
    assignedClass: '1',
    preferredLanguage: 'mundari',
    qualification: 'B.Ed Certified',
    experienceYears: 6,
    nipunCertified: true,
  });

  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('mundari');
  const [currentClass, setCurrentClass] = useState<ClassGrade>('1');

  const handleLoginSuccess = (profile: TeacherProfile) => {
    setTeacher(profile);
    setCurrentLanguage(profile.preferredLanguage);
    setCurrentClass(profile.assignedClass);
    setIsLoggedIn(true);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentScreen('login');
  };

  if (!isLoggedIn) {
    if (currentScreen === 'register') {
      return (
        <RegisterScreen
          onRegisterSuccess={handleLoginSuccess}
          onNavigateLogin={() => setCurrentScreen('login')}
        />
      );
    }
    return (
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
        onNavigateRegister={() => setCurrentScreen('register')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        currentClass={currentClass}
        onClassChange={setCurrentClass}
        teacher={teacher}
        onLogout={handleLogout}
        activeScreen={currentScreen}
        onNavigate={setCurrentScreen}
      />

      {/* Main Workspace Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {currentScreen === 'dashboard' && (
          <DashboardScreen
            teacher={teacher}
            currentLanguage={currentLanguage}
            currentClass={currentClass}
            onNavigate={setCurrentScreen}
          />
        )}
        {currentScreen === 'dictionary' && (
          <DictionaryScreen currentLanguage={currentLanguage} />
        )}
        {currentScreen === 'flashcards' && (
          <FlashcardsScreen currentLanguage={currentLanguage} />
        )}
        {currentScreen === 'curriculum' && (
          <CurriculumScreen
            currentLanguage={currentLanguage}
            currentClass={currentClass}
          />
        )}
        {currentScreen === 'progress' && <ProgressScreen />}
        {currentScreen === 'voice_bridge' && (
          <VoiceBridgeScreen currentLanguage={currentLanguage} />
        )}
        {currentScreen === 'worksheet' && (
          <WorksheetScreen
            currentLanguage={currentLanguage}
            currentClass={currentClass}
          />
        )}
      </main>
    </div>
  );
};

export default App;
