import React, { useState } from 'react';
import { TeacherProfile } from '../types/models';
import { MOCK_DISTRICTS } from '../utils/mockDistricts';

interface RegisterScreenProps {
  onRegisterSuccess: (teacher: TeacherProfile) => void;
  onNavigateLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onRegisterSuccess, onNavigateLogin }) => {
  const [fullName, setFullName] = useState('');
  const [teacherId, setTeacherId] = useState('TCH-JH-');
  const [districtId, setDistrictId] = useState(MOCK_DISTRICTS[0].id);
  const [udiseCode, setUdiseCode] = useState('');
  const [schoolName, setSchoolName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const district = MOCK_DISTRICTS.find(d => d.id === districtId) || MOCK_DISTRICTS[0];
    const profile: TeacherProfile = {
      id: `tch_${Date.now()}`,
      name: fullName.trim() || 'नवीन शिक्षक',
      teacherCode: teacherId.trim() || 'TCH-JH-9999',
      district: district.name.split('(')[0].trim(),
      block: 'सदर ब्लॉक',
      schoolName: schoolName.trim() || 'राजकीय प्राथमिक विद्यालय',
      udiseCode: udiseCode.trim() || '20190109999',
      assignedClass: '1',
      preferredLanguage: district.primaryLanguage,
      qualification: 'B.Ed / D.El.Ed Certified',
      experienceYears: 1,
      nipunCertified: true,
      token: `jwt_token_${Date.now()}`,
    };
    onRegisterSuccess(profile);
  };

  return (
    <div className="min-h-screen bg-[#FFFBEB] flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-[#FDE68A] p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-[#78350F]">नया शिक्षक पंजीकरण (Register)</h2>
          <p className="text-xs text-gray-500 font-semibold mt-1">VaniSetu OS • Samagra Shiksha Jharkhand</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          <div>
            <label className="block text-gray-700 mb-1 font-bold">शिक्षक का पूरा नाम (Full Name):</label>
            <input
              type="text"
              required
              placeholder="e.g. बिरसा टोपनो"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 font-bold focus:ring-2 focus:ring-[#E06D10] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-bold">Teacher ID (TCH-JH-XXXX):</label>
            <input
              type="text"
              required
              value={teacherId}
              onChange={e => setTeacherId(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 font-bold focus:ring-2 focus:ring-[#E06D10] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-bold">जिला चुनें (District):</label>
            <select
              value={districtId}
              onChange={e => setDistrictId(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 font-bold focus:ring-2 focus:ring-[#E06D10] focus:outline-none"
            >
              {MOCK_DISTRICTS.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-bold">11-अंकीय UDISE कोड (School UDISE):</label>
            <input
              type="text"
              required
              placeholder="e.g. 20190104201"
              value={udiseCode}
              onChange={e => setUdiseCode(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 font-bold focus:ring-2 focus:ring-[#E06D10] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-bold">विद्यालय का नाम (School Name):</label>
            <input
              type="text"
              required
              placeholder="e.g. राजकीय प्राथमिक विद्यालय"
              value={schoolName}
              onChange={e => setSchoolName(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 font-bold focus:ring-2 focus:ring-[#E06D10] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#E06D10] hover:bg-[#C25A08] text-white py-3 rounded-xl font-black text-sm shadow-md transition-all mt-4"
          >
            ➔ पंजीकरण पूर्ण करें व डेटा सिंक करें
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500 font-medium">
            पहले से पंजीकृत हैं?{' '}
            <button
              onClick={onNavigateLogin}
              className="text-[#0F4D2A] font-black hover:underline ml-1"
            >
              यहाँ लॉगिन करें (Login)
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
