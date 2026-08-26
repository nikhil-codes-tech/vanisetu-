import React, { useState, useEffect, useRef } from 'react';
import TeacherAuth from './components/TeacherAuth';
import Dashboard from './components/Dashboard';
import WorksheetGenerator from './components/WorksheetGenerator';
import VocabularyList from './components/VocabularyList';
import LiveConversation from './components/LiveConversation';
import Dictionary from './components/Dictionary';
import TeacherProfile from './components/TeacherProfile';
import Avatar from './components/Avatar';
import { 
  Download, Wifi, WifiOff, Globe, ArrowLeftRight,
  Languages, Mic, Book, ChevronRight, ChevronLeft, Volume2, User, Bell, Search, Eye, EyeOff, Printer, FileText, CheckCircle2
} from 'lucide-react';
import { translateBetweenLanguages, VOCABULARY_DATABASE, LANGUAGES_METADATA, SUBJECTS_DATA, ANIMALS_FLASHCARDS } from './utils/mockData';
import { MOCK_SCHOOLS } from './data/jharkhandData';
import canvasConfetti from 'canvas-confetti';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [teacherData, setTeacherData] = useState(null); // holds teacher profile object
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sourceLanguage, setSourceLanguage] = useState('हिंदी');
  const [targetLanguage, setTargetLanguage] = useState('हो');
  const [classLevel, setClassLevel] = useState('Grade 2');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // Multi-teacher switcher state (Point 3)
  const [isTeacherSwitcherOpen, setIsTeacherSwitcherOpen] = useState(false);

  // 1. Core States
  const [selectedSubject, setSelectedSubject] = useState('गणित');
  
  // Interactive Network status toggle
  const [networkSimulationMode, setNetworkSimulationMode] = useState('cloud'); // cloud vs offline
  const [isOnline, setIsOnline] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState('आज, 10:42 AM');
  const [syncStatus, setSyncStatus] = useState('safe'); 
  
  // Student Preview Full-screen replica simulator
  const [isStudentPreview, setIsStudentPreview] = useState(false);
  const [studentMockAnswer, setStudentMockAnswer] = useState(null);

  // 2. Playback speech speed rate dial
  const [speechRate, setSpeechRate] = useState(0.85); // 0.75 or 1.0

  // 3. AI Outcomes dynamic bindings
  const [selectedNipunOutcome, setSelectedNipunOutcome] = useState('M-G1.2');
  const [selectedChapterObj, setSelectedChapterObj] = useState({
    id: "math_ch1", 
    title: "संख्या पहचानो (1–5)", 
    nipun: "M-G1.2", 
    outcomeText: "M-G1.2: One-to-one number correspondence and recognition up to 5."
  });

  // 4. AI Translation
  const [translationInput, setTranslationInput] = useState('बच्चों, आज हम पेड़ों के बारे में सीखेंगे।');
  const [translationOutput, setTranslationOutput] = useState('');
  const [sharedClassroomMessage, setSharedClassroomMessage] = useState('');
  const [translationHistory, setTranslationHistory] = useState([
    { sourceText: 'पानी लाओ।', targetText: 'दाः ओड़ाः मे।', source: 'हिंदी', target: 'हो' },
    { sourceText: 'आज हम संख्या सीखेंगे।', targetText: 'तेइसिंग बु लेखा रेयाः बु इतुआ।', source: 'हिंदी', target: 'हो' }
  ]);

  // 5. Voice-to-Voice Bridge state
  const [isVoiceBridgeTranslating, setIsVoiceBridgeTranslating] = useState(false);
  const [voiceBridgeSpokenText, setVoiceBridgeSpokenText] = useState('');
  const [voiceBridgeTranslatedText, setVoiceBridgeTranslatedText] = useState('');
  const [voiceBridgeLatency, setVoiceBridgeLatency] = useState(null);
  const [voiceBridgeStep, setVoiceBridgeStep] = useState('idle'); // idle, listening, translating, playing
  const [voiceBridgeHistory, setVoiceBridgeHistory] = useState([
    { speaker: 'teacher', hindiText: 'बच्चों, किताब खोलिए।', tribalText: 'होनको, पुथी नीः पे।', latency: '1.12' },
    { speaker: 'student', tribalText: 'दाः जोम आ।', hindiText: 'मुझे पानी चाहिए।', latency: '1.20' }
  ]);

  // 6. EVS Animal Flashcards state
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [flashcardLearnedMap, setFlashcardLearnedMap] = useState({});
  const [isFlashcardRecording, setIsFlashcardRecording] = useState(false);
  const [flashcardScore, setFlashcardScore] = useState(null);

  // 7. Global Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const profileDropdownRef = useRef(null);
  const switcherDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (switcherDropdownRef.current && !switcherDropdownRef.current.contains(event.target)) {
        setIsTeacherSwitcherOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGlobalSpeak = (textToSpeak, langCode) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = speechRate; 
      window.speechSynthesis.speak(utterance);
    } else {
      alert("ऑडियो उपलब्ध नहीं है");
    }
  };

  const handleLogin = (teacherProfile) => {
    setTeacherData(teacherProfile);
    setSourceLanguage('हिंदी');
    
    // Set matching dialect
    const lang = teacherProfile.primaryTribalLang === 'ho' 
      ? 'हो' 
      : (teacherProfile.primaryTribalLang === 'santhali' ? 'संथाली' : 'मुंडारी');
    setTargetLanguage(lang);
    setClassLevel(teacherProfile.assignedClass || 'Grade 2');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setTeacherData(null);
    setActiveTab('dashboard');
    setIsStudentPreview(false);
  };

  const handleAITranslate = (e) => {
    e.preventDefault();
    if (!translationInput.trim()) return;
    
    const result = translateBetweenLanguages(translationInput, sourceLanguage, targetLanguage);
    setTranslationOutput(result);
    
    setTranslationHistory(prev => [
      { sourceText: translationInput, targetText: result, source: sourceLanguage, target: targetLanguage },
      ...prev.slice(0, 4)
    ]);
  };

  const handleSendToClassroom = () => {
    if (!translationOutput) return;
    setSharedClassroomMessage(translationInput);
    setActiveTab('live');
    alert("✓ अनुवादित पाठ लाइव कक्षा सत्र (Live Classroom) के शीर्ष पर भेज दिया गया है!");
  };

  const handleVoiceBridgeSpeak = (speakingLang) => {
    setVoiceBridgeStep('listening');
    setVoiceBridgeSpokenText('');
    setVoiceBridgeTranslatedText('');
    setVoiceBridgeLatency(null);

    setTimeout(() => {
      setVoiceBridgeStep('translating');
      if (speakingLang === 'Hindi') {
        setVoiceBridgeSpokenText('बच्चों, किताब खोलिए।');
        setTimeout(() => {
          setVoiceBridgeStep('playing');
          const trans = targetLanguage === 'हो' ? 'होनको, पुथी नीः पे।' : 'पुथी उताःइमे।';
          setVoiceBridgeTranslatedText(trans);
          setVoiceBridgeLatency('1.12');
          handleGlobalSpeak(trans, targetLanguage);
          setVoiceBridgeHistory(prev => [
            { speaker: 'teacher', hindiText: 'बच्चों, किताब खोलिए।', tribalText: trans, latency: '1.12' },
            ...prev
          ]);
          canvasConfetti({ particleCount: 40, spread: 35, origin: { y: 0.8 } });
          setTimeout(() => setVoiceBridgeStep('idle'), 1500);
        }, 1200);
      } else {
        setVoiceBridgeSpokenText('दाः जोम आ।');
        setTimeout(() => {
          setVoiceBridgeStep('playing');
          const trans = 'मुझे पानी चाहिए।';
          setVoiceBridgeTranslatedText(trans);
          setVoiceBridgeLatency('1.20');
          handleGlobalSpeak(trans, 'hi');
          setVoiceBridgeHistory(prev => [
            { speaker: 'student', tribalText: 'दाः जोम आ।', hindiText: trans, latency: '1.20' },
            ...prev
          ]);
          setTimeout(() => setVoiceBridgeStep('idle'), 1500);
        }, 1000);
      }
    }, 1500);
  };

  const handleFlashcardRecord = () => {
    setIsFlashcardRecording(true);
    setFlashcardScore(null);
    setTimeout(() => {
      setIsFlashcardRecording(false);
      setFlashcardScore(92);
      canvasConfetti({ particleCount: 40, spread: 30, origin: { y: 0.8 } });
    }, 1800);
  };

  const handleSyncNow = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      setLastSyncTime(`आज, ${hours}:${minutes} ${ampm}`);
      setSyncStatus('safe');
      canvasConfetti({
        particleCount: 50,
        spread: 40,
        origin: { y: 0.8 }
      });
    }, 1500);
  };

  if (!isLoggedIn) {
    return <TeacherAuth onLoginSuccess={handleLogin} />;
  }

  // Multi-teacher switcher list loading
  const currentSchoolObj = MOCK_SCHOOLS.find(s => s.udiseCode === teacherData.udiseCode) || MOCK_SCHOOLS[0];
  const peerTeachers = currentSchoolObj ? currentSchoolObj.teachers.filter(t => t.id !== teacherData.id) : [];

  const handlePeerSwitch = (peerObj) => {
    handleLogin({
      ...peerObj,
      schoolName: currentSchoolObj.name,
      udiseCode: currentSchoolObj.udiseCode,
      district: teacherData.district,
      block: teacherData.block
    });
    setIsTeacherSwitcherOpen(false);
  };

  const activeLangMeta = LANGUAGES_METADATA[targetLanguage] || LANGUAGES_METADATA["हो"];

  const groupedNavigation = [
    {
      title: 'TEACH',
      items: [
        { id: 'dashboard', label: '🏠 Dashboard' },
        { id: 'curriculum', label: '📚 Curriculum' },
        { id: 'lessons', label: '📖 Worksheets' },
        { id: 'flashcards', label: '🎴 Flashcards' },
        { id: 'vocabulary', label: '🔤 Vocabulary' },
        { id: 'dictionary', label: '📖 Dictionary' }
      ]
    },
    {
      title: 'AI TOOLS',
      items: [
        { id: 'voice-bridge', label: '🎙 Voice Bridge' },
        { id: 'translate', label: '✨ AI Translation' },
        { id: 'worksheet-generator', label: '📄 Worksheet Generator' }
      ]
    },
    {
      title: 'CLASSROOM',
      items: [
        { id: 'live', label: '🔴 Live Class' },
        { id: 'progress', label: '📊 Progress' }
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'profile', label: '👤 Teacher Profile' },
        { id: 'offline', label: '📦 Content' },
        { id: 'sync-device', label: '🔄 Sync & Device' }
      ]
    }
  ];

  return (
    <div className={`flex h-screen bg-[#FDFBF7] overflow-hidden font-sans text-slate-805 ${isStudentPreview ? 'text-lg' : ''}`}>
      
      {/* Student View replica modal */}
      {isStudentPreview && (
        <div className="fixed inset-0 bg-[#0F4D2A]/90 z-50 flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white rounded-3xl border-8 border-slate-900 shadow-2xl max-w-4xl w-full h-[620px] overflow-hidden flex flex-col justify-between p-6 relative">
            <div className="flex justify-between items-center border-b pb-3 text-xs font-black uppercase text-slate-750">
              <span className="text-emerald-805">🟢 Student Mode Replica</span>
              <button 
                onClick={() => setIsStudentPreview(false)}
                className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2 rounded h-11 flex items-center cursor-pointer min-w-[48px]"
              >
                Exit Student View
              </button>
            </div>

            <div className="my-auto space-y-6 text-center">
              <div>
                <span className="text-[10px] bg-[#E06D10] text-white px-2 py-0.5 rounded font-black uppercase">
                  M-G1.2: One-to-One Correspondence
                </span>
                <h3 className="text-base font-black text-slate-850 mt-2">चित्रों को गिनें और संख्या का चयन करें।</h3>
              </div>

              <div className="w-48 h-20 bg-slate-50 border border-slate-200 rounded-full mx-auto flex items-center justify-center text-5xl shadow-inner select-none">
                🍎 🍎 🍎
              </div>

              <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
                {['2', '3', '4'].map(val => (
                  <button
                    key={val}
                    onClick={() => {
                      setStudentMockAnswer(val);
                      if (val === '3') {
                        canvasConfetti({ particleCount: 80, spread: 50, origin: { y: 0.6 } });
                        handleGlobalSpeak('सबाशी गे! सही उत्तर तीन है।', 'hi');
                      }
                    }}
                    className={`h-16 text-lg font-black border rounded-lg flex items-center justify-center transition-colors cursor-pointer min-w-[56px] ${
                      studentMockAnswer === val
                        ? (val === '3' ? 'bg-emerald-50 border-emerald-350 text-emerald-800' : 'bg-rose-50 border-rose-350 text-rose-800')
                        : 'bg-[#FAF9F5] border-slate-250 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>

              {studentMockAnswer && (
                <p className={`text-xs font-black uppercase ${studentMockAnswer === '3' ? 'text-emerald-800' : 'text-rose-800'}`}>
                  {studentMockAnswer === '3' ? '✓ सही उत्तर (Shabash!)' : '✗ पुनः प्रयास करें'}
                </p>
              )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <button
                onClick={() => handleGlobalSpeak('चिमिन सेब मेनाः आ?', targetLanguage)}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-755 px-4.5 py-3 rounded-lg text-xs font-black flex items-center space-x-1.5 cursor-pointer h-12 min-w-[48px]"
              >
                <Volume2 className="w-4.5 h-4.5" />
                <span>छुओ और सुनो (Touch to Hear Ho)</span>
              </button>

              <span className="text-[9px] text-slate-400 font-bold uppercase">Samagra Shiksha Tablet Mock</span>
            </div>
          </div>
        </div>
      )}

      {/* Left Sidebar */}
      {!isStudentPreview && (
        <aside className={`${isSidebarCollapsed ? 'w-16' : 'w-60'} bg-[#0F4D2A] text-white flex flex-col justify-between flex-shrink-0 z-20 shadow-lg transition-all duration-300`}>
          <div>
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#082a17]">
              <div className="flex items-center space-x-2.5 overflow-hidden">
                <img 
                  src="/palash_flower.jpg" 
                  alt="Palash Logo" 
                  className="w-7 h-7 rounded-full object-cover border border-white/20 flex-shrink-0"
                />
                {!isSidebarCollapsed && (
                  <div className="text-left whitespace-nowrap">
                    <h2 className="text-xs font-black tracking-wide leading-none">PALASH Vani Setu</h2>
                    <p className="text-[7.5px] text-[#A6C4B9] uppercase tracking-widest font-extrabold mt-1">JCERT / SAMAGRA SHIKSHA</p>
                  </div>
                )}
              </div>
              <button 
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white cursor-pointer h-9 w-9 flex items-center justify-center"
              >
                {isSidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Profile context */}
            {!isSidebarCollapsed && (
              <div className="mx-3 my-4 p-3.5 bg-[#082a17]/70 border border-white/5 rounded text-left text-xs text-slate-350 space-y-2">
                <div className="flex items-center space-x-2.5">
                  <Avatar name={teacherData.name} size="xs" border={true} />
                  <div>
                    <p className="font-extrabold text-white leading-none">{teacherData.name.split(' ')[0]}</p>
                    <p className="text-[8.5px] text-slate-400 font-bold mt-1.5 leading-none">Shikshak ID: {teacherData.id}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center border-t border-white/5 pt-2 mt-1 text-[8.5px]">
                  <span className="text-emerald-450 font-black">● Offline Config</span>
                  <span className="text-slate-500 font-bold">2026-27</span>
                </div>
              </div>
            )}

            {/* Navigation Lists with 48px min touch target */}
            <div className="p-2 py-3 space-y-3.5 max-h-[62vh] overflow-y-auto">
              {groupedNavigation.map((group, gIdx) => (
                <div key={gIdx} className="space-y-0.5 text-left">
                  {!isSidebarCollapsed && (
                    <p className="text-[8.5px] font-black text-[#6F9586] tracking-wider px-3.5 uppercase mb-1 leading-none">{group.title}</p>
                  )}
                  {group.items.map(item => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                        }}
                        className={`w-full text-left px-3.5 rounded transition-all duration-150 flex items-center group relative cursor-pointer min-h-[48px] ${
                          isActive 
                            ? 'bg-[#185c37] text-white font-black shadow-sm border-l-4 border-[#E06D10]' 
                            : 'text-[#C7D4CF] hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {!isSidebarCollapsed ? (
                          <span className="text-xs font-bold">{item.label}</span>
                        ) : (
                          <span className="text-xs font-black text-center w-full">{item.label.substring(0, 2)}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 border-t border-white/10 bg-[#082a17]/80 text-[8.5px] text-slate-400 font-bold">
            {!isSidebarCollapsed && <p className="text-center">Developed by Vanitech</p>}
          </div>
        </aside>
      )}

      {/* Main Window */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Institutional Header Bar */}
        <header className="bg-white border-b border-slate-200 px-6 flex justify-between items-center flex-shrink-0 shadow-3xs flex-wrap py-2 gap-3 min-h-[64px]">
          
          {/* UDISE & Block codes metadata */}
          <div className="text-left text-[9px] font-black text-slate-500 space-y-0.5 font-sans leading-none uppercase">
            <p className="text-slate-850 font-extrabold">🏫 UDISE School Code: {teacherData.udiseCode || '20190100201'}</p>
            <p className="text-slate-455 mt-1">District: {teacherData.district || 'Khunti'} / Block: {teacherData.block || 'Murhu'} · 2026-27</p>
          </div>

          <span className="text-[9.5px] bg-[#E06D10] text-white px-2 py-1 rounded font-black uppercase tracking-wider">
            NIPUN BHARAT LINKED
          </span>

          {/* Student View trigger */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsStudentPreview(true)}
              className="px-3.5 py-1.5 bg-[#FAF9F5] border border-slate-350 hover:bg-slate-100 text-slate-800 text-xs font-black rounded-lg flex items-center space-x-1.5 cursor-pointer h-11 shadow-3xs"
            >
              <Eye className="w-4 h-4 text-[#E06D10]" />
              <span>👁 छात्र को ऐसे दिखेगा</span>
            </button>
          </div>

        </header>

        {/* Tab Router Workspace */}
        <main className="flex-1 overflow-y-auto bg-[#FDFBF7]">
          
          {activeTab === 'dashboard' && (
            <Dashboard
              teacherData={{ teacher: teacherData, school: teacherData.schoolName }}
              setActiveTab={setActiveTab}
              sourceLanguage={sourceLanguage}
              targetLanguage={targetLanguage}
              setTargetLanguage={setTargetLanguage}
              onLogout={() => {
                setIsLoggedIn(false);
                setTeacherData(null);
                setActiveTab('dashboard');
              }}
              classLevel={classLevel}
              selectedSubject={selectedSubject}
              setSelectedSubject={setSelectedSubject}
              isOnline={isOnline}
              setIsOnline={setIsOnline}
              lastSyncTime={lastSyncTime}
              handleSyncNow={handleSyncNow}
              syncStatus={syncStatus}
              setSelectedNipunOutcome={setSelectedNipunOutcome}
            />
          )}

          {activeTab === 'lessons' && (
            <WorksheetGenerator 
              selectedLanguage={targetLanguage} 
              onSpeak={handleGlobalSpeak}
              selectedSubject={selectedSubject}
              setSelectedSubject={setSelectedSubject}
            />
          )}

          {activeTab === 'vocabulary' && (
            <VocabularyList 
              selectedLanguage={targetLanguage}
              onSpeak={handleGlobalSpeak}
              selectedSubject={selectedSubject}
              setSelectedSubject={setSelectedSubject}
            />
          )}

          {/* Voice Bridge Workspace (Point 3 & 4) */}
          {activeTab === 'voice-bridge' && (
            <div className="p-6 max-w-5xl mx-auto space-y-6 text-left animate-fade-in font-sans">
              <div className="text-[10px] font-bold text-slate-400 uppercase flex space-x-1.5">
                <span className="hover:underline cursor-pointer" onClick={() => setActiveTab('dashboard')}>Dashboard</span>
                <span>/</span>
                <span>Voice Bridge</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Inputs left panel */}
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded p-5 space-y-5 shadow-3xs">
                  <div>
                    <span className="text-[8px] bg-[#E06D10] text-white px-2 py-0.5 rounded font-black uppercase">
                      ONNX Local Execution
                    </span>
                    <h3 className="text-sm font-black text-slate-805 mt-1.5">🎙️ Live Voice Bridge</h3>
                    <p className="text-[10px] text-slate-450 font-bold">
                      Hindi-speaking teachers can translate speech to regional language in real time.
                    </p>
                  </div>

                  <div className="space-y-4 pt-2 border-t border-slate-100 font-sans">
                    <div className="space-y-3">
                      
                      {/* Playback speed selector rate */}
                      <div className="bg-slate-50 p-2.5 border rounded space-y-1.5">
                        <label className="block text-[9.5px] font-black text-slate-500 uppercase">
                          Speech Speed rate: {speechRate}x
                        </label>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => setSpeechRate(0.75)}
                            className={`px-3 py-1.5 border text-xs font-bold rounded-lg cursor-pointer flex-1 h-10 ${
                              speechRate === 0.75 ? 'bg-[#0F4D2A] text-white border-emerald-950' : 'bg-white text-slate-700'
                            }`}
                          >
                            0.75x (Slower for Grade 1-2)
                          </button>
                          <button
                            type="button"
                            onClick={() => setSpeechRate(1.0)}
                            className={`px-3 py-1.5 border text-xs font-bold rounded-lg cursor-pointer flex-1 h-10 ${
                              speechRate === 1.0 ? 'bg-[#0F4D2A] text-white border-emerald-950' : 'bg-white text-slate-700'
                            }`}
                          >
                            1.0x (Standard Speed)
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => handleVoiceBridgeSpeak('Hindi')}
                        disabled={voiceBridgeStep !== 'idle'}
                        className="w-full bg-[#0F4D2A] hover:bg-[#09351C] text-white text-xs font-black rounded-lg cursor-pointer flex items-center justify-center space-x-2 shadow-xs disabled:opacity-50 min-h-[48px] uppercase"
                      >
                        <Mic className="w-4.5 h-4.5" />
                        <span>Teacher Speaks Hindi</span>
                      </button>

                      <button
                        onClick={() => handleVoiceBridgeSpeak('Tribal')}
                        disabled={voiceBridgeStep !== 'idle'}
                        className="w-full bg-indigo-650 hover:bg-indigo-755 text-white text-xs font-black rounded-lg cursor-pointer flex items-center justify-center space-x-2 shadow-xs disabled:opacity-50 min-h-[48px] uppercase"
                      >
                        <Mic className="w-4.5 h-4.5" />
                        <span>Student Speaks {targetLanguage}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Simulated Screen telemetry metrics */}
                <div className="lg:col-span-7 bg-white border border-slate-200 p-6 rounded shadow-3xs space-y-6">
                  
                  <div className="border border-slate-205 bg-[#FAF9F5] p-5 rounded-lg text-center space-y-3">
                    <div className="flex justify-between text-[8.5px] text-[#E06D10] font-black uppercase">
                      <span>Telemetry Telemetry</span>
                      <span>Target: &lt; 3.0s</span>
                    </div>

                    {/* Waveform graphic view */}
                    <div className="py-4 flex justify-center items-center select-none">
                      {voiceBridgeStep === 'idle' && (
                        <div className="w-14 h-14 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center font-black">
                          🎙️
                        </div>
                      )}

                      {voiceBridgeStep === 'listening' && (
                        <div className="flex flex-col items-center space-y-2">
                          <div className="w-14 h-14 bg-rose-600 text-white rounded-full flex items-center justify-center font-black animate-pulse">
                            🔴
                          </div>
                          {/* CSS Waveforms */}
                          <div className="flex space-x-1 justify-center items-center h-8 bg-white border border-slate-200 rounded px-3 w-40">
                            <span className="w-1 bg-rose-500 h-4 rounded animate-bounce"></span>
                            <span className="w-1 bg-rose-500 h-6 rounded animate-bounce delay-75"></span>
                            <span className="w-1 bg-rose-500 h-3 rounded animate-bounce delay-150"></span>
                          </div>
                          <p className="text-[10px] text-rose-600 font-extrabold uppercase">Listening...</p>
                        </div>
                      )}

                      {voiceBridgeStep === 'translating' && (
                        <div className="flex flex-col items-center space-y-2">
                          <div className="w-14 h-14 bg-indigo-650 text-white rounded-full flex items-center justify-center font-black animate-spin">
                            ✨
                          </div>
                          <p className="text-[10px] text-indigo-750 font-extrabold uppercase animate-pulse">Translating...</p>
                        </div>
                      )}

                      {voiceBridgeStep === 'playing' && (
                        <div className="flex flex-col items-center space-y-2">
                          <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center font-black">
                            🔊
                          </div>
                          <div className="flex space-x-1 justify-center items-center h-8 bg-white border border-slate-200 rounded px-3 w-40">
                            <span className="w-1 bg-emerald-500 h-5 rounded animate-pulse"></span>
                            <span className="w-1 bg-emerald-500 h-3 rounded animate-pulse delay-75"></span>
                            <span className="w-1 bg-emerald-500 h-6 rounded animate-pulse delay-150"></span>
                          </div>
                          <p className="text-[10px] text-emerald-800 font-extrabold uppercase">Playing Audio...</p>
                        </div>
                      )}
                    </div>

                    {/* Telemetry info with live memory RAM constraint specs (Point 3) */}
                    <div className="text-[9.5px] text-slate-500 bg-white border p-2.5 rounded text-left font-mono space-y-1.5 leading-none">
                      <p>Pipeline Engine: <span className="font-extrabold text-emerald-800">Local ONNX Runtime</span></p>
                      {voiceBridgeLatency && <p>Latency speed: <span className="font-extrabold text-[#E06D10]">{voiceBridgeLatency}s</span></p>}
                      <p>Model Footprint: <span className="font-extrabold text-[#E06D10]">214 MB / 2048 MB RAM</span></p>
                    </div>

                    {/* Result boxes */}
                    {voiceBridgeSpokenText && (
                      <div className="space-y-1 bg-white border border-slate-200 p-3.5 rounded text-left text-xs font-bold leading-relaxed">
                        <p className="text-slate-500">Spoken: "{voiceBridgeSpokenText}"</p>
                        <p className="text-indigo-950 font-mono mt-1">Translated: "{voiceBridgeTranslatedText}"</p>
                      </div>
                    )}
                  </div>

                  {/* Log lists */}
                  <div className="space-y-3 font-sans">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Conversation Log</h4>
                    <div className="space-y-2.5 max-h-[200px] overflow-y-auto pr-1">
                      {voiceBridgeHistory.map((item, index) => (
                        <div key={index} className="p-3 bg-[#FAF9F5] border border-slate-200 rounded font-bold text-xs">
                          <div className="flex justify-between text-[8px] text-slate-455 uppercase tracking-wider mb-1">
                            <span>{item.speaker === 'teacher' ? 'Teacher ➔ Student' : 'Student ➔ Teacher'}</span>
                            <span className="text-emerald-805 font-extrabold">⚡ {item.latency}s delay</span>
                          </div>
                          {item.speaker === 'teacher' ? (
                            <>
                              <p className="text-slate-800">Hindi: "{item.hindiText}"</p>
                              <p className="text-indigo-900 mt-1 font-mono">{targetLanguage}: "{item.tribalText}"</p>
                            </>
                          ) : (
                            <>
                              <p className="text-indigo-900 font-mono">{targetLanguage}: "{item.tribalText}"</p>
                              <p className="text-slate-850 mt-1">Hindi: "{item.hindiText}"</p>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

          {activeTab === 'curriculum' && (
            <div className="p-6 max-w-5xl mx-auto space-y-6 text-left animate-fade-in font-sans">
              <div className="text-[10px] font-bold text-slate-400 uppercase flex space-x-1.5">
                <span className="hover:underline cursor-pointer" onClick={() => setActiveTab('dashboard')}>Dashboard</span>
                <span>/</span>
                <span>Curriculum Outline</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* List items (Left span 5) */}
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded p-5 space-y-4 shadow-3xs">
                  <h3 className="text-sm font-black text-slate-805">📚 JCERT Outcomes Curriculum</h3>
                  
                  <div className="space-y-3.5">
                    {SUBJECTS_DATA[selectedSubject]?.map((ch, idx) => (
                      <div
                        key={ch.id}
                        onClick={() => setSelectedChapterObj(ch)}
                        className={`p-3.5 border rounded cursor-pointer transition-all ${
                          selectedChapterObj?.id === ch.id 
                            ? 'border-[#0F4D2A] bg-indigo-50/50' 
                            : 'border-slate-200 hover:bg-slate-50 bg-[#FAF9F5]'
                        }`}
                      >
                        <span className="text-[8px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-black uppercase">
                          NIPUN Competency: {ch.nipun}
                        </span>
                        <p className="text-xs font-extrabold text-slate-850 mt-1">{ch.title}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inspect outcome details (Right span 7) */}
                <div className="lg:col-span-7 bg-white border border-slate-200 p-6 rounded shadow-3xs">
                  {selectedChapterObj ? (
                    <div className="space-y-5 animate-fade-in text-xs font-bold text-slate-700">
                      
                      <div className="border-b border-slate-100 pb-3">
                        <span className="text-[8.5px] bg-[#E06D10] text-white px-2 py-0.5 rounded font-black uppercase inline-block">
                          Competency Code: {selectedChapterObj.nipun}
                        </span>
                        <h4 className="text-sm font-black text-slate-850 mt-2">{selectedChapterObj.title}</h4>
                      </div>

                      <div className="bg-[#FAF9F5] border border-slate-200 p-3 rounded leading-relaxed">
                        <span className="text-[8px] text-slate-400 uppercase font-black block">Outcome Objective</span>
                        <p className="text-slate-800 mt-1 font-extrabold">"{selectedChapterObj.outcomeText}"</p>
                      </div>

                      {/* Aligned child workspace triggers */}
                      <div className="space-y-3">
                        <p className="text-[9px] text-[#0F4D2A] font-black uppercase">Available materials:</p>
                        
                        <div className="divide-y divide-slate-100 border border-slate-200 rounded overflow-hidden">
                          <button
                            onClick={() => setActiveTab('lessons')}
                            className="w-full text-left p-3.5 hover:bg-slate-50 transition-colors flex justify-between items-center cursor-pointer bg-white"
                          >
                            <span>📖 Lesson (Worksheets)</span>
                            <span className="text-[10px] text-slate-400 font-semibold">Start exercise →</span>
                          </button>

                          <button
                            onClick={() => setActiveTab('voice-bridge')}
                            className="w-full text-left p-3.5 hover:bg-slate-50 transition-colors flex justify-between items-center cursor-pointer bg-white"
                          >
                            <span>🎙 Voice Script (Voice Bridge)</span>
                            <span className="text-[10px] text-slate-400 font-semibold">Practice translation →</span>
                          </button>

                          <button
                            onClick={() => {
                              setSelectedNipunOutcome(selectedChapterObj.nipun);
                              setActiveTab('worksheet-generator');
                            }}
                            className="w-full text-left p-3.5 hover:bg-slate-50 transition-colors flex justify-between items-center cursor-pointer bg-white"
                          >
                            <span>📄 Worksheet (AI Generator)</span>
                            <span className="text-[10px] text-slate-400 font-semibold">Bilingual Preview →</span>
                          </button>

                          <button
                            onClick={() => setActiveTab('flashcards')}
                            className="w-full text-left p-3.5 hover:bg-slate-50 transition-colors flex justify-between items-center cursor-pointer bg-white"
                          >
                            <span>🎴 Flashcards</span>
                            <span className="text-[10px] text-slate-400 font-semibold">Visual learning →</span>
                          </button>

                          <button
                            onClick={() => setActiveTab('vocabulary')}
                            className="w-full text-left p-3.5 hover:bg-slate-50 transition-colors flex justify-between items-center cursor-pointer bg-white"
                          >
                            <span>🗣 Vocabulary</span>
                            <span className="text-[10px] text-slate-400 font-semibold">Study word list →</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="text-center text-slate-400 font-semibold py-24 text-xs">
                      ← बाईं ओर से कोई भी NIPUN आउटकम चैप्टर चुनें।
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* Flashcards */}
          {activeTab === 'flashcards' && (
            <div className="p-6 max-w-2xl mx-auto space-y-6 text-left animate-fade-in font-sans">
              <div className="text-[10px] font-bold text-slate-400 uppercase flex space-x-1.5">
                <span className="hover:underline cursor-pointer" onClick={() => setActiveTab('dashboard')}>Dashboard</span>
                <span>/</span>
                <span>Visual Learning Cards</span>
              </div>

              <div className="bg-white border border-slate-205 rounded p-6 shadow-3xs space-y-5">
                <div>
                  <h3 className="text-sm font-black text-slate-805">🎴 Visual Learning Cards (Flashcards)</h3>
                  <p className="text-[10px] text-slate-450 font-bold">Visual animal identification cards for Grade 1-3 regional learners.</p>
                </div>

                <div className="border border-slate-250 rounded-lg p-8 max-w-md mx-auto text-center space-y-5 bg-[#FAF9F5] shadow-sm">
                  <div className="flex justify-between items-center text-[10px] text-slate-450 font-black uppercase">
                    <span>Card {activeCardIndex + 1} / {ANIMALS_FLASHCARDS.length}</span>
                    
                    <button
                      onClick={() => toggleFlashcardLearned(activeCardIndex)}
                      className={`px-2 py-0.5 rounded border text-[8.5px] font-black uppercase cursor-pointer ${
                        flashcardLearnedMap[activeCardIndex] 
                          ? 'bg-emerald-50 border-emerald-250 text-emerald-800' 
                          : 'border-slate-350 text-slate-650 bg-white'
                      }`}
                    >
                      {flashcardLearnedMap[activeCardIndex] ? '✓ सीखा हुआ' : 'मैंने सीख लिया'}
                    </button>
                  </div>

                  <div className="w-48 h-48 bg-white border border-slate-200 rounded-full mx-auto flex items-center justify-center text-8xl shadow-inner select-none">
                    {ANIMALS_FLASHCARDS[activeCardIndex].icon}
                  </div>

                  <div className="py-3.5 border-y border-slate-200 space-y-3.5">
                    <div>
                      <span className="text-[8px] text-slate-455 uppercase block font-bold">Hindi</span>
                      <p className="text-sm font-black text-slate-800">
                        {ANIMALS_FLASHCARDS[activeCardIndex].animal.split(' ')[0]}
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-[8px] text-indigo-400 uppercase block font-bold">
                        {targetLanguage} (Native Script: {activeLangMeta.script})
                      </span>
                      <p className="text-xl font-black text-indigo-950 font-mono tracking-wider">
                        {ANIMALS_FLASHCARDS[activeCardIndex].nativeScript?.[activeLangMeta.translationCode || 'ho'] || "अनुवाद उपलब्ध नहीं है"}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                        Phonetic: "{ANIMALS_FLASHCARDS[activeCardIndex].translation[activeLangMeta.translationCode || 'ho']}"
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-1">
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => {
                          const tr = ANIMALS_FLASHCARDS[activeCardIndex].translation[activeLangMeta.translationCode || 'ho'] || '';
                          handleGlobalSpeak(tr || ANIMALS_FLASHCARDS[activeCardIndex].animal, targetLanguage);
                        }}
                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-650 text-xs font-black py-2.5 px-4 rounded-lg cursor-pointer h-11 flex items-center space-x-1.5 shadow-3xs"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>🔊 Play</span>
                      </button>

                      <button
                        onClick={handleFlashcardRecord}
                        disabled={isFlashcardRecording}
                        className="bg-[#0F4D2A] hover:bg-[#09351C] text-white text-xs font-black py-2.5 px-4 rounded-lg cursor-pointer h-11 flex items-center space-x-1.5 disabled:opacity-50"
                        style={{ backgroundColor: '#0F4D2A' }}
                      >
                        <span>{isFlashcardRecording ? 'Listening...' : '🎙 Practice Pronunciation'}</span>
                      </button>
                    </div>

                    {isFlashcardRecording && (
                      <div className="flex space-x-1 justify-center items-center h-8 bg-white border border-slate-200 rounded px-4 w-40 mx-auto">
                        <span className="w-1 bg-[#0F4D2A] h-4 rounded animate-pulse"></span>
                        <span className="w-1 bg-[#0F4D2A] h-6 rounded animate-pulse delay-75"></span>
                        <span className="w-1 bg-[#0F4D2A] h-3 rounded animate-pulse delay-150"></span>
                      </div>
                    )}

                    {flashcardScore !== null && (
                      <p className="bg-emerald-50 border border-emerald-250 p-2.5 rounded text-center text-xs font-black text-emerald-800 animate-fade-in">
                        Pronunciation Score: {flashcardScore}% ✓ (Good matching!)
                      </p>
                    )}

                    <div className="flex justify-center space-x-2 pt-2">
                      <button
                        onClick={() => { setActiveCardIndex(p => Math.max(0, p - 1)); setFlashcardScore(null); }}
                        disabled={activeCardIndex === 0}
                        className="px-3.5 py-1.5 border border-slate-350 hover:bg-slate-100 rounded text-xs font-bold disabled:opacity-40 cursor-pointer bg-white"
                      >
                        ← Prev
                      </button>
                      <button
                        onClick={() => { setActiveCardIndex(p => Math.min(ANIMALS_FLASHCARDS.length - 1, p + 1)); setFlashcardScore(null); }}
                        disabled={activeCardIndex === ANIMALS_FLASHCARDS.length - 1}
                        className="px-3.5 py-1.5 border border-slate-350 hover:bg-slate-100 rounded text-xs font-bold disabled:opacity-40 cursor-pointer bg-white"
                      >
                        Next →
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {activeTab === 'translate' && (
            <div className="p-6 max-w-3xl mx-auto space-y-6 text-left animate-fade-in font-sans">
              <div className="text-[10px] font-bold text-slate-400 uppercase flex space-x-1.5">
                <span className="hover:underline cursor-pointer" onClick={() => setActiveTab('dashboard')}>Dashboard</span>
                <span>/</span>
                <span>AI Translation</span>
              </div>

              <div className="bg-white border border-slate-205 rounded p-6 shadow-3xs space-y-5">
                <div>
                  <h3 className="text-sm font-black text-slate-805">✨ AI Translation</h3>
                  <p className="text-[10px] text-slate-455 font-bold">Classroom-aware translation between Hindi and supported regional languages.</p>
                </div>

                <form onSubmit={handleAITranslate} className="space-y-4 text-xs font-bold">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2.5">
                      <span className="text-[8.5px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-black uppercase inline-block">
                        🇮🇳 Hindi (Teacher Input)
                      </span>
                      <textarea
                        value={translationInput}
                        onChange={(e) => setTranslationInput(e.target.value)}
                        maxLength={500}
                        className="w-full bg-slate-50 border border-slate-205 rounded p-3 text-xs font-bold text-slate-808 focus:outline-none focus:bg-white resize-none h-24 shadow-inner"
                        placeholder="उदा. बच्चों, आज हम गिनती सीखेंगे।"
                      />
                    </div>

                    <div className="space-y-2.5">
                      <span className="text-[8.5px] bg-indigo-50 text-indigo-750 px-2 py-0.5 rounded font-black uppercase inline-block">
                        🟢 {activeLangMeta.name} (Translation Output)
                      </span>
                      
                      <div className="bg-[#FAF9F5] border border-slate-200 rounded p-3 text-xs font-bold text-indigo-950 font-mono h-24 overflow-y-auto leading-relaxed shadow-inner">
                        {translationOutput || "अनुवाद की प्रतीक्षा में..."}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#E06D10] hover:bg-[#c25e0c] text-white text-xs font-black py-2.5 rounded shadow-xs cursor-pointer h-11 uppercase font-sans"
                  >
                    ✨ Translate Instruction
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'live' && (
            <LiveConversation 
              sourceLanguage={sourceLanguage}
              targetLanguage={targetLanguage}
              currentTeacher={teacherData} 
              onSpeak={handleGlobalSpeak}
              sharedClassroomMessage={sharedClassroomMessage}
              setSharedClassroomMessage={setSharedClassroomMessage}
            />
          )}

          {activeTab === 'progress' && (
            <div className="p-6 max-w-2xl mx-auto space-y-6 text-left animate-fade-in font-sans">
              <div className="text-[10px] font-bold text-slate-400 uppercase flex space-x-1.5 font-sans">
                <span className="hover:underline cursor-pointer" onClick={() => setActiveTab('dashboard')}>Dashboard</span>
                <span>/</span>
                <span>Student Progress</span>
              </div>

              <div className="bg-white border border-slate-200 rounded p-6 shadow-3xs space-y-5">
                <div>
                  <h3 className="text-sm font-black text-slate-805">कक्षा 2 — सीखने की प्रगति (Learning Progress)</h3>
                  <p className="text-[10px] text-slate-455 font-bold">28 students • UPS Murhu Primary School</p>
                </div>

                <div className="space-y-4 pt-2 border-t border-slate-105 text-xs font-bold text-slate-705">
                  <div className="space-y-1 font-mono">
                    <div className="flex justify-between">
                      <span>भाषा (Languages)</span>
                      <span>████████░░ 82%</span>
                    </div>
                  </div>

                  <div className="space-y-1 font-mono">
                    <div className="flex justify-between">
                      <span>गणित (Math)</span>
                      <span>███████░░░ 71%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'offline' && (
            <div className="p-6 max-w-2xl mx-auto space-y-6 text-left animate-fade-in font-sans">
              <div className="bg-white border border-slate-200 rounded p-5 shadow-3xs space-y-4">
                <div>
                  <h3 className="text-sm font-black text-slate-855">ऑफलाइन सामग्री (Offline Storage Manager)</h3>
                  <p className="text-[10px] text-slate-455 font-bold">Manage resources downloaded on this tablet.</p>
                </div>
                
                <div className="p-4 bg-slate-50 border border-slate-200 rounded text-xs space-y-3">
                  <div className="flex justify-between items-center font-bold">
                    <span>DEVICE STORAGE:</span>
                    <span className="text-[#0F4D2A]">12.4 GB Free</span>
                  </div>
                  <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden border border-slate-200">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                  <p className="text-[9px] text-slate-450 text-right font-black uppercase">68% space used</p>
                </div>

                <button 
                  onClick={handleSyncNow}
                  className="bg-[#0F4D2A] hover:bg-[#09351C] text-white text-xs font-bold py-2.5 px-4 rounded cursor-pointer h-11"
                  style={{ backgroundColor: '#0F4D2A' }}
                >
                  अभी सिंक करें (Sync Now)
                </button>
              </div>
            </div>
          )}

          {activeTab === 'sync-device' && (
            <div className="p-6 max-w-2xl mx-auto space-y-6 text-left animate-fade-in font-sans">
              <div className="text-[10px] font-bold text-slate-400 uppercase flex space-x-1.5">
                <span className="hover:underline cursor-pointer" onClick={() => setActiveTab('dashboard')}>Dashboard</span>
                <span>/</span>
                <span>Sync & Device</span>
              </div>

              <div className="bg-white border border-slate-200 rounded p-6 shadow-3xs space-y-5">
                <div>
                  <h3 className="text-sm font-black text-slate-805">🔄 Offline Sync & Device Status</h3>
                  <p className="text-[10.5px] text-slate-455 font-bold">Verifiable specifications confirming offline-first capabilities.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-[#FAF9F5] border border-slate-200 p-4 rounded text-xs font-bold text-slate-755 leading-relaxed">
                  <div>
                    <span className="text-[8px] text-slate-400 uppercase block">Device model</span>
                    <p className="text-sm font-black text-[#0F4D2A]">Tablet-04 (Low-Cost Android)</p>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-400 uppercase block">Operating System</span>
                    <p className="text-sm font-black text-slate-808">Android 9+</p>
                  </div>
                  <div className="border-t border-slate-200/60 pt-3">
                    <span className="text-[8px] text-slate-400 uppercase block">Memory RAM</span>
                    <p className="text-sm font-black text-slate-808">2 GB RAM (Validated ✓)</p>
                  </div>
                  <div className="border-t border-slate-200/60 pt-3">
                    <span className="text-[8px] text-slate-400 uppercase block">Connection</span>
                    <p className="text-sm font-black text-amber-700">No Internet Required</p>
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={handleSyncNow}
                    className="bg-[#0F4D2A] hover:bg-[#09351C] text-white text-xs font-black py-2.5 px-5 rounded cursor-pointer shadow-xs"
                    style={{ backgroundColor: '#0F4D2A' }}
                  >
                    Sync Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'worksheet-generator' && (
            <WorksheetGenerator 
              selectedLanguage={targetLanguage} 
              onSpeak={handleGlobalSpeak}
              selectedSubject={selectedSubject}
              setSelectedSubject={setSelectedSubject}
            />
          )}

          {activeTab === 'dictionary' && (
            <Dictionary 
              selectedLanguage={targetLanguage} 
              onSpeak={handleGlobalSpeak}
            />
          )}

          {activeTab === 'profile' && (
            <TeacherProfile 
              teacherData={teacherData} 
              classLevel={classLevel} 
              setClassLevel={setClassLevel} 
              onLogout={() => {
                setIsLoggedIn(false);
                setTeacherData(null);
                setActiveTab('dashboard');
              }}
            />
          )}

        </main>

      </div>

    </div>
  );
}

export default App;
