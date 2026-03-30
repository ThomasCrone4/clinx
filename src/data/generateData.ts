import type {
  Alert,
  AttendanceTrend,
  AttendanceRecord,
  ArborApiSnapshot,
  ArborAttendanceRecord,
  ArborStudentRecord,
  BehaviourSeverity,
  BehaviourIncident,
  ClassChartsApiSnapshot,
  ClassChartsBehaviourRecord,
  ClassChartsHomeworkRecord,
  CpomsApiSnapshot,
  CpomsConcernRecord,
  GeneratedData,
  HomeworkHistory,
  HomeworkTrend,
  ExternalSourceSnapshots,
  Period,
  Pupil,
  RiskFactor,
  RiskLevel,
  SchoolClass,
  SchoolDay,
  SendStatus,
  StaffNote,
  Teacher,
  TeacherTimetableSlot,
  WellbeingEntry,
} from '../types/domain';

// Seeded random for reproducibility
function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    var t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(42);
const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
const randBetween = (min: number, max: number): number => min + rand() * (max - min);
const randInt = (min: number, max: number): number => Math.floor(randBetween(min, max + 1));
const clamp = (v: number, min: number, max: number): number => Math.max(min, Math.min(max, v));

// Teacher name pools
const firstNames = ['James','Robert','John','David','Michael','William','Richard','Thomas','Mark','Paul','Andrew','Peter','Daniel','Stephen','Matthew','Sarah','Emma','Laura','Rachel','Helen','Claire','Rebecca','Karen','Lisa','Anna','Charlotte','Olivia','Sophie','Hannah','Victoria'];
const surnames = ['Smith','Jones','Taylor','Brown','Wilson','Evans','Thomas','Roberts','Johnson','Walker','Wright','Thompson','White','Hughes','Edwards','Green','Hall','Clarke','Jackson','Wood','Harris','Lewis','Robinson','King','Lee','Martin','Davis','Turner','Baker','Cooper'];
const titles = ['Mr','Mrs','Ms','Dr'];

const subjects = ['English','Maths','Science','History','Geography','PE','Art','Computing','Music','French'];
const yearGroups = [5, 6, 7, 8];
const forms = ['A', 'B', 'C', 'D'];
const rooms = ['101','102','103','104','105','201','202','203','204','205','301','302','303','304','305','G01','G02','G03','G04','G05','Hall','Gym','Art Studio','Music Room','IT Suite'];

const periods: Period[] = [
  { id: 1, label: 'Period 1', start: '09:00', end: '10:00' },
  { id: 2, label: 'Period 2', start: '10:00', end: '11:00' },
  { id: 3, label: 'Period 3', start: '11:20', end: '12:20' },
  { id: 4, label: 'Period 4', start: '13:00', end: '14:00' },
  { id: 5, label: 'Period 5', start: '14:00', end: '15:00' },
  { id: 6, label: 'Period 6', start: '15:00', end: '16:00' },
];

const days: SchoolDay[] = ['Monday','Tuesday','Wednesday','Thursday','Friday'];

const formRiskPlan: Record<string, { high: number; medium: number }> = {
  '5A': { high: 1, medium: 2 },
  '5B': { high: 0, medium: 2 },
  '5C': { high: 1, medium: 1 },
  '5D': { high: 0, medium: 2 },
  '6A': { high: 1, medium: 2 },
  '6B': { high: 0, medium: 3 },
  '6C': { high: 1, medium: 2 },
  '6D': { high: 0, medium: 2 },
  '7A': { high: 1, medium: 2 },
  '7B': { high: 1, medium: 3 },
  '7C': { high: 0, medium: 2 },
  '7D': { high: 1, medium: 2 },
  '8A': { high: 1, medium: 2 },
  '8B': { high: 0, medium: 2 },
  '8C': { high: 1, medium: 3 },
  '8D': { high: 0, medium: 2 },
};

