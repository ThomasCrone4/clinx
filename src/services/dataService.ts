import { generateAllData } from '../data/generateData';
<<<<<<< HEAD
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
=======

// Singleton data store — generated once, used everywhere
let _data = null;

function getData() {
  if (!_data) {
    _data = generateAllData();
  }
  return _data;
}

// --- Pupils ---
export function getAllPupils(): Pupil[] { return getData().pupils; }
export function getPupilById(id: string): Pupil | undefined { return getData().pupils.find(p => p.id === id); }
export function getPupilsByForm(form: string): Pupil[] { return getData().pupils.filter(p => p.form === form); }
export function getPupilsByYear(year: number): Pupil[] { return getData().pupils.filter(p => p.year === year); }
export function getPupilsByRisk(level: string): Pupil[] { return getData().pupils.filter(p => p.riskLevel === level); }
export function getPupilsByIds(ids: string[]): Pupil[] { return getData().pupils.filter(p => ids.includes(p.id)); }
>>>>>>> e32bc16161a97afec281bfc088fa1df03f4d66d5

export function getPupilStats(): PupilStats {
  const pupils = getData().pupils;
  return {
    total: pupils.length,
<<<<<<< HEAD
    high: pupils.filter((pupil) => pupil.riskLevel === 'High').length,
    medium: pupils.filter((pupil) => pupil.riskLevel === 'Medium').length,
    low: pupils.filter((pupil) => pupil.riskLevel === 'Low').length,
    avgAttendance: Math.round((pupils.reduce((sum, pupil) => sum + pupil.attendance, 0) / pupils.length) * 10) / 10,
=======
    high: pupils.filter(p => p.riskLevel === 'High').length,
    medium: pupils.filter(p => p.riskLevel === 'Medium').length,
    low: pupils.filter(p => p.riskLevel === 'Low').length,
    avgAttendance: Math.round(pupils.reduce((s, p) => s + p.attendance, 0) / pupils.length * 10) / 10,
>>>>>>> e32bc16161a97afec281bfc088fa1df03f4d66d5
  };
}

// --- Teachers ---
<<<<<<< HEAD
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
=======
export function getAllTeachers(): Teacher[] { return getData().teachers; }
export function getTeacherById(id: string): Teacher | undefined { return getData().teachers.find(t => t.id === id); }
export function getTeacherByEmail(email: string): Teacher | undefined { return getData().teachers.find(t => t.email === email); }

// --- Classes ---
export function getAllClasses(): ClassGroup[] { return getData().classes; }
export function getClassById(id: string): ClassGroup | undefined { return getData().classes.find(c => c.id === id); }
export function getClassesForTeacher(teacherId: string): ClassGroup[] { return getData().classes.filter(c => c.teacherId === teacherId); }

// --- Alerts ---
let _alertOverrides: Record<string, AlertStatus> = {};
export function getAllAlerts(): Alert[] {
  return getData().alerts.map(a => ({
    ...a,
    status: _alertOverrides[a.id] || a.status,
  }));
}
export function getAlertsForTeacher(teacherName: string): Alert[] {
  return getAllAlerts().filter(a => a.assignedTeachers.includes(teacherName));
}
export function acknowledgeAlert(id: string): void { _alertOverrides[id] = 'Acknowledged'; }
export function dismissAlert(id: string): void { _alertOverrides[id] = 'Dismissed'; }

// --- Notes ---
let _noteOverrides: Record<string, StaffNote[]> = {};
export function getNotesForPupil(pupilId: string): StaffNote[] {
  const base = getData().staffNotes[pupilId] || [];
  const added = _noteOverrides[pupilId] || [];
  return [...added, ...base];
}
export function addNoteForPupil(pupilId: string, author: string, text: string): void {
  if (!_noteOverrides[pupilId]) _noteOverrides[pupilId] = [];
  _noteOverrides[pupilId].unshift({
>>>>>>> e32bc16161a97afec281bfc088fa1df03f4d66d5
    id: `N${pupilId}-new-${Date.now()}`,
    timestamp: new Date().toISOString(),
    author,
    text,
  });
}

// --- Timetable ---
<<<<<<< HEAD
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
=======
export function getPeriods(): Period[] { return getData().periods; }
export function getDays(): string[] { return getData().days; }

// --- Attendance chart data (school-wide monthly) ---
export function getSchoolAttendanceMonthly(): AttendanceMonthly[] {
  const months = ['Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026'];
  return months.map((month, i) => ({
    month,
    attendance: 94 - i * 0.3 + (Math.random() - 0.5) * 1.5,
>>>>>>> e32bc16161a97afec281bfc088fa1df03f4d66d5
  }));
}
