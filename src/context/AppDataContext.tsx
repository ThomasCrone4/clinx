import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { getAllAlerts as getBaseAlerts, getNotesForPupil as getBaseNotesForPupil } from '../services/dataService';
import type { Alert, AlertStatus, StaffNote, TeacherActionStatus } from '../types/domain';

type AppDataContextValue = {
  alerts: Alert[];
  unreadAlerts: Alert[];
  teacherActions: Record<string, TeacherActionStatus>;
  getNotesForPupil: (pupilId: string) => StaffNote[];
  acknowledgeAlert: (id: string) => void;
  dismissAlert: (id: string) => void;
  addNoteForPupil: (pupilId: string, author: string, text: string) => void;
  setTeacherAction: (pupilId: string, status: TeacherActionStatus) => void;
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [alertOverrides, setAlertOverrides] = useState<Record<string, AlertStatus>>({});
  const [noteOverrides, setNoteOverrides] = useState<Record<string, StaffNote[]>>({});
  const [teacherActions, setTeacherActions] = useState<Record<string, TeacherActionStatus>>({});

  const alerts = useMemo(
    () =>
      getBaseAlerts().map((alert) => ({
        ...alert,
        status: alertOverrides[alert.id] ?? alert.status,
      })),
    [alertOverrides],
  );

  const unreadAlerts = useMemo(() => alerts.filter((alert) => alert.status === 'Unread'), [alerts]);

  function acknowledgeAlert(id: string) {
    setAlertOverrides((prev) => ({ ...prev, [id]: 'Acknowledged' }));
  }

  function dismissAlert(id: string) {
    setAlertOverrides((prev) => ({ ...prev, [id]: 'Dismissed' }));
  }

  function getNotesForPupil(pupilId: string): StaffNote[] {
    const baseNotes = getBaseNotesForPupil(pupilId);
    const addedNotes = noteOverrides[pupilId] || [];
    return [...addedNotes, ...baseNotes];
  }

  function addNoteForPupil(pupilId: string, author: string, text: string) {
    setNoteOverrides((prev) => ({
      ...prev,
      [pupilId]: [
        {
          id: `N${pupilId}-new-${Date.now()}`,
          timestamp: new Date().toISOString(),
          author,
          text,
        },
        ...(prev[pupilId] || []),
      ],
    }));
  }

  function setTeacherAction(pupilId: string, status: TeacherActionStatus) {
    setTeacherActions((prev) => ({
      ...prev,
      [pupilId]: status,
    }));
  }

  return (
    <AppDataContext.Provider
      value={{
        alerts,
        unreadAlerts,
        teacherActions,
        getNotesForPupil,
        acknowledgeAlert,
        dismissAlert,
        addNoteForPupil,
        setTeacherAction,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error('useAppData must be used within AppDataProvider');
  }
  return ctx;
}
