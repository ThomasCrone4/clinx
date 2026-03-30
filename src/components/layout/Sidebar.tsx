import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  Users,
  AlertTriangle,
  UserCog,
  Settings,
  CalendarDays,
  HelpCircle,
  Building2,
  Database,
  Workflow,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { LucideIcon } from 'lucide-react';

type NavItem = {
  to: string;
  icon: LucideIcon;
  label: string;
  end?: boolean;
};

const siteAdminItems: NavItem[] = [
  { to: '/admin', icon: BarChart3, label: 'Dashboard', end: true },
  { to: '/admin/schools', icon: Building2, label: 'Schools' },
  { to: '/admin/onboarding', icon: Workflow, label: 'Onboarding' },
];

const liveSchoolAdminItems: NavItem[] = [
  { to: '/dashboard', icon: BarChart3, label: 'Dashboard', end: true },
  { to: '/dashboard/pupils', icon: Users, label: 'All Pupils' },
  { to: '/dashboard/alerts', icon: AlertTriangle, label: 'Alerts' },
  { to: '/dashboard/staff', icon: UserCog, label: 'Staff' },
  { to: '/dashboard/data-sources', icon: Database, label: 'Your Data' },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

const teacherItems: NavItem[] = [
  { to: '/teacher', icon: CalendarDays, label: 'My Classes', end: true },
  { to: '/teacher/alerts', icon: AlertTriangle, label: 'My Alerts' },
  { to: '/teacher/help', icon: HelpCircle, label: 'Help' },
];

export default function Sidebar() {
  const { user } = useAuth();
  if (!user) return null;

  const items =
    user.role === 'siteAdmin'
      ? siteAdminItems
      : user.role === 'teacher'
        ? teacherItems
        : liveSchoolAdminItems;

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col shrink-0">
      <nav className="flex-1 py-4">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            data-tour-path={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-2.5 mx-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-sky-50 text-sky-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-100 text-xs text-gray-400">
        {user.role === 'siteAdmin' ? 'Internal Clinx view' : 'Built around the data your school already holds'}
      </div>
    </aside>
  );
}
