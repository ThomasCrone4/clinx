import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import AlertCard from './AlertCard';
import type { AlertStatus, RouteBasePath } from '../../types/domain';

type AlertListProps = {
  basePath?: RouteBasePath;
};

type AlertSortMode = 'risk' | 'newest';

export default function AlertList({ basePath = '/dashboard' }: AlertListProps) {
  const { user } = useAuth();
  const { alerts, acknowledgeAlert, dismissAlert } = useAppData();
  const [filter, setFilter] = useState<AlertStatus | 'All'>('Unread');
  const [sortBy, setSortBy] = useState<AlertSortMode>('risk');
  const [, forceUpdate] = useState(0);
  const filterOptions: Array<AlertStatus | 'All'> = ['Unread', 'Acknowledged', 'All'];
  const sortOptions: Array<{ key: AlertSortMode; label: string }> = [
    { key: 'risk', label: 'Highest Risk' },
    { key: 'newest', label: 'Newest' },
  ];

  const allAlerts = user?.role === 'teacher' ? alerts.filter((alert) => alert.assignedTeachers.includes(user.name)) : alerts;

  const filtered = useMemo(() => {
    let result = allAlerts;
    if (filter !== 'All') result = result.filter(a => a.status === filter);
    if (sortBy === 'risk') result = [...result].sort((a, b) => b.riskScore - a.riskScore);
    else result = [...result].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    return result;
  }, [allAlerts, filter, sortBy]);

  function handleAcknowledge(id: string) {
    acknowledgeAlert(id);
    forceUpdate(n => n + 1);
  }
  function handleDismiss(id: string) {
    dismissAlert(id);
    forceUpdate(n => n + 1);
  }

  return (
    <div className="max-w-4xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{user?.role === 'teacher' ? 'My' : ''} Alerts</h1>
        <p className="text-sm text-gray-500 mt-1">{filtered.length} alerts</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex bg-white rounded-lg border border-gray-200 p-0.5">
          {filterOptions.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === f ? 'bg-sky-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex bg-white rounded-lg border border-gray-200 p-0.5">
          {sortOptions.map(s => (
            <button
              key={s.key}
              onClick={() => setSortBy(s.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                sortBy === s.key ? 'bg-sky-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-400">No alerts to show</p>
          </div>
        ) : (
          filtered.map(alert => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onAcknowledge={handleAcknowledge}
              onDismiss={handleDismiss}
              basePath={basePath}
            />
          ))
        )}
      </div>
    </div>
  );
}
