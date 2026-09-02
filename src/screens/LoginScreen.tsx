import React, { useState } from 'react';
import { TeacherProfile } from '../types/models';
import { MOCK_DISTRICTS } from '../utils/mockDistricts';

interface LoginScreenProps {
  onLoginSuccess: (teacher: TeacherProfile) => void;
  onNavigateRegister: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onNavigateRegister }) => {
  const [selectedDistrictId, setSelectedDistrictId] = useState(MOCK_DISTRICTS[0].id);
  const selectedDistrict = MOCK_DISTRICTS.find(d => d.id === selectedDistrictId) || MOCK_DISTRICTS[0];
  const [selectedSchoolUdise, setSelectedSchoolUdise] = useState(selectedDistrict.schools[0].udiseCode);
  const selectedSchool = selectedDistrict.schools.find(s => s.udiseCode === selectedSchoolUdise) || selectedDistrict.schools[0];
  const [selectedTeacherName, setSelectedTeacherName] = useState(selectedSchool.teachers[0]);

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dId = e.target.value;
    setSelectedDistrictId(dId);
    const d = MOCK_DISTRICTS.find(item => item.id === dId) || MOCK_DISTRICTS[0];
    setSelectedSchoolUdise(d.schools[0].udiseCode);
    setSelectedTeacherName(d.schools[0].teachers[0]);
  };

  const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const udise = e.target.value;
    setSelectedSchoolUdise(udise);
    const s = selectedDistrict.schools.find(item => item.udiseCode === udise) || selectedDistrict.schools[0];
    setSelectedTeacherName(s.teachers[0]);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const profile: TeacherProfile = {
      id: `tch_${Date.now()}`,
      name: selectedTeacherName.split('(')[0].trim(),
      teacherCode: selectedTeacherName.includes('(') ? selectedTeacherName.split('(')[1].replace(')', '').trim() : 'TCH-JH-0182',
      district: selectedDistrict.name.split('(')[0].trim(),
      block: selectedSchool.block.split('(')[0].trim(),
      schoolName: selectedSchool.name,
      udiseCode: selectedSchool.udiseCode,
      assignedClass: '1',
      preferredLanguage: selectedDistrict.primaryLanguage,
      qualification: 'B.Ed / D.El.Ed Certified',
      experienceYears: 6,
      nipunCertified: true,
      token: `jwt_mock_token_${Date.now()}`,
    };
    onLoginSuccess(profile);
  };

  return (
    <div className="min-h-screen bg-[#F0FDF4] flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-[#86EFAC]/60 p-6">
        {/* Brand Banner */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#0F4D2A] text-white flex items-center justify-center font-black text-2xl mb-2 shadow-md">
            V
          </div>
          <h2 className="text-2xl font-black text-[#0F4D2A]">वाणीसेतु VaniSetu OS</h2>
          <p className="text-xs text-gray-500 font-semibold mt-1">झारखंड प्राथमिक शिक्षा • MTB-MLE शिक्षक पोर्टल</p>
        </div>

        {/* Quick Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-semibold">
          {/* District Select */}
          <div>
            <label className="block text-gray-700 mb-1 font-bold">1. जिला चुनें (Select District):</label>
            <select
              value={selectedDistrictId}
              onChange={handleDistrictChange}
              className="w-full bg-[#F8FAFC] border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 font-bold focus:ring-2 focus:ring-[#0F4D2A] focus:outline-none"
            >
              {MOCK_DISTRICTS.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* School Select */}
          <div>
            <label className="block text-gray-700 mb-1 font-bold">2. विद्यालय चुनें (Select School UDISE):</label>
            <select
              value={selectedSchoolUdise}
              onChange={handleSchoolChange}
              className="w-full bg-[#F8FAFC] border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 font-bold focus:ring-2 focus:ring-[#0F4D2A] focus:outline-none"
            >
              {selectedDistrict.schools.map(s => (
                <option key={s.udiseCode} value={s.udiseCode}>
                  {s.name} ({s.udiseCode})
                </option>
              ))}
            </select>
          </div>

          {/* Teacher Select */}
          <div>
            <label className="block text-gray-700 mb-1 font-bold">3. शिक्षक का नाम (Select Teacher):</label>
            <select
              value={selectedTeacherName}
              onChange={e => setSelectedTeacherName(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 font-bold focus:ring-2 focus:ring-[#0F4D2A] focus:outline-none"
            >
              {selectedSchool.teachers.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Enter Classroom Button */}
          <button
            type="submit"
            className="w-full bg-[#0F4D2A] hover:bg-[#14532D] text-white py-3 rounded-xl font-black text-sm shadow-md transition-all mt-4"
          >
            ➔ कक्षा सत्र शुरू करें (Enter Classroom)
          </button>
        </form>

        {/* Register Alternate Link */}
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500 font-medium">
            नया शिक्षक?{' '}
            <button
              onClick={onNavigateRegister}
              className="text-[#E06D10] font-black hover:underline ml-1"
            >
              यहाँ पंजीकरण करें (Register)
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
