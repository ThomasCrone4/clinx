import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppDataProvider } from './context/AppDataContext';
import { AdminDataProvider } from './context/AdminDataContext';
import { ToastProvider } from './components/common/Toast';
import Layout from './components/layout/Layout';
import LandingPage from './components/landing/LandingPage';
import LoginPage from './components/auth/LoginPage';
import SchoolAdminDashboard from './components/dashboard/SchoolAdminDashboard';
import PupilTable from './components/pupils/PupilTable';
import PupilDetail from './components/pupils/PupilDetail';
import AlertList from './components/alerts/AlertList';
import StaffManagement from './components/staff/StaffManagement';
import TeacherProfile from './components/staff/TeacherProfile';
import DataSourcesPage from './components/dashboard/DataSourcesPage';
import SettingsPage from './components/dashboard/SettingsPage';
import SiteAdminDashboard from './components/admin/SiteAdminDashboard';
import SchoolsList from './components/admin/SchoolsList';
import OnboardingHub from './components/admin/OnboardingHub';
import SchoolSupportPage from './components/admin/SchoolSupportPage';
import CalendarView from './components/teacher/CalendarView';
import ClassDetail from './components/teacher/ClassDetail';
import HelpPage from './components/teacher/HelpPage';
import MyPupilsPage from './components/teacher/MyPupilsPage';
import TrustPage from './components/shared/TrustPage';
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
  const defaultRoute = user ? (user.role === 'siteAdmin' ? '/admin' : user.role === 'teacher' ? '/teacher' : '/dashboard') : '/';

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={defaultRoute} /> : <LandingPage />} />
      <Route path="/login" element={user ? <Navigate to={defaultRoute} /> : <LoginPage />} />
      <Route path="/trust" element={<TrustPage />} />

      {/* Site Admin routes */}
      <Route element={<ProtectedRoute roles={['siteAdmin']}><Layout /></ProtectedRoute>}>
        <Route path="/admin" element={<SiteAdminDashboard />} />
        <Route path="/admin/schools" element={<SchoolsList />} />
        <Route path="/admin/schools/:id" element={<SchoolSupportPage />} />
        <Route path="/admin/onboarding" element={<OnboardingHub />} />
      </Route>

      {/* School Admin routes */}
      <Route element={<ProtectedRoute roles={['schoolAdmin', 'siteAdmin']}><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<SchoolAdminDashboard />} />
        <Route path="/dashboard/pupils" element={<PupilTable />} />
        <Route path="/dashboard/pupils/:id" element={<PupilDetail />} />
        <Route path="/dashboard/alerts" element={<AlertList />} />
        <Route path="/dashboard/staff" element={<StaffManagement />} />
        <Route path="/dashboard/staff/:id" element={<TeacherProfile />} />
        <Route path="/dashboard/data-sources" element={<DataSourcesPage />} />
        <Route path="/dashboard/trust" element={<Navigate to="/dashboard/data-sources" replace />} />
        <Route
          path="/dashboard/staff/:teacherId/class/:id"
          element={<ClassDetail basePath="/dashboard" backPath="/dashboard/staff" backLabel="Back to Staff" />}
        />
        <Route path="/dashboard/settings" element={<SettingsPage />} />
      </Route>

      {/* Teacher routes */}
      <Route element={<ProtectedRoute roles={['teacher']}><Layout /></ProtectedRoute>}>
        <Route path="/teacher" element={<CalendarView />} />
        <Route path="/teacher/pupils" element={<MyPupilsPage />} />
        <Route path="/teacher/class/:id" element={<ClassDetail />} />
        <Route path="/teacher/pupils/:id" element={<PupilDetail />} />
        <Route path="/teacher/alerts" element={<AlertList basePath="/teacher" />} />
        <Route path="/teacher/help" element={<HelpPage />} />
        <Route path="/teacher/trust" element={<Navigate to="/teacher/help" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <AdminDataProvider>
          <AppDataProvider>
            <ToastProvider>
              <AppRoutes />
            </ToastProvider>
          </AppDataProvider>
        </AdminDataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
