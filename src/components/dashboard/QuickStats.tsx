import { Users, TrendingUp, AlertTriangle, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getPupilStats } from '../../services/dataService';
import { useAppData } from '../../context/AppDataContext';

export default function QuickStats() {
  const navigate = useNavigate();
  const stats = getPupilStats();
  const { unreadAlerts } = useAppData();
  const activeAlerts = unreadAlerts.length;
  const pupilsNeedingReview = stats.high + stats.medium;

  const items = [
    { label: 'Total Pupils', value: stats.total, icon: Users, color: 'text-sky-600', to: '/dashboard/pupils' },
    { label: 'Avg Attendance', value: `${stats.avgAttendance}%`, icon: TrendingUp, color: 'text-emerald-600' },
    { label: 'Open Alerts', value: activeAlerts, icon: AlertTriangle, color: 'text-amber-600', to: '/dashboard/alerts' },
    { label: 'Flagged for Review', value: pupilsNeedingReview, icon: Brain, color: 'text-violet-600' },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {items.map(item => (
        <button
          key={item.label}
          onClick={item.to ? () => navigate(item.to) : undefined}
          disabled={!item.to}
          className={`bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 text-left ${
            item.to ? 'transition-colors hover:bg-slate-50 cursor-pointer' : 'cursor-default'
          }`}
        >
          <div className={`w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center ${item.color}`}>
            <item.icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            <p className="text-xs text-gray-500">{item.label}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
