import React, { useEffect, useState } from 'react';
import { dbService } from '../services/database';
import { PiperTtsService } from '../services/piperTts';
import { SupportedLanguage, VocabularyWord } from '../types/models';

interface DictionaryScreenProps {
  currentLanguage: SupportedLanguage;
}

export const DictionaryScreen: React.FC<DictionaryScreenProps> = ({ currentLanguage }) => {
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    loadWords();
  }, [selectedCategory, searchQuery]);

  const loadWords = async () => {
    const list = await dbService.getVocabulary(selectedCategory, searchQuery);
    setWords(list);
  };

  const handleSpeak = (word: VocabularyWord) => {
    let speakText = word.hindi;
    if (currentLanguage === 'ho') speakText = word.ho;
    else if (currentLanguage === 'santhali') speakText = word.santhali;
    else if (currentLanguage === 'mundari') speakText = word.mundari;

    PiperTtsService.speak(speakText);
  };

  const categories = ['All', 'Math', 'EVS', 'Hindi', 'Science', 'General'];

  return (
    <div className="space-y-4">
      {/* Header & Filter Controls */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap justify-between items-center gap-3">
        <div>
          <h2 className="text-lg font-black text-[#0F4D2A]">📖 द्विभाषी व बहुभाषी शब्दकोश (Bilingual Dictionary)</h2>
          <p className="text-xs text-gray-500">50+ प्रामाणिक शब्द • देवनागरी, Ol Chiki व Warang Chiti लिपियाँ</p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-64">
          <input
            type="text"
            placeholder="शब्द खोजें (Search words)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#F8FAFC] border border-gray-300 rounded-lg px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-[#0F4D2A] focus:outline-none"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedCategory === cat
                ? 'bg-[#0F4D2A] text-white shadow'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Vocabulary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {words.map(w => (
          <div
            key={w.id}
            className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:border-[#86EFAC] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="font-black text-base text-gray-900">{w.hindi}</span>
                <span className="bg-[#F1F5F9] text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded">
                  {w.category}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3 font-semibold">English: {w.english}</p>

              {/* Tribal Translations */}
              <div className="bg-[#F8FAFC] p-2.5 rounded-lg border border-gray-100 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-bold">हो (Ho):</span>
                  <span className="font-black text-[#0F4D2A]">{w.ho} <span className="text-gray-400 font-normal font-mono text-[10px]">{w.hoScript}</span></span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-bold">संथाली (Santhali):</span>
                  <span className="font-black text-[#E06D10]">{w.santhali} <span className="text-gray-400 font-normal font-mono text-[10px]">{w.santhaliScript}</span></span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-bold">मुंडारी (Mundari):</span>
                  <span className="font-black text-[#115E59]">{w.mundari}</span>
                </div>
              </div>
            </div>

            {/* Audio Button */}
            <button
              onClick={() => handleSpeak(w)}
              className="mt-3 w-full bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#14532D] py-2 rounded-lg font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              🔊 उच्चारण सुनें (Pronounce with Piper TTS)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
