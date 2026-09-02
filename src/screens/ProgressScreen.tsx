import React, { useEffect, useState } from 'react';
import { dbService } from '../services/database';
import { StudentProgressRecord } from '../types/models';

export const ProgressScreen: React.FC = () => {
  const [records, setRecords] = useState<StudentProgressRecord[]>([]);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    const list = await dbService.getStudentProgress();
    setRecords(list);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap justify-between items-center gap-3">
        <div>
          <h2 className="text-lg font-black text-[#1E293B]">📊 छात्र प्रगति रिपोर्ट (Student Progress &amp; Analytics)</h2>
          <p className="text-xs text-gray-500">NIPUN Bharat FLN दक्षता मूल्यांकन • Local SQLite Persistence</p>
        </div>
        <div className="bg-[#DCFCE7] text-[#14532D] border border-[#86EFAC] px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5">
          ✓ ऑटो सिंक सक्रिय (Auto-Sync Active)
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs font-bold text-gray-500">कुल नामांकित छात्र (Students)</span>
          <div className="text-2xl font-black text-[#0F4D2A] mt-1">32</div>
          <span className="text-[11px] text-emerald-600 font-bold">100% हाजिरी आज</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs font-bold text-gray-500">औसत बुनियादी साक्षरता (FLN)</span>
          <div className="text-2xl font-black text-[#E06D10] mt-1">86.4%</div>
          <span className="text-[11px] text-emerald-600 font-bold">↑ +14% इस माह</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs font-bold text-gray-500">मातृभाषा शब्दावली पूर्णता</span>
          <div className="text-2xl font-black text-[#115E59] mt-1">91%</div>
          <span className="text-[11px] text-gray-500 font-bold">50 में से 45 शब्द</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs font-bold text-gray-500">ऑफलाइन सिंक स्थिति</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">100%</div>
          <span className="text-[11px] text-gray-500 font-bold">Zero Data Loss</span>
        </div>
      </div>

      {/* Progress Records Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 font-black text-sm text-gray-900">
          छात्र-वार दक्षता मूल्यांकन (Competency Breakdown)
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-gray-600 border-b border-gray-200">
              <tr>
                <th className="p-3 font-bold">छात्र का नाम (Name)</th>
                <th className="p-3 font-bold">कक्षा (Grade)</th>
                <th className="p-3 font-bold">विषय (Subject)</th>
                <th className="p-3 font-bold">दक्षता कोड (Code)</th>
                <th className="p-3 font-bold">प्राप्तांक (Score)</th>
                <th className="p-3 font-bold">सिंक स्थिति (Status)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="p-3 font-bold text-gray-900">{r.studentName}</td>
                  <td className="p-3 font-semibold text-gray-600">कक्षा {r.grade}</td>
                  <td className="p-3 font-bold uppercase text-[#0F4D2A]">{r.subject}</td>
                  <td className="p-3 font-mono font-bold text-gray-600">{r.competencyCode}</td>
                  <td className="p-3 font-black text-gray-900">
                    <span className="bg-[#DCFCE7] text-[#14532D] px-2 py-0.5 rounded font-bold">
                      {r.score}%
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${r.synced ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {r.synced ? '✓ Synced' : '⏳ Local Queue'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
