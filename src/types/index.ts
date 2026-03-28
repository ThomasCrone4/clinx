// Clinx TypeScript Type Definitions

// Core Risk Level type
export type RiskLevel = 'High' | 'Medium' | 'Low';

// User role type
export type UserRole = 'siteAdmin' | 'schoolAdmin' | 'teacher';

// Alert status type
export type AlertStatus = 'Unread' | 'Acknowledged' | 'Dismissed';

// SEND status type
export type SendStatus = 'None' | 'SEN Support' | 'EHCP';

// Attendance status type
export type AttendanceStatus = 'Present' | 'Late' | 'Absent' | 'Authorised Absence';

// Behaviour severity type
export type BehaviourSeverity = 'Minor' | 'Moderate' | 'Major';

// --- Data Models ---

export interface AttendanceRecord {
  date: string;
  am: AttendanceStatus;
  pm: AttendanceStatus;
}

export interface BehaviourIncident {
  date: string;
  severity: BehaviourSeverity;
  type: string;
  description: string;
  loggedBy: string;
}

export interface HomeworkSubject {
  subject: string;
  pct: number;
  trend: 'Declining' | 'Improving' | 'Stable' | string;
  lastSubmission: string;
}

export interface HomeworkHistory {
  overall: number;
  subjects: HomeworkSubject[];
}

export interface WellbeingSurvey {
  date: string;
  score: number;
}

export interface RiskFactor {
  text: string;
  source: string;
  trend?: string;
}

export interface RiskBreakdown {
  attendance: number;
  behaviour: number;
  academic: number;
  wellbeing: number;
  context: number;
}

export interface Pupil {
  id: string;
  year: number;
  form: string;
  riskLevel: RiskLevel;
  riskScore: number;
  attendance: number;
  attendanceTrend: 'Declining' | 'Improving' | 'Stable' | string;
  attendanceHistory: AttendanceRecord[];
  behaviourIncidents: number;
  behaviourHistory: BehaviourIncident[];
  homeworkPct: number;
  homeworkHistory: HomeworkHistory;
  wellbeingScore: number;
  wellbeingHistory: WellbeingSurvey[];
  send: SendStatus;
  fsm: boolean;
  classIds: string[];
  aiExplanation: RiskFactor[];
  riskBreakdown: RiskBreakdown;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  subjects: string[];
  classes: string[];
  timetable: Record<string, Array<TimetableSlot | null>>;
}

export interface TimetableSlot {
  classId: string;
  className: string;
  room: string;
}

export interface ClassGroup {
  id: string;
  name: string;
  form: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  room: string;
  pupils: string[];
}

export interface Alert {
  id: string;
  pupilId: string;
  riskLevel: RiskLevel;
  riskScore: number;
  reason: string;
  timestamp: string;
  status: AlertStatus;
  assignedTeachers: string[];
}

export interface StaffNote {
  id: string;
  timestamp: string;
  author: string;
  text: string;
}

export interface Period {
  id: string;
  start: string;
  end: string;
  label: string;
}

// --- Auth Types ---

export interface User {
  email: string;
  password: string;
  role: UserRole;
  name: string;
  teacherId: string | null;
}

export interface AuthUser {
  email: string;
  role: UserRole;
  name: string;
  teacherId: string | null;
}

// --- Component Props Types ---

export interface PupilTableProps {
  basePath?: string;
  pupils?: Pupil[];
}

export interface AlertCardProps {
  alert: Alert;
  onAcknowledge: (id: string) => void;
  onDismiss: (id: string) => void;
  basePath?: string;
}

export interface AlertListProps {
  basePath?: string;
}

export interface PupilDetailProps {
  // Uses useParams for id
}

export interface PupilOverviewProps {
  pupil: Pupil;
}

export interface AttendanceTabProps {
  pupil: Pupil;
}

export interface BehaviourTabProps {
  pupil: Pupil;
}

export interface AcademicTabProps {
  pupil: Pupil;
}

export interface WellbeingTabProps {
  pupil: Pupil;
}

export interface NotesTabProps {
  pupil: Pupil;
}

export interface SuggestedActionsProps {
  pupil: Pupil;
}

export interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  size?: 'sm' | 'lg';
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: UserRole[];
}

export interface RecentAlertsProps {
  basePath?: string;
}

export interface ClassDetailProps {
  // Uses useParams for id
}

// --- Store Types (Zustand) ---

export interface AuthState {
  user: AuthUser | null;
  login: (email: string, password: string) => { success: boolean; role?: UserRole; error?: string };
  logout: () => void;
  DEMO_ACCOUNTS: User[];
}

export interface AlertState {
  overrides: Record<string, AlertStatus>;
  acknowledgeAlert: (id: string) => void;
  dismissAlert: (id: string) => void;
  getAlertStatus: (id: string, defaultStatus: AlertStatus) => AlertStatus;
}

export interface NoteState {
  overrides: Record<string, StaffNote[]>;
  addNote: (pupilId: string, author: string, text: string) => void;
  getNotesForPupil: (pupilId: string, baseNotes: StaffNote[]) => StaffNote[];
}

// --- Stats Types ---

export interface PupilStats {
  total: number;
  high: number;
  medium: number;
  low: number;
  avgAttendance: number;
}

export interface AttendanceMonthly {
  month: string;
  attendance: number;
}

// --- Nav Item Type ---

export interface NavItem {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  end?: boolean;
}
