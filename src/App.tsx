import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';
import Layout from './components/layout/Layout';
import LandingPage from './components/landing/LandingPage';
import LoginPage from './components/auth/LoginPage';
import SchoolAdminDashboard from './components/dashboard/SchoolAdminDashboard';
import PupilTable from './components/pupils/PupilTable';
import PupilDetail from './components/pupils/PupilDetail';
import AlertList from './components/alerts/AlertList';
import StaffManagement from './components/staff/StaffManagement';
import SettingsPage from './components/dashboard/SettingsPage';
import SiteAdminDashboard from './components/admin/SiteAdminDashboard';
import SchoolsList from './components/admin/SchoolsList';
import CalendarView from './components/teacher/CalendarView';
import ClassDetail from './components/teacher/ClassDetail';
import HelpPage from './components/teacher/HelpPage';
import type { ReactNode } from 'react';
import type { UserRole } from './types/domain';

type ProtectedRouteProps = {
  children: ReactNode;
  roles?: UserRole[];
};

function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={user.role === 'siteAdmin' ? '/admin' : user.role === 'teacher' ? '/teacher' : '/dashboard'} /> : <LandingPage />} />
      <Route path="/login" element={user ? <Navigate to={user.role === 'siteAdmin' ? '/admin' : user.role === 'teacher' ? '/teacher' : '/dashboard'} /> : <LoginPage />} />

      {/* Site Admin routes */}
      <Route element={<ProtectedRoute roles={['siteAdmin']}><Layout /></ProtectedRoute>}>
        <Route path="/admin" element={<SiteAdminDashboard />} />
        <Route path="/admin/schools" element={<SchoolsList />} />
      </Route>

      {/* School Admin routes */}
      <Route element={<ProtectedRoute roles={['schoolAdmin', 'siteAdmin']}><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<SchoolAdminDashboard />} />
        <Route path="/dashboard/pupils" element={<PupilTable />} />
        <Route path="/dashboard/pupils/:id" element={<PupilDetail />} />
        <Route path="/dashboard/alerts" element={<AlertList />} />
        <Route path="/dashboard/staff" element={<StaffManagement />} />
        <Route path="/dashboard/settings" element={<SettingsPage />} />
      </Route>

      {/* Teacher routes */}
      <Route element={<ProtectedRoute roles={['teacher']}><Layout /></ProtectedRoute>}>
        <Route path="/teacher" element={<CalendarView />} />
        <Route path="/teacher/class/:id" element={<ClassDetail />} />
        <Route path="/teacher/pupils/:id" element={<PupilDetail />} />
        <Route path="/teacher/alerts" element={<AlertList basePath="/teacher" />} />
        <Route path="/teacher/help" element={<HelpPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
