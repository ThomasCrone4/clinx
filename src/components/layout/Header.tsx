import { Bell, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { user, logout } = useAuth();
  const { unreadAlerts } = useAppData();
  const navigate = useNavigate();

  const alerts = user?.role === 'teacher' ? unreadAlerts.filter((alert) => alert.assignedTeachers.includes(user.name)) : unreadAlerts;
  const alertCount = alerts.length;

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 hover:opacity-85 transition-opacity"
        >
          <Shield className="w-8 h-8 text-sky-600" />
          <span className="text-xl font-bold text-sky-700">Clinx</span>
        </button>
        {user && (
          <span className="text-sm text-gray-400 ml-4 hidden lg:block">
            {user.role === 'siteAdmin' ? 'Site Administration' : 'Dedworth Middle School'}
          </span>
        )}
      </div>

      {user && (
        <div className="flex items-center gap-4">
          {user.role !== 'siteAdmin' && (
            <button
              onClick={() => navigate(user.role === 'teacher' ? '/teacher/alerts' : '/dashboard/alerts')}
              className="relative p-2 text-gray-500 hover:text-sky-600 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {alertCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {alertCount}
                </span>
              )}
            </button>
          )}

          <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
            <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center text-sky-700 font-semibold text-sm">
              {user.name.split(' ').map(n => n[0]).filter((_, i) => i < 2).join('')}
            </div>
            <span className="text-sm font-medium text-gray-700">{user.name}</span>
            <button
              onClick={handleLogout}
              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
