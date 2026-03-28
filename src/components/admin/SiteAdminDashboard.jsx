import { Building2, Users, BarChart3, AlertTriangle } from 'lucide-react';
import { getPupilStats, getAllAlerts } from '../../services/dataService';
import { useNavigate } from 'react-router-dom';

export default function SiteAdminDashboard() {
  const stats = getPupilStats();
  const alerts = getAllAlerts().filter(a => a.status === 'Unread');
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Site Administration</h1>
        <p className="text-sm text-gray-500 mt-1">Clinx platform overview</p>
      </div>

      {/* System stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Schools', value: '1', icon: Building2, color: 'text-sky-600' },
          { label: 'Total Pupils', value: stats.total, icon: Users, color: 'text-emerald-600' },
          { label: 'Alerts This Week', value: alerts.length, icon: AlertTriangle, color: 'text-amber-600' },
          { label: 'Avg Risk Score', value: '23%', icon: BarChart3, color: 'text-purple-600' },
        ].map(item => (
          <div key={item.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">{item.label}</span>
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Schools table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">Schools</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">School</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Location</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Pupils</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Active Alerts</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              onClick={() => navigate('/dashboard')}
              className="hover:bg-sky-50/50 cursor-pointer transition-colors"
            >
              <td className="px-4 py-3 text-sm font-medium text-gray-900">Dedworth Middle School</td>
              <td className="px-4 py-3 text-sm text-gray-600">Windsor, UK</td>
              <td className="px-4 py-3 text-sm text-gray-600">{stats.total}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{alerts.length}</td>
              <td className="px-4 py-3">
                <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Active</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
