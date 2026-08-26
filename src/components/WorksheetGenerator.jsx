import React, { useState, useEffect } from 'react';
import { LANGUAGES_METADATA } from '../utils/mockData';
import { Printer } from 'lucide-react';

const AVAILABLE_WORKSHEETS_TEMPLATES = {
  "गणित": [
    {
      id: "ws_math_1",
      title: "संख्या पहचानना (1–5)",
      outcome: "M-G1.2",
      duration: "20 minutes",
      learningObjective: "M-G1.2: One-to-one correspondence and recognition up to 5.",
      questions: [
        { id: 1, type: "multiple-choice", instruction: "कितने सेब हैं? गिनें और चुनें।", visual: "🍎 🍎 🍎", options: ["2", "3", "4"], correct: "3", translations: { ho: "चिमिन सेब मेनाः आ? लेखा मे।" } }
      ]
    },
    {
      id: "ws_math_2",
      title: "जोड़ और घटाव",
      outcome: "M-G2.2",
      duration: "25 minutes",
      learningObjective: "M-G2.2: Count and sequence numbers up to 20.",
      questions: [
        { id: 1, type: "multiple-choice", instruction: "जोड़ें: 2 + 3 =", options: ["4", "5", "6"], correct: "5", translations: { ho: "मेसा मे: २ + ३ =" } }
      ]
    }
  ],
  "हिंदी": [
    {
      id: "ws_hin_1",
      title: "वर्णमाला पहचान",
      outcome: "L-G2.3",
      duration: "15 minutes",
      learningObjective: "L-G2.3: Read alphabet combinations with local sound translation.",
      questions: [
        { id: 1, type: "multiple-choice", instruction: "अक्षर 'अ' से शुरू होने वाला शब्द चुनें:", options: ["आम", "अनार", "इमली"], correct: "अनार", translations: { ho: "अक्षर 'अ' एते एनेते कजी साल मे:" } }
      ]
    }
  ],
  "पर्यावरण अध्ययन": [
    {
      id: "ws_evs_1",
      title: "हमारे पशु-पक्षी (Animals)",
      outcome: "E-G1.5",
      duration: "15 minutes",
      learningObjective: "जीव-जंतुओं के नाम और स्थानीय परिवेश में उनके आवास की पहचान।",
      questions: [
        { id: 1, type: "multiple-choice", instruction: "गाय (Cow) के लिए सही क्षेत्रीय अनुवाद चुनें:", options: ["मेरम", "गाई", "बीर"], correct: "गाई", translations: { ho: "गाई (Cow) रेयाः अनुवाद साला मे:" } }
      ]
    },
    {
      id: "ws_evs_2",
      title: "जल और पेड़ (Water & Plants)",
      outcome: "E-G2.4",
      duration: "20 minutes",
      learningObjective: "पेड़-पौधों के महत्व और जल संरक्षण की बुनियादी समझ।",
      questions: [
        { id: 1, type: "multiple-choice", instruction: "पेड़ को हो भाषा में क्या कहते हैं?", options: ["दाः", "दारू", "साकाम"], correct: "दारू", translations: { ho: "पेड़ हो काजी रे चिनाः मेनाः आ?" } }
      ]
    }
  ]
};