// High-risk archetypes
const highRiskArchetypes = [
  { desc: 'Attendance nosedive + homework decline', attOverride: [96, 90, 84, 76, 72, 68], hwOverride: 38, behav: 1, wellbeing: 4 },
  { desc: 'Behaviour spike, stable attendance', attOverride: null, hwOverride: null, behavOverride: 6, wellbeing: 5 },
  { desc: 'FSM + attendance decline + low wellbeing', fsmOverride: true, attOverride: [94, 90, 86, 80, 76, 72], wellbeing: 3, hwOverride: 52 },
  { desc: 'SEND + behaviour change + homework drop', sendOverride: 'SEN Support', behavOverride: 5, hwOverride: 40, wellbeing: 4 },
  { desc: 'Wellbeing survey flagged', wellbeingHistory: [8, 8, 7, 6, 4, 3], wellbeing: 3 },
  { desc: 'Multiple small signals', attOverride: [95, 93, 91, 89, 87, 85], hwOverride: 65, behavOverride: 2, wellbeing: 5 },
  { desc: 'Monday absence pattern', mondayAbsent: true, wellbeing: 5 },
  { desc: 'Previously high-performing, sudden academic decline', hwOverride: 35, hwHistory: [95, 94, 90, 72, 50, 35], wellbeing: 4 },
  { desc: 'Social isolation signals', peNonParticipation: true, wellbeing: 3, behavOverride: 0 },
  { desc: 'Post-holiday attendance crash', attOverride: [97, 96, 95, 60, 55, 58], wellbeing: 5 },
  { desc: 'Persistent low-level disruption escalating', behavOverride: 8, behavHistory: [1, 1, 2, 3, 5, 8], wellbeing: 5 },
  { desc: 'Parental contact issues + attendance concerns', attOverride: [92, 88, 82, 78, 74, 70], parentalIssues: true, wellbeing: 4 },
];

function getPupilIdentity(pupil: Pupil) {
  const numericId = Number.parseInt(pupil.id.replace(/\D/g, ''), 10);
  const firstName = firstNames[numericId % firstNames.length];
  const lastName = surnames[(numericId * 3) % surnames.length];
  const preferredFirstName = numericId % 9 === 0 ? firstName.slice(0, Math.max(3, firstName.length - 1)) : firstName;
  const dobYear = 2010 + ((numericId + pupil.year) % 4);
  const dobMonth = String((numericId % 12) + 1).padStart(2, '0');
  const dobDay = String(((numericId * 2) % 28) + 1).padStart(2, '0');

  return {
    firstName,
    lastName,
    preferredFirstName,
    fullName: `${preferredFirstName} ${lastName}`,
    dateOfBirth: `${dobYear}-${dobMonth}-${dobDay}`,
    upn: `A${String(100000000000 + numericId).slice(0, 12)}`,
    studentNumber: `ARB-${String(numericId).padStart(6, '0')}`,
  };
}

function getPupilIdentityById(id: string) {
  return getPupilIdentity({ id } as Pupil);
}

function generateTeachers(): Teacher[] {
  const teachers: Teacher[] = [];
  const usedNames = new Set();

  // Assign subjects: first 20 teachers get 1 subject each (2 per subject), next 10 get 1 subject
  const subjectAssignments: string[] = [];
  subjects.forEach(s => { subjectAssignments.push(s); subjectAssignments.push(s); });
  // remaining 10 teachers get random subjects
  for (let i = 0; i < 10; i++) subjectAssignments.push(subjects[i]);

  for (let i = 0; i < 30; i++) {
    let name;
    do {
      const title = pick(titles);
      const initial = String.fromCharCode(65 + randInt(0, 25));
      const surname = pick(surnames);
      name = `${title}. ${initial}. ${surname}`;
    } while (usedNames.has(name));
    usedNames.add(name);

    const subj = subjectAssignments[i];
    const email = name.toLowerCase().replace(/\.\s/g, '.').replace(/\s/g, '').replace(/\./g, '') + '@dedworth.school';

    teachers.push({
      id: `T${String(i + 1).padStart(3, '0')}`,
      name,
      email,
      subjects: [subj],
      classes: [],
      formTutor: null,
      timetable: {
        Monday: Array(6).fill(null),
        Tuesday: Array(6).fill(null),
        Wednesday: Array(6).fill(null),
        Thursday: Array(6).fill(null),
        Friday: Array(6).fill(null),
      },
    });
  }
  return teachers;
}

function generateClasses(teachers: Teacher[]): SchoolClass[] {
  const classes: SchoolClass[] = [];
  let classId = 1;

  // For each form group × subject, create a class
  const formGroups: string[] = [];
  yearGroups.forEach(y => forms.forEach(f => formGroups.push(`${y}${f}`)));

  // Get teachers by subject
  const teachersBySubject: Record<string, Teacher[]> = {};
  subjects.forEach(s => { teachersBySubject[s] = teachers.filter(t => t.subjects.includes(s)); });

  formGroups.forEach(fg => {
    const year = parseInt(fg[0]);
    const form = fg[1];
    subjects.forEach(subj => {
      const available = teachersBySubject[subj];
      // Round-robin assign
      const teacher = available[classId % available.length];
      const cls = {
        id: `CL${String(classId).padStart(3, '0')}`,
        name: `${fg} ${subj}`,
        yearGroup: year,
        form: `${year}${form}`,
        subject: subj,
        teacherId: teacher.id,
        teacherName: teacher.name,
        room: pick(rooms),
        pupils: [],
      };
      classes.push(cls);
      teacher.classes.push(cls.id);
      classId++;
    });
  });

  // Assign form tutors (first 16 teachers)
  formGroups.forEach((fg, i) => {
    if (i < teachers.length) {
      teachers[i].formTutor = fg;
    }
  });

  return classes;
}

