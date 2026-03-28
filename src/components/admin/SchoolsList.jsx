import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { getPupilStats, getAllAlerts } from '../../services/dataService';
import { useToast } from '../common/Toast';

export default function SchoolsList() {
  const navigate = useNavigate();
  const stats = getPupilStats();
  const alerts = getAllAlerts().filter(a => a.status === 'Unread');
  const { addToast } = useToast();

  return (
    <div className="max-w-6xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schools</h1>
          <p className="text-sm text-gray-500 mt-1">All schools using Clinx</p>
        </div>
        <button
          onClick={() => addToast('School added successfully', 'success')}
          className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 text-white text-sm rounded-lg font-medium hover:bg-sky-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add School
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">School</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Location</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Pupils</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">High Risk</th>
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
              <td className="px-4 py-3">
                <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-0.5 rounded-full">{stats.high}</span>
              </td>
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
