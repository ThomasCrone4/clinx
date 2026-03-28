export type UserRole = 'siteAdmin' | 'schoolAdmin' | 'teacher';
export type RiskLevel = 'High' | 'Medium' | 'Low';
export type AttendanceTrend = 'Declining' | 'Stable' | 'Improving';
export type BehaviourSeverity = 'Minor' | 'Moderate' | 'Major';
export type AttendanceSession = 'Present' | 'Late' | 'Absent';
export type AlertStatus = 'Unread' | 'Acknowledged' | 'Dismissed';
export type SendStatus = 'None' | 'SEN Support' | 'EHCP';
export type HomeworkTrend = 'Declining' | 'Stable' | 'Improving';
export type RouteBasePath = '/dashboard' | '/teacher';
export type SchoolDay = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export type DemoAccount = {
  email: string;
  password: string;
  role: UserRole;
  name: string;
  teacherId: string | null;
};

export type RiskBreakdown = {
  attendance: number;
  behaviour: number;
  academic: number;
  wellbeing: number;
  context: number;
};

export type RiskFactor = {
  text: string;
  trend: string;
  source: string;
};

export type AttendanceRecord = {
  date: string;
  am: AttendanceSession;
  pm: AttendanceSession;
};

export type BehaviourIncident = {
  date: string;
  type: string;
  severity: BehaviourSeverity;
  description: string;
  loggedBy: string;
};

export type WellbeingEntry = {
  date: string;
  score: number;
};

export type HomeworkMonthlyEntry = {
  date: string;
  pct: number;
};

export type HomeworkSubjectEntry = {
  subject: string;
  pct: number;
  trend: HomeworkTrend;
  lastSubmission: string;
};

export type HomeworkHistory = {
  monthly: HomeworkMonthlyEntry[];
  subjects: HomeworkSubjectEntry[];
};

export type Pupil = {
  id: string;
  year: number;
  form: string;
  attendance: number;
  attendanceTrend: AttendanceTrend;
  behaviourIncidents: number;
  homeworkPct: number;
  wellbeingScore: number;
  fsm: boolean;
  send: SendStatus;
  riskScore: number;
  riskLevel: RiskLevel;
  riskBreakdown: RiskBreakdown;
  aiExplanation: RiskFactor[];
  attendanceHistory: AttendanceRecord[];
  behaviourHistory: BehaviourIncident[];
  wellbeingHistory: WellbeingEntry[];
  homeworkHistory: HomeworkHistory;
  archetype: string | null;
  classIds: string[];
  lastUpdated: string;
};

export type TeacherTimetableSlot = {
  classId: string;
  className: string;
  subject: string;
  room: string;
  form: string;
};

export type Teacher = {
  id: string;
  name: string;
  email: string;
  subjects: string[];
  classes: string[];
  formTutor: string | null;
  timetable: Record<SchoolDay, Array<TeacherTimetableSlot | null>>;
};

export type SchoolClass = {
  id: string;
  name: string;
  yearGroup: number;
  form: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  room: string;
  pupils: string[];
};

export type Alert = {
  id: string;
  pupilId: string;
  riskLevel: RiskLevel;
  riskScore: number;
  reason: string;
  timestamp: string;
  status: AlertStatus;
  assignedTeachers: string[];
};

export type StaffNote = {
  id: string;
  timestamp: string;
  author: string;
  text: string;
};

export type Period = {
  id: number;
  label: string;
  start: string;
  end: string;
};

export type AttendanceMonthlyPoint = {
  month: string;
  attendance: number;
};

export type PupilStats = {
  total: number;
  high: number;
  medium: number;
  low: number;
  avgAttendance: number;
};

export type GeneratedData = {
  teachers: Teacher[];
  classes: SchoolClass[];
  pupils: Pupil[];
  alerts: Alert[];
  staffNotes: Record<string, StaffNote[]>;
  periods: Period[];
  days: SchoolDay[];
};