function generateTimetable(teachers: Teacher[], classes: SchoolClass[]): void {
  // For each teacher, schedule their classes across the week
  teachers.forEach(teacher => {
    const teacherClasses = classes.filter(c => c.teacherId === teacher.id);
    const timetable: Record<SchoolDay, Array<TeacherTimetableSlot | null>> = {
      Monday: Array(6).fill(null),
      Tuesday: Array(6).fill(null),
      Wednesday: Array(6).fill(null),
      Thursday: Array(6).fill(null),
      Friday: Array(6).fill(null),
    };

    // Each class meets ~3 times per week
    const slots: Array<{ day: SchoolDay; period: number }> = [];
    days.forEach(day => periods.forEach((_, pi) => slots.push({ day, period: pi })));

    // Shuffle slots
    for (let i = slots.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [slots[i], slots[j]] = [slots[j], slots[i]];
    }

    let slotIdx = 0;
    teacherClasses.forEach(cls => {
      let assigned = 0;
      while (assigned < 3 && slotIdx < slots.length) {
        const { day, period } = slots[slotIdx];
        slotIdx++;
        if (!timetable[day][period]) {
          timetable[day][period] = {
            classId: cls.id,
            className: cls.name,
            subject: cls.subject,
            room: cls.room,
            form: cls.form,
          };
          assigned++;
        }
      }
    });

    teacher.timetable = timetable;
  });
}

