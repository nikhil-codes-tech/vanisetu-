import React, { useState } from 'react';
import { LANGUAGES_METADATA, SUBJECTS_DATA } from '../utils/mockData';
import { Mic, Wifi, WifiOff, Volume2, Clock } from 'lucide-react';

export default function Dashboard({ 
  teacherData, 
  setActiveTab, 
  targetLanguage, 
  setTargetLanguage,
  onLogout,
  isOnline,
  setIsOnline,
  lastSyncTime,
  handleSyncNow,
  syncStatus,
  selectedSubject,
  setSelectedSubject,
  classLevel,
  setClassLevel,
  setSelectedNipunOutcome
}) {
  const activeLangMeta = LANGUAGES_METADATA[targetLanguage] || LANGUAGES_METADATA["हो"];
  
  // Dashboard profile dropdown states (Point 1)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Dashboard embedded mini voice simulator states
  const [isDemoTranslating, setIsDemoTranslating] = useState(false);
  const [demoSpoken, setDemoSpoken] = useState('');
  const [demoTranslated, setDemoTranslated] = useState('');
  const [demoLatency, setDemoLatency] = useState(null);

  const triggerDemoSpeak = () => {
    setIsDemoTranslating(true);
    setDemoSpoken('');
    setDemoTranslated('');
    setDemoLatency(null);

    setTimeout(() => {
      setIsDemoTranslating(false);
      setDemoSpoken('बच्चों, किताब खोलिए।');
      const tr = targetLanguage === 'हो' ? 'होनको, पुथी नीः पे।' : 'पुथी उताःइमे।';
      setDemoTranslated(tr);
      setDemoLatency('1.12');
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(tr);
        u.rate = 0.85;
        window.speechSynthesis.speak(u);
      }
    }, 1200);
  };

  const activeChapters = SUBJECTS_DATA[selectedSubject] || SUBJECTS_DATA["गणित"];
  const activeChapter = activeChapters[0] || { title: "अध्याय 1", nipun: "M-G1.2", outcomeText: "संख्या पहचानना।" };

  return (
    <div className="max-w-[1200px] mx-auto p-6 space-y-6 bg-[#FDFBF7] min-h-screen text-slate-805 font-sans text-left leading-normal">
      
      {/* Dashboard Top Header Row with Profile Dropdown (Point 1) */}
      <div className="flex justify-between items-center pb-3 border-b border-slate-200/60 flex-wrap gap-3">
        <div>
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">झारखण्ड सरकार • विद्यालय संचालन पोर्टल</span>
        </div>

        {/* Top-Right Profile Dropdown */}
        <div className="relative font-sans text-xs z-30">
          <button
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex items-center space-x-2.5 bg-white border border-slate-205 hover:bg-slate-50 px-3 py-1.5 rounded-full cursor-pointer shadow-3xs h-11 transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-[#0F4D2A] text-white flex items-center justify-center font-bold text-[11px] border border-[#0A3D20]/10">
              {teacherData?.teacher?.name?.substring(0, 1) || 'S'}
            </div>
            <div className="text-left leading-none hidden sm:block">
              <p className="text-xs font-black text-slate-900">{teacherData?.teacher?.name || 'सविता मुंडा'}</p>
              <p className="text-[8.5px] text-slate-455 font-bold mt-1 uppercase">Active Profile</p>
            </div>
            <span className="text-slate-400 text-[9px] pointer-events-none">▼</span>
          </button>

          {isProfileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-250 rounded-2xl shadow-xl p-4 space-y-4 text-left animate-fade-in">
              {/* Teacher Details */}
              <div className="space-y-1.5">
                <h4 className="text-[9.5px] text-[#0F4D2A] font-black uppercase tracking-wider">शिक्षक विवरण (Teacher Details)</h4>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1 text-[11px] font-bold">
                  <p className="text-slate-900 font-black">{teacherData?.teacher?.name || 'सविता मुंडा'}</p>
                  <p className="text-slate-455">Shikshak ID: {teacherData?.teacher?.id || 'TCH-201-01'}</p>
                  <p className="text-slate-455">UDISE School: {teacherData?.teacher?.school || 'UPS Murhu Primary School'}</p>
                  <p className="text-slate-455">District: {teacherData?.teacher?.district || 'Khunti'}</p>
                  <p className="text-slate-455">Block: {teacherData?.teacher?.block || 'Murhu'}</p>
                  <p className="text-slate-455">Assigned Class: {classLevel || 'कक्षा 2'}</p>
                </div>
              </div>

              {/* Language change option */}
              <div className="space-y-2">
                <label className="block text-[9.5px] text-[#E06D10] font-black uppercase tracking-wider">
                  भाषा बदलें (Select Target Language)
                </label>
                <select
                  value={targetLanguage}
                  onChange={(e) => {
                    setTargetLanguage(e.target.value);
                    setIsProfileDropdownOpen(false);
                  }}
                  className="w-full bg-slate-50 border border-slate-205 rounded p-2 text-[11px] font-extrabold text-slate-755 cursor-pointer h-10 focus:outline-none"
                >
                  <option value="हो">हो (Ho)</option>
                  <option value="संथाली">संथाली (Santhali)</option>
                  <option value="मुंडारी">मुंडारी (Mundari)</option>
                </select>
              </div>

              {/* Class change option */}
              <div className="space-y-2">
                <label className="block text-[9.5px] text-[#0F4D2A] font-black uppercase tracking-wider">
                  कक्षा बदलें (Change Assigned Class)
                </label>
                <select
                  value={classLevel}
                  onChange={(e) => {
                    setClassLevel(e.target.value);
                    setIsProfileDropdownOpen(false);
                  }}
                  className="w-full bg-slate-50 border border-slate-205 rounded p-2 text-[11px] font-extrabold text-slate-755 cursor-pointer h-10 focus:outline-none"
                >
                  <option value="कक्षा 1 (Grade 1)">कक्षा 1 (Grade 1)</option>
                  <option value="कक्षा 2 (Grade 2)">कक्षा 2 (Grade 2)</option>
                  <option value="कक्षा 3 (Grade 3)">कक्षा 3 (Grade 3)</option>
                  <option value="कक्षा 4 (Grade 4)">कक्षा 4 (Grade 4)</option>
                  <option value="कक्षा 5 (Grade 5)">कक्षा 5 (Grade 5)</option>
                </select>
              </div>

              {/* Logout button */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-black py-2 rounded-lg cursor-pointer h-9 transition-colors text-center uppercase"
                >
                  लॉगआउट (Logout)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 1. Official Cream Dashboard Banner Card (JCERT / Samagra style format) */}
      <div className="bg-[#FAF7ED] border border-[#E5DEC9] rounded-2xl p-6 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 items-center text-left relative overflow-hidden">
        
        {/* Left column (Banner description) */}
        <div className="lg:col-span-7 space-y-4 z-10">
          <div className="flex items-center space-x-2">
            <span className="text-[9.5px] bg-[#E06D10] text-white px-2 py-0.5 rounded font-black uppercase tracking-wider">
              NIPUN BHARAT MTB-MLE PORTAL
            </span>
            <span className="text-[9.5px] bg-[#0F4D2A] text-white px-2 py-0.5 rounded font-black uppercase tracking-wider">
              {teacherData?.school || 'UPS Murhu Primary School'}
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-black text-slate-900 leading-tight">
              नमस्ते, {teacherData?.teacher?.name || 'सविता मुंडा'}!
            </h1>
            <h2 className="text-lg font-extrabold text-[#0F4D2A]">
              आज की कक्षा के लिए तैयार हैं?
            </h2>
          </div>

          <p className="text-xs text-slate-600 font-semibold leading-relaxed max-w-xl">
            AI की मदद से अब आप आसानी से हो, मुंडारी और संथाली में माँ-भाषा (MTB-MLE) आधारित शिक्षा दे सकते हैं। सभी शिक्षण सामग्री ऑफलाइन मोड में उपलब्ध हैं।
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1 font-sans">
            <button
              onClick={() => setActiveTab('curriculum')}
              className="bg-[#E06D10] hover:bg-[#c25e0c] text-white text-xs font-black px-5 py-2.5 rounded-lg shadow-xs cursor-pointer h-11 flex items-center space-x-1.5 transition-colors uppercase"
            >
              <span>पाठ्यविवरण देखें (View Curriculum) →</span>
            </button>
            
            <button
              onClick={handleSyncNow}
              disabled={syncStatus === 'syncing'}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-black rounded-lg h-11 flex items-center space-x-1 cursor-pointer disabled:opacity-50"
            >
              <span>{syncStatus === 'syncing' ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>
        </div>

        {/* Right column (Actual photo of the classroom) */}
        <div className="lg:col-span-5 relative z-10 w-full h-48 rounded-xl overflow-hidden shadow-md border-2 border-white/60">
          <img 
            src="/classroom_real.jpg" 
            alt="Real Classroom" 
            className="w-full h-full object-cover" 
          />
        </div>

      </div>

      {/* Emergency Offline Banner */}
      {!isOnline && (
        <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-lg text-xs font-semibold leading-relaxed animate-fade-in text-left space-y-2">
          <p className="text-amber-900 font-black flex items-center space-x-1.5">
            <span>📴</span>
            <span>INTERNET DISCONNECTED — Don't worry, PALASH continues working offline!</span>
          </p>
          <p className="text-slate-600 font-medium">
            All localized student speech processing, worksheets, vocab translations, and FLN curriculum outcome books are cached internally on this tablet device.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-emerald-800 font-black uppercase pt-1">
            <span>✓ Voice Bridge (Offline)</span>
            <span>✓ Bilingual Worksheets</span>
            <span>✓ Audio Lessons</span>
            <span>✓ EVS Animals Flashcards</span>
          </div>
        </div>
      )}

      {/* 2. Headline: Deep Forest Green themed (Point 2) */}
      <div className="bg-[#0F4D2A] text-white p-6 rounded-lg space-y-4 border border-emerald-950 relative shadow-3xs overflow-hidden">
        <div className="space-y-1.5 max-w-2xl">
          <span className="text-[8px] bg-[#E06D10] text-white font-black px-2 py-0.5 rounded uppercase tracking-wider">
            NIPUN FOCUSED TEACHING
          </span>
          <h2 className="text-lg font-black text-white leading-tight">मातृभाषा में पढ़ाएं — बिना भाषा प्रशिक्षण के</h2>
          <p className="text-xs text-[#A6C4B9] font-bold">
            Hindi-speaking teachers can now teach in Ho, Mundari, and Santhali. Aligned with NIPUN Bharat FLN learning goals.
          </p>
        </div>

        {/* Translation Flowchart diagram */}
        <div className="bg-[#082a17]/85 border border-white/5 p-4 rounded max-w-3xl">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center text-xs font-bold font-sans">
            <div className="space-y-1">
              <span className="text-[8.5px] bg-[#0F4D2A] border border-white/20 text-white px-2 py-0.5 rounded font-black uppercase">Teacher</span>
              <p className="text-white">Hindi 🇮🇳</p>
              <p className="text-[10px] text-emerald-250 italic mt-0.5">"बच्चों, आज हम संख्या सीखेंगे"</p>
            </div>
            <div className="text-[#E06D10] animate-pulse text-base">➔</div>
            <div className="space-y-1">
              <span className="text-[8.5px] bg-[#E06D10] text-white px-2 py-0.5 rounded font-black uppercase">✨ PALASH AI</span>
              <p className="text-indigo-200">Local ONNX Pipeline</p>
              <p className="text-[9.5px] text-indigo-400">⚡ &lt;3 sec latency</p>
            </div>
            <div className="text-[#E06D10] animate-pulse text-base">➔</div>
            <div className="space-y-1">
              <span className="text-[8.5px] bg-[#0F4D2A] border border-white/20 text-white px-2 py-0.5 rounded font-black uppercase">Students</span>
              <p className="text-white">{targetLanguage} (Regional) 🟢</p>
              <p className="text-[10px] text-emerald-300 font-mono mt-0.5">"होनको, तेइसिंग बु लेखा..."</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Hero Feature Area: Interactive Live Voice Bridge */}
      <div className="bg-white border border-slate-205 rounded-lg p-5 shadow-3xs space-y-4">
        <div className="flex justify-between items-start border-b border-slate-100 pb-3 flex-wrap gap-2">
          <div className="text-left font-sans">
            <span className="text-[8px] bg-indigo-50 text-indigo-650 px-2 py-0.5 border border-indigo-200 rounded font-black uppercase">HERO FEATURE</span>
            <h3 className="text-sm font-black text-slate-805 mt-1 flex items-center space-x-1.5">
              <span>🎙️ LIVE VOICE BRIDGE</span>
              <span className="text-[10px] text-slate-400 font-bold">(Hindi ➔ {targetLanguage})</span>
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('voice-bridge')}
            className="bg-[#E06D10] hover:bg-[#c25e0c] text-white text-xs font-black px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-3xs"
          >
            Open Live Voice Bridge →
          </button>
        </div>

        {/* Live Audio speak mock widget inside dashboard */}
        <div className="bg-[#FAF9F5] border border-slate-200 rounded p-5 text-center space-y-4">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-500 uppercase">शिक्षक बोलें (Hindi)</p>
            <p className="text-sm font-black text-slate-800">"बच्चों, किताब खोलिए।"</p>
          </div>

          <div className="flex justify-center items-center py-2.5">
            {isDemoTranslating ? (
              <div className="flex flex-col items-center space-y-2">
                <div className="flex space-x-1 justify-center items-center h-8 bg-white border border-slate-200 rounded-full px-4 w-48">
                  <span className="w-1 bg-[#0F4D2A] h-4 rounded animate-pulse"></span>
                  <span className="w-1 bg-[#0F4D2A] h-6 rounded animate-pulse delay-75"></span>
                  <span className="w-1 bg-[#0F4D2A] h-5 rounded animate-pulse delay-100"></span>
                  <span className="w-1 bg-[#0F4D2A] h-3 rounded animate-pulse delay-200"></span>
                </div>
                <p className="text-[10px] text-indigo-700 font-extrabold animate-pulse">✨ Translating speech...</p>
              </div>
            ) : demoTranslated ? (
              <div className="space-y-2.5 text-center">
                <div className="flex justify-center items-center space-x-2">
                  <span className="bg-emerald-50 text-emerald-808 border border-emerald-250 text-[9.5px] font-black px-2 py-0.5 rounded">
                    ⚡ {demoLatency}s Latency
                  </span>
                  <span className="text-[9.5px] text-slate-400 font-bold">Target: &lt; 3.0s</span>
                </div>
                <p className="text-sm font-black text-indigo-950 font-mono">"{demoTranslated}"</p>
                <button
                  onClick={() => {
                    if ('speechSynthesis' in window) {
                      window.speechSynthesis.cancel();
                      const u = new SpeechSynthesisUtterance(demoTranslated);
                      u.rate = 0.85;
                      window.speechSynthesis.speak(u);
                    }
                  }}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-650 text-xs font-black px-3.5 py-2 rounded-lg flex items-center space-x-1.5 mx-auto cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>सुनें (Play Ho Audio)</span>
                </button>
              </div>
            ) : (
              <button
                onClick={triggerDemoSpeak}
                className="w-16 h-16 bg-[#0F4D2A] hover:bg-[#09351C] text-white rounded-full flex items-center justify-center shadow-xs cursor-pointer hover:scale-105 active:scale-95 transition-all"
                title="Tap to speak"
              >
                <Mic className="w-6 h-6 animate-pulse" />
              </button>
            )}
          </div>

          <p className="text-[10px] text-slate-450 font-bold uppercase">
            ⚡ Telemetry: Local ONNX Pipeline • Latency: 1.12s • Offline Cache Ready
          </p>
        </div>
      </div>

      {/* 4. Today's Class Outcomes panel */}
      <div className="bg-white border border-slate-200 rounded p-5 shadow-3xs space-y-4">
        <h3 className="text-xs font-black text-slate-450 uppercase tracking-wider">Today's Class Goals</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          <div className="md:col-span-8 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
              <span className="text-[#0F4D2A] font-black">Grade 2</span>
              <span>•</span>
              <span>{selectedSubject}</span>
              <span>•</span>
              <span className="bg-[#FAF9F5] border border-slate-205 text-slate-650 px-2 py-0.5 rounded font-black">
                NIPUN Outcome Code: {activeChapter.nipun}
              </span>
            </div>
            <p className="text-xs font-bold text-[#E06D10] leading-relaxed bg-[#FAF9F5] border border-slate-200 p-3 rounded">
              🎯 लक्ष्य: "{activeChapter.outcomeText}"
            </p>
          </div>

          <div className="md:col-span-4 text-center md:text-right space-y-3 font-sans">
            <div className="text-xs font-bold">
              <span>Outcome Progress:</span>
              <span className="ml-2 font-black text-[#0F4D2A]">60% completed</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/50">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: '60%' }}></div>
            </div>
            
            <button
              onClick={() => {
                setSelectedNipunOutcome(activeChapter.nipun);
                setActiveTab('lessons');
              }}
              className="w-full sm:w-auto bg-[#0F4D2A] hover:bg-[#09351C] text-white text-xs font-black py-2.5 px-5 rounded-lg shadow-xs cursor-pointer transition-colors"
            >
              Continue Lesson →
            </button>
          </div>
        </div>
      </div>

      {/* 5. Curriculum Adaptation Grid */}
      <div className="bg-white border border-slate-200 rounded p-5 shadow-3xs space-y-4 font-sans">
        <h3 className="text-xs font-black text-slate-455 uppercase tracking-wider">Mother-Tongue Adaptation Library</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold text-slate-705">
          <div 
            onClick={() => setActiveTab('curriculum')}
            className="p-4 bg-[#FAF9F5] border border-slate-200 rounded hover:bg-slate-100/50 cursor-pointer transition-colors space-y-1"
          >
            <span className="text-[#0F4D2A] font-black uppercase text-[8.5px] block">Curriculum</span>
            <p className="font-extrabold text-slate-800">{selectedSubject} adapted chapters</p>
            <p className="text-[10px] text-slate-450 font-semibold">12 units aligned</p>
          </div>

          <div 
            onClick={() => setActiveTab('lessons')}
            className="p-4 bg-[#FAF9F5] border border-slate-200 rounded hover:bg-slate-100/50 cursor-pointer transition-colors space-y-1"
          >
            <span className="text-[#E06D10] font-black uppercase text-[8.5px] block">Worksheet</span>
            <p className="font-extrabold text-slate-800"> संख्या 1–5</p>
            <p className="text-[10px] text-slate-450 font-semibold">4 active exercises</p>
          </div>

          <div 
            onClick={() => setActiveTab('vocabulary')}
            className="p-4 bg-[#FAF9F5] border border-slate-200 rounded hover:bg-slate-100/50 cursor-pointer transition-colors space-y-1"
          >
            <span className="text-indigo-700 font-black uppercase text-[8.5px] block">Vocabulary</span>
            <p className="font-extrabold text-slate-800">Regulated flash vocabularies</p>
            <p className="text-[10px] text-slate-455 font-semibold">24 definitions downloaded</p>
          </div>
        </div>
      </div>

      {/* 6. AI Engine status checks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-sans">
        
        {/* Compatible validation */}
        <div className="bg-white border border-slate-200 rounded p-5 shadow-3xs space-y-3 text-xs font-bold text-slate-700">
          <h4 className="text-xs font-black text-slate-805 uppercase tracking-wider">Device Compatibility</h4>
          <div className="divide-y divide-slate-100">
            <div className="flex justify-between py-2">
              <span className="text-slate-450 font-medium">Tablet Model:</span>
              <span className="text-slate-808 font-extrabold">Tablet-04 (Offline ready)</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-455 font-medium">Android version:</span>
              <span className="text-emerald-808 font-black">Android 9+ ✓</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-455 font-medium">RAM size:</span>
              <span className="text-emerald-808 font-black">2 GB RAM ✓</span>
            </div>
          </div>
        </div>

        {/* AI System Health indicators */}
        <div className="bg-white border border-slate-200 rounded p-5 shadow-3xs space-y-3 text-xs font-bold text-slate-700">
          <h4 className="text-xs font-black text-slate-805 uppercase tracking-wider">PALASH AI System Health</h4>
          <div className="divide-y divide-slate-100">
            <div className="flex justify-between py-2">
              <span className="text-slate-450 font-medium">Speech Translation:</span>
              <span className="text-emerald-750 font-black">🟢 Local ONNX Runtime</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-450 font-medium">Voice Synthesizer:</span>
              <span className="text-emerald-750 font-black">🟢 Loaded locally</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-455 font-medium">{targetLanguage} Translation Model:</span>
              <span className="text-emerald-750 font-black">🟢 Cache Active</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
