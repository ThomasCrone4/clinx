import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Info } from 'lucide-react';

export default function WellbeingTab({ pupil }) {
  const history = pupil.wellbeingHistory.map(w => ({
    ...w,
    yearAvg: 7.2 + (Math.random() - 0.5),
  }));

  const lastSurvey = history[history.length - 1];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">Wellbeing Score Over Time</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }} />
              <Line type="monotone" dataKey="score" name="Pupil" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="yearAvg" name="Year Avg" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
              <ReferenceLine y={4} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Concern threshold', fontSize: 11, fill: '#ef4444' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Last survey */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Last Survey Response</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-400 text-xs">Date</p>
            <p className="font-medium text-gray-700">{lastSurvey?.date || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Score</p>
            <p className={`font-bold text-lg ${lastSurvey?.score <= 4 ? 'text-red-600' : lastSurvey?.score <= 6 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {lastSurvey?.score}/10
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Year Group Average</p>
            <p className="font-medium text-gray-700">7.2/10</p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-2">
        <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-700">
          Self-reported data — for context only, not diagnostic. Wellbeing scores are one data point among many and should be interpreted alongside other indicators.
        </p>
      </div>
    </div>
  );
}
