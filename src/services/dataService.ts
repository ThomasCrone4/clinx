import { generateAllData } from '../data/generateData';
import type {
  Alert,
  AlertStatus,
  AttendanceMonthlyPoint,
  ArborApiSnapshot,
  ClassChartsApiSnapshot,
  CpomsApiSnapshot,
  ExternalSourceSnapshots,
  GeneratedData,
  Period,
  Pupil,
  PupilStats,
  SchoolClass,
  SchoolDay,
  SchoolSignalsMonthlyPoint,
  StaffNote,
  Teacher,
} from '../types/domain';

let dataStore: GeneratedData | null = null;
let alertOverrides: Record<string, AlertStatus> = {};
let noteOverrides: Record<string, StaffNote[]> = {};
let schoolAttendanceMonthly: AttendanceMonthlyPoint[] | null = null;
let schoolSignalsMonthly: SchoolSignalsMonthlyPoint[] | null = null;

const schoolTrendMonths = [
  { key: '2025-10', label: 'Oct 2025' },
  { key: '2025-11', label: 'Nov 2025' },
  { key: '2025-12', label: 'Dec 2025' },
  { key: '2026-01', label: 'Jan 2026' },
  { key: '2026-02', label: 'Feb 2026' },
  { key: '2026-03', label: 'Mar 2026' },
];

function clampNumber(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function roundToOneDecimal(value: number) {
  return Math.round(value * 10) / 10;
}

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getMonthlyAttendancePct(pupil: Pupil, monthKey: string) {
  const records = pupil.attendanceHistory.filter((record) => record.date.startsWith(monthKey));
  if (records.length === 0) {
    return pupil.attendance;
  }

  const attendedSessions = records.reduce((sum, record) => {
    const amAttended = record.am === 'Present' || record.am === 'Late' ? 1 : 0;
    const pmAttended = record.pm === 'Present' || record.pm === 'Late' ? 1 : 0;
    return sum + amAttended + pmAttended;
  }, 0);

  return roundToOneDecimal((attendedSessions / (records.length * 2)) * 100);
}

function getMonthlyIncidentCount(pupil: Pupil, monthKey: string) {
  return pupil.behaviourHistory.filter((incident) => incident.date.startsWith(monthKey)).length;
}

function getMonthlyHomeworkPct(pupil: Pupil, monthKey: string, monthIndex: number) {
  const monthlyEntry = pupil.homeworkHistory.monthly.find((entry) => entry.date.startsWith(monthKey));
  if (monthlyEntry) {
    return monthlyEntry.pct;
  }

  const trendWeight = pupil.homeworkHistory.subjects.reduce((sum, subjectEntry) => {
    if (subjectEntry.trend === 'Improving') {
      return sum + 1;
    }
    if (subjectEntry.trend === 'Declining') {
      return sum - 1;
    }
    return sum;
  }, 0);
  const monthOffset = monthIndex - (schoolTrendMonths.length - 1);
  const slope = trendWeight > 1 ? 1.4 : trendWeight < -1 ? -1.4 : 0.3;

  return clampNumber(roundToOneDecimal(pupil.homeworkPct + monthOffset * slope), 0, 100);
}

function getMonthlyWellbeingScore(pupil: Pupil, monthKey: string) {
  return pupil.wellbeingHistory.find((entry) => entry.date.startsWith(monthKey))?.score ?? pupil.wellbeingScore;
}

function getMonthlyRiskScore(pupil: Pupil, monthKey: string, monthIndex: number) {
  const attendance = getMonthlyAttendancePct(pupil, monthKey);
  const incidents = getMonthlyIncidentCount(pupil, monthKey);
  const homeworkPct = getMonthlyHomeworkPct(pupil, monthKey, monthIndex);
  const wellbeingScore = getMonthlyWellbeingScore(pupil, monthKey);
  const attendanceRisk = Math.max(0, (100 - attendance) / 100) * 35;
  const behaviourRisk = Math.min(incidents / 8, 1) * 25;
  const academicRisk = Math.max(0, (100 - homeworkPct) / 100) * 20;
  const wellbeingRisk = Math.max(0, (10 - wellbeingScore) / 10) * 15;
  const contextRisk = (pupil.fsm ? 3 : 0) + (pupil.send !== 'None' ? 2 : 0);

  return Math.round(clampNumber(attendanceRisk + behaviourRisk + academicRisk + wellbeingRisk + contextRisk, 0, 100));
}

function getData(): GeneratedData {
  if (!dataStore) {
    dataStore = generateAllData();
  }
  return dataStore;
}

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

export function getAllTeachers(): Teacher[] {
  return getData().teachers;
}

export function getTeacherById(id?: string | null): Teacher | undefined {
  return getData().teachers.find((teacher) => teacher.id === id);
}

export function getTeacherByEmail(email: string): Teacher | undefined {
  return getData().teachers.find((teacher) => teacher.email === email);
}

export function getAllClasses(): SchoolClass[] {
  return getData().classes;
}

export function getClassById(id?: string): SchoolClass | undefined {
  return getData().classes.find((schoolClass) => schoolClass.id === id);
}

export function getClassesForTeacher(teacherId: string): SchoolClass[] {
  return getData().classes.filter((schoolClass) => schoolClass.teacherId === teacherId);
}

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

export function getPeriods(): Period[] {
  return getData().periods;
}

export function getDays(): SchoolDay[] {
  return getData().days;
}

export function getSchoolAttendanceMonthly(): AttendanceMonthlyPoint[] {
  if (!schoolAttendanceMonthly) {
    const months = ['Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026'];
    schoolAttendanceMonthly = months.map((month, index) => ({
      month,
      attendance: 94 - index * 0.3 + (Math.random() - 0.5) * 1.5,
    }));
  }

  return schoolAttendanceMonthly;
}

export function getSchoolSignalsMonthly(): SchoolSignalsMonthlyPoint[] {
  if (!schoolSignalsMonthly) {
    const pupils = getData().pupils;

    schoolSignalsMonthly = schoolTrendMonths.map(({ key, label }, monthIndex) => ({
      month: label,
      highRiskPupils: pupils.filter((pupil) => getMonthlyRiskScore(pupil, key, monthIndex) > 75).length,
      incidents: pupils.reduce((sum, pupil) => sum + getMonthlyIncidentCount(pupil, key), 0),
      homeworkCompletion: roundToOneDecimal(
        average(pupils.map((pupil) => getMonthlyHomeworkPct(pupil, key, monthIndex))),
      ),
    }));
  }

  return schoolSignalsMonthly;
}

export function getSourceData(): ExternalSourceSnapshots {
  return getData().sourceData;
}

export function getArborSnapshot(): ArborApiSnapshot {
  return getData().sourceData.arbor;
}

export function getClassChartsSnapshot(): ClassChartsApiSnapshot {
  return getData().sourceData.classCharts;
}

export function getCpomsSnapshot(): CpomsApiSnapshot {
  return getData().sourceData.cpoms;
}
