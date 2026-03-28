import { useNavigate } from 'react-router-dom';
import { Clock, Eye, Check, X } from 'lucide-react';
import RiskBadge from '../common/RiskBadge';

export default function AlertCard({ alert, onAcknowledge, onDismiss, basePath = '/dashboard' }) {
  const navigate = useNavigate();

  function timeAgo(ts) {
    const diff = Date.now() - new Date(ts).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }

  const isAcknowledged = alert.status === 'Acknowledged';

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-4 transition-opacity ${isAcknowledged ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-bold text-gray-900">{alert.pupilId}</span>
            <RiskBadge level={alert.riskLevel} score={alert.riskScore} />
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" /> {timeAgo(alert.timestamp)}
            </span>
            {isAcknowledged && (
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Acknowledged</span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-2">{alert.reason}</p>
          <p className="text-xs text-gray-400">
            Assigned to: {alert.assignedTeachers.slice(0, 3).join(', ')}
            {alert.assignedTeachers.length > 3 && ` +${alert.assignedTeachers.length - 3} more`}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => navigate(`${basePath}/pupils/${alert.pupilId}`)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-sky-50 text-sky-700 rounded-lg hover:bg-sky-100 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" /> View
          </button>
          {alert.status === 'Unread' && (
            <button
              onClick={() => onAcknowledge(alert.id)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Check className="w-3.5 h-3.5" /> Acknowledge
            </button>
          )}
          {alert.status !== 'Dismissed' && (
            <button
              onClick={() => onDismiss(alert.id)}
              className="flex items-center gap-1 px-2 py-1.5 text-xs text-gray-400 rounded-lg hover:bg-gray-50 hover:text-red-500 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
