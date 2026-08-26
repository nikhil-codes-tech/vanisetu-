import React, { useState, useEffect } from 'react';
import { JHARKHAND_DISTRICTS, TRIBAL_LANGUAGES, MOCK_SCHOOLS } from '../data/jharkhandData';
import { CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import canvasConfetti from 'canvas-confetti';

// Dynamic generator for schools/teachers per district
function getSchoolsForDistrict(dist) {
  const matches = MOCK_SCHOOLS.filter(s => s.district.toLowerCase() === dist.toLowerCase());
  if (matches.length > 0) return matches;
  
  return [
    {
      udiseCode: `20${Math.floor(100103001 + (dist.charCodeAt(0) || 65) * 123456)}`,
      name: `Govt. Primary School, ${dist}`,
      district: dist,
      block: `${dist} Sadar`,
      teachers: [
        {
          id: `TCH-${dist.substring(0,3).toUpperCase()}-01`,
          name: `सुनीता मुर्मू (Sunita Murmu)`,
          avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
          assignedClass: "कक्षा 2 (Grade 2)",
          subject: "गणित (Mathematics)",
          primaryTribalLang: "ho",
          pin: "1234"
        },
        {
          id: `TCH-${dist.substring(0,3).toUpperCase()}-02`,
          name: `बिरसा हांसदा (Birsa Hansda)`,
          avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
          assignedClass: "कक्षा 1 (Grade 1)",
          subject: "भाषा एवं साक्षरता (Hindi FLN)",
          primaryTribalLang: "ho",
          pin: "1234"
        }
      ]
    },
    {
      udiseCode: `20${Math.floor(100203001 + (dist.charCodeAt(0) || 65) * 234567)}`,
      name: `UPS Tribal School, ${dist}`,
      district: dist,
      block: `${dist} Block B`,
      teachers: [
        {
          id: `TCH-${dist.substring(0,3).toUpperCase()}-03`,
          name: `अंजलि सोरेन (Anjali Soren)`,
          avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
          assignedClass: "कक्षा 3 (Grade 3)",
          subject: "पर्यावरण अध्ययन (EVS)",
          primaryTribalLang: "santhali",
          pin: "4321"
        }
      ]
    }
  ];
}

export default function TeacherAuth({ onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('quick-login');
  
  // Rotating backgrounds
  const backgrounds = ['/classroom_1.jpg', '/classroom_2.jpg', '/classroom_3.jpg'];
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  // Quick Login State
  const [selectedDistrict, setSelectedDistrict] = useState('Khunti');
  const [selectedSchoolUdise, setSelectedSchoolUdise] = useState('20190100201');
  const [selectedTeacherId, setSelectedTeacherId] = useState('TCH-201-01');
  const [authError, setAuthError] = useState('');

  const schoolsForDistrict = getSchoolsForDistrict(selectedDistrict);
  
  useEffect(() => {
    if (schoolsForDistrict.length > 0) {
      setSelectedSchoolUdise(schoolsForDistrict[0].udiseCode);
    }
  }, [selectedDistrict]);

  useEffect(() => {
    const matchedSchool = schoolsForDistrict.find(s => s.udiseCode === selectedSchoolUdise);
    if (matchedSchool && matchedSchool.teachers.length > 0) {
      setSelectedTeacherId(matchedSchool.teachers[0].id);
    }
  }, [selectedSchoolUdise, selectedDistrict]);

  const currentSchool = schoolsForDistrict.find(s => s.udiseCode === selectedSchoolUdise);
  const currentTeacher = currentSchool?.teachers.find(t => t.id === selectedTeacherId);

  // Registration State
  const [regForm, setRegForm] = useState({
    fullName: '',
    teacherCode: '',
    district: 'Khunti',
    schoolName: '',
    udiseCode: '',
    grade: 'कक्षा 2 (Grade 2)',
    subject: 'गणित (Mathematics)',
    targetLanguage: 'ho'
  });

  // Success Popout States
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successType, setSuccessType] = useState('login'); 
  const [pendingTeacherData, setPendingTeacherData] = useState(null);

  const handleQuickLogin = (e) => {
    e.preventDefault();
    if (!currentTeacher) return;
    
    const profile = {
      ...currentTeacher,
      schoolName: currentSchool.name,
      udiseCode: currentSchool.udiseCode,
      district: currentSchool.district,
      block: currentSchool.block
    };

    setPendingTeacherData(profile);
    setSuccessType('login');
    setShowSuccessModal(true);
    canvasConfetti({ particleCount: 80, spread: 50, origin: { y: 0.6 } });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const newTeacher = {
      id: regForm.teacherCode || `TCH-${Math.floor(1000 + Math.random() * 9000)}`,
      name: regForm.fullName,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      assignedClass: regForm.grade,
      subject: regForm.subject,
      primaryTribalLang: regForm.targetLanguage,
      schoolName: regForm.schoolName,
      udiseCode: regForm.udiseCode,
      district: regForm.district,
      block: "Local Block"
    };

    setPendingTeacherData(newTeacher);
    setSuccessType('register');
    setShowSuccessModal(true);
    canvasConfetti({ particleCount: 80, spread: 50, origin: { y: 0.6 } });
  };

  const triggerSuccessProceed = () => {
    setShowSuccessModal(false);
    if (pendingTeacherData) {
      onLoginSuccess(pendingTeacherData);
    }
  };

  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        triggerSuccessProceed();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);

  return (
    <div 
      className="min-h-screen flex flex-col justify-center items-center p-4 font-sans text-slate-805 relative overflow-y-auto py-12 transition-all duration-1000"
      style={{ 
        backgroundImage: `url(${backgrounds[bgIndex]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-[#072415]/45 z-0"></div>

      {/* Success modal popout overlay */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center space-y-4 border border-emerald-500/20 shadow-2xl relative">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-850">
                {successType === 'login' ? 'लॉगिन सफल! (Login Successful)' : 'पंजीकरण सफल! (Registration Successful)'}
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                {successType === 'login' ? 'शिक्षक प्रोफ़ाइल मिलान कर ली गई है।' : 'नया शिक्षक प्रोफ़ाइल सुरक्षित कर लिया गया है।'}
              </p>
            </div>

            <div className="p-3 bg-slate-50 border rounded-lg text-xs leading-normal font-bold">
              <p className="text-[#0F4D2A] font-black">{pendingTeacherData?.name}</p>
              <p className="text-slate-550 mt-0.5">{pendingTeacherData?.schoolName}</p>
            </div>

            <div className="text-[10px] text-slate-400 font-semibold flex items-center justify-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
              <span>Redirecting to classroom dashboard...</span>
            </div>

            <button
              onClick={triggerSuccessProceed}
              className="w-full py-2.5 bg-[#0F4D2A] hover:bg-[#09351C] text-white text-xs font-black rounded-lg cursor-pointer h-10"
            >
              आगे बढ़ें (Proceed Now)
            </button>
          </div>
        </div>
      )}

      {/* Top Gov Header - Removed top-right status pill (Point 1) */}
      <div className="w-full max-w-5xl mb-4 flex items-center justify-between text-white border-b border-emerald-800/60 pb-3 z-10 relative">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center p-0.5 shadow-md overflow-hidden flex-shrink-0">
            <img 
              src="/vanisetu_logo.jpg" 
              alt="VaniSetu Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-left font-sans">
            {/* Removed Red NEW Badge next to PALASH VaniSetu title (Point 1) */}
            <h1 className="text-xl font-black tracking-wide text-emerald-100 leading-none">PALASH VaniSetu</h1>
            <p className="text-xs text-emerald-350 font-bold mt-1.5">झारखण्ड शिक्षा परियोजना परिषद • JCERT / NIPUN Bharat MTB-MLE Suite</p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 border border-emerald-900/20 z-10 relative">
        
        {/* Left Side: Real Classroom Visuals */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#0c3b23] to-[#062013] text-white p-6 md:p-8 flex flex-col justify-between relative overflow-hidden text-left">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-0.5 shadow-md overflow-hidden flex-shrink-0">
                <img 
                  src="/vanisetu_logo.jpg" 
                  alt="VaniSetu Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-sm font-black tracking-wider text-emerald-100">VaniSetu OS</span>
            </div>

            <div className="inline-block bg-amber-500/20 text-amber-300 text-xs px-2.5 py-1 rounded-md font-medium mb-4 border border-amber-500/30">
              PALASH Mother Tongue Bridge
            </div>
            <h2 className="text-2xl font-bold leading-tight mb-2">मातृभाषा आधारित शिक्षण प्रणाली</h2>
            <p className="text-sm text-emerald-200/90 leading-relaxed mb-6">
              Empowering Hindi-medium primary school teachers to conduct interactive FLN lessons in Santhali, Ho, and Mundari without prior language training.
            </p>

            <div className="mt-4 rounded-xl overflow-hidden border border-white/10 shadow-lg bg-[#0F4D2A]/10">
              <img 
                src="/login_benefits.png" 
                alt="VaniSetu Login Benefits" 
                className="w-full object-contain"
              />
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-emerald-800/80 mt-6 flex items-center justify-between text-[11px] text-emerald-350 font-sans font-bold">
            <span>JCERT Approved FLN Framework</span>
            <span className="font-mono">v2.4-offline</span>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="md:col-span-7 p-6 md:p-8 bg-slate-50 flex flex-col justify-center text-left">
          {/* Tab Switcher */}
          <div className="flex bg-slate-200/70 p-1 rounded-xl mb-6 max-w-sm mx-auto w-full">
            <button
              onClick={() => setActiveTab('quick-login')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'quick-login' ? 'bg-[#0F4D2A] text-white shadow-sm' : 'text-slate-600 hover:text-slate-905'
              }`}
            >
              ⚡ शिक्षक लॉगिन (Quick Login)
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'register' ? 'bg-[#0F4D2A] text-white shadow-sm' : 'text-slate-600 hover:text-slate-905'
              }`}
            >
              📝 नया शिक्षक पंजीकरण (Register)
            </button>
          </div>

          {/* Quick Login Form */}
          {activeTab === 'quick-login' && (
            <form onSubmit={handleQuickLogin} className="space-y-5 font-sans text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  1. जिला चुनें (Select District)
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full bg-white border border-slate-350 rounded-lg px-3 py-2.5 text-xs font-medium text-slate-808 focus:ring-2 focus:ring-[#0F4D2A] outline-none h-11 cursor-pointer"
                >
                  {JHARKHAND_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    2. विद्यालय (School UDISE)
                  </label>
                  <select
                    value={selectedSchoolUdise}
                    onChange={(e) => setSelectedSchoolUdise(e.target.value)}
                    className="w-full bg-white border border-slate-350 rounded-lg px-3 py-2.5 text-xs font-medium text-slate-808 focus:ring-2 focus:ring-[#0F4D2A] outline-none h-11 cursor-pointer"
                  >
                    {schoolsForDistrict.map((sch) => (
                      <option key={sch.udiseCode} value={sch.udiseCode}>
                        {sch.name} ({sch.udiseCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    3. शिक्षक प्रोफाइल (Teacher)
                  </label>
                  <select
                    value={selectedTeacherId}
                    onChange={(e) => setSelectedTeacherId(e.target.value)}
                    className="w-full bg-white border border-slate-355 rounded-lg px-3 py-2.5 text-xs font-medium text-slate-808 focus:ring-2 focus:ring-[#0F4D2A] outline-none h-11 cursor-pointer"
                  >
                    {currentSchool?.teachers.map((tch) => (
                      <option key={tch.id} value={tch.id}>
                        {tch.name} • {tch.subject}
                      </option>
                    ))}
                  </select>
                </div>
              </div>



              <button
                type="submit"
                className="w-full py-3 hover:opacity-95 text-white rounded-xl text-xs font-black shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer h-12"
                style={{ backgroundColor: '#0F4D2A' }}
              >
                <span>कक्षा सत्र शुरू करें (Enter Classroom Suite)</span>
                <span>→</span>
              </button>
            </form>
          )}

          {/* Registration Form */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4 font-sans text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">शिक्षक का नाम (Full Name)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. सुनीता मुर्मू"
                    value={regForm.fullName}
                    onChange={e => setRegForm({...regForm, fullName: e.target.value})}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-700 outline-none h-11"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">शिक्षक कोड (Teacher ID)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TCH-JH-8842"
                    value={regForm.teacherCode}
                    onChange={e => setRegForm({...regForm, teacherCode: e.target.value})}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-700 outline-none h-11"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">जिला (District)</label>
                  <select
                    value={regForm.district}
                    onChange={e => setRegForm({...regForm, district: e.target.value})}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-700 outline-none h-11 cursor-pointer"
                  >
                    {JHARKHAND_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">विद्यालय UDISE कोड</label>
                  <input
                    type="text"
                    required
                    placeholder="11-digit UDISE Code"
                    value={regForm.udiseCode}
                    onChange={e => setRegForm({...regForm, udiseCode: e.target.value})}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-700 outline-none h-11"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">कक्षा (Class)</label>
                  <select
                    value={regForm.grade}
                    onChange={e => setRegForm({...regForm, grade: e.target.value})}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2 py-2 text-xs h-11 cursor-pointer"
                  >
                    <option>कक्षा 1 (Grade 1)</option>
                    <option>कक्षा 2 (Grade 2)</option>
                    <option>कक्षा 3 (Grade 3)</option>
                    <option>कक्षा 4 (Grade 4)</option>
                    <option>कक्षा 5 (Grade 5)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">विषय (Subject)</label>
                  <select
                    value={regForm.subject}
                    onChange={e => setRegForm({...regForm, subject: e.target.value})}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2 py-2 text-xs h-11 cursor-pointer"
                  >
                    <option>गणित (Mathematics)</option>
                    <option>भाषा (Hindi FLN)</option>
                    <option>पर्यावरण अध्ययन (EVS)</option>
                    <option>अंग्रेज़ी (English)</option>
                    <option>विज्ञान (Science)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">मातृभाषा (Target)</label>
                  <select
                    value={regForm.targetLanguage}
                    onChange={e => setRegForm({...regForm, targetLanguage: e.target.value})}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2 py-2 text-xs h-11 cursor-pointer"
                  >
                    {TRIBAL_LANGUAGES.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 hover:opacity-95 text-white rounded-xl text-xs font-black shadow-md transition-all cursor-pointer h-12"
                style={{ backgroundColor: '#0F4D2A' }}
              >
                पंजीकरण पूर्ण करें व डेटा सिंक करें (Register & Cache)
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Visual Classroom Grid */}
      <div className="w-full max-w-5xl mt-8 bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl p-6 space-y-4 text-left z-10 relative">
        <h4 className="text-xs font-black text-white uppercase tracking-wide">
          📸 झारखण्ड की कक्षाओं में Palash VaniSetu (Classroom Implementation)
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl overflow-hidden shadow-md h-36 border border-white/10">
            <img src="/classroom_4.jpg" alt="Classroom 4" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
          </div>
          <div className="rounded-xl overflow-hidden shadow-md h-36 border border-white/10">
            <img src="/classroom_5.jpg" alt="Classroom 5" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
          </div>
          <div className="rounded-xl overflow-hidden shadow-md h-36 border border-white/10">
            <img src="/classroom_6.jpg" alt="Classroom 6" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
          </div>
          <div className="rounded-xl overflow-hidden shadow-md h-36 border border-white/10">
            <img src="/classroom_7.jpg" alt="Classroom 7" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
          </div>
        </div>
      </div>

      {/* Footer Co-branding section (Point 2) */}
      <footer className="w-full max-w-5xl mt-8 pt-6 border-t border-emerald-800/40 text-center text-white/70 text-[9.5px] font-bold z-10 relative space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>Jharkhand Education Initiative • Samagra Shiksha</span>
          
          <div className="flex items-center gap-3">
            <span>Developed by Vanitech</span>
            <span>•</span>
            <span className="text-emerald-300 font-extrabold flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-850 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              Offline Ready Engine (≤2GB RAM)
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