export default function WorksheetGenerator({ 
  selectedLanguage, 
  onSpeak, 
  selectedSubject, 
  setSelectedSubject 
}) {
  const [activeWorksheet, setActiveWorksheet] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  // Low-ink B&W mode
  const [isLowInkMode, setIsLowInkMode] = useState(false);

  // Custom worksheets generator state
  const [newClass, setNewClass] = useState('कक्षा 2');
  const [newDifficulty, setNewDifficulty] = useState('Medium');
  const [newChapterName, setNewChapterName] = useState('संख्या मिलान');
  const [wsType, setWsType] = useState('MCQ');

  const activeLangMeta = LANGUAGES_METADATA[selectedLanguage] || LANGUAGES_METADATA["हो"];

  // Auto-switch templates when subject changes (Point 1)
  useEffect(() => {
    const templates = AVAILABLE_WORKSHEETS_TEMPLATES[selectedSubject] || [];
    if (templates.length > 0) {
      setActiveWorksheet(templates[0]);
      setUserAnswers({});
      setQuizFinished(false);
    } else {
      setActiveWorksheet(null);
    }
  }, [selectedSubject]);

  const handleOpenWorksheet = (sheet) => {
    setActiveWorksheet(sheet);
    setUserAnswers({});
    setQuizFinished(false);
  };

  const handleDownload = () => {
    setDownloadComplete(true);
    setTimeout(() => setDownloadComplete(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSelectOption = (qId, val) => {
    setUserAnswers(prev => ({
      ...prev,
      [qId]: val
    }));
  };

  const handleCustomGenerate = (e) => {
    e.preventDefault();
    const sheetObj = {
      id: `custom_${Date.now()}`,
      title: `${newChapterName} (${newDifficulty})`,
      outcome: "M-G1.2",
      duration: "20 minutes",
      learningObjective: `${newClass} के बच्चों के लिए ${newChapterName} आधारित bilingual worksheet.`,
      questions: [
        {
          id: 1,
          type: "multiple-choice",
          instruction: "दी गई वस्तुओं को गिनें:",
          visual: "⭐ ⭐ ⭐ ⭐",
          options: ["3", "4", "5"],
          correct: "4",
          translations: {
            ho: "नग जोम को लेखा मे।"
          }
        }
      ]
    };
    setActiveWorksheet(sheetObj);
    alert("✓ AI Bilingual Worksheet Generated!");
  };

  const templatesList = AVAILABLE_WORKSHEETS_TEMPLATES[selectedSubject] || [];

  return (
    <div className="p-6 bg-[#FDFBF7] min-h-screen text-slate-805 font-sans text-left">
      <div className="max-w-[1200px] mx-auto space-y-6">
        
        {/* Title breadcrumb */}
        <div className="text-[10px] font-bold text-slate-400 uppercase flex space-x-1.5 font-sans">
          <span>Teach</span>
          <span>/</span>
          <span>Worksheets</span>
        </div>

        {/* Split workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: Controls (Span 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Custom Generator Form */}
            <div className="bg-white border border-slate-200 rounded p-5 space-y-4 shadow-3xs">
              <h3 className="text-sm font-black text-slate-805">✨ AI Bilingual Worksheet Builder</h3>
              
              <form onSubmit={handleCustomGenerate} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[8.5px] font-black text-slate-400 uppercase mb-1">Subject</label>
                  <select 
                    value={selectedSubject} 
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded py-1.5 px-2 font-bold text-slate-700 h-10 cursor-pointer"
                  >
                    <option value="गणित">गणित (Mathematics)</option>
                    <option value="हिंदी">हिंदी (Hindi)</option>
                    <option value="पर्यावरण अध्ययन">पर्यावरण अध्ययन (EVS)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[8.5px] font-black text-slate-400 uppercase mb-1">Class Level</label>
                  <select 
                    value={newClass} 
                    onChange={(e) => setNewClass(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded py-1.5 px-2 font-bold text-slate-700 h-10 cursor-pointer"
                  >
                    <option value="कक्षा 1">कक्षा 1</option>
                    <option value="कक्षा 2">कक्षा 2</option>
                    <option value="कक्षा 3">कक्षा 3</option>
                    <option value="कक्षा 4">कक्षा 4</option>
                    <option value="कक्षा 5">कक्षा 5</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[8.5px] font-black text-slate-400 uppercase mb-1">Chapter Name</label>
                  <input
                    type="text"
                    value={newChapterName}
                    onChange={(e) => setNewChapterName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded py-1.5 px-2 font-bold text-slate-850 h-10"
                  />
                </div>

                {/* Low-Ink Checkbox option */}
                <div className="flex items-center space-x-2 py-1.5">
                  <input
                    type="checkbox"
                    id="inkMode"
                    checked={isLowInkMode}
                    onChange={(e) => setIsLowInkMode(e.target.checked)}
                    className="w-4.5 h-4.5 accent-[#E06D10] cursor-pointer"
                  />
                  <label htmlFor="inkMode" className="text-xs font-bold text-slate-705 cursor-pointer">
                    Low-Ink Mode (B&W printable layout)
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#E06D10] hover:bg-[#c25e0c] text-white text-xs font-black py-2.5 rounded shadow-xs cursor-pointer h-10 uppercase"
                >
                  ✨ Generate Worksheet
                </button>
              </form>
            </div>

            {/* Available list */}
            <div className="bg-white border border-slate-200 rounded p-5 space-y-4 shadow-3xs text-left">
              <h3 className="text-sm font-black text-slate-805">Available Worksheets</h3>
              
              <div className="space-y-3.5">
                {templatesList.length === 0 ? (
                  <p className="text-xs text-slate-400 font-semibold text-center py-4">इस विषय के लिए कोई वर्कशीट उपलब्ध नहीं है।</p>
                ) : (
                  templatesList.map(sheet => (
                    <div 
                      key={sheet.id} 
                      className={`p-3.5 border rounded cursor-pointer transition-all ${
                        activeWorksheet?.id === sheet.id 
                          ? 'border-[#0F4D2A] bg-indigo-50/50' 
                          : 'border-slate-200 hover:bg-slate-50 bg-[#FAF9F5]'
                      }`}
                      onClick={() => handleOpenWorksheet(sheet)}
                    >
                      <span className="text-[8.5px] bg-[#0F4D2A] text-white px-2 py-0.5 rounded font-black uppercase inline-block mb-1">
                        Competency: {sheet.outcome}
                      </span>
                      <p className="text-xs font-extrabold text-slate-850">{sheet.title}</p>
                      <p className="text-[9.5px] text-slate-455 font-semibold mt-1">Duration: {sheet.duration} • JCERT Standard</p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* RIGHT: A4 Printable Canvas */}
          <div className="lg:col-span-7 bg-white border border-slate-200 p-6 rounded shadow-3xs text-left">
            {activeWorksheet ? (
              <div className="space-y-5 animate-fade-in">
                
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 flex-wrap gap-2">
                  <span className="text-xs font-extrabold text-[#0F4D2A] bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                    Bilingual A4 Canvas Preview
                  </span>
                  
                  <div className="flex space-x-2 font-sans">
                    <button
                      onClick={handlePrint}
                      className="px-3.5 py-1.5 border border-slate-350 hover:bg-slate-50 text-slate-705 text-xs font-bold rounded h-10 flex items-center space-x-1 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print / Save PDF (Bilingual)</span>
                    </button>
                    <button
                      onClick={handleDownload}
                      className="px-3.5 py-1.5 bg-[#0F4D2A] hover:bg-[#09351C] text-white text-xs font-bold rounded h-10 flex items-center cursor-pointer"
                    >
                      <span>{downloadComplete ? '✓ Saved' : 'Save Offline'}</span>
                    </button>
                  </div>
                </div>

                <div className={`p-8 font-serif text-slate-900 min-h-[600px] relative border-2 border-slate-900 ${
                  isLowInkMode ? 'bg-white' : 'bg-white shadow-md'
                }`}>
                  
                  {/* Corner Cut Marks */}
                  <div className="absolute top-2 left-2 text-[10px] text-slate-400 font-sans pointer-events-none select-none">┌</div>
                  <div className="absolute top-2 right-2 text-[10px] text-slate-400 font-sans pointer-events-none select-none">┐</div>
                  <div className="absolute bottom-2 left-2 text-[10px] text-slate-400 font-sans pointer-events-none select-none">└</div>
                  <div className="absolute bottom-2 right-2 text-[10px] text-slate-400 font-sans pointer-events-none select-none">┘</div>

                  {/* JCERT Government Co-branding Header */}
                  <div className="flex justify-between items-start border-b-2 border-slate-955 pb-4 text-left">
                    <div className="space-y-1">
                      <h4 className="text-[10px] text-slate-500 font-black uppercase font-sans">
                        SAMAGRA SHIKSHA JHARKHAND • JCERT
                      </h4>
                      <h3 className="text-base font-black text-slate-900 tracking-wide uppercase leading-tight font-sans">
                        {activeWorksheet.title}
                      </h3>
                      <p className="text-[9px] text-[#E06D10] font-sans font-black">
                        NIPUN COMPETENCY LINKED: {activeWorksheet.outcome}
                      </p>
                    </div>

                    {/* Roll No & Student Fields */}
                    <div className="text-right text-[9.5px] font-sans font-bold space-y-1.5 flex-shrink-0">
                      <p>नाम (Name): _______________________</p>
                      <p>अनुक्रमांक (Roll No): _________________</p>
                      <p>कक्षा (Class): {newClass} · Section: ______</p>
                    </div>
                  </div>

                  {/* Objective box */}
                  <div className={`my-4 p-3.5 rounded border font-sans text-[11px] leading-relaxed text-left ${
                    isLowInkMode ? 'bg-white border-slate-900 text-slate-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    <p className="font-extrabold text-slate-955">Learning Competency Objective:</p>
                    <p className="mt-0.5">{activeWorksheet.learningObjective}</p>
                  </div>

                  {/* Bilingual questions side-by-side */}
                  <div className="space-y-6 pt-3 font-sans text-xs">
                    {activeWorksheet.questions.map((q, idx) => {
                      const selectedVal = userAnswers[q.id];
                      const isAnswered = selectedVal !== undefined;
                      const isCorrect = selectedVal === q.correct;
                      const tribalInstruction = q.translations?.[activeLangMeta.translationCode] || "अनुवाद उपलब्ध नहीं है";

                      return (
                        <div key={q.id} className="space-y-4 pb-4 border-b border-dashed border-slate-300">
                          
                          <div className="grid grid-cols-2 gap-6">
                            
                            {/* HINDI COLUMN */}
                            <div className="space-y-1.5 border-r border-slate-200 pr-3 text-left">
                              <span className={`text-[8.5px] px-1.5 py-0.5 rounded font-black uppercase ${
                                isLowInkMode ? 'border border-slate-900 text-slate-900' : 'bg-slate-100 text-slate-600'
                              }`}>
                                Hindi Instruction
                              </span>
                              <p className="font-extrabold text-slate-900">{idx + 1}. {q.instruction}</p>
                            </div>

                            {/* TRIBAL COLUMN */}
                            <div className="space-y-1.5 pl-1 text-left">
                              <span className={`text-[8.5px] px-1.5 py-0.5 rounded font-black uppercase ${
                                isLowInkMode ? 'border border-slate-900 text-slate-900' : 'bg-indigo-50 text-indigo-750'
                              }`}>
                                {activeLangMeta.name} Translation
                              </span>
                              <p className="font-extrabold text-indigo-950 font-mono">{idx + 1}. {tribalInstruction}</p>
                            </div>

                          </div>

                          {q.visual && (
                            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-center text-3xl select-none max-w-xs mx-auto">
                              {q.visual}
                            </div>
                          )}

                          {/* Options grid */}
                          <div className="grid grid-cols-3 gap-2.5 max-w-sm mx-auto">
                            {q.options.map(opt => {
                              let style = "border-slate-200 bg-white text-slate-800 hover:bg-slate-50";
                              if (isAnswered) {
                                if (opt === q.correct) {
                                  style = "border-emerald-350 bg-emerald-50 text-emerald-800 font-extrabold";
                                } else if (selectedVal === opt) {
                                  style = "border-rose-350 bg-rose-50 text-rose-800";
                                } else {
                                  style = "border-slate-100 bg-white text-slate-400 opacity-60";
                                }
                              }
                              return (
                                <button
                                  key={opt}
                                  onClick={() => !isAnswered && handleSelectOption(q.id, opt)}
                                  className={`border p-2.5 rounded text-center text-xs font-bold cursor-pointer transition-colors ${style}`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>

                        </div>
                      );
                    })}
                  </div>

                </div>

              </div>
            ) : (
              <div className="text-center text-slate-400 font-semibold py-32 text-xs">
                ← बाईं ओर से कोई वर्कशीट चुनें या नई वर्कशीट जनरेट करें।
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
