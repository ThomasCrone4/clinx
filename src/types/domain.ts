export type UserRole = 'siteAdmin' | 'schoolAdmin' | 'teacher';
export type RiskLevel = 'High' | 'Medium' | 'Low';
export type AttendanceTrend = 'Declining' | 'Stable' | 'Improving';
export type BehaviourSeverity = 'Minor' | 'Moderate' | 'Major';
export type AttendanceSession = 'Present' | 'Late' | 'Absent';
export type AlertStatus = 'Unread' | 'Acknowledged' | 'Dismissed';
export type TeacherActionStatus = 'New' | 'Acknowledged' | 'Monitoring' | 'Follow Up Planned';
export type SendStatus = 'None' | 'SEN Support' | 'EHCP';
export type HomeworkTrend = 'Declining' | 'Stable' | 'Improving';
export type RouteBasePath = '/dashboard' | '/teacher';
export type SchoolDay = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
export type ExternalSourceSystem = 'arbor' | 'classCharts' | 'cpoms';

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

export type ArborStudentRecord = {
  student_id: string;
  student_number: string;
  upn: string;
  legal_first_name: string;
  legal_last_name: string;
  preferred_first_name: string;
  date_of_birth: string;
  year_group: number;
  registration_form: string;
  pupil_premium_eligible: boolean;
  sen_status: SendStatus;
  enrolment_status: 'Current';
  school_name: string;
  last_synced_at: string;
};

export type ArborAttendanceRecord = {
  student_id: string;
  date: string;
  session: 'AM' | 'PM';
  mark_code: '/' | '\\' | 'L' | 'N';
  mark_meaning: 'Present' | 'Late' | 'Absent';
  attendance_value: AttendanceSession;
  school_name: string;
  source_system: 'arbor';
};

export type ArborApiSnapshot = {
  students: ArborStudentRecord[];
  attendance_marks: ArborAttendanceRecord[];
};

export type ClassChartsBehaviourRecord = {
  behaviour_id: string;
  pupil_id: string;
  pupil_name: string;
  class_id: string;
  class_name: string;
  teacher_id: string;
  teacher_name: string;
  activity_type: string;
  severity: BehaviourSeverity;
  points: number;
  comment: string;
  logged_at: string;
  source_system: 'classCharts';
};

export type ClassChartsHomeworkRecord = {
  homework_id: string;
  pupil_id: string;
  pupil_name: string;
  subject: string;
  teacher_id: string;
  teacher_name: string;
  class_id: string;
  title: string;
  assigned_date: string;
  due_date: string;
  submitted_at: string | null;
  submission_status: 'Submitted' | 'Late' | 'Missing';
  grade_percent: number | null;
  source_system: 'classCharts';
};

export type ClassChartsApiSnapshot = {
  behaviour_events: ClassChartsBehaviourRecord[];
  homework_feed: ClassChartsHomeworkRecord[];
};

export type CpomsConcernRecord = {
  concern_id: string;
  pupil_id: string;
  pupil_name: string;
  category: 'Safeguarding' | 'Attendance' | 'Wellbeing' | 'Behaviour' | 'Pastoral';
  status: 'Open' | 'Monitoring' | 'Closed';
  priority: 'Low' | 'Medium' | 'High';
  reported_by: string;
  assigned_to: string;
  incident_date: string;
  created_at: string;
  chronology_note: string;
  linked_alert_id: string | null;
  source_system: 'cpoms';
};

export type CpomsApiSnapshot = {
  concerns: CpomsConcernRecord[];
};

export type ExternalSourceSnapshots = {
  arbor: ArborApiSnapshot;
  classCharts: ClassChartsApiSnapshot;
  cpoms: CpomsApiSnapshot;
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
  sourceData: ExternalSourceSnapshots;
};
