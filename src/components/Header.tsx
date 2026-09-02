import React, { useState } from 'react';
import { ClassGrade, SupportedLanguage, TeacherProfile } from '../types/models';

interface HeaderProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  currentClass: ClassGrade;
  onClassChange: (grade: ClassGrade) => void;
  teacher: TeacherProfile | null;
  onLogout: () => void;
  activeScreen: string;
  onNavigate: (screen: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  currentClass,
  onClassChange,
  teacher,
  onLogout,
  activeScreen,
  onNavigate,
}) => {
  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <header className="bg-[#0F4D2A] text-white shadow-md select-none">
      {/* Top Government Co-Branding Context Bar */}
      <div className="bg-[#0A341C] px-4 py-1.5 flex flex-wrap justify-between items-center text-xs border-b border-[#166534]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#86EFAC]">झारखंड सरकार (Govt. of Jharkhand)</span>
          <span className="text-gray-400">•</span>
          <span>समग्र शिक्षा (Samagra Shiksha) &amp; JCERT</span>
          <span className="text-gray-400">•</span>
          <span className="bg-[#166534] text-[#DCFCE7] px-2 py-0.5 rounded text-[10px] font-bold">NIPUN Bharat</span>
        </div>
        <div className="flex items-center gap-3 text-gray-300">
          <span>UDISE: <b className="text-white">{teacher?.udiseCode || '20190104201'}</b></span>
          <span>जिला: <b className="text-white">{teacher?.district || 'खूंटी'}</b></span>
          <span className="bg-emerald-700 text-white px-2 py-0.5 rounded font-bold text-[10px]">100% OFFLINE ACTIVE</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-3">
        {/* Brand & Title */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <div className="w-10 h-10 rounded-full bg-[#DCFCE7] flex items-center justify-center font-black text-[#0F4D2A] text-xl shadow">
            V
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tight text-white flex items-center gap-2">
              वाणीसेतु <span className="text-xs bg-[#E06D10] text-white font-bold px-2 py-0.5 rounded-full">VaniSetu OS</span>
            </h1>
            <p className="text-xs text-[#86EFAC] font-medium">मातृभाषा-आधारित बहुभाषी शिक्षण (MTB-MLE Suite)</p>
          </div>
        </div>

        {/* Global Controls: Language & Class Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Language Switcher */}
          <div className="bg-[#166534] p-1 rounded-lg flex items-center gap-1 border border-[#22C55E]/40">
            <span className="text-xs font-bold text-[#86EFAC] px-2">भाषा:</span>
            <button
              onClick={() => onLanguageChange('ho')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                currentLanguage === 'ho' ? 'bg-[#E06D10] text-white shadow' : 'text-gray-200 hover:bg-[#0A341C]'
              }`}
            >
              हो (Ho)
            </button>
            <button
              onClick={() => onLanguageChange('santhali')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                currentLanguage === 'santhali' ? 'bg-[#E06D10] text-white shadow' : 'text-gray-200 hover:bg-[#0A341C]'
              }`}
            >
              संथाली (Santhali)
            </button>
            <button
              onClick={() => onLanguageChange('mundari')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                currentLanguage === 'mundari' ? 'bg-[#E06D10] text-white shadow' : 'text-gray-200 hover:bg-[#0A341C]'
              }`}
            >
              मुंडारी (Mundari)
            </button>
          </div>

          {/* Class Grade Switcher */}
          <div className="bg-[#166534] p-1 rounded-lg flex items-center gap-1 border border-[#22C55E]/40">
            <span className="text-xs font-bold text-[#86EFAC] px-2">कक्षा:</span>
            {(['1', '2', '3', '4', '5'] as ClassGrade[]).map(grade => (
              <button
                key={grade}
                onClick={() => onClassChange(grade)}
                className={`w-7 h-7 rounded text-xs font-black transition-all flex items-center justify-center ${
                  currentClass === grade ? 'bg-white text-[#0F4D2A] shadow-md scale-105' : 'text-gray-200 hover:bg-[#0A341C]'
                }`}
              >
                {grade}
              </button>
            ))}
          </div>

          {/* Teacher Profile Button */}
          <button
            onClick={() => setShowProfileModal(true)}
            className="bg-[#0A341C] hover:bg-[#166534] border border-[#22C55E]/40 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold transition-all"
          >
            <div className="w-6 h-6 rounded-full bg-[#E06D10] text-white flex items-center justify-center font-bold text-[11px]">
              {teacher?.name ? teacher.name.charAt(0) : 'T'}
            </div>
            <span>{teacher?.name || 'शिक्षक'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <nav className="bg-[#14532D] border-t border-[#166534] px-4 py-1.5 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-bold">
          {[
            { id: 'dashboard', label: 'डैशबोर्ड (Home)' },
            { id: 'dictionary', label: 'द्विभाषी शब्दकोश (Dictionary)' },
            { id: 'flashcards', label: 'सचित्र कार्ड (Flashcards)' },
            { id: 'curriculum', label: 'पाठ्यक्रम (Curriculum)' },
            { id: 'progress', label: 'प्रगति रिपोर्ट (Progress)' },
            { id: 'voice_bridge', label: 'ध्वनि सेतु (Live Voice Bridge)' },
            { id: 'worksheet', label: 'कार्यपत्रक (Worksheet Generator)' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-all ${
                activeScreen === tab.id
                  ? 'bg-white text-[#0F4D2A] shadow font-black'
                  : 'text-gray-200 hover:bg-[#166534] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Profile & Logout Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white text-[#0F172A] rounded-xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex justify-between items-start mb-4 border-b pb-3">
              <div>
                <h3 className="font-black text-lg text-[#0F4D2A]">शिक्षक प्रोफ़ाइल (Teacher Profile)</h3>
                <p className="text-xs text-gray-500">Government of Jharkhand • Samagra Shiksha</p>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-gray-400 hover:text-gray-700 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="bg-[#F8FAFC] p-3 rounded-lg border border-gray-100 flex justify-between">
                <span className="text-gray-500 font-semibold">शिक्षक का नाम:</span>
                <span className="font-bold text-gray-900">{teacher?.name || 'सुनील मुंडा'}</span>
              </div>
              <div className="bg-[#F8FAFC] p-3 rounded-lg border border-gray-100 flex justify-between">
                <span className="text-gray-500 font-semibold">Teacher ID:</span>
                <span className="font-bold text-gray-900">{teacher?.teacherCode || 'TCH-JH-0182'}</span>
              </div>
              <div className="bg-[#F8FAFC] p-3 rounded-lg border border-gray-100 flex justify-between">
                <span className="text-gray-500 font-semibold">विद्यालय UDISE:</span>
                <span className="font-bold text-gray-900">{teacher?.udiseCode || '20190104201'}</span>
              </div>
              <div className="bg-[#F8FAFC] p-3 rounded-lg border border-gray-100 flex justify-between">
                <span className="text-gray-500 font-semibold">जिला / ब्लॉक:</span>
                <span className="font-bold text-gray-900">{teacher?.district || 'खूंटी'} / {teacher?.block || 'तोरपा'}</span>
              </div>
              <div className="bg-[#DCFCE7] p-3 rounded-lg border border-[#86EFAC] text-center text-[#14532D] font-bold">
                ✓ NIPUN Bharat MTB-MLE प्रमाणित शिक्षक
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-100"
              >
                बंद करें (Close)
              </button>
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  onLogout();
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow"
              >
                लॉगआउट (Logout)
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
