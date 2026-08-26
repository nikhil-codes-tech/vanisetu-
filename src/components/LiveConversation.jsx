import React, { useState, useEffect, useRef } from 'react';
import { getScenarioDialogues, LANGUAGES_METADATA } from '../utils/mockData';
import { Mic, Volume2, PhoneOff } from 'lucide-react';
import Avatar from './Avatar';

export default function LiveConversation({ 
  sourceLanguage, 
  targetLanguage, 
  currentTeacher, 
  onSpeak,
  sharedClassroomMessage,
  setSharedClassroomMessage
}) {
  const [sessionStarted, setSessionStarted] = useState(false);
  const [conversation, setConversation] = useState([
    { speaker: 'teacher', sourceText: 'आज हम गिनती सीखेंगे।', targetText: targetLanguage === 'हो' ? 'तेइसिंग बु लेखा रेयाः बु इतुआ।' : 'तिहिंग बु लेखा रेयाः बु इतुआ।', latency: '1.12' }
  ]);
  const [currentSpeaker, setCurrentSpeaker] = useState(null); 
  const [latencyText, setLatencyText] = useState('Ready');
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isCallActive, setIsCallActive] = useState(false);

  const scenarioDialogues = getScenarioDialogues(sourceLanguage, targetLanguage);
  const timerRef = useRef(null);

  useEffect(() => {
    let interval = null;
    if (isCallActive) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      setSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  useEffect(() => {
    handleReset();
    setSessionStarted(false);
  }, [sourceLanguage, targetLanguage]);

  const handleReset = () => {
    setConversation([
      { speaker: 'teacher', sourceText: 'आज हम गिनती सीखेंगे।', targetText: targetLanguage === 'हो' ? 'तेइसिंग बु लेखा रेयाः बु इतुआ।' : 'तिहिंग बु लेखा रेयाः बु इतुआ।', latency: '1.12' }
    ]);
    setCurrentSpeaker(null);
    setIsRecording(false);
    setLatencyText('Ready');
    setIsCallActive(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleStartClass = () => {
    setSessionStarted(true);
    setIsCallActive(true);
  };

  const handleResetSession = () => {
    handleReset();
    setSessionStarted(false);
  };

  const handleSimulateNextStep = () => {
    if (isRecording || currentSpeaker) return;

    const nextIndex = conversation.length;
    if (nextIndex >= scenarioDialogues.length) {
      alert("संवाद समाप्त हो गया है!");
      return;
    }

    const nextLineObj = scenarioDialogues[nextIndex];
    
    setCurrentSpeaker(nextLineObj.speaker);
    setIsRecording(true);
    setLatencyText('Listening...');

    timerRef.current = setTimeout(() => {
      setIsRecording(false);
      setLatencyText('Translating...');
      
      const randomLatency = (0.5 + Math.random() * 0.8).toFixed(2);
      
      timerRef.current = setTimeout(() => {
        setLatencyText(`Translated in ${randomLatency}s`);
        setConversation(prev => [...prev, { ...nextLineObj, latency: randomLatency }]);
        
        onSpeak(
          nextLineObj.speaker === 'teacher' ? nextLineObj.sourceText : nextLineObj.targetText, 
          nextLineObj.speaker === 'teacher' ? sourceLanguage : targetLanguage
        );

        setCurrentSpeaker(null);
      }, 700);

    }, 1500);
  };

  const speakSharedAIMessage = () => {
    if (!sharedClassroomMessage) return;

    const nextLineObj = {
      speaker: 'teacher',
      sourceText: sharedClassroomMessage,
      targetText: sharedClassroomMessage.includes("पेड़ों के बारे में") 
        ? (targetLanguage === 'हो' ? 'होनको, तेइसिंग बु दारूको रेयाः बु इतुआ।' : 'होनको, तिहिंग बु दारूको रेयाः बु इतुआ।')
        : "अनुवाद उपलब्ध नहीं है",
      latency: "1.12"
    };

    setConversation(prev => [...prev, nextLineObj]);
    onSpeak(nextLineObj.sourceText, sourceLanguage);
    setSharedClassroomMessage('');
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (!sessionStarted) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-6 text-slate-805 text-left font-sans animate-fade-in">
        
        {/* Pre-Gate Panel */}
        <div className="bg-white border-2 border-[#0F4D2A] rounded-lg p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[#0F4D2A] font-black text-xs uppercase block tracking-wider">कक्षा प्रबंधन (Classroom Setup)</span>
            <h2 className="text-xl font-black text-slate-850 mt-1">कक्षा शुरू हो रही है (Class Starting)</h2>
          </div>

          <div className="space-y-4 text-xs font-bold">
            <div className="grid grid-cols-2 gap-4 text-slate-700 bg-slate-50 p-4 rounded border border-slate-200 leading-normal">
              <div>
                <span className="text-[8px] text-slate-400 uppercase">Subject:</span>
                <p className="text-sm font-black text-[#0F4D2A]">गणित (Mathematics)</p>
              </div>
              <div>
                <span className="text-[8px] text-slate-400 uppercase">Chapter:</span>
                <p className="text-sm font-black text-slate-800">संख्या पहचानो (1-5)</p>
              </div>
              <div className="border-t border-slate-200/60 pt-3">
                <span className="text-[8px] text-slate-400 uppercase">Grade:</span>
                <p className="text-sm font-black text-slate-808">कक्षा 2 (Grade 2)</p>
              </div>
              <div className="border-t border-slate-200/60 pt-3">
                <span className="text-[8px] text-slate-400 uppercase">Languages:</span>
                <p className="text-sm font-black text-indigo-900 font-mono">Hindi ➔ {targetLanguage}</p>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-250 rounded text-xs font-semibold leading-relaxed">
              <span className="text-[8px] text-[#0F4D2A] font-black uppercase">Lesson Objective:</span>
              <p className="text-emerald-950 mt-1 font-bold">"बच्चे 1–5 तक की संख्याओं को पहचान सकेंगे और मात्रा मिलान अभ्यास पूरा करेंगे।"</p>
            </div>
          </div>

          <button
            onClick={handleStartClass}
            className="w-full bg-[#0F4D2A] hover:bg-[#09351C] text-white font-bold h-12 rounded shadow-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer text-xs uppercase"
            style={{ backgroundColor: '#0F4D2A' }}
          >
            <span>▶ कक्षा शुरू करें (Start Classroom Session)</span>
          </button>
        </div>

      </div>
    );
  }

  return (
    <div className="p-6 bg-[#FDFBF7] min-h-screen text-slate-805 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {sharedClassroomMessage && (
          <div className="bg-indigo-50 border-2 border-indigo-200 p-4 rounded-lg flex justify-between items-center text-left shadow-3xs animate-pulse">
            <div className="space-y-1">
              <span className="text-[8.5px] bg-indigo-650 text-white px-2 py-0.5 rounded font-black uppercase">✨ AI translation message</span>
              <p className="text-xs font-black text-indigo-950">"{sharedClassroomMessage}"</p>
            </div>
            <button
              onClick={speakSharedAIMessage}
              className="bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-black px-4.5 py-2 rounded-lg shadow-xs cursor-pointer h-10"
            >
              कक्षा में बोलें (Play to students)
            </button>
          </div>
        )}

        {/* Classroom Simulator HUD */}
        <div className="bg-white border border-slate-205 rounded-lg overflow-hidden shadow-3xs text-left">
          
          <div className="bg-rose-50 border-b border-rose-200 px-5 py-3 flex justify-between items-center text-xs font-black text-rose-805">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 bg-rose-600 rounded-full animate-ping"></span>
              <span>🔴 LIVE SESSION</span>
            </div>
            <div className="flex space-x-3 text-[10px]">
              <span>Grade 2</span>
              <span>•</span>
              <span>28 Students</span>
              <span>•</span>
              <span>Hindi ➔ {targetLanguage} (1.12 sec)</span>
            </div>
          </div>

          <div className="p-5 space-y-5">
            
            {/* Speak block */}
            <div className="bg-[#FAF9F5] border border-slate-200 rounded p-6 text-center space-y-4 max-w-xl mx-auto">
              <span className="text-[8px] bg-indigo-50 text-indigo-705 px-2 py-0.5 rounded border border-indigo-200 font-black uppercase">
                🎙 Speak to Class
              </span>

              <div className="py-2">
                <button
                  onClick={handleSimulateNextStep}
                  disabled={isRecording || currentSpeaker !== null}
                  className="w-16 h-16 bg-[#0F4D2A] hover:bg-[#09351C] text-white rounded-full flex items-center justify-center mx-auto shadow-xs cursor-pointer active:scale-95 disabled:opacity-40 transition-all"
                  style={{ backgroundColor: '#0F4D2A' }}
                >
                  <Mic className="w-6 h-6" />
                </button>
                <p className="text-[10px] text-slate-450 font-bold mt-1.5">Tap to speak instruction</p>
              </div>

              {isRecording ? (
                <p className="text-xs font-bold text-slate-500 animate-pulse">{latencyText}</p>
              ) : (
                <div className="space-y-2 text-xs font-bold">
                  <p className="text-slate-500">Current instruction: "सब बच्चे संख्या 1 दिखाएं।"</p>
                  <p className="text-indigo-950 font-mono text-sm font-black border-l-2 border-indigo-200 pl-3">
                    Ho translation: "होनको, लेखा मियाद उदुब पे।"
                  </p>

                  <button
                    onClick={() => onSpeak("होनको, लेखा मियाद उदुब पे।", targetLanguage)}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-650 text-[10.5px] font-black py-1.5 px-3 rounded flex items-center space-x-1 mx-auto cursor-pointer h-10"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>🔊 Play to students</span>
                  </button>
                </div>
              )}
            </div>

            {/* Conversation logs list */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Dialogue Log</h4>
              
              <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                {conversation.map((log, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3.5 border rounded-lg relative text-xs font-bold leading-normal ${
                      log.speaker === 'teacher' 
                        ? 'bg-slate-50 border-slate-200 mr-8' 
                        : 'bg-indigo-50/50 border-indigo-150 ml-8'
                    }`}
                  >
                    <div className="flex justify-between items-center text-[7.5px] text-slate-400 uppercase tracking-wide mb-1">
                      <span>{log.speaker === 'teacher' ? 'Teacher ➔ Student' : 'Student ➔ Teacher'}</span>
                      <span className="text-emerald-700 font-extrabold">{log.latency}s latency</span>
                    </div>
                    <p className="text-slate-805">"{log.sourceText}"</p>
                    <p className="text-indigo-900 border-t border-slate-200/60 pt-1 mt-1 font-mono">"{log.targetText}"</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="flex justify-between items-center px-5 py-3.5 border-t border-slate-100 bg-[#FAF9F5] flex-wrap gap-2 text-xs">
            <button
              onClick={handleResetSession}
              className="px-4 py-2 border border-rose-300 hover:bg-rose-50 text-rose-700 text-xs font-black rounded-lg cursor-pointer h-10 flex items-center space-x-1 shadow-3xs"
            >
              <PhoneOff className="w-3.5 h-3.5" />
              <span>End Classroom Session</span>
            </button>

            <span className="text-[8px] text-slate-405 font-bold uppercase">
              PALASH VaniSetu • SAMAGRA SHIKSHA JHARKHAND
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
