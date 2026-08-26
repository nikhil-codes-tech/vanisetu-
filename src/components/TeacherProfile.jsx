import React from 'react';
import Avatar from './Avatar';

export default function TeacherProfile({ 
  teacherData, 
  classLevel, 
  setClassLevel, 
  onLogout 
}) {
  const teacher = teacherData || { name: "सविता मुंडा", id: "TCH-201-01", subject: "गणित" };

  // Hardcoded realistic educational qualification details (Point 2)
  const qualifications = [
    { label: "Educational Qualification", value: "M.A. in Tribal Languages & Literature" },
    { label: "Professional Certificate", value: "B.Ed (JCERT Certified FLN Lead Trainer)" },
    { label: "Designation", value: "Primary Grade Assistant Teacher (PRT)" },
    { label: "Teaching Experience", value: "8 Years in Jharkhand Government Schools" },
    { label: "Date of Joining", value: "12-Jul-2018" }
  ];

  return (
    <div className="p-6 bg-[#FDFBF7] min-h-screen text-slate-805 text-left leading-normal font-sans">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* Breadcrumbs */}
        <div className="text-[10px] font-bold text-slate-400 uppercase flex space-x-1.5 font-sans">
          <span>System</span>
          <span>/</span>
          <span>Teacher Profile</span>
        </div>

        {/* Profile Card */}
        <div className="bg-white border border-[#E5DEC9] rounded-2xl shadow-3xs overflow-hidden">
          
          {/* Header background banner */}
          <div className="h-28 bg-[#0F4D2A] relative flex items-end px-6 pb-4">
            <div className="absolute top-4 right-4 bg-emerald-950/65 text-emerald-300 border border-emerald-800/40 text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase">
              Active Session
            </div>
          </div>

          <div className="p-6 pt-12 relative text-left space-y-5">
            {/* Avatar positioning */}
            <div className="absolute -top-10 left-6">
              <Avatar name={teacher.name} size="md" border={true} />
            </div>

            {/* Teacher general info */}
            <div>
              <h2 className="text-base font-black text-slate-900 leading-none">{teacher.name}</h2>
              <p className="text-[10.5px] text-slate-455 font-semibold mt-1">
                Shikshak ID: {teacher.id} · UDISE school: {teacher.udiseCode || '20190100201'}
              </p>
            </div>

            {/* Qualifications list */}
            <div className="border-t border-slate-100 pt-4 space-y-2.5 text-xs font-semibold">
              <h4 className="text-[9.5px] text-[#0F4D2A] font-black uppercase tracking-wider">Teacher Qualifications & Credentials</h4>
              <div className="space-y-2 font-medium">
                {qualifications.map((q, idx) => (
                  <div key={idx} className="flex justify-between py-1 border-b border-dashed border-slate-100">
                    <span className="text-slate-455">{q.label}</span>
                    <span className="text-slate-808 font-bold text-right">{q.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Change Class Dropdown Option (Point 2) */}
            <div className="border-t border-slate-100 pt-4 space-y-2 font-bold text-xs">
              <label htmlFor="classSelector" className="block text-[9.5px] text-[#0F4D2A] font-black uppercase tracking-wider mb-1.5">
                Change Assigned Class (कक्षा बदलें)
              </label>
              <select
                id="classSelector"
                value={classLevel}
                onChange={(e) => {
                  setClassLevel(e.target.value);
                  alert(`Assigned class updated to ${e.target.value}`);
                }}
                className="w-full bg-slate-50 border border-slate-205 rounded p-2.5 font-extrabold text-slate-755 cursor-pointer h-11 focus:outline-none"
              >
                <option value="कक्षा 1 (Grade 1)">कक्षा 1 (Grade 1)</option>
                <option value="कक्षा 2 (Grade 2)">कक्षा 2 (Grade 2)</option>
                <option value="कक्षा 3 (Grade 3)">कक्षा 3 (Grade 3)</option>
              </select>
            </div>

            {/* Logout button (Point 2) */}
            <div className="border-t border-slate-100 pt-4">
              <button
                onClick={onLogout}
                className="w-full bg-rose-650 hover:bg-rose-750 text-white text-xs font-black py-3 rounded-lg shadow-xs cursor-pointer h-12 transition-colors uppercase text-center"
              >
                लॉगआउट (Logout)
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
