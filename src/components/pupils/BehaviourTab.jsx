import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle } from 'lucide-react';

const severityColors = {
  Minor: 'bg-yellow-100 text-yellow-700',
  Moderate: 'bg-orange-100 text-orange-700',
  Major: 'bg-red-100 text-red-700',
};

export default function BehaviourTab({ pupil }) {
  const incidents = pupil.behaviourHistory;

  // Monthly aggregation
  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const monthlyCounts = months.map((month, i) => {
    const target = i < 3 ? `2025-${String(10 + i).padStart(2, '0')}` : `2026-${String(i - 2).padStart(2, '0')}`;
    const count = incidents.filter(inc => inc.date.startsWith(target)).length;
    return { month, count };
  });

  return (
    <div className="space-y-4">
      {/* Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">Monthly Incident Count</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyCounts}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }} />
              <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">Incident Timeline</h4>
        {incidents.length === 0 ? (
          <p className="text-sm text-gray-400">No behaviour incidents recorded</p>
        ) : (
          <div className="space-y-0">
            {incidents.map((inc, i) => (
              <div key={i} className="flex gap-4 pb-4 relative">
                {/* Timeline line */}
                {i < incidents.length - 1 && (
                  <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-gray-200" />
                )}
                <div className="shrink-0 mt-1">
                  <AlertCircle className="w-6 h-6 text-orange-400" />
                </div>
                <div className="flex-1 bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-500">{inc.date}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${severityColors[inc.severity]}`}>
                      {inc.severity}
                    </span>
                    <span className="text-xs text-gray-400">{inc.type}</span>
                  </div>
                  <p className="text-sm text-gray-700">{inc.description}</p>
                  <p className="text-xs text-gray-400 mt-1">Logged by: {inc.loggedBy}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
