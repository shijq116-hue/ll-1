import React from 'react';
import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';

// Mock data for stress patterns
const STRESS_DATA = [
  { syllable: 'Pho', stress: 10, label: 'Strong' },
  { syllable: 'to', stress: 3, label: 'Weak' },
  { syllable: 'graph', stress: 8, label: 'Secondary' },
  { syllable: 'ic', stress: 3, label: 'Weak' },
];

const CHINESE_COMPARISON_DATA = [
  { syllable: 'Pai', stress: 10 },
  { syllable: 'She', stress: 10 },
  { syllable: 'Zhao', stress: 10 },
  { syllable: 'Pian', stress: 10 },
];

const RhythmVisualizer: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <h3 className="text-lg font-bold text-slate-800 mb-1">Rhythm & Stress</h3>
      <p className="text-slate-500 text-sm mb-6">English is "Stress-Timed" (Music), Chinese is "Syllable-Timed" (Robot).</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* English */}
        <div>
           <div className="flex justify-between mb-2">
             <span className="text-sm font-semibold text-indigo-600">English: Photographic</span>
           </div>
           <div className="h-32 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={STRESS_DATA}>
                 <Bar dataKey="stress" radius={[4, 4, 0, 0]}>
                   {STRESS_DATA.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.stress > 5 ? '#4F46E5' : '#A5B4FC'} />
                   ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
           <div className="flex justify-between text-xs text-slate-400 mt-2 px-2">
              <span>Pho</span><span>to</span><span>graph</span><span>ic</span>
           </div>
        </div>

        {/* Chinese Comparison */}
        <div>
           <div className="flex justify-between mb-2">
             <span className="text-sm font-semibold text-slate-500">Chinese: 拍摄照片 (Pāishè zhàopiàn)</span>
           </div>
           <div className="h-32 w-full opacity-60 grayscale">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={CHINESE_COMPARISON_DATA}>
                 <Bar dataKey="stress" radius={[4, 4, 0, 0]} fill="#64748B" />
               </BarChart>
             </ResponsiveContainer>
           </div>
           <div className="flex justify-between text-xs text-slate-400 mt-2 px-2">
              <span>Pai</span><span>She</span><span>Zhao</span><span>Pian</span>
           </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-indigo-50 rounded-lg text-sm text-indigo-800">
        <strong>Key:</strong> In English, eat the weak syllables (make them fast and quiet: "schwa" /ə/). Don't pronounce every syllable clearly like in Chinese!
      </div>
    </div>
  );
};

export default RhythmVisualizer;
