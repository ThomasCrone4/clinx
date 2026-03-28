import { generateAllData } from '../data/generateData';
import type {
  Alert,
  AlertStatus,
  AttendanceMonthlyPoint,
  GeneratedData,
  Period,
  Pupil,
  PupilStats,
  SchoolClass,
  SchoolDay,
  StaffNote,
  Teacher,
} from '../types/domain';

// Singleton data store - generated once, used everywhere
let dataStore: GeneratedData | null = null;

function getData(): GeneratedData {
  if (!dataStore) {
    dataStore = generateAllData();
  }
  return dataStore;
}

// --- Pupils ---
export function getAllPupils(): Pupil[] {
  return getData().pupils;
}

export function getPupilById(id?: string): Pupil | undefined {
  return getData().pupils.find((pupil) => pupil.id === id);
}

export function getPupilsByForm(form: string): Pupil[] {
  return getData().pupils.filter((pupil) => pupil.form === form);
}

export function getPupilsByYear(year: number): Pupil[] {
  return getData().pupils.filter((pupil) => pupil.year === year);
}

export function getPupilsByRisk(level: Pupil['riskLevel']): Pupil[] {
  return getData().pupils.filter((pupil) => pupil.riskLevel === level);
}

export function getPupilsByIds(ids: string[]): Pupil[] {
  return getData().pupils.filter((pupil) => ids.includes(pupil.id));
}

export function getPupilStats(): PupilStats {
  const pupils = getData().pupils;
  return {
    total: pupils.length,
    high: pupils.filter((pupil) => pupil.riskLevel === 'High').length,
    medium: pupils.filter((pupil) => pupil.riskLevel === 'Medium').length,
    low: pupils.filter((pupil) => pupil.riskLevel === 'Low').length,
    avgAttendance: Math.round((pupils.reduce((sum, pupil) => sum + pupil.attendance, 0) / pupils.length) * 10) / 10,
  };
}

// --- Teachers ---
export function getAllTeachers(): Teacher[] {
  return getData().teachers;
}

export function getTeacherById(id?: string | null): Teacher | undefined {
  return getData().teachers.find((teacher) => teacher.id === id);
}

export function getTeacherByEmail(email: string): Teacher | undefined {
  return getData().teachers.find((teacher) => teacher.email === email);
}

// --- Classes ---
export function getAllClasses(): SchoolClass[] {
  return getData().classes;
}

export function getClassById(id?: string): SchoolClass | undefined {
  return getData().classes.find((schoolClass) => schoolClass.id === id);
}

export function getClassesForTeacher(teacherId: string): SchoolClass[] {
  return getData().classes.filter((schoolClass) => schoolClass.teacherId === teacherId);
}

// --- Alerts ---
let alertOverrides: Record<string, AlertStatus> = {};

export function getAllAlerts(): Alert[] {
  return getData().alerts.map((alert) => ({
    ...alert,
    status: alertOverrides[alert.id] || alert.status,
  }));
}

export function getAlertsForTeacher(teacherName: string): Alert[] {
  return getAllAlerts().filter((alert) => alert.assignedTeachers.includes(teacherName));
}

export function acknowledgeAlert(id: string): void {
  alertOverrides[id] = 'Acknowledged';
}

export function dismissAlert(id: string): void {
  alertOverrides[id] = 'Dismissed';
}

// --- Notes ---
let noteOverrides: Record<string, StaffNote[]> = {};

export function getNotesForPupil(pupilId: string): StaffNote[] {
  const baseNotes = getData().staffNotes[pupilId] || [];
  const addedNotes = noteOverrides[pupilId] || [];
  return [...addedNotes, ...baseNotes];
}

export function addNoteForPupil(pupilId: string, author: string, text: string): void {
  if (!noteOverrides[pupilId]) {
    noteOverrides[pupilId] = [];
  }

  noteOverrides[pupilId].unshift({
    id: `N${pupilId}-new-${Date.now()}`,
    timestamp: new Date().toISOString(),
    author,
    text,
  });
}

// --- Timetable ---
export function getPeriods(): Period[] {
  return getData().periods;
}

export function getDays(): SchoolDay[] {
  return getData().days;
}

// --- Attendance chart data (school-wide monthly) ---
export function getSchoolAttendanceMonthly(): AttendanceMonthlyPoint[] {
  const months = ['Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026'];
  return months.map((month, index) => ({
    month,
    attendance: 94 - index * 0.3 + (Math.random() - 0.5) * 1.5,
  }));
}
