import { Users, TrendingUp, AlertTriangle, BookOpen } from 'lucide-react';
import { getPupilStats, getAllAlerts } from '../../services/dataService';

export default function QuickStats() {
  const stats = getPupilStats();
  const activeAlerts = getAllAlerts().filter(a => a.status === 'Unread').length;

  const items = [
    { label: 'Total Pupils', value: stats.total, icon: Users, color: 'text-sky-600' },
    { label: 'Avg Attendance', value: `${stats.avgAttendance}%`, icon: TrendingUp, color: 'text-emerald-600' },
    { label: 'Active Alerts', value: activeAlerts, icon: AlertTriangle, color: 'text-amber-600' },
    { label: 'Year Groups', value: '4', icon: BookOpen, color: 'text-purple-600' },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {items.map(item => (
        <div key={item.label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center ${item.color}`}>
            <item.icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            <p className="text-xs text-gray-500">{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
