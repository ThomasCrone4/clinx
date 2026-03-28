import { useNavigate } from 'react-router-dom';
import { useAppData } from '../../context/AppDataContext';
import RiskBadge from '../common/RiskBadge';
import { Clock } from 'lucide-react';
import type { RouteBasePath } from '../../types/domain';

type RecentAlertsProps = {
  basePath?: RouteBasePath;
};

export default function RecentAlerts({ basePath = '/dashboard' }: RecentAlertsProps) {
  const navigate = useNavigate();
  const { unreadAlerts } = useAppData();
  const alerts = [...unreadAlerts]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 10);

  function timeAgo(ts: string) {
    const diff = Date.now() - new Date(ts).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Recent Alerts</h3>
      <div className="space-y-3">
        {alerts.length === 0 && <p className="text-sm text-gray-400">No active alerts</p>}
        {alerts.map(alert => (
          <button
            key={alert.id}
            onClick={() => navigate(`${basePath}/pupils/${alert.pupilId}`)}
            className="w-full text-left flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RiskBadge level={alert.riskLevel} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{alert.pupilId}</p>
              <p className="text-xs text-gray-500 truncate">{alert.reason}</p>
            </div>
            <span className="text-xs text-gray-400 flex items-center gap-1 shrink-0">
              <Clock className="w-3 h-3" />
              {timeAgo(alert.timestamp)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
