import React, { useState, useEffect, useRef } from 'react';
import { JHARKHAND_DISTRICTS, MOCK_TEACHERS } from '../utils/mockData';
import Avatar from './Avatar';

function getSchoolCode(schoolName) {
  let hash = 0;
  for (let i = 0; i < schoolName.length; i++) {
    hash = schoolName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const code = Math.abs(hash) % 10000;
  return `JH-SCH-${code.toString().padStart(4, '0')}`;
}

export default function Login({ onLogin }) {
  const [isFirstTimeSetup, setIsFirstTimeSetup] = useState(false);

  // Government credential bindings
  const [teacherShikshakId, setTeacherShikshakId] = useState('JH-TCH-20102');
  const [district, setDistrict] = useState('Khunti');
  const [school, setSchool] = useState('UPS Murhu Primary School');
  const [pin, setPin] = useState(['', '', '', '']);
  const [targetLanguage, setTargetLanguage] = useState('हो');
  const [classLevel, setClassLevel] = useState('Grade 2');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const pinRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const handlePinChange = (value, index) => {
    const cleanValue = value.replace(/\D/g, '');
    if (!cleanValue) {
      const newPin = [...pin];
      newPin[index] = '';
      setPin(newPin);
      return;
    }
    
    const newPin = [...pin];
    newPin[index] = cleanValue.substring(cleanValue.length - 1);
    setPin(newPin);
    
    if (index < 3) {
      pinRefs[index + 1].current.focus();
    }
  };

  const handlePinKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const newPin = [...pin];
      if (pin[index] === '') {
        if (index > 0) {
          newPin[index - 1] = '';
          setPin(newPin);
          pinRefs[index - 1].current.focus();
        }
      } else {
        newPin[index] = '';
        setPin(newPin);
      }
    }
  };

  const handleQuickLoginSubmit = () => {
    setLoading(true);
    setError('');
    setTimeout(() => {
      const matched = MOCK_TEACHERS.find(t => t.shikshakId === 'JH-TCH-20102');
      onLogin({
        teacher: matched,
        isOffline: true,
        sourceLanguage: 'हिंदी',
        targetLanguage: 'हो',
        school: 'UPS Murhu Primary School',
        district: 'Khunti',
        classLevel: 'Grade 2',
        udiseCode: '20110300101'
      });
    }, 700);
  };

  const handleSubmitSetup = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!teacherShikshakId.trim()) {
      setError('कृपया शिक्षक Shikshak ID दर्ज करें।');
      setLoading(false);
      return;
    }

    const matched = MOCK_TEACHERS.find(
      t => t.shikshakId.toLowerCase() === teacherShikshakId.trim().toLowerCase()
    );

    if (!matched) {
      setError('अमान्य Shikshak ID। (उदा: JH-TCH-20102 दर्ज करें)');
      setLoading(false);
      return;
    }

    if (pin.some(val => val === '')) {
      setError('कृपया 4-अंकीय ऑफलाइन पिन दर्ज करें।');
      setLoading(false);
      return;
    }

    const enteredPin = pin.join('');
    if (enteredPin !== '1234') {
      setError('गलत सुरक्षा PIN (सही PIN: 1234)');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      onLogin({
        teacher: matched,
        isOffline: true,
        sourceLanguage: 'हिंदी',
        targetLanguage: targetLanguage,
        school: school,
        district: district,
        classLevel: classLevel,
        udiseCode: '20110300101'
      });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-10 px-4 flex flex-col justify-between items-center text-slate-805 font-sans leading-normal">
      
      {/* Institutional Top Co-branding Header bar */}
      <div className="max-w-[1050px] w-full flex flex-col sm:flex-row justify-between items-center bg-white border border-slate-200 p-4 rounded-lg shadow-3xs mb-6 text-center sm:text-left gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 bg-slate-50 border rounded flex items-center justify-center font-black text-xs text-emerald-800">
            झारखंड
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-850">SAMAGRA SHIKSHA JHARKHAND</h4>
            <p className="text-[9px] text-slate-455 font-bold uppercase tracking-wider">Department of School Education & Literacy</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-4">
          <div className="text-right leading-none">
            <h5 className="text-[10.5px] font-black text-[#E06D10]">JCERT & NIPUN BHARAT</h5>
            <p className="text-[8.5px] text-slate-400 font-bold uppercase tracking-widest mt-1">Bilingual Mother Tongue Initiative</p>
          </div>
        </div>
      </div>

      {/* Main Grid Wrapper */}
      <div className="max-w-[1050px] w-full bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col md:flex-row items-stretch shadow-sm">
        
        {/* Left Side Column: Brand & Benefits */}
        <div className="w-full md:w-[42%] bg-[#0F4D2A] p-8 text-white flex flex-col justify-between border-r border-emerald-950 text-left space-y-6">
          <div className="space-y-6">
            <div>
              <span className="text-[9.5px] bg-[#E06D10] text-white px-2 py-0.5 rounded font-black uppercase tracking-wider">
                Govt. Approved Portal
              </span>
              <h2 className="text-xl font-black text-white leading-none mt-2">PALASH Vani Setu</h2>
              <p className="text-[10px] text-[#A6C4B9] font-black uppercase tracking-wider mt-1.5 leading-none">
                Mother-Tongue Classroom OS
              </p>
            </div>

            <p className="text-xs text-emerald-100/90 leading-relaxed font-semibold">
              Hindi-trained teachers can deliver foundational learning in Ho, Mundari, and Santhali using on-device real-time voice translation models.
            </p>

            <div className="space-y-4 pt-2 font-sans text-xs">
              <div className="space-y-1">
                <p className="text-[10.5px] text-white font-black uppercase">🎙️ Voice Bridge (Real-Time)</p>
                <p className="text-[9.5px] text-[#A6C4B9] font-semibold pl-1">Low-latency offline voice-to-voice translation.</p>
              </div>
              <div className="space-y-1 border-t border-[#185c37] pt-3">
                <p className="text-[10.5px] text-white font-black uppercase">📚 NIPUN Outcomes Aligned</p>
                <p className="text-[9.5px] text-[#A6C4B9] font-semibold pl-1">JCERT Grade 1-3 bilingual learning competencies.</p>
              </div>
              <div className="space-y-1 border-t border-[#185c37] pt-3">
                <p className="text-[10.5px] text-white font-black uppercase">📴 Low-Ram Android Tablet Optimized</p>
                <p className="text-[9.5px] text-[#A6C4B9] font-semibold pl-1">100% Offline execution on 2GB RAM devices.</p>
              </div>
            </div>
          </div>

          <div className="text-[9px] text-[#A6C4B9] pt-4 font-black uppercase tracking-widest border-t border-[#185c37]">
            SAMAGRA SHIKSHA ABHIYAN
          </div>
        </div>

        {/* Right Side: Setup form */}
        <div className="flex-1 p-8 bg-white flex flex-col justify-between text-left">
          
          {!isFirstTimeSetup ? (
            /* Quick login template greeting (Point 20) */
            <div className="my-auto space-y-6">
              <div>
                <h3 className="text-lg font-black text-slate-805 leading-none">Welcome back, सविता मुंडा! 👋</h3>
                <p className="text-[10.5px] text-slate-450 mt-1 font-bold">Assigned School: UPS Murhu Primary (Khunti)</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded text-xs font-semibold leading-relaxed space-y-2">
                <div className="flex justify-between border-b pb-1.5 text-slate-500 text-[10px] uppercase font-black">
                  <span>UDISE Metadata Details</span>
                  <span className="text-[#E06D10]">Linked</span>
                </div>
                <p className="text-slate-800 font-extrabold">🏫 UDISE School Code: 20110300101</p>
                <p className="text-slate-800 font-bold">👩‍🏫 Shikshak ID: JH-TCH-20102</p>
                <p className="text-indigo-950 font-black">🌐 Target Dialect: हो (Ho) • Grade 2</p>
              </div>

              <button
                onClick={handleQuickLoginSubmit}
                disabled={loading}
                className="w-full bg-[#0F4D2A] hover:bg-[#09351C] text-white font-black h-12 rounded shadow-xs flex items-center justify-center space-x-2 text-xs uppercase cursor-pointer"
                style={{ backgroundColor: '#0F4D2A' }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>कक्षा शुरू करें (Start Class) →</span>
                )}
              </button>

              <div className="text-center">
                <button
                  onClick={() => setIsFirstTimeSetup(true)}
                  className="text-xs font-black text-[#E06D10] hover:underline cursor-pointer"
                >
                  Configure new teacher profile (दूसरा शिक्षक आईडी दर्ज करें)
                </button>
              </div>
            </div>
          ) : (
            /* First Time Setup with UDISE ID fields (Point 21) */
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-black text-slate-805 leading-none">Register Teacher Account</h3>
                <p className="text-[10.5px] text-slate-455 mt-1 font-bold">Enter your registered JCERT Shikshak details</p>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs font-bold text-rose-700 animate-pulse">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmitSetup} className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-[9px] font-black text-slate-500 uppercase mb-1">Shikshak ID (शिक्षक आईडी)</label>
                    <input
                      type="text"
                      value={teacherShikshakId}
                      onChange={(e) => setTeacherShikshakId(e.target.value)}
                      placeholder="उदा. JH-TCH-20102"
                      className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs font-bold text-slate-808 h-11 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[8.5px] font-black text-slate-400 uppercase mb-1">District</label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 font-bold h-10 cursor-pointer text-slate-700"
                      >
                        <option value="Khunti">Khunti</option>
                        <option value="Ranchi">Ranchi</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[8.5px] font-black text-slate-400 uppercase mb-1">Target Language</label>
                      <select
                        value={targetLanguage}
                        onChange={(e) => setTargetLanguage(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 font-bold h-10 cursor-pointer text-slate-700"
                      >
                        <option value="हो">हो (Ho)</option>
                        <option value="संथाली">संथाली (Santhali)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[9.5px] font-black text-slate-500 uppercase">
                    ऑफलाइन सुरक्षा PIN (1234)
                  </label>
                  <div className="flex space-x-2">
                    {[0, 1, 2, 3].map(idx => (
                      <input
                        key={idx}
                        ref={pinRefs[idx]}
                        type="password"
                        maxLength={1}
                        value={pin[idx]}
                        onChange={(e) => handlePinChange(e.target.value, idx)}
                        onKeyDown={(e) => handlePinKeyDown(e, idx)}
                        className="w-10 h-10 border border-slate-200 bg-slate-50 rounded text-center text-sm font-bold focus:outline-none"
                        placeholder="•"
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0F4D2A] hover:bg-[#09351C] text-white font-black h-12 rounded flex items-center justify-center space-x-2 disabled:opacity-50 text-xs uppercase cursor-pointer"
                  style={{ backgroundColor: '#0F4D2A' }}
                >
                  {loading ? 'शिक्षक आईडी जाँची जा रही है...' : 'Verify ID & Start →'}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsFirstTimeSetup(false)}
                    className="text-xs text-slate-500 font-bold hover:underline cursor-pointer"
                  >
                    वापस (Quick Login)
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

      </div>

      {/* Before / With Comparison Block */}
      <div className="max-w-[1050px] w-full bg-white border border-slate-200 rounded p-6 text-left space-y-4 shadow-3xs">
        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">कक्षा में प्रभाव (Classroom Impact comparison)</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-bold leading-normal">
          <div className="bg-rose-50/50 border border-rose-200 p-4 rounded space-y-2">
            <span className="text-[9px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-black uppercase">❌ Without PALASH</span>
            <p className="text-slate-808 font-extrabold">Hindi-medium teacher struggles to explain content.</p>
            <p className="text-slate-500 font-medium">Children cannot understand instructions in Hindi, leading to learning gaps.</p>
          </div>

          <div className="bg-emerald-50/50 border border-emerald-250 p-4 rounded space-y-2">
            <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-black uppercase">✨ With PALASH</span>
            <p className="text-emerald-950 font-extrabold">Hindi-speaking teacher speaks naturally.</p>
            <p className="text-slate-650 font-medium">Real-time offline voice bridge translates instructions into mother-tongue Ho/regional audio, improving student understanding.</p>
          </div>
        </div>
      </div>

      {/* Institutional Footer */}
      <footer className="max-w-[1050px] w-full pt-8 text-center space-y-4 text-[9.5px] text-slate-450 font-semibold border-t border-slate-200">
        <div className="space-y-1">
          <p className="text-[#0F4D2A] font-black text-xs uppercase tracking-wide">PALASH Vani Setu</p>
          <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">
            Mother-Tongue Classroom for Tribal-Area Schools
          </p>
        </div>

        <div className="space-y-0.5">
          <p className="text-slate-700 font-bold">Jharkhand Education Initiative</p>
          <p className="text-slate-400">Government of Jharkhand Project</p>
        </div>

        <div className="text-slate-600 font-black text-[9.5px] tracking-wide">
          Developed by Vanitech
        </div>

        <div className="flex justify-center space-x-3 text-slate-400">
          <span className="hover:underline cursor-pointer">Privacy</span>
          <span>·</span>
          <span className="hover:underline cursor-pointer">सहायता</span>
          <span>·</span>
          <span className="hover:underline cursor-pointer">भाषा</span>
        </div>

        <div className="text-[8px] text-slate-350">
          © 2026 PALASH Vani Setu
        </div>
      </footer>

    </div>
  );
}