function generatePupils(classes: SchoolClass[]): Pupil[] {
  const pupils: Pupil[] = [];

  const formGroups: Array<{ year: number; form: string }> = [];
  yearGroups.forEach(y => forms.forEach(f => formGroups.push({ year: y, form: `${y}${f}` })));

  let pupilIdx = 0;
  let highRiskAssigned = 0;
  formGroups.forEach(({ year, form }) => {
    const count = year === 5 ? 31 : year === 6 ? 31 : year === 7 ? 32 : 31; // ~125 per year
    const adjustedCount = pupilIdx + count > 500 ? 500 - pupilIdx : count;
    const riskPlan = formRiskPlan[form] || { high: 0, medium: 1 };
    const positionPool = Array.from({ length: adjustedCount }, (_, index) => index);

    for (let i = positionPool.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [positionPool[i], positionPool[j]] = [positionPool[j], positionPool[i]];
    }

    const highRiskPositions = new Set(positionPool.slice(0, riskPlan.high));
    const mediumRiskPositions = new Set(positionPool.slice(riskPlan.high, riskPlan.high + riskPlan.medium));

    for (let i = 0; i < adjustedCount; i++) {
      pupilIdx++;
      const id = `C${String(pupilIdx).padStart(4, '0')}`;
      const identity = getPupilIdentityById(id);
      const isHighRisk = highRiskPositions.has(i);
      const isMediumRisk = !isHighRisk && mediumRiskPositions.has(i);

      let attendance = isHighRisk ? randBetween(55, 78) : isMediumRisk ? randBetween(72, 88) : randBetween(88, 100);
      let behaviourIncidents = isHighRisk ? randInt(3, 8) : isMediumRisk ? randInt(1, 4) : randInt(0, 1);
      let homeworkPct = isHighRisk ? randBetween(25, 55) : isMediumRisk ? randBetween(55, 78) : randBetween(78, 100);
      let wellbeingScore = isHighRisk ? randInt(2, 5) : isMediumRisk ? randInt(4, 6) : randInt(6, 10);
      let fsm = rand() < 0.15;
      let send: SendStatus = rand() < 0.03 ? 'EHCP' : rand() < 0.15 ? 'SEN Support' : 'None';

      // Apply high-risk archetypes
      let archetype = null;
      if (isHighRisk) {
        archetype = highRiskArchetypes[highRiskAssigned % highRiskArchetypes.length];
        highRiskAssigned++;
        if (archetype.fsmOverride) fsm = true;
        if (archetype.sendOverride) send = archetype.sendOverride;
        if (archetype.behavOverride !== undefined) behaviourIncidents = archetype.behavOverride;
        if (archetype.hwOverride) homeworkPct = archetype.hwOverride;
        if (archetype.wellbeing) wellbeingScore = archetype.wellbeing;
        if (archetype.attOverride) attendance = archetype.attOverride[archetype.attOverride.length - 1];
      }

      attendance = clamp(Math.round(attendance * 10) / 10, 0, 100);
      homeworkPct = clamp(Math.round(homeworkPct * 10) / 10, 0, 100);

      // Calculate risk score
      const attRisk = Math.max(0, (100 - attendance) / 100) * 35;
      const behRisk = Math.min(behaviourIncidents / 8, 1) * 25;
      const acadRisk = Math.max(0, (100 - homeworkPct) / 100) * 20;
      const wellRisk = Math.max(0, (10 - wellbeingScore) / 10) * 15;
      const contextRisk = ((fsm ? 3 : 0) + (send !== 'None' ? 2 : 0));
      let riskScore = Math.round(clamp(attRisk + behRisk + acadRisk + wellRisk + contextRisk, 0, 100));

      // Force high-risk pupils above 75
      if (isHighRisk && riskScore < 76) riskScore = randInt(76, 95);
      if (isMediumRisk && riskScore < 50) riskScore = randInt(50, 74);
      if (!isHighRisk && !isMediumRisk && riskScore > 49) riskScore = randInt(10, 45);

      const riskLevel: RiskLevel = riskScore > 75 ? 'High' : riskScore >= 50 ? 'Medium' : 'Low';
      const attendanceTrend: AttendanceTrend = isHighRisk ? 'Declining' : isMediumRisk ? (rand() > 0.5 ? 'Declining' : 'Stable') : (rand() > 0.8 ? 'Improving' : 'Stable');

      // Assign to classes
      const formClasses = classes.filter(c => c.form === form);
      formClasses.forEach(c => c.pupils.push(id));

      // Generate attendance history (6 months, ~120 school days)
      const attendanceHistory = generateAttendanceHistory(attendance, attendanceTrend, archetype);
      const behaviourHistory = generateBehaviourHistory(behaviourIncidents, archetype, id);
      const wellbeingHistory = generateWellbeingHistory(wellbeingScore, archetype);
      const homeworkHistory = generateHomeworkHistory(homeworkPct, archetype);

      // AI explanation
      const aiExplanation = generateAIExplanation(id, {
        attendance, attendanceTrend, behaviourIncidents, homeworkPct,
        wellbeingScore, fsm, send, riskScore, archetype
      });

      // Risk breakdown
      const riskBreakdown = {
        attendance: Math.round(attRisk),
        behaviour: Math.round(behRisk),
        academic: Math.round(acadRisk),
        wellbeing: Math.round(wellRisk),
        context: contextRisk,
      };

      pupils.push({
        id,
        firstName: identity.firstName,
        lastName: identity.lastName,
        preferredName: identity.preferredFirstName,
        fullName: identity.fullName,
        year, form, attendance, attendanceTrend, behaviourIncidents,
        homeworkPct, wellbeingScore, fsm, send, riskScore, riskLevel,
        riskBreakdown, aiExplanation, attendanceHistory, behaviourHistory,
        wellbeingHistory, homeworkHistory, archetype: archetype?.desc || null,
        classIds: formClasses.map(c => c.id),
        lastUpdated: '2026-03-28T08:00:00Z',
      });
    }
  });

  return pupils;
}

