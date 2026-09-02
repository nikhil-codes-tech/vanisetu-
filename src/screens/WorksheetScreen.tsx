import React, { useState } from 'react';
import { CanvasPdfGeneratorService } from '../services/pdfGenerator';
import { ClassGrade, GeneratedWorksheet, SubjectCategory, SupportedLanguage } from '../types/models';

interface WorksheetScreenProps {
  currentLanguage: SupportedLanguage;
  currentClass: ClassGrade;
}

export const WorksheetScreen: React.FC<WorksheetScreenProps> = ({ currentLanguage, currentClass }) => {
  const [selectedGrade, setSelectedGrade] = useState<ClassGrade>(currentClass);
  const [selectedSubject, setSelectedSubject] = useState<SubjectCategory>('hindi');
  const [worksheet, setWorksheet] = useState<GeneratedWorksheet>(() =>
    CanvasPdfGeneratorService.generateSampleWorksheet(currentClass, 'hindi', currentLanguage)
  );

  const handleGenerate = () => {
    const ws = CanvasPdfGeneratorService.generateSampleWorksheet(selectedGrade, selectedSubject, currentLanguage);
    setWorksheet(ws);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap justify-between items-center gap-3 print:hidden">
        <div>
          <h2 className="text-lg font-black text-[#115E59]">🖨️ कार्यपत्रक जेनरेटर (Printable Worksheet &amp; PDF Generator)</h2>
          <p className="text-xs text-gray-500">Android Canvas / A4 Printable Engine • ट्रेसिंग डॉट्स व चित्र मिलान</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedGrade}
            onChange={e => setSelectedGrade(e.target.value as ClassGrade)}
            className="bg-[#F8FAFC] border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-bold"
          >
            {(['1', '2', '3', '4', '5'] as ClassGrade[]).map(g => (
              <option key={g} value={g}>
                कक्षा {g}
              </option>
            ))}
          </select>

          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value as SubjectCategory)}
            className="bg-[#F8FAFC] border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-bold uppercase"
          >
            {(['hindi', 'math', 'science', 'english', 'evs'] as SubjectCategory[]).map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            onClick={handleGenerate}
            className="bg-[#115E59] hover:bg-[#0D4B47] text-white px-4 py-2 rounded-lg text-xs font-black shadow transition-all"
          >
            नया कार्यपत्रक बनाएँ (Generate)
          </button>

          <button
            onClick={handlePrint}
            className="bg-[#E06D10] hover:bg-[#C25A08] text-white px-4 py-2 rounded-lg text-xs font-black shadow transition-all flex items-center gap-1.5"
          >
            📄 प्रिंट / PDF डाउनलोड (Print)
          </button>
        </div>
      </div>

      {/* A4 Sheet Preview Canvas */}
      <div className="max-w-3xl mx-auto bg-white border-2 border-gray-800 p-8 rounded-lg shadow-lg font-sans">
        {/* Worksheet Official Header */}
        <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
          <div className="text-xs font-black text-gray-500 tracking-wider">समग्र शिक्षा • झारखंड सरकार • JCERT NIPUN BHARAT</div>
          <h1 className="text-xl font-black text-gray-900 mt-1">{worksheet.chapterTitle}</h1>
          <div className="flex justify-between items-center text-xs font-bold text-gray-700 mt-4 border-t pt-2">
            <span>विद्यार्थी का नाम: ________________________</span>
            <span>रोल नं: _____</span>
            <span>दिनांक: {worksheet.generatedAt}</span>
          </div>
        </div>

        {/* 5 Questions */}
        <div className="space-y-6 text-xs text-gray-900">
          {worksheet.questions.map((q, idx) => (
            <div key={q.id} className="border-b border-gray-200 pb-4 last:border-b-0">
              <div className="font-bold text-sm mb-1">{q.questionPromptHindi}</div>
              <div className="text-gray-500 font-semibold mb-2">({q.questionPromptTribal[currentLanguage]})</div>

              {/* Tracing Format */}
              {q.type === 'tracing' && (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 p-4 rounded text-center text-2xl font-mono tracking-widest text-gray-400">
                  {q.tracingText}
                </div>
              )}

              {/* Matching Format */}
              {q.type === 'matching' && q.leftItems && q.rightItems && (
                <div className="grid grid-cols-2 gap-8 my-2 px-4">
                  <div className="space-y-2">
                    {q.leftItems.map(item => (
                      <div key={item} className="border border-gray-300 p-2 rounded font-bold bg-gray-50">
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {q.rightItems.map(item => (
                      <div key={item} className="border border-gray-300 p-2 rounded font-bold bg-gray-50 text-right">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Counting / Text Format */}
              {(q.type === 'counting' || q.type === 'fillBlank' || q.type === 'translation') && (
                <div className="text-base font-mono font-bold text-gray-700 bg-gray-50 p-3 rounded border border-gray-200">
                  {q.tracingText || 'उत्तर: _____________________________________________'}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Score Box */}
        <div className="mt-8 pt-4 border-t-2 border-gray-800 flex justify-between items-center text-xs font-black">
          <div>कुल अंक: 20</div>
          <div>प्राप्तांक: ______ / 20</div>
          <div>शिक्षक हस्ताक्षर: ___________________</div>
        </div>
      </div>
    </div>
  );
};
