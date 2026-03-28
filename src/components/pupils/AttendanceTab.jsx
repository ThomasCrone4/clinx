import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function AttendanceTab({ pupil }) {
  // Monthly aggregation
  const monthlyData = [];
  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const history = pupil.attendanceHistory;
  const chunkSize = Math.floor(history.length / 6);

  for (let i = 0; i < 6; i++) {
    const chunk = history.slice(i * chunkSize, (i + 1) * chunkSize);
    const present = chunk.filter(d => d.am === 'Present').length;
    const total = chunk.length || 1;
    monthlyData.push({
      month: months[i],
      pupil: Math.round((present / total) * 100),
      school: 93 + (Math.random() - 0.5) * 2,
    });
  }

  // Recent records
  const recentRecords = history.slice(-20).reverse();

  // Absence pattern
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const absentByDay = {};
  history.forEach(r => {
    if (r.am === 'Absent') {
      const day = dayNames[new Date(r.date).getDay()];
      absentByDay[day] = (absentByDay[day] || 0) + 1;
    }
  });
  const totalAbsences = Object.values(absentByDay).reduce((s, v) => s + v, 0);
  const peakDay = Object.entries(absentByDay).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">Attendance Over Time</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis domain={[40, 100]} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }} />
              <Line type="monotone" dataKey="pupil" name="Pupil" stroke="#0284c7" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="school" name="School Avg" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pattern analysis */}
      {peakDay && totalAbsences > 3 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm text-amber-800">
            📊 <strong>Absence pattern detected:</strong> Most absences on {peakDay[0]}s ({peakDay[1]} of {totalAbsences} absences)
          </p>
        </div>
      )}

      {/* Recent records table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">AM Session</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">PM Session</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {recentRecords.map((r, i) => (
              <tr key={i}>
                <td className="px-4 py-2.5 text-sm text-gray-700">{r.date}</td>
                <td className="px-4 py-2.5">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    r.am === 'Present' ? 'bg-emerald-100 text-emerald-700' :
                    r.am === 'Late' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>{r.am}</span>
                </td>
                <td className="px-4 py-2.5">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    r.pm === 'Present' ? 'bg-emerald-100 text-emerald-700' :
                    r.pm === 'Late' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>{r.pm}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