function generateAttendanceHistory(currentAtt, trend, archetype): AttendanceRecord[] {
  const history: AttendanceRecord[] = [];
  const baseDate = new Date('2025-10-01');
  let att = trend === 'Declining' ? currentAtt + 25 : trend === 'Improving' ? currentAtt - 10 : currentAtt;

  if (archetype?.attOverride) {
    // Use override curve
    const curve = archetype.attOverride;
    for (let month = 0; month < 6; month++) {
      const monthAtt = curve[month] || currentAtt;
      for (let week = 0; week < 4; week++) {
        for (let day = 0; day < 5; day++) {
          const date = new Date(baseDate);
          date.setDate(date.getDate() + month * 28 + week * 7 + day);
          const present = rand() * 100 < monthAtt;
          history.push({
            date: date.toISOString().split('T')[0],
            am: present ? 'Present' : (rand() > 0.7 ? 'Late' : 'Absent'),
            pm: present ? 'Present' : (rand() > 0.3 ? 'Present' : 'Absent'),
          });
        }
      }
    }
  } else {
    for (let month = 0; month < 6; month++) {
      const progress = month / 5;
      const monthAtt = trend === 'Declining' ? att - progress * 25 :
        trend === 'Improving' ? att + progress * 10 : att + (rand() - 0.5) * 3;
      for (let week = 0; week < 4; week++) {
        for (let day = 0; day < 5; day++) {
          const date = new Date(baseDate);
          date.setDate(date.getDate() + month * 28 + week * 7 + day);
          const dayOfWeek = date.getDay();
          if (dayOfWeek === 0 || dayOfWeek === 6) continue;
          let present = rand() * 100 < monthAtt;
          if (archetype?.mondayAbsent && day === 0) present = rand() > 0.6;
          history.push({
            date: date.toISOString().split('T')[0],
            am: present ? 'Present' : (rand() > 0.8 ? 'Late' : 'Absent'),
            pm: present ? 'Present' : (rand() > 0.4 ? 'Present' : 'Absent'),
          });
        }
      }
    }
  }
  return history;
}

function generateBehaviourHistory(incidents, archetype, pupilId): BehaviourIncident[] {
  const history: BehaviourIncident[] = [];
  const types = ['Disruption', 'Defiance', 'Aggression', 'Other'];
  const severities: BehaviourSeverity[] = ['Minor', 'Moderate', 'Major'];
  const descriptions = [
    'Talking over teacher during lesson',
    'Refused to follow instructions',
    'Disruptive behaviour in class',
    'Late to lesson without valid reason',
    'Inappropriate language towards peer',
    'Not completing set work in class',
    'Pushing another pupil in corridor',
    'Using phone in lesson',
    'Walking out of classroom',
    'Throwing objects in class',
  ];
  const recurringConcernMonths = [
    '2025-11-01',
    '2025-12-01',
    '2026-01-01',
    '2026-01-01',
    '2026-02-01',
    '2026-02-01',
    '2026-02-01',
  ];

  function addIncident(date: Date, severityOptions: BehaviourSeverity[]) {
    history.push({
      date: date.toISOString().split('T')[0],
      type: pick(types),
      severity: pick(severityOptions),
      description: pick(descriptions),
      loggedBy: `Staff Member`,
    });
  }

  if (archetype?.behavHistory) {
    archetype.behavHistory.forEach((count, month) => {
      for (let i = 0; i < count; i++) {
        const date = new Date('2025-10-01');
        date.setDate(date.getDate() + month * 28 + randInt(0, 27));
        addIncident(date, count > 4 ? ['Moderate', 'Major'] : severities);
      }
    });
  } else {
    const hasRecurringBehaviourPattern = incidents >= 2;
    const maxHistoricalIncidents =
      incidents >= 6 ? 4 : incidents >= 4 ? 3 : incidents >= 2 ? 2 : 0;
    const historicalIncidentCount = hasRecurringBehaviourPattern ? randInt(1, maxHistoricalIncidents) : 0;

    for (let i = 0; i < historicalIncidentCount; i++) {
      const monthStart = new Date(pick(recurringConcernMonths));
      monthStart.setDate(monthStart.getDate() + randInt(0, 27));
      addIncident(monthStart, incidents >= 5 ? ['Minor', 'Moderate', 'Moderate'] : ['Minor', 'Minor', 'Moderate']);
    }

    for (let i = 0; i < incidents; i++) {
      const date = new Date('2026-03-01');
      date.setDate(date.getDate() + randInt(0, 27));
      addIncident(date, severities);
    }
  }

  return history.sort((a, b) => b.date.localeCompare(a.date));
}

function generateWellbeingHistory(currentScore, archetype): WellbeingEntry[] {
  const history: WellbeingEntry[] = [];
  if (archetype?.wellbeingHistory) {
    archetype.wellbeingHistory.forEach((score, i) => {
      const date = new Date('2025-10-01');
      date.setMonth(date.getMonth() + i);
      history.push({ date: date.toISOString().split('T')[0], score });
    });
  } else {
    for (let i = 0; i < 6; i++) {
      const date = new Date('2025-10-01');
      date.setMonth(date.getMonth() + i);
      const score = clamp(Math.round(currentScore + (rand() - 0.5) * 3), 1, 10);
      history.push({ date: date.toISOString().split('T')[0], score });
    }
  }
  return history;
}

