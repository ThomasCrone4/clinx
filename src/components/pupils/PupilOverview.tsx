import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import type { AttendanceTrend, Pupil } from '../../types/domain';

type PupilOverviewProps = {
  pupil: Pupil;
};

function TrendIcon({ trend }: { trend: AttendanceTrend }) {
  if (trend === 'Declining') return <TrendingDown className="w-4 h-4 text-red-500" />;
  if (trend === 'Improving') return <TrendingUp className="w-4 h-4 text-emerald-500" />;
  return <Minus className="w-4 h-4 text-gray-400" />;
}

function Sparkline({ data, color = '#0284c7' }: { data: Array<{ v: number }>; color?: string }) {
  return (
    <div className="h-8 w-20">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function PupilOverview({ pupil }: PupilOverviewProps) {
  const attSparkline = pupil.attendanceHistory.slice(-30).reduce<Array<{ v: number }>>((acc, r, i) => {
    if (i % 5 === 0) {
      const chunk = pupil.attendanceHistory.slice(Math.max(0, i - 5), i + 1);
      const present = chunk.filter(d => d.am === 'Present').length;
      acc.push({ v: (present / Math.max(chunk.length, 1)) * 100 });
    }
    return acc;
  }, []).slice(-6);

  const behSparkline = pupil.behaviourHistory.slice(-6).map((_, i) => ({
    v: pupil.behaviourHistory.slice(0, i + 1).length,
  }));

  const wellSparkline = pupil.wellbeingHistory.map(w => ({ v: w.score }));

  const cards: Array<{
    label: string;
    value: string | number;
    trend: AttendanceTrend;
    sparkline: Array<{ v: number }>;
    color: string;
  }> = [
    {
      label: 'Attendance',
      value: `${pupil.attendance}%`,
      trend: pupil.attendanceTrend,
      sparkline: attSparkline,
      color: pupil.attendance < 85 ? '#ef4444' : '#10b981',
    },
    {
      label: 'Behaviour Incidents (4w)',
      value: pupil.behaviourIncidents,
      trend: pupil.behaviourIncidents > 3 ? 'Declining' : 'Stable',
      sparkline: behSparkline,
      color: pupil.behaviourIncidents > 3 ? '#ef4444' : '#10b981',
    },
    {
      label: 'Homework',
      value: `${pupil.homeworkPct}%`,
      trend: pupil.homeworkPct < 70 ? 'Declining' : 'Stable',
      sparkline: [{ v: 85 }, { v: 80 }, { v: 75 }, { v: 70 }, { v: pupil.homeworkPct }, { v: pupil.homeworkPct }],
      color: pupil.homeworkPct < 70 ? '#ef4444' : '#10b981',
    },
    {
      label: 'Wellbeing Score',
      value: `${pupil.wellbeingScore}/10`,
      trend: pupil.wellbeingScore <= 4 ? 'Declining' : 'Stable',
      sparkline: wellSparkline,
      color: pupil.wellbeingScore <= 4 ? '#ef4444' : '#10b981',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {cards.map(card => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500">{card.label}</p>
              <TrendIcon trend={card.trend} />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-2">{card.value}</p>
            <Sparkline data={card.sparkline} color={card.color} />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick Info</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-400 text-xs">Form Tutor</p>
            <p className="font-medium text-gray-700">Staff assigned to {pupil.form}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Classes Enrolled</p>
            <p className="font-medium text-gray-700">{pupil.classIds.length} classes</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">SEND / FSM Status</p>
            <p className="font-medium text-gray-700">
              {pupil.send !== 'None' ? pupil.send : 'None'} / {pupil.fsm ? 'Eligible' : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
