import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GuidedTourModal from '../common/GuidedTourModal';
import Header from './Header';
import Sidebar from './Sidebar';

export default function Layout() {
  const { user } = useAuth();
  const [tourOpen, setTourOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const storageKey = `clinx-tour-seen-${user.role}`;
    if (!sessionStorage.getItem(storageKey)) {
      setTourOpen(true);
      sessionStorage.setItem(storageKey, 'true');
    }
  }, [user]);

  useEffect(() => {
    function handleOpenTour() {
      setTourOpen(true);
    }

    window.addEventListener('clinx:open-tour', handleOpenTour);
    return () => window.removeEventListener('clinx:open-tour', handleOpenTour);
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <Outlet />
        </main>
      </div>
      <GuidedTourModal isOpen={tourOpen} onClose={() => setTourOpen(false)} />
    </div>
  );
}
