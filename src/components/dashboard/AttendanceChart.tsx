import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getSchoolAttendanceMonthly } from '../../services/dataService';

export default function AttendanceChart() {
  const data = getSchoolAttendanceMonthly().map(d => ({
    ...d,
    attendance: Math.round(d.attendance * 10) / 10,
  }));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">School Attendance Trend</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <YAxis domain={[85, 100]} tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}
              formatter={(value) => [`${value}%`, 'Attendance']}
            />
            <Line type="monotone" dataKey="attendance" stroke="#0284c7" strokeWidth={2.5} dot={{ r: 4, fill: '#0284c7' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
