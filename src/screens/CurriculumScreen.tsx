import React, { useState } from 'react';
import { ClassGrade, SubjectCategory, SupportedLanguage, SyllabusChapter } from '../types/models';
import { MOCK_SYLLABUS } from '../utils/mockSyllabus';

interface CurriculumScreenProps {
  currentLanguage: SupportedLanguage;
  currentClass: ClassGrade;
}

export const CurriculumScreen: React.FC<CurriculumScreenProps> = ({ currentLanguage, currentClass }) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectCategory>('math');
  const [selectedGrade, setSelectedGrade] = useState<ClassGrade>(currentClass);

  const subjects: { id: SubjectCategory; label: string; icon: string }[] = [
    { id: 'math', label: 'गणित (Math)', icon: '📐' },
    { id: 'science', label: 'विज्ञान (Science)', icon: '🔬' },
    { id: 'hindi', label: 'हिंदी (Hindi)', icon: '📖' },
    { id: 'english', label: 'English', icon: '🔤' },
    { id: 'evs', label: 'पर्यावरण (EVS)', icon: '🌿' },
  ];

  const filteredChapters: SyllabusChapter[] = MOCK_SYLLABUS.filter(
    ch => ch.grade === selectedGrade && ch.subject === selectedSubject
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap justify-between items-center gap-3">
        <div>
          <h2 className="text-lg font-black text-[#0F4D2A]">📚 कक्षा 1 से 5 संपूर्ण पाठ्यक्रम (Curriculum Database)</h2>
          <p className="text-xs text-gray-500">75+ अध्याय • NIPUN भारत लर्निंग आउटकम के साथ संरेखित</p>
        </div>

        {/* Grade Filter */}
        <div className="flex items-center gap-1 bg-[#F8FAFC] p-1 rounded-lg border border-gray-200">
          <span className="text-xs font-bold text-gray-600 px-2">कक्षा:</span>
          {(['1', '2', '3', '4', '5'] as ClassGrade[]).map(g => (
            <button
              key={g}
              onClick={() => setSelectedGrade(g)}
              className={`w-7 h-7 rounded text-xs font-black transition-all ${
                selectedGrade === g ? 'bg-[#0F4D2A] text-white shadow' : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Subject Tabs */}
      <div className="flex flex-wrap gap-2">
        {subjects.map(s => (
          <button
            key={s.id}
            onClick={() => setSelectedSubject(s.id)}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              selectedSubject === s.id
                ? 'bg-[#0F4D2A] text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span>{s.icon}</span>
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      {/* Chapter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredChapters.map(ch => (
          <div
            key={ch.id}
            className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:border-[#86EFAC] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="bg-[#DCFCE7] text-[#14532D] text-[10px] font-black px-2 py-0.5 rounded">
                  NIPUN {ch.nipunCompetencyCode}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${ch.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {ch.completed ? '✓ पूर्ण (Completed)' : 'प्रगति पर (In Progress)'}
                </span>
              </div>

              <h4 className="font-black text-sm text-gray-900 mb-1">{ch.titleHindi}</h4>
              <p className="text-xs text-[#0F4D2A] font-bold mb-2">
                मातृभाषा अनुवाद: {ch.titleTribal[currentLanguage]}
              </p>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">{ch.description}</p>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-bold text-gray-500 mb-1">
                <span>दक्षता स्तर (Mastery)</span>
                <span>{ch.masteryPercentage}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-[#0F4D2A] h-2 rounded-full transition-all"
                  style={{ width: `${ch.masteryPercentage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
