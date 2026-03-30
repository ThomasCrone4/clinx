import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Settings, SlidersHorizontal } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { useToast } from '../common/Toast';
import AlertCard from './AlertCard';
import type { AlertStatus, RouteBasePath } from '../../types/domain';

type AlertListProps = {
  basePath?: RouteBasePath;
};

type AlertSortMode = 'risk' | 'newest';

export default function AlertList({ basePath = '/dashboard' }: AlertListProps) {
  const { user } = useAuth();
  const { alerts, acknowledgeAlert, dismissAlert, remindLater, deferredAlerts } = useAppData();
  const { addToast } = useToast();
  const [filter, setFilter] = useState<AlertStatus | 'All'>('Unread');
  const [sortBy, setSortBy] = useState<AlertSortMode>('risk');
  const [, forceUpdate] = useState(0);
  const filterOptions: Array<{ label: string; value: AlertStatus | 'All' }> = [
    { label: 'Unread', value: 'Unread' },
    { label: 'Seen', value: 'Acknowledged' },
    { label: 'All', value: 'All' },
  ];
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
  function handleRemindLater(id: string) {
    remindLater(id);
    addToast('Reminder set for tomorrow', 'success');
    forceUpdate(n => n + 1);
  }

  return (
    <div className="max-w-4xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{user?.role === 'teacher' ? 'My' : ''} Alerts</h1>
        <p className="text-sm text-gray-500 mt-1">{filtered.length} alerts</p>
      </div>

      {user?.role === 'schoolAdmin' && (
        <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-sky-900">Alert settings can be adjusted in Settings</p>
            <p className="text-sm text-sky-800 mt-1">
              School-wide alert defaults and leadership visibility are managed from the settings page.
            </p>
          </div>
          <Link
            to="/dashboard/settings"
            className="shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white text-sky-700 border border-sky-200 text-sm font-medium hover:bg-sky-100 transition-colors"
          >
            <Settings className="w-4 h-4" />
            Open Settings
          </Link>
        </div>
      )}

      {user?.role === 'teacher' && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-emerald-900">You can personalise how you receive alerts</p>
            <p className="text-sm text-emerald-800 mt-1">
              Update your own alert preferences from the My Classes page so Clinx fits around how you prefer to work.
            </p>
          </div>
          <Link
            to="/teacher#alert-preferences"
            className="shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white text-emerald-700 border border-emerald-200 text-sm font-medium hover:bg-emerald-100 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Manage My Preferences
          </Link>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="flex bg-white rounded-lg border border-gray-200 p-0.5">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === option.value ? 'bg-sky-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {option.label}
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
              onRemindLater={user?.role === 'teacher' ? handleRemindLater : undefined}
              reminderAt={deferredAlerts[alert.id]}
              basePath={basePath}
            />
          ))
        )}
      </div>
    </div>
  );
}
