import React, { useState } from 'react';
import { VOCABULARY_DATABASE, LANGUAGES_METADATA } from '../utils/mockData';
import { Volume2, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';

export default function VocabularyList({ 
  selectedLanguage, 
  onSpeak, 
  selectedSubject, 
  setSelectedSubject 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Script mode toggle state: 'phonetic' vs 'indigenous' (Point 6)
  const [scriptMode, setScriptMode] = useState('phonetic');

  // Learned status map
  const [learnedMap, setLearnedMap] = useState({
    "संख्या": true,
    "जोड़": true,
    "पानी": false
  });

  // Example sentences generated map
  const [generatedExamplesMap, setGeneratedExamplesMap] = useState({});

  const activeLangMeta = LANGUAGES_METADATA[selectedLanguage] || LANGUAGES_METADATA["हो"];
  const targetKey = activeLangMeta.translationCode || 'ho';

  const subjectVocabList = VOCABULARY_DATABASE[selectedSubject] || [];

  const filteredVocab = subjectVocabList.filter(item => 
    item.word.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleLearned = (wordText) => {
    setLearnedMap(prev => ({
      ...prev,
      [wordText]: !prev[wordText]
    }));
  };

  const handleGenerateExamples = (wordText) => {
    setGeneratedExamplesMap(prev => ({
      ...prev,
      [wordText]: true
    }));
  };

  const totalCount = subjectVocabList.length;
  const learnedCount = subjectVocabList.filter(item => learnedMap[item.word]).length;
  const practiceCount = totalCount - learnedCount;

  return (
    <div className="p-6 bg-[#FDFBF7] min-h-screen text-slate-805 font-sans text-left leading-normal">
      <div className="max-w-[1200px] mx-auto space-y-6">
        
        {/* Breadcrumbs */}
        <div className="text-[10px] font-bold text-slate-400 uppercase flex space-x-1.5">
          <span>Teach</span>
          <span>/</span>
          <span>Vocabulary</span>
        </div>

        {/* 1. Header Filter & Progress Panel */}
        <div className="bg-white border border-slate-205 rounded p-5 shadow-3xs space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-wide">Classroom Vocabulary</h2>
              <p className="text-[10px] text-slate-450 font-bold mt-0.5">मातृभाषा शब्दावली संग्रह और सचित्र शिक्षण</p>
            </div>
            
            {/* Multi-script Toggle Button (Point 6) */}
            <div className="flex space-x-2">
              <button
                onClick={() => setScriptMode(prev => prev === 'phonetic' ? 'indigenous' : 'phonetic')}
                className="bg-[#E06D10] hover:bg-[#c25e0c] text-white text-xs font-black px-4 py-2 rounded-lg transition-colors cursor-pointer h-10 shadow-3xs"
              >
                𑢵 Script: {scriptMode === 'phonetic' ? 'Phonetic Devanagari' : 'Indigenous Script (Ol Chiki/Warang Chiti)'}
              </button>

              <div className="bg-indigo-50 border border-indigo-150 rounded px-3 py-1.5 text-xs font-bold text-indigo-900 flex items-center h-10">
                <span>Teaching: Hindi ➔ {selectedLanguage}</span>
              </div>
            </div>
          </div>

          {/* Word Progress statistics bar */}
          <div className="bg-[#FAF9F5] border border-slate-200 p-3 rounded flex justify-between items-center text-xs font-black text-slate-700 flex-wrap gap-2">
            <div>
              <span>शब्द प्रगति (Study Loop):</span>
              <span className="ml-2 font-medium text-slate-500">
                सीखे गए: <span className="text-emerald-800 font-black">{learnedCount}</span> | 
                अभ्यास चाहिए: <span className="text-[#E06D10] font-black">{practiceCount}</span> | 
                कुल: <span className="text-slate-800 font-black">{totalCount}</span>
              </span>
            </div>
            <div className="w-40 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600" style={{ width: `${(learnedCount / Math.max(1, totalCount)) * 100}%` }}></div>
            </div>
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-[8.5px] font-black text-slate-400 uppercase mb-1">Subject Area</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded py-2 px-3 text-xs text-slate-755 font-bold focus:outline-none cursor-pointer h-11"
              >
                <option value="गणित">गणित (Mathematics)</option>
                <option value="हिंदी">हिंदी (Hindi)</option>
                <option value="पर्यावरण अध्ययन">पर्यावरण अध्ययन (EVS)</option>
                <option value="अंग्रेज़ी">अंग्रेज़ी (English)</option>
                <option value="विज्ञान">विज्ञान (Science)</option>
              </select>
            </div>

            <div>
              <label className="block text-[8.5px] font-black text-slate-400 uppercase mb-1">शब्द खोजें (Search Word)</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="हिंदी शब्द खोजें..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded text-xs font-bold focus:outline-none h-11"
                />
                <span className="absolute inset-y-0 right-3 flex items-center text-slate-400">🔍</span>
              </div>
            </div>
          </div>

        </div>

        {/* 2. Vocabulary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredVocab.length === 0 ? (
            <div className="col-span-full bg-white rounded border border-slate-200 p-8 text-center text-slate-400 font-semibold shadow-3xs">
              कोई शब्दावली परिणाम नहीं मिला।
            </div>
          ) : (
            filteredVocab.map((item, idx) => {
              const phoneticVal = item.translations[targetKey] || "अनुवाद उपलब्ध नहीं है";
              const nativeVal = item.nativeScripts?.[targetKey] || phoneticVal;
              
              // Select active text display based on toggle script state (Point 6)
              const translationDisplay = scriptMode === 'phonetic' ? phoneticVal : nativeVal;
              const isWordLearned = learnedMap[item.word] === true;
              const hasExamplesGenerated = generatedExamplesMap[item.word] === true;

              return (
                <div 
                  key={idx} 
                  className={`bg-white border rounded p-5 shadow-3xs flex flex-col justify-between space-y-4 text-left transition-all ${
                    isWordLearned ? 'border-emerald-350 bg-emerald-50/5' : 'border-slate-200'
                  }`}
                >
                  
                  {/* Status Indicator */}
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-800 uppercase">Hindi ➔ {activeLangMeta.name}</span>
                    
                    <span className={`text-[8.5px] px-2 py-0.5 border rounded font-black uppercase ${
                      isWordLearned 
                        ? 'bg-emerald-50 border-emerald-250 text-emerald-800' 
                        : 'bg-amber-50 border-amber-250 text-amber-800'
                    }`}>
                      {isWordLearned ? '✓ सीखा हुआ' : '↻ अभ्यास चाहिए'}
                    </span>
                  </div>

                  {/* Main Aligned translations */}
                  <div className="py-3 border-y border-slate-100 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[8px] text-slate-400 font-bold uppercase block font-sans">Hindi</span>
                        <h4 className="text-sm font-black text-slate-808">{item.word}</h4>
                      </div>
                      <div>
                        <span className="text-[8px] text-[#E06D10] font-bold uppercase block font-sans">
                          {selectedLanguage} ({scriptMode === 'phonetic' ? 'Phonetic' : 'Native'})
                        </span>
                        <h4 className="text-base font-black text-indigo-900 font-mono tracking-wide">{translationDisplay}</h4>
                      </div>
                    </div>

                    {/* Classroom examples */}
                    <div className="pt-2.5 border-t border-slate-100/60 space-y-2">
                      <p className="text-[9.5px] text-[#0F4D2A] font-black uppercase">Classroom Usage Examples:</p>
                      
                      {hasExamplesGenerated ? (
                        <div className="bg-slate-50 border border-slate-200 p-2.5 rounded text-xs space-y-2 font-semibold">
                          {item.examples && item.examples.map((ex, eIdx) => (
                            <div key={eIdx} className="space-y-0.5 leading-relaxed">
                              <p className="text-slate-800">Hindi: "{ex.hindi}"</p>
                              <p className="text-indigo-900 font-mono font-black">{activeLangMeta.name}: "{ex.translated}"</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <button
                          onClick={() => handleGenerateExamples(item.word)}
                          className="bg-[#EBF7F2] hover:bg-emerald-100 border border-[#C3ECD8] text-[#0F4D2A] text-[10.5px] font-black py-1.5 px-3 rounded flex items-center space-x-1 cursor-pointer h-10"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>✨ Generate examples</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Footer Speech and Study Toggle triggers */}
                  <div className="flex justify-between items-center text-xs flex-wrap gap-2 pt-1 font-sans">
                    
                    <button
                      onClick={() => onSpeak(phoneticVal !== 'अनुवाद उपलब्ध नहीं है' ? phoneticVal.split(' ')[0] : item.word, targetKey)}
                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-650 px-3.5 py-2 rounded-lg text-xs font-black flex items-center space-x-1.5 transition-colors cursor-pointer h-11"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>सुनें</span>
                    </button>

                    <button
                      onClick={() => toggleLearned(item.word)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-black flex items-center space-x-1 transition-colors cursor-pointer h-11 border ${
                        isWordLearned
                          ? 'border-emerald-300 hover:bg-emerald-50 text-emerald-800'
                          : 'border-slate-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {isWordLearned ? (
                        <>
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>फिर अभ्यास करें</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>मैंने सीख लिया ✓</span>
                        </>
                      )}
                    </button>

                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
