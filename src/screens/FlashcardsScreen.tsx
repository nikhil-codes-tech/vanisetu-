import React, { useState } from 'react';
import { PiperTtsService } from '../services/piperTts';
import { ClassGrade, SubjectCategory, SupportedLanguage } from '../types/models';
import { ClassSubjectFlashcard, getFlashcardsForClassAndSubject } from '../utils/flashcardsData';

interface FlashcardsScreenProps {
  currentLanguage: SupportedLanguage;
  currentClass: ClassGrade;
}

export const FlashcardsScreen: React.FC<FlashcardsScreenProps> = ({ currentLanguage, currentClass }) => {
  const [selectedGrade, setSelectedGrade] = useState<ClassGrade>(currentClass);
  const [selectedSubject, setSelectedSubject] = useState<SubjectCategory>('evs');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const subjectOptions: { id: SubjectCategory; label: string; icon: string }[] = [
    { id: 'evs', label: 'पर्यावरण (EVS)', icon: '🌿' },
    { id: 'language_ho', label: 'हो भाषा (Language - Ho)', icon: '🏹' },
    { id: 'language_santhali', label: 'संथाली भाषा (Language - Santhali)', icon: '📜' },
    { id: 'language_mundari', label: 'मुंडारी भाषा (Language - Mundari)', icon: '🌲' },
    { id: 'math', label: 'गणित (Mathematics)', icon: '📐' },
    { id: 'english', label: 'English', icon: '🔤' },
  ];

  const currentCards: ClassSubjectFlashcard[] = getFlashcardsForClassAndSubject(selectedGrade, selectedSubject);
  const currentCard: ClassSubjectFlashcard = currentCards[currentIndex] || currentCards[0];

  const handleGradeChange = (grade: ClassGrade) => {
    setSelectedGrade(grade);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  const handleSubjectChange = (subj: SubjectCategory) => {
    setSelectedSubject(subj);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setCurrentIndex(prev => (prev + 1) % currentCards.length);
  };

  const handlePrev = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setCurrentIndex(prev => (prev - 1 + currentCards.length) % currentCards.length);
  };

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);
    if (index === currentCard.quizOptions.correctIndex) {
      setScore(prev => prev + 10);
      PiperTtsService.speak('शाबाश! सही उत्तर (Well done)');
    } else {
      PiperTtsService.speak('पुनः प्रयास करें (Try again)');
    }
  };

  const handlePronounce = () => {
    let text = currentCard.titleHindi;
    if (currentLanguage === 'ho') text = currentCard.nameHo;
    else if (currentLanguage === 'santhali') text = currentCard.nameSanthali;
    else if (currentLanguage === 'mundari') text = currentCard.nameMundari;
    PiperTtsService.speak(text);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header & Matrix Controls */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🎴</span>
              <h2 className="text-xl font-black text-[#78350F]">
                सचित्र फ्लैशकार्ड व क्विज़ (Curriculum Flashcards &amp; Quiz)
              </h2>
            </div>
            <p className="text-xs text-gray-500 font-semibold mt-0.5">
              Class 1–5 Matrix • 5 Questions per Subject • Piper TTS Speech &amp; MCQ Score Tracker
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] px-3.5 py-1.5 rounded-xl font-black text-xs shadow-sm">
              🏆 कुल स्कोर: {score} अंक
            </div>
            <button
              onClick={handlePronounce}
              className="bg-[#0F4D2A] hover:bg-[#14532D] text-white px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow"
            >
              🔊 उच्चारण (Piper TTS)
            </button>
          </div>
        </div>

        {/* Class 1-5 Selectors */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
          <span className="text-xs font-black text-gray-700">कक्षा चुनें (Class):</span>
          {(['1', '2', '3', '4', '5'] as ClassGrade[]).map(g => (
            <button
              key={g}
              onClick={() => handleGradeChange(g)}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                selectedGrade === g
                  ? 'bg-[#78350F] text-white shadow'
                  : 'bg-[#F8FAFC] border border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              कक्षा {g}
            </button>
          ))}
        </div>

        {/* Subject Tabs */}
        <div className="flex flex-wrap gap-2">
          {subjectOptions.map(subj => (
            <button
              key={subj.id}
              onClick={() => handleSubjectChange(subj.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedSubject === subj.id
                  ? 'bg-[#92400E] text-white shadow-md font-black'
                  : 'bg-[#F8FAFC] border border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>{subj.icon}</span>
              <span>{subj.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Visual Flashcard */}
      <div className="bg-gradient-to-b from-[#FFFBEB] to-[#FEF3C7] border-2 border-[#FCD34D] rounded-2xl p-8 text-center shadow-lg relative">
        <div className="absolute top-4 right-4 bg-white/90 border border-amber-300 px-3 py-1 rounded-full text-xs font-black text-[#78350F]">
          कार्ड {currentIndex + 1} / {currentCards.length}
        </div>

        <div className="text-7xl mb-3 select-none animate-bounce">{currentCard.emoji}</div>
        <h3 className="text-2xl font-black text-[#78350F] mb-1">{currentCard.titleHindi}</h3>
        <p className="text-xs text-gray-600 font-bold mb-5">{currentCard.category}</p>

        {/* Trilingual Word & Script Grid */}
        <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto bg-white/90 backdrop-blur rounded-xl p-3.5 border border-amber-200 text-xs mb-6 shadow-sm">
          <div>
            <div className="text-gray-400 font-bold text-[10px]">हो (Ho / Warang Chiti)</div>
            <div className="font-black text-[#0F4D2A] text-sm mt-0.5">{currentCard.nameHo}</div>
            <div className="text-[10px] font-mono text-gray-500">{currentCard.scriptHo}</div>
          </div>
          <div className="border-x border-amber-200">
            <div className="text-gray-400 font-bold text-[10px]">संथाली (Santhali / Ol Chiki)</div>
            <div className="font-black text-[#E06D10] text-sm mt-0.5">{currentCard.nameSanthali}</div>
            <div className="text-[10px] font-mono text-gray-500">{currentCard.scriptSanthali}</div>
          </div>
          <div>
            <div className="text-gray-400 font-bold text-[10px]">मुंडारी (Mundari)</div>
            <div className="font-black text-[#115E59] text-sm mt-0.5">{currentCard.nameMundari}</div>
            <div className="text-[10px] font-mono text-gray-500">{currentCard.scriptMundari}</div>
          </div>
        </div>

        {/* Interactive MCQ Quiz Box */}
        <div className="bg-white rounded-xl p-5 border border-amber-300 text-left shadow-sm max-w-xl mx-auto">
          <p className="font-black text-xs text-gray-900 mb-3 flex items-center gap-1.5">
            <span className="text-amber-600">❓ प्रश्न:</span> {currentCard.quizOptions.questionText}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {currentCard.quizOptions.options.map((opt, idx) => {
              let btnStyle = 'bg-[#F8FAFC] border-gray-200 text-gray-800 hover:bg-amber-50';
              if (isAnswered) {
                if (idx === currentCard.quizOptions.correctIndex) {
                  btnStyle = 'bg-[#DCFCE7] border-[#22C55E] text-[#14532D] font-black scale-[1.02] shadow-sm';
                } else if (idx === selectedAnswer) {
                  btnStyle = 'bg-red-100 border-red-400 text-red-700 font-black';
                }
              }
              return (
                <button
                  key={opt}
                  onClick={() => handleOptionClick(idx)}
                  className={`p-3 rounded-lg border text-xs font-bold text-center transition-all ${btnStyle}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Card Navigation Footer */}
        <div className="flex justify-between items-center max-w-xl mx-auto mt-6">
          <button
            onClick={handlePrev}
            className="bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-xl text-xs font-black shadow-sm"
          >
            ← पिछला कार्ड (Previous)
          </button>
          <button
            onClick={handleNext}
            className="bg-[#E06D10] hover:bg-[#C25A08] text-white px-6 py-2.5 rounded-xl text-xs font-black shadow"
          >
            अगला कार्ड (Next Card) →
          </button>
        </div>
      </div>
    </div>
  );
};
