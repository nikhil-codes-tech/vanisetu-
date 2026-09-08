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

  // Active playing audio key state for visual feedback
  const [playingKey, setPlayingKey] = useState(null);

  const handleSpeakWord = (text, lang, key) => {
    setPlayingKey(key);
    if (onSpeak) {
      onSpeak(text, lang);
    }
    setTimeout(() => {
      setPlayingKey(prev => (prev === key ? null : prev));
    }, 1400);
  };

  const activeLangMeta = LANGUAGES_METADATA[selectedLanguage] || LANGUAGES_METADATA["हो"];
  let targetKey = activeLangMeta.translationCode || 'ho';
  if (selectedLanguage === 'मुंडारी' || selectedLanguage === 'Mundari' || targetKey === 'mun' || targetKey === 'unr') {
    targetKey = 'mundari';
  } else if (selectedLanguage === 'संथाली' || selectedLanguage === 'Santhali' || targetKey === 'sat') {
    targetKey = 'santhali';
  } else {
    targetKey = 'ho';
  }

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
              const phoneticVal = item.translations?.[targetKey] || item.translations?.ho || "अनुवाद उपलब्ध नहीं है";
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
                      <div className="flex items-center justify-between">
                        <p className="text-[9.5px] text-[#0F4D2A] font-black uppercase">Classroom Usage Examples:</p>
                        <span className="text-[8px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                          NIPUN ALIGNED
                        </span>
                      </div>
                      
                      {hasExamplesGenerated ? (
                        <div className="bg-slate-50 border border-slate-200 p-2.5 rounded text-xs space-y-2.5 font-semibold">
                          {item.examples && item.examples.map((ex, eIdx) => {
                            const translatedExampleText = (ex.translations && (ex.translations[targetKey] || ex.translations.ho))
                              || (typeof ex.translated === 'object' && (ex.translated[targetKey] || ex.translated.ho))
                              || (typeof ex.translated === 'string' ? ex.translated : (item.translations?.[targetKey] || item.translations?.ho || ''));

                            return (
                              <div key={eIdx} className="space-y-1 leading-relaxed bg-white p-2 rounded border border-slate-150">
                                <div className="flex justify-between items-center">
                                  <p className="text-slate-800 text-xs">🇮🇳 Hindi: "{ex.hindi}"</p>
                                  <button
                                    type="button"
                                    onClick={() => handleSpeakWord(ex.hindi, 'hi', `ex_hi_${idx}_${eIdx}`)}
                                    title="Listen in Hindi"
                                    className={`p-1 rounded cursor-pointer transition-all ${
                                      playingKey === `ex_hi_${idx}_${eIdx}`
                                        ? 'bg-amber-100 text-amber-900 scale-110'
                                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                                    }`}
                                  >
                                    <Volume2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <div className="flex justify-between items-center pt-0.5 border-t border-slate-100">
                                  <p className="text-indigo-900 font-mono font-black text-xs">🌿 {activeLangMeta.name}: "{translatedExampleText}"</p>
                                  <button
                                    type="button"
                                    onClick={() => handleSpeakWord(translatedExampleText, targetKey, `ex_tr_${idx}_${eIdx}`)}
                                    title={`Listen in ${activeLangMeta.name}`}
                                    className={`p-1 rounded cursor-pointer transition-all ${
                                      playingKey === `ex_tr_${idx}_${eIdx}`
                                        ? 'bg-emerald-100 text-emerald-900 scale-110'
                                        : 'text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50'
                                    }`}
                                  >
                                    <Volume2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <button
                          onClick={() => handleGenerateExamples(item.word)}
                          className="bg-[#EBF7F2] hover:bg-emerald-100 border border-[#C3ECD8] text-[#0F4D2A] text-[10.5px] font-black py-1.5 px-3 rounded flex items-center space-x-1 cursor-pointer h-10 transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>✨ Generate classroom examples & audio</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Footer Speech and Study Toggle triggers */}
                  <div className="flex justify-between items-center text-xs flex-wrap gap-2 pt-1 font-sans">
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          const toSpeak = phoneticVal || item.word;
                          handleSpeakWord(toSpeak, targetKey, `vocab_tr_${idx}`);
                        }}
                        title={`Listen pronunciation in ${selectedLanguage}`}
                        className={`px-3.5 py-2 rounded-lg text-xs font-black flex items-center space-x-1.5 transition-all cursor-pointer h-11 shadow-3xs ${
                          playingKey === `vocab_tr_${idx}`
                            ? 'bg-emerald-700 text-white scale-105 shadow-md'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                      >
                        <Volume2 className={`w-4 h-4 ${playingKey === `vocab_tr_${idx}` ? 'animate-bounce' : ''}`} />
                        <span>{playingKey === `vocab_tr_${idx}` ? '🔊 बोल रहा है...' : `🔊 सुनें (${selectedLanguage})`}</span>
                      </button>

                      <button
                        onClick={() => handleSpeakWord(item.word, 'hi', `vocab_hi_${idx}`)}
                        title="Listen pronunciation in Hindi"
                        className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center space-x-1 transition-all cursor-pointer h-11 ${
                          playingKey === `vocab_hi_${idx}`
                            ? 'bg-amber-100 text-amber-900 border border-amber-300 scale-105'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        <Volume2 className={`w-3.5 h-3.5 ${playingKey === `vocab_hi_${idx}` ? 'animate-bounce' : ''}`} />
                        <span>{playingKey === `vocab_hi_${idx}` ? 'बोल रहा है...' : 'हिंदी'}</span>
                      </button>
                    </div>

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