function generateHomeworkHistory(currentPct, archetype): HomeworkHistory {
  const history: HomeworkHistory['monthly'] = [];
  const subjects = ['English', 'Maths', 'Science', 'History', 'Geography', 'French', 'Computing', 'Art'];
  if (archetype?.hwHistory) {
    archetype.hwHistory.forEach((pct, i) => {
      const date = new Date('2025-10-01');
      date.setMonth(date.getMonth() + i);
      history.push({ date: date.toISOString().split('T')[0], pct });
    });
  }
  // Per-subject breakdown
  const subjectBreakdown = subjects.map((s): HomeworkHistory['subjects'][number] => ({
    subject: s,
    pct: clamp(Math.round(currentPct + (rand() - 0.5) * 20), 0, 100),
    trend: (rand() > 0.6 ? 'Declining' : rand() > 0.3 ? 'Stable' : 'Improving') as HomeworkTrend,
    lastSubmission: '2026-03-' + String(randInt(20, 27)).padStart(2, '0'),
  }));
  return { monthly: history, subjects: subjectBreakdown };
}

function generateAIExplanation(id, data): RiskFactor[] {
  const factors: RiskFactor[] = [];
  if (data.attendance < 85) {
    factors.push({
      text: `Attendance at ${data.attendance}% (school average: 93%)`,
      trend: data.attendanceTrend === 'Declining' ? `— declining trend over 6 weeks` : '',
      source: 'Arbor MIS',
    });
  }
  if (data.behaviourIncidents >= 3) {
    factors.push({
      text: `${data.behaviourIncidents} behaviour incidents in last 4 weeks`,
      trend: '(above threshold of 2)',
      source: 'Class Charts',
    });
  }
  if (data.homeworkPct < 70) {
    factors.push({
      text: `Homework submission rate at ${data.homeworkPct}%`,
      trend: '(below 70% threshold)',
      source: 'Class Charts Homework',
    });
  }
  if (data.wellbeingScore <= 4) {
    factors.push({
      text: `Wellbeing survey score: ${data.wellbeingScore}/10`,
      trend: '(significant concern level)',
      source: 'Clinx Survey',
    });
  }
  if (data.fsm) {
    factors.push({
      text: 'Free School Meals eligible',
      trend: '(socioeconomic risk factor)',
      source: 'Arbor MIS',
    });
  }
  if (data.send !== 'None') {
    factors.push({
      text: `SEND status: ${data.send}`,
      trend: '(additional vulnerability factor)',
      source: 'Arbor MIS',
    });
  }
  if (factors.length === 0) {
    factors.push({ text: 'No significant risk factors identified', trend: '', source: 'Clinx AI' });
  }
  return factors;
}

