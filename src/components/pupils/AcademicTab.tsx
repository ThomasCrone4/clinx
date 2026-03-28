import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

export default function AcademicTab({ pupil }) {
  const subjectData = pupil.homeworkHistory.subjects || [];
  const chartData = subjectData.map(s => ({
    subject: s.subject,
    pct: s.pct,
    formAvg: 85 + Math.floor(Math.random() * 8),
  }));

  return (
    <div className="space-y-4">
      {/* Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">Homework Submission % by Subject</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="subject" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }} />
              <Bar dataKey="pct" name="Pupil %" fill="#0284c7" radius={[4, 4, 0, 0]} />
              <Bar dataKey="formAvg" name="Form Avg %" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Subject</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Homework %</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Trend</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Last Submission</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {subjectData.map(s => (
              <tr key={s.subject}>
                <td className="px-4 py-2.5 text-sm font-medium text-gray-700">{s.subject}</td>
                <td className="px-4 py-2.5">
                  <span className={`text-sm font-medium ${s.pct < 60 ? 'text-red-600' : s.pct < 75 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {s.pct}%
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <span className="flex items-center gap-1 text-xs">
                    {s.trend === 'Declining' ? <TrendingDown className="w-3.5 h-3.5 text-red-500" /> :
                     s.trend === 'Improving' ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> :
                     <Minus className="w-3.5 h-3.5 text-gray-400" />}
                    <span className="text-gray-500">{s.trend}</span>
                  </span>
                </td>
                <td className="px-4 py-2.5 text-sm text-gray-500">{s.lastSubmission}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
