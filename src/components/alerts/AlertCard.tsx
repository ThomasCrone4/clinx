import { useNavigate } from 'react-router-dom';
import { Clock, Eye, Check, X, BellOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getPupilById } from '../../services/dataService';
import RiskBadge from '../common/RiskBadge';
import type { Alert, RouteBasePath } from '../../types/domain';
import { getPupilPrimaryLabel } from '../../utils/pupilDisplay';

type AlertCardProps = {
  alert: Alert;
  onAcknowledge: (id: string) => void;
  onDismiss: (id: string) => void;
  onRemindLater?: (id: string) => void;
  reminderAt?: string;
  basePath?: RouteBasePath;
};

export default function AlertCard({
  alert,
  onAcknowledge,
  onDismiss,
  onRemindLater,
  reminderAt,
  basePath = '/dashboard',
}: AlertCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const pupil = getPupilById(alert.pupilId);

  function timeAgo(ts: string) {
    const diff = Date.now() - new Date(ts).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }

  const isAcknowledged = alert.status === 'Acknowledged';
  const reminderLabel = reminderAt
    ? new Date(reminderAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    : null;

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-4 transition-opacity ${isAcknowledged ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-bold text-gray-900">{pupil ? getPupilPrimaryLabel(pupil, user) : alert.pupilId}</span>
            <RiskBadge level={alert.riskLevel} score={alert.riskScore} />
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" /> {timeAgo(alert.timestamp)}
            </span>
            {isAcknowledged && (
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Acknowledged</span>
            )}
            {user?.role === 'teacher' && reminderLabel && (
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Reminder set for {reminderLabel}</span>
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
              <Check className="w-3.5 h-3.5" /> {user?.role === 'teacher' ? 'Already Aware' : 'Acknowledge'}
            </button>
          )}
          {user?.role === 'teacher' && alert.status !== 'Dismissed' && onRemindLater && (
            <button
              onClick={() => onRemindLater(alert.id)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors"
            >
              <BellOff className="w-3.5 h-3.5" /> Remind Later
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
