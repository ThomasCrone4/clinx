import { generateAllData } from '../data/generateData';

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

export function getPupilStats(): PupilStats {
  const pupils = getData().pupils;
  return {
    total: pupils.length,
    high: pupils.filter(p => p.riskLevel === 'High').length,
    medium: pupils.filter(p => p.riskLevel === 'Medium').length,
    low: pupils.filter(p => p.riskLevel === 'Low').length,
    avgAttendance: Math.round(pupils.reduce((s, p) => s + p.attendance, 0) / pupils.length * 10) / 10,
  };
}

// --- Teachers ---
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
    id: `N${pupilId}-new-${Date.now()}`,
    timestamp: new Date().toISOString(),
    author,
    text,
  });
}

// --- Timetable ---
export function getPeriods(): Period[] { return getData().periods; }
export function getDays(): string[] { return getData().days; }

// --- Attendance chart data (school-wide monthly) ---
export function getSchoolAttendanceMonthly(): AttendanceMonthly[] {
  const months = ['Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026'];
  return months.map((month, i) => ({
    month,
    attendance: 94 - i * 0.3 + (Math.random() - 0.5) * 1.5,
  }));
}
