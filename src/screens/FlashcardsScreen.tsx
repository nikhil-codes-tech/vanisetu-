import React, { useState } from 'react';
import { PiperTtsService } from '../services/piperTts';
import { FlashcardAnimal, SupportedLanguage } from '../types/models';
import { FLASHCARD_ANIMALS } from '../utils/flashcardsData';

interface FlashcardsScreenProps {
  currentLanguage: SupportedLanguage;
}

export const FlashcardsScreen: React.FC<FlashcardsScreenProps> = ({ currentLanguage }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const currentAnimal: FlashcardAnimal = FLASHCARD_ANIMALS[currentIndex];

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setCurrentIndex(prev => (prev + 1) % FLASHCARD_ANIMALS.length);
  };

  const handlePrev = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setCurrentIndex(prev => (prev - 1 + FLASHCARD_ANIMALS.length) % FLASHCARD_ANIMALS.length);
  };

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);
    if (index === currentAnimal.quizOptions.correctIndex) {
      setScore(prev => prev + 10);
      PiperTtsService.speak('शाबाश! सही उत्तर (Well done)');
    } else {
      PiperTtsService.speak('पुनः प्रयास करें (Try again)');
    }
  };

  const handlePronounce = () => {
    let text = currentAnimal.nameHindi;
    if (currentLanguage === 'ho') text = currentAnimal.nameHo;
    else if (currentLanguage === 'santhali') text = currentAnimal.nameSanthali;
    else if (currentLanguage === 'mundari') text = currentAnimal.nameMundari;
    PiperTtsService.speak(text);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-lg font-black text-[#78350F]">🐄 सचित्र कार्ड व प्रश्नोत्तरी (Animal Flashcards &amp; Quiz)</h2>
          <p className="text-xs text-gray-500">कार्ड {currentIndex + 1} of {FLASHCARD_ANIMALS.length} • क्विज़ स्कोर: {score} अंक</p>
        </div>
        <button
          onClick={handlePronounce}
          className="bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#92400E] px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 shadow-sm"
        >
          🔊 उच्चारण (Audio)
        </button>
      </div>

      {/* Interactive Visual Flashcard */}
      <div className="bg-gradient-to-b from-[#FFFBEB] to-[#FEF3C7] border-2 border-[#FCD34D] rounded-2xl p-8 text-center shadow-md">
        <div className="text-7xl mb-4 select-none animate-bounce">{currentAnimal.emoji}</div>
        <h3 className="text-2xl font-black text-[#78350F] mb-1">{currentAnimal.nameHindi}</h3>
        <p className="text-xs text-gray-500 font-bold mb-4">{currentAnimal.category}</p>

        {/* Trilingual Translation Grid */}
        <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto bg-white/80 backdrop-blur rounded-xl p-3 border border-amber-200 text-xs mb-6">
          <div>
            <div className="text-gray-400 font-bold text-[10px]">हो (Ho)</div>
            <div className="font-black text-[#0F4D2A] text-sm">{currentAnimal.nameHo}</div>
            <div className="text-[10px] text-gray-500">{currentAnimal.scriptHo}</div>
          </div>
          <div className="border-x border-amber-200">
            <div className="text-gray-400 font-bold text-[10px]">संथाली (Santhali)</div>
            <div className="font-black text-[#E06D10] text-sm">{currentAnimal.nameSanthali}</div>
            <div className="text-[10px] text-gray-500">{currentAnimal.scriptSanthali}</div>
          </div>
          <div>
            <div className="text-gray-400 font-bold text-[10px]">मुंडारी (Mundari)</div>
            <div className="font-black text-[#115E59] text-sm">{currentAnimal.nameMundari}</div>
            <div className="text-[10px] text-gray-500">{currentAnimal.scriptMundari}</div>
          </div>
        </div>

        {/* Interactive MCQ Quiz Box */}
        <div className="bg-white rounded-xl p-4 border border-amber-200 text-left">
          <p className="font-black text-xs text-gray-800 mb-3">
            ❓ प्रश्न: {currentAnimal.quizOptions.questionText}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {currentAnimal.quizOptions.options.map((opt, idx) => {
              let btnStyle = 'bg-[#F8FAFC] border-gray-200 text-gray-800 hover:bg-amber-50';
              if (isAnswered) {
                if (idx === currentAnimal.quizOptions.correctIndex) {
                  btnStyle = 'bg-[#DCFCE7] border-[#22C55E] text-[#14532D] font-black';
                } else if (idx === selectedAnswer) {
                  btnStyle = 'bg-red-100 border-red-400 text-red-700 font-black';
                }
              }
              return (
                <button
                  key={opt}
                  onClick={() => handleOptionClick(idx)}
                  className={`p-2.5 rounded-lg border text-xs font-bold text-center transition-all ${btnStyle}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Card Navigation Footer */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handlePrev}
            className="bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded-xl text-xs font-black shadow-sm"
          >
            ← पिछला (Previous)
          </button>
          <button
            onClick={handleNext}
            className="bg-[#E06D10] hover:bg-[#C25A08] text-white px-5 py-2 rounded-xl text-xs font-black shadow"
          >
            अगला कार्ड (Next Card) →
          </button>
        </div>
      </div>
    </div>
  );
};
