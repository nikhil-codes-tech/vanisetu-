import React from 'react';
import { ClassGrade, SupportedLanguage, TeacherProfile } from '../types/models';

interface DashboardScreenProps {
  teacher: TeacherProfile | null;
  currentLanguage: SupportedLanguage;
  currentClass: ClassGrade;
  onNavigate: (screen: string) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  teacher,
  currentLanguage,
  currentClass,
  onNavigate,
}) => {
  const langDisplayMap: Record<SupportedLanguage, string> = {
    ho: 'हो (Ho)',
    santhali: 'संथाली (Santhali)',
    mundari: 'मुंडारी (Mundari)',
  };

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0F4D2A] to-[#166534] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-block bg-[#E06D10] text-white text-[11px] font-black px-3 py-1 rounded-full mb-3 shadow-sm">
            FLN NIPUN BHARAT CLASSROOM ACTIVE
          </div>
          <h2 className="text-2xl font-black mb-1">
            जोहार {teacher?.name || 'शिक्षक महोदय'}! 👋
          </h2>
          <p className="text-xs text-[#DCFCE7] font-medium leading-relaxed">
            आज की चयनित कक्षा: <b className="text-white">कक्षा {currentClass}</b> | सक्रिय मातृभाषा शिक्षण:{' '}
            <b className="text-white">{langDisplayMap[currentLanguage]}</b> | विद्यालय:{' '}
            <b className="text-white">{teacher?.schoolName || 'राजकीय प्राथमिक विद्यालय'}</b>
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('voice_bridge')}
              className="bg-[#E06D10] hover:bg-[#C25A08] text-white px-4 py-2.5 rounded-xl font-black text-xs shadow transition-all flex items-center gap-2"
            >
              🎙️ लाइव ध्वनि सेतु शुरू करें (Voice Bridge)
            </button>
            <button
              onClick={() => onNavigate('dictionary')}
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-4 py-2.5 rounded-xl font-bold text-xs transition-all"
            >
              📖 द्विभाषी शब्दकोश खोलें
            </button>
          </div>
        </div>
      </div>

      {/* Top 3 Central Action Hub Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Today's FLN Target */}
        <div className="bg-white rounded-xl p-5 border border-[#86EFAC] shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xl">🌟</span>
            <span className="bg-[#DCFCE7] text-[#14532D] text-[10px] font-black px-2 py-0.5 rounded">NIPUN Target M{currentClass}.1</span>
          </div>
          <h3 className="font-black text-sm text-[#0F4D2A] mb-1">आज की कक्षा (Today's Goal)</h3>
          <p className="text-xs text-gray-600 mb-4">
            कक्षा {currentClass} के बच्चों को संख्या 1 से 20 की गिनती व घरेलू वस्तुओं का नाम मातृभाषा में अभ्यास कराएं।
          </p>
          <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
            <div className="bg-[#0F4D2A] h-2 rounded-full w-[70%]" />
          </div>
          <span className="text-[11px] font-bold text-gray-500">70% सत्र पूर्ण (Target on track)</span>
        </div>

        {/* Card 2: 1-Click Resume */}
        <div className="bg-white rounded-xl p-5 border border-[#99F6E4] shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={() => onNavigate('flashcards')}>
          <div className="flex justify-between items-start mb-3">
            <span className="text-xl">🔄</span>
            <span className="bg-[#CCFBF1] text-[#0F766E] text-[10px] font-black px-2 py-0.5 rounded">Quick Resume</span>
          </div>
          <h3 className="font-black text-sm text-[#115E59] mb-1">पिछली कक्षा जारी रखें</h3>
          <p className="text-xs text-gray-600 mb-4">
            चित्र कार्ड (Animal Flashcards) पर 5 नए जानवरों के नाम व ध्वनि का अभ्यास बाकी है।
          </p>
          <span className="text-xs font-black text-[#0F766E] hover:underline flex items-center gap-1">
            जारी रखें (Resume Flashcards) ➔
          </span>
        </div>

        {/* Card 3: Printable Worksheets */}
        <div className="bg-white rounded-xl p-5 border border-[#FDE68A] shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={() => onNavigate('worksheet')}>
          <div className="flex justify-between items-start mb-3">
            <span className="text-xl">🖨️</span>
            <span className="bg-[#FEF3C7] text-[#92400E] text-[10px] font-black px-2 py-0.5 rounded">Printable A4</span>
          </div>
          <h3 className="font-black text-sm text-[#78350F] mb-1">कार्यपत्रक जेनरेटर</h3>
          <p className="text-xs text-gray-600 mb-4">
            आज के पाठ के आधार पर 5 प्रश्नों का प्रिंट-योग्य A4 कार्यपत्रक तुरंत तैयार करें।
          </p>
          <span className="text-xs font-black text-[#92400E] hover:underline flex items-center gap-1">
            कार्यपत्रक बनाएँ (Generate) ➔
          </span>
        </div>
      </div>

      {/* Classroom Teaching Features Grid */}
      <div>
        <h3 className="font-black text-base text-gray-900 mb-3 flex items-center gap-2">
          📚 मुख्य शिक्षण मॉड्यूल (Teaching Modules)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { id: 'dictionary', title: 'द्विभाषी शब्दकोश', sub: '50+ Words with Audio', color: 'bg-[#F0FDFA] border-[#99F6E4] text-[#115E59]' },
            { id: 'flashcards', title: 'सचित्र कार्ड व क्विज़', sub: 'Trilingual Animal MCQs', color: 'bg-[#FFFBEB] border-[#FDE68A] text-[#78350F]' },
            { id: 'curriculum', title: 'पाठ्यक्रम डेटाबेस', sub: '75+ Chapters for Grades 1–5', color: 'bg-[#F0FDF4] border-[#86EFAC] text-[#14532D]' },
            { id: 'progress', title: 'छात्र प्रगति रिपोर्ट', sub: 'Competency Mastery Scores', color: 'bg-[#EEF2FF] border-[#C7D2FE] text-[#312E81]' },
          ].map(item => (
            <div
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`${item.color} p-4 rounded-xl border shadow-sm hover:scale-[1.02] cursor-pointer transition-all`}
            >
              <h4 className="font-black text-xs mb-1">{item.title}</h4>
              <p className="text-[11px] opacity-80">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
