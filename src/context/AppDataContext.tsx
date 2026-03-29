import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { getAllAlerts as getBaseAlerts, getNotesForPupil as getBaseNotesForPupil } from '../services/dataService';
import type { Alert, AlertStatus, StaffNote, TeacherActionStatus, TeacherAlertPreferences } from '../types/domain';

type AppDataContextValue = {
  alerts: Alert[];
  unreadAlerts: Alert[];
  teacherActions: Record<string, TeacherActionStatus>;
  deferredAlerts: Record<string, string>;
  getTeacherAlertPreferences: (teacherId: string | null | undefined) => TeacherAlertPreferences;
  getNotesForPupil: (pupilId: string) => StaffNote[];
  acknowledgeAlert: (id: string) => void;
  dismissAlert: (id: string) => void;
  remindLater: (id: string) => void;
  addNoteForPupil: (pupilId: string, author: string, text: string) => void;
  setTeacherAction: (pupilId: string, status: TeacherActionStatus) => void;
  updateTeacherAlertPreferences: (
    teacherId: string | null | undefined,
    updates: Partial<TeacherAlertPreferences>,
  ) => void;
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

const DEFAULT_TEACHER_ALERT_PREFERENCES: TeacherAlertPreferences = {
  delivery: 'Immediate',
  inApp: true,
  emailDigest: false,
  highPriorityOnly: false,
};

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [alertOverrides, setAlertOverrides] = useState<Record<string, AlertStatus>>({});
  const [noteOverrides, setNoteOverrides] = useState<Record<string, StaffNote[]>>({});
  const [teacherActions, setTeacherActions] = useState<Record<string, TeacherActionStatus>>({});
  const [teacherAlertPreferences, setTeacherAlertPreferences] = useState<Record<string, TeacherAlertPreferences>>({});
  const [deferredAlerts, setDeferredAlerts] = useState<Record<string, string>>({});

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

  function remindLater(id: string) {
    const reminderAt = new Date();
    reminderAt.setDate(reminderAt.getDate() + 1);
    setDeferredAlerts((prev) => ({
      ...prev,
      [id]: reminderAt.toISOString(),
    }));
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

  function getTeacherAlertPreferences(teacherId: string | null | undefined): TeacherAlertPreferences {
    if (!teacherId) {
      return DEFAULT_TEACHER_ALERT_PREFERENCES;
    }

    return teacherAlertPreferences[teacherId] ?? DEFAULT_TEACHER_ALERT_PREFERENCES;
  }

  function updateTeacherAlertPreferences(
    teacherId: string | null | undefined,
    updates: Partial<TeacherAlertPreferences>,
  ) {
    if (!teacherId) {
      return;
    }

    setTeacherAlertPreferences((prev) => ({
      ...prev,
      [teacherId]: {
        ...(prev[teacherId] ?? DEFAULT_TEACHER_ALERT_PREFERENCES),
        ...updates,
      },
    }));
  }

  return (
    <AppDataContext.Provider
      value={{
        alerts,
        unreadAlerts,
        teacherActions,
        deferredAlerts,
        getTeacherAlertPreferences,
        getNotesForPupil,
        acknowledgeAlert,
        dismissAlert,
        remindLater,
        addNoteForPupil,
        setTeacherAction,
        updateTeacherAlertPreferences,
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