function generateAlerts(pupils: Pupil[], teachers: Teacher[], classes: SchoolClass[]): Alert[] {
  const alerts: Alert[] = [];
  const highRisk = pupils.filter(p => p.riskLevel === 'High');
  const mediumRisk = pupils.filter(p => p.riskLevel === 'Medium').slice(0, 8);
  const flagged = [...highRisk, ...mediumRisk];

  flagged.forEach((pupil, i) => {
    if (i >= 20) return;
    const daysAgo = randInt(0, 6);
    const date = new Date('2026-03-28');
    date.setDate(date.getDate() - daysAgo);
    date.setHours(randInt(7, 16), randInt(0, 59));

    // Find teachers for this pupil
    const pupilClasses = classes.filter(c => c.pupils.includes(pupil.id));
    const assignedTeachers = [...new Set(pupilClasses.map(c => c.teacherName))];

    alerts.push({
      id: `AL${String(i + 1).padStart(3, '0')}`,
      pupilId: pupil.id,
      riskLevel: pupil.riskLevel,
      riskScore: pupil.riskScore,
      reason: `Pattern shift noted (${pupil.riskScore}%): ${pupil.aiExplanation.slice(0, 2).map((f) => f.text).join(' + ')}`,
      timestamp: date.toISOString(),
      status: i < 12 ? 'Unread' : i < 16 ? 'Acknowledged' : 'Dismissed',
      assignedTeachers,
    });
  });

  return alerts.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

function generateStaffNotes(pupils: Pupil[]): Record<string, StaffNote[]> {
  const notes: Record<string, StaffNote[]> = {};
  const noteTemplates = [
    'Spoke with pupil during break. Seemed quiet but engaged when asked about weekend.',
    'Called home - no answer. Will try again tomorrow.',
    'Pupil mentioned feeling overwhelmed with homework. Discussed prioritisation strategies.',
    'Met with parent. They confirmed family difficulties at home. Agreed to weekly check-ins.',
    'Pupil seemed more settled today. Participated well in group work.',
    'Referred to pastoral team for additional support.',
    'Pupil absent again. Third Monday absence this half term.',
    'Had a positive conversation about goals. Pupil expressed interest in coding club.',
    'Noticed pupil sitting alone at lunch. Will monitor.',
    'SENCO review completed. Additional classroom support recommended.',
    'Behaviour has improved this week following conversation with Head of Year.',
    'Pupil disclosed feeling anxious about upcoming tests. Discussed coping strategies.',
  ];
  const staffNames = ['Mrs. K. Thompson', 'Mr. D. Wilson', 'Ms. R. Hughes', 'Mr. A. Smith', 'Mrs. L. Brown'];

  pupils.forEach(p => {
    const noteCount = p.riskLevel === 'High' ? randInt(3, 5) : p.riskLevel === 'Medium' ? randInt(0, 1) : 0;
    if (noteCount === 0) return;
    notes[p.id] = [];
    for (let i = 0; i < noteCount; i++) {
      const daysAgo = randInt(1, 60);
      const date = new Date('2026-03-28');
      date.setDate(date.getDate() - daysAgo);
      notes[p.id].push({
        id: `N${p.id}-${i}`,
        timestamp: date.toISOString(),
        author: pick(staffNames),
        text: pick(noteTemplates),
      });
    }
    notes[p.id].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  });
  return notes;
}

function generateArborSnapshot(pupils: Pupil[]): ArborApiSnapshot {
  const students: ArborStudentRecord[] = pupils.map((pupil) => {
    const identity = getPupilIdentity(pupil);
    return {
      student_id: pupil.id,
      student_number: identity.studentNumber,
      upn: identity.upn,
      legal_first_name: identity.firstName,
      legal_last_name: identity.lastName,
      preferred_first_name: identity.preferredFirstName,
      date_of_birth: identity.dateOfBirth,
      year_group: pupil.year,
      registration_form: pupil.form,
      pupil_premium_eligible: pupil.fsm,
      sen_status: pupil.send,
      enrolment_status: 'Current',
      school_name: 'Dedworth Middle School',
      last_synced_at: pupil.lastUpdated,
    };
  });

  const attendance_marks: ArborAttendanceRecord[] = pupils.flatMap((pupil) =>
    pupil.attendanceHistory.flatMap((record) => [
      {
        student_id: pupil.id,
        date: record.date,
        session: 'AM' as const,
        mark_code: record.am === 'Present' ? '/' : record.am === 'Late' ? 'L' : 'N',
        mark_meaning: record.am,
        attendance_value: record.am,
        school_name: 'Dedworth Middle School',
        source_system: 'arbor' as const,
      },
      {
        student_id: pupil.id,
        date: record.date,
        session: 'PM' as const,
        mark_code: record.pm === 'Present' ? '\\' : record.pm === 'Late' ? 'L' : 'N',
        mark_meaning: record.pm,
        attendance_value: record.pm,
        school_name: 'Dedworth Middle School',
        source_system: 'arbor' as const,
      },
    ]),
  );

  return { students, attendance_marks };
}

function generateClassChartsSnapshot(pupils: Pupil[], teachers: Teacher[], classes: SchoolClass[]): ClassChartsApiSnapshot {
  const behaviour_events: ClassChartsBehaviourRecord[] = pupils.flatMap((pupil) => {
    const identity = getPupilIdentity(pupil);
    return pupil.behaviourHistory.map((incident, index) => {
      const matchingClass = classes.find((schoolClass) => pupil.classIds.includes(schoolClass.id)) || classes[0];
      return {
        behaviour_id: `CC-B-${pupil.id}-${String(index + 1).padStart(3, '0')}`,
        pupil_id: pupil.id,
        pupil_name: identity.fullName,
        class_id: matchingClass.id,
        class_name: matchingClass.name,
        teacher_id: matchingClass.teacherId,
        teacher_name: matchingClass.teacherName,
        activity_type: incident.type,
        severity: incident.severity,
        points: incident.severity === 'Major' ? -4 : incident.severity === 'Moderate' ? -2 : -1,
        comment: incident.description,
        logged_at: `${incident.date}T14:${String((index * 7) % 60).padStart(2, '0')}:00Z`,
        source_system: 'classCharts',
      };
    });
  });

  const homework_feed: ClassChartsHomeworkRecord[] = pupils.flatMap((pupil) => {
    const identity = getPupilIdentity(pupil);
    return pupil.homeworkHistory.subjects.map((subjectEntry, index) => {
      const matchingClass =
        classes.find((schoolClass) => schoolClass.subject === subjectEntry.subject && pupil.classIds.includes(schoolClass.id)) ||
        classes.find((schoolClass) => pupil.classIds.includes(schoolClass.id)) ||
        classes[0];

      const isMissing = subjectEntry.pct < 50;
      const isLate = !isMissing && subjectEntry.pct < 75;
      return {
        homework_id: `CC-H-${pupil.id}-${String(index + 1).padStart(3, '0')}`,
        pupil_id: pupil.id,
        pupil_name: identity.fullName,
        subject: subjectEntry.subject,
        teacher_id: matchingClass.teacherId,
        teacher_name: matchingClass.teacherName,
        class_id: matchingClass.id,
        title: `${subjectEntry.subject} Retrieval Task ${index + 1}`,
        assigned_date: `2026-03-${String(Math.max(1, index + 3)).padStart(2, '0')}`,
        due_date: `2026-03-${String(Math.max(3, index + 10)).padStart(2, '0')}`,
        submitted_at: isMissing ? null : `${subjectEntry.lastSubmission}T17:15:00Z`,
        submission_status: isMissing ? 'Missing' : isLate ? 'Late' : 'Submitted',
        grade_percent: isMissing ? null : subjectEntry.pct,
        source_system: 'classCharts',
      };
    });
  });

  return { behaviour_events, homework_feed };
}

function generateCpomsSnapshot(
  pupils: Pupil[],
  staffNotes: Record<string, StaffNote[]>,
  alerts: Alert[],
  teachers: Teacher[],
): CpomsApiSnapshot {
  const defaultAssignee = teachers[0]?.name || 'Pastoral Lead';
  const concerns: CpomsConcernRecord[] = pupils
    .filter((pupil) => pupil.riskLevel !== 'Low' || (staffNotes[pupil.id] || []).length > 0)
    .flatMap((pupil, index) => {
      const identity = getPupilIdentity(pupil);
      const notes = staffNotes[pupil.id] || [];
      const linkedAlert = alerts.find((alert) => alert.pupilId === pupil.id) || null;
      const category: CpomsConcernRecord['category'] =
        pupil.wellbeingScore <= 4
          ? 'Wellbeing'
          : pupil.attendance < 85
            ? 'Attendance'
            : pupil.behaviourIncidents >= 3
              ? 'Behaviour'
              : 'Pastoral';

      return [
        {
          concern_id: `CPOMS-${String(index + 1).padStart(4, '0')}`,
          pupil_id: pupil.id,
          pupil_name: identity.fullName,
          category,
          status: linkedAlert?.status === 'Dismissed' ? 'Closed' : linkedAlert?.status === 'Acknowledged' ? 'Monitoring' : 'Open',
          priority: pupil.riskLevel,
          reported_by: notes[0]?.author || defaultAssignee,
          assigned_to: linkedAlert?.assignedTeachers[0] || defaultAssignee,
          incident_date: notes[0]?.timestamp?.slice(0, 10) || pupil.lastUpdated.slice(0, 10),
          created_at: notes[0]?.timestamp || pupil.lastUpdated,
          chronology_note:
            notes[0]?.text ||
            `Automated concern created from aggregated signals: attendance ${pupil.attendance}%, behaviour ${pupil.behaviourIncidents}, wellbeing ${pupil.wellbeingScore}/10.`,
          linked_alert_id: linkedAlert?.id || null,
          source_system: 'cpoms',
        },
      ];
    });

  return { concerns };
}

function generateExternalSourceSnapshots(
  pupils: Pupil[],
  teachers: Teacher[],
  classes: SchoolClass[],
  alerts: Alert[],
  staffNotes: Record<string, StaffNote[]>,
): ExternalSourceSnapshots {
  return {
    arbor: generateArborSnapshot(pupils),
    classCharts: generateClassChartsSnapshot(pupils, teachers, classes),
    cpoms: generateCpomsSnapshot(pupils, staffNotes, alerts, teachers),
  };
}

export function generateAllData(): GeneratedData {
  const teachers = generateTeachers();
  const classes = generateClasses(teachers);
  generateTimetable(teachers, classes);
  const pupils = generatePupils(classes);
  const alerts = generateAlerts(pupils, teachers, classes);
  const staffNotes = generateStaffNotes(pupils);
  const sourceData = generateExternalSourceSnapshots(pupils, teachers, classes, alerts, staffNotes);

  return { teachers, classes, pupils, alerts, staffNotes, periods, days, sourceData };
}

