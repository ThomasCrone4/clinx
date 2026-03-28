import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { getAllTeachers, getPupilStats } from '../services/dataService';
import { getAllAlerts as getBaseAlerts } from '../services/dataService';
import type { Teacher } from '../types/domain';

export type SchoolStatus = 'Active' | 'Onboarding' | 'Training';
export type IntegrationMode = 'CSV-First Setup' | 'Live MIS/API + CSV Outcomes' | 'Hybrid Rollout';
export type TrainingMode = 'Historical CSV Training' | 'Scheduled Batch Retraining' | 'Pilot Without Model';
export type OnboardingStage = 'Discovery' | 'Integration Setup' | 'Historical Training' | 'Go-Live Readiness';
export type OnboardingStatus = 'On Track' | 'Needs Input' | 'Ready';
export type CsvImportStatus = 'Imported' | 'Pending' | 'Missing';
export type ProvisionedUserStatus = 'Created' | 'Invite Pending';
export type SupportAccountStatus = 'Active' | 'Invited' | 'Suspended';

export type SchoolSupportAccount = {
  id: string;
  name: string;
  role: string;
  email: string;
  classes: string;
  status: SupportAccountStatus;
  source: 'Synced' | 'Manual';
  lastAccess: string;
};

export type OnboardingChecklistItem = {
  label: string;
  complete: boolean;
};

export type SchoolConnectorSettings = {
  arborToken: string;
  classChartsToken: string;
  cpomsRoute: string;
};

export type CsvImportRecord = {
  name: string;
  status: CsvImportStatus;
  note: string;
};

export type ProvisionedAdminUser = {
  name: string;
  email: string;
  role: string;
  status: ProvisionedUserStatus;
};

export type AdminSchool = {
  id: string;
  name: string;
  location: string;
  pupils: number;
  highRisk: number;
  alerts: number;
  status: SchoolStatus;
  supportOwner: string;
  onboarding: {
    owner: string;
    stage: OnboardingStage;
    status: OnboardingStatus;
    integrationMode: IntegrationMode;
    trainingMode: TrainingMode;
    nextMilestone: string;
    connectedSources: string[];
    checklist: OnboardingChecklistItem[];
    connectors: SchoolConnectorSettings;
    csvImports: CsvImportRecord[];
    adminUsers: ProvisionedAdminUser[];
    trackingNotes: string;
  };
  accounts: SchoolSupportAccount[];
};

export type NewSchoolPayload = {
  schoolName: string;
  location: string;
  pupilEstimate: string;
  adminName: string;
  adminEmail: string;
  integrationMode: IntegrationMode;
  trainingMode: TrainingMode;
  connectArbor: boolean;
  connectClassCharts: boolean;
  connectCpoms: boolean;
};

type AdminDataContextValue = {
  schools: AdminSchool[];
  addSchool: (payload: NewSchoolPayload) => AdminSchool;
  getSchoolById: (id: string) => AdminSchool | undefined;
  updateOnboardingStage: (schoolId: string, stage: OnboardingStage) => void;
  updateTrackingNotes: (schoolId: string, notes: string) => void;
  updateConnectors: (schoolId: string, connectors: SchoolConnectorSettings) => void;
  markCsvImportDone: (schoolId: string, name: string) => void;
  addProvisionedAdminUser: (schoolId: string, user: Omit<ProvisionedAdminUser, 'status'>) => void;
  updateSupportAccount: (
    schoolId: string,
    accountId: string,
    updates: Partial<Pick<SchoolSupportAccount, 'email' | 'status'>>,
  ) => void;
  suspendSupportAccount: (schoolId: string, accountId: string) => void;
  reactivateSupportAccount: (schoolId: string, accountId: string) => void;
};

const AdminDataContext = createContext<AdminDataContextValue | null>(null);
const STORAGE_KEY = 'clinx-admin-data-v1';

function buildDedworthAccounts(): SchoolSupportAccount[] {
  const teachers = getAllTeachers();

  return [
    {
      id: 'support-head',
      name: 'Mrs. J. Whitfield',
      role: 'School Admin',
      email: 'head@dedworth.school',
      classes: '-',
      status: 'Active',
      source: 'Manual',
      lastAccess: '28 Mar 2026',
    },
    {
      id: 'support-dsl',
      name: 'Mr. P. Hargreaves',
      role: 'DSL',
      email: 'dsl@dedworth.school',
      classes: '-',
      status: 'Active',
      source: 'Manual',
      lastAccess: '28 Mar 2026',
    },
    ...teachers.map((teacher: Teacher, index) => ({
      id: teacher.id,
      name: teacher.name,
      role: 'Teacher',
      email: teacher.email,
      classes: `${teacher.classes.length} classes`,
      status: index < 24 ? ('Active' as const) : index < 27 ? ('Invited' as const) : ('Suspended' as const),
      source: 'Synced' as const,
      lastAccess: index < 24 ? `2${8 - (index % 5)} Mar 2026` : 'Never',
    })),
  ];
}

function buildPlaceholderAccounts(prefix: string, schoolId: string): SchoolSupportAccount[] {
  const slug = prefix.toLowerCase();
  return [
    {
      id: `${schoolId}-admin`,
      name: `${prefix} Admin`,
      role: 'School Admin',
      email: `admin@${slug}.school`,
      classes: '-',
      status: 'Invited',
      source: 'Manual',
      lastAccess: 'Pending setup',
    },
    {
      id: `${schoolId}-teacher-1`,
      name: 'Ms. A. Carter',
      role: 'Teacher',
      email: `a.carter@${slug}.school`,
      classes: '8 classes',
      status: 'Invited',
      source: 'Synced',
      lastAccess: 'Pending setup',
    },
    {
      id: `${schoolId}-teacher-2`,
      name: 'Mr. D. Khan',
      role: 'Teacher',
      email: `d.khan@${slug}.school`,
      classes: '7 classes',
      status: 'Active',
      source: 'Synced',
      lastAccess: '27 Mar 2026',
    },
  ];
}

function createInitialSchools(): AdminSchool[] {
  const stats = getPupilStats();
  const alerts = getBaseAlerts().filter((alert) => alert.status === 'Unread');

  return [
    {
      id: 'school-dedworth',
      name: 'Dedworth Middle School',
      location: 'Windsor, UK',
      pupils: stats.total,
      highRisk: stats.high,
      alerts: alerts.length,
      status: 'Active',
      supportOwner: 'Clinx Customer Success',
      onboarding: {
        owner: 'Clinx Customer Success',
        stage: 'Go-Live Readiness',
        status: 'Ready',
        integrationMode: 'Hybrid Rollout',
        trainingMode: 'Historical CSV Training',
        nextMilestone: 'Monitor post-launch outcome quality and plan the next retraining window',
        connectedSources: ['Arbor live feed', 'Class Charts live feed', 'CPOMS historical export'],
        checklist: [
          { label: 'Commercial agreement confirmed', complete: true },
          { label: 'Named school onboarding lead assigned', complete: true },
          { label: 'Live MIS/API credentials requested', complete: true },
          { label: 'Historical CSV export scheduled', complete: true },
          { label: 'Model validation workshop booked', complete: true },
          { label: 'Go-live date agreed', complete: true },
        ],
        connectors: {
          arborToken: 'arb_live_dedworth_2026',
          classChartsToken: 'cc_sync_dedworth_2026',
          cpomsRoute: 'Weekly secure export',
        },
        csvImports: [
          { name: 'Arbor attendance history.csv', status: 'Imported', note: '24 months loaded' },
          { name: 'Class Charts behaviour.csv', status: 'Imported', note: '18 months loaded' },
          { name: 'CPOMS chronology export.csv', status: 'Imported', note: 'Safeguarding chronology labels mapped' },
        ],
        adminUsers: [
          { name: 'Mrs. J. Whitfield', email: 'head@dedworth.school', role: 'School Admin', status: 'Created' },
          { name: 'Mr. P. Hargreaves', email: 'dsl@dedworth.school', role: 'DSL', status: 'Created' },
        ],
        trackingNotes:
          'Owner: Clinx Customer Success. Dedworth is live on the hybrid model path with historical training complete and monitoring in place.',
      },
      accounts: buildDedworthAccounts(),
    },
    {
      id: 'school-hillview',
      name: 'Hillview Academy',
      location: 'Reading, UK',
      pupils: 780,
      highRisk: 0,
      alerts: 0,
      status: 'Onboarding',
      supportOwner: 'S. Patel',
      onboarding: {
        owner: 'S. Patel',
        stage: 'Integration Setup',
        status: 'On Track',
        integrationMode: 'Live MIS/API + CSV Outcomes',
        trainingMode: 'Historical CSV Training',
        nextMilestone: 'Confirm Arbor credentials and schedule CPOMS export route',
        connectedSources: ['Arbor live feed', 'Class Charts live feed', 'CPOMS historical export'],
        checklist: [
          { label: 'Commercial agreement confirmed', complete: true },
          { label: 'Named school onboarding lead assigned', complete: true },
          { label: 'Live MIS/API credentials requested', complete: true },
          { label: 'Historical CSV export scheduled', complete: false },
          { label: 'Model validation workshop booked', complete: false },
          { label: 'Go-live date agreed', complete: false },
        ],
        connectors: {
          arborToken: 'arb_live_hillview_2026',
          classChartsToken: 'cc_sync_hillview_2026',
          cpomsRoute: 'Weekly secure export',
        },
        csvImports: [
          { name: 'Arbor attendance history.csv', status: 'Imported', note: '24 months loaded' },
          { name: 'Class Charts behaviour.csv', status: 'Imported', note: '18 months loaded' },
          { name: 'CPOMS chronology export.csv', status: 'Pending', note: 'Awaiting safeguarding lead upload' },
        ],
        adminUsers: [
          { name: 'J. Reynolds', email: 'j.reynolds@hillview.school', role: 'School Admin', status: 'Created' },
          { name: 'M. Shah', email: 'm.shah@hillview.school', role: 'DSL', status: 'Invite Pending' },
        ],
        trackingNotes:
          'Owner: S. Patel. Hillview is moving through connector setup and only needs the CPOMS export route confirmed.',
      },
      accounts: buildPlaceholderAccounts('Hillview', 'school-hillview'),
    },
    {
      id: 'school-riverside',
      name: 'Riverside Academy',
      location: 'Slough, UK',
      pupils: 640,
      highRisk: 0,
      alerts: 0,
      status: 'Training',
      supportOwner: 'A. Turner',
      onboarding: {
        owner: 'A. Turner',
        stage: 'Historical Training',
        status: 'Needs Input',
        integrationMode: 'Hybrid Rollout',
        trainingMode: 'Scheduled Batch Retraining',
        nextMilestone: 'Receive two years of outcome history for training',
        connectedSources: ['Arbor live feed', 'CPOMS historical export'],
        checklist: [
          { label: 'School setup created', complete: true },
          { label: 'Connector scope agreed', complete: true },
          { label: 'Backfill window confirmed', complete: false },
          { label: 'Training dataset mapped', complete: false },
          { label: 'Safeguarding review completed', complete: false },
          { label: 'Pilot staff selected', complete: false },
        ],
        connectors: {
          arborToken: 'arb_riverside_pending',
          classChartsToken: '',
          cpomsRoute: 'Monthly export requested',
        },
        csvImports: [
          { name: 'Arbor pupil-roll.csv', status: 'Imported', note: 'Current-year baseline loaded' },
          { name: 'Behaviour archive.zip', status: 'Pending', note: 'Awaiting Class Charts export' },
          { name: 'CPOMS outcomes 2024-2026.csv', status: 'Missing', note: 'Not received yet' },
        ],
        adminUsers: [
          { name: 'A. Turner', email: 'a.turner@riverside.school', role: 'School Admin', status: 'Created' },
        ],
        trackingNotes:
          'Owner: A. Turner. Riverside is blocked on outcome-history exports before the first training run can be validated.',
      },
      accounts: buildPlaceholderAccounts('Riverside', 'school-riverside'),
    },
    {
      id: 'school-oakfield',
      name: 'Oakfield College',
      location: 'Maidenhead, UK',
      pupils: 920,
      highRisk: 0,
      alerts: 0,
      status: 'Training',
      supportOwner: 'L. Morris',
      onboarding: {
        owner: 'L. Morris',
        stage: 'Go-Live Readiness',
        status: 'Ready',
        integrationMode: 'CSV-First Setup',
        trainingMode: 'Historical CSV Training',
        nextMilestone: 'Approve pilot launch for Year 7 and Year 8',
        connectedSources: ['CSV attendance', 'CSV behaviour', 'CPOMS historical export'],
        checklist: [
          { label: 'Historical model training complete', complete: true },
          { label: 'School validation session complete', complete: true },
          { label: 'Notification routing configured', complete: true },
          { label: 'Pilot cohort chosen', complete: true },
          { label: 'Staff onboarding materials shared', complete: true },
          { label: 'Go-live sign-off pending', complete: false },
        ],
        connectors: {
          arborToken: '',
          classChartsToken: '',
          cpomsRoute: 'Termly export only',
        },
        csvImports: [
          { name: 'Attendance history.csv', status: 'Imported', note: '36 months loaded' },
          { name: 'Behaviour and homework.csv', status: 'Imported', note: '24 months loaded' },
          { name: 'CPOMS chronology export.csv', status: 'Imported', note: 'Safeguarding labels mapped' },
        ],
        adminUsers: [
          { name: 'L. Morris', email: 'l.morris@oakfield.school', role: 'School Admin', status: 'Created' },
          { name: 'P. Lewis', email: 'p.lewis@oakfield.school', role: 'DSL', status: 'Created' },
        ],
        trackingNotes:
          'Owner: L. Morris. Oakfield is ready for a controlled pilot launch once the final go-live sign-off is logged.',
      },
      accounts: buildPlaceholderAccounts('Oakfield', 'school-oakfield'),
    },
  ];
}

function loadInitialSchools(): AdminSchool[] {
  if (typeof window === 'undefined') {
    return createInitialSchools();
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return createInitialSchools();
  }

  try {
    return JSON.parse(stored) as AdminSchool[];
  } catch {
    return createInitialSchools();
  }
}

function inferSchoolStatus(stage: OnboardingStage, trainingMode: TrainingMode): SchoolStatus {
  if (stage === 'Go-Live Readiness') {
    return 'Active';
  }
  if (stage === 'Historical Training' && trainingMode !== 'Pilot Without Model') {
    return 'Training';
  }
  return 'Onboarding';
}

function inferOnboardingStatus(stage: OnboardingStage, connectors: SchoolConnectorSettings, csvImports: CsvImportRecord[]): OnboardingStatus {
  const missingImports = csvImports.some((item) => item.status === 'Missing');
  const pendingImports = csvImports.some((item) => item.status === 'Pending');
  const missingTokenInSetup =
    stage === 'Integration Setup' && (!connectors.arborToken.trim() || !connectors.classChartsToken.trim());

  if (!missingImports && !pendingImports && !missingTokenInSetup && stage === 'Go-Live Readiness') {
    return 'Ready';
  }
  if (missingImports || missingTokenInSetup) {
    return 'Needs Input';
  }
  return 'On Track';
}

function updateSchoolRecord(
  schools: AdminSchool[],
  schoolId: string,
  updater: (school: AdminSchool) => AdminSchool,
): AdminSchool[] {
  return schools.map((school) => (school.id === schoolId ? updater(school) : school));
}

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [schools, setSchools] = useState<AdminSchool[]>(loadInitialSchools);

  function persist(nextSchools: AdminSchool[]) {
    setSchools(nextSchools);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSchools));
    }
  }

  function addSchool(payload: NewSchoolPayload): AdminSchool {
    const trimmedName = payload.schoolName.trim();
    const trimmedAdminName = payload.adminName.trim() || 'School Admin';
    const trimmedAdminEmail = payload.adminEmail.trim();
    const stage: OnboardingStage =
      payload.trainingMode === 'Pilot Without Model' ? 'Discovery' : 'Historical Training';
    const connectedSources = [
      payload.connectArbor ? 'Arbor live feed' : null,
      payload.connectClassCharts ? 'Class Charts live feed' : null,
      payload.connectCpoms ? 'CPOMS historical export' : null,
    ].filter(Boolean) as string[];
    const schoolId = `school-${trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
    const prefix = trimmedName.split(' ')[0] || 'School';

    const newSchool: AdminSchool = {
      id: schoolId,
      name: trimmedName,
      location: payload.location.trim() || 'Location pending',
      pupils: Number(payload.pupilEstimate) || 0,
      highRisk: 0,
      alerts: 0,
      status: inferSchoolStatus(stage, payload.trainingMode),
      supportOwner: trimmedAdminName,
      onboarding: {
        owner: trimmedAdminName,
        stage,
        status: payload.trainingMode === 'Pilot Without Model' ? 'Needs Input' : 'On Track',
        integrationMode: payload.integrationMode,
        trainingMode: payload.trainingMode,
        nextMilestone:
          payload.trainingMode === 'Pilot Without Model'
            ? 'Confirm pilot workflow, notification routing, and first school admin users'
            : 'Collect historical exports and validate the first training dataset',
        connectedSources,
        checklist: [
          { label: 'Commercial agreement confirmed', complete: true },
          { label: 'Named school onboarding lead assigned', complete: true },
          { label: 'Live MIS/API credentials requested', complete: payload.connectArbor || payload.connectClassCharts },
          { label: 'Historical CSV export scheduled', complete: false },
          { label: 'Model validation workshop booked', complete: false },
          { label: 'Go-live date agreed', complete: false },
        ],
        connectors: {
          arborToken: '',
          classChartsToken: '',
          cpomsRoute: payload.connectCpoms ? 'Awaiting secure export route' : '',
        },
        csvImports: [
          {
            name: 'Arbor attendance history.csv',
            status: payload.connectArbor ? 'Pending' : 'Missing',
            note: payload.connectArbor ? 'Awaiting upload from school' : 'Not included in current scope',
          },
          {
            name: 'Class Charts behaviour.csv',
            status: payload.connectClassCharts ? 'Pending' : 'Missing',
            note: payload.connectClassCharts ? 'Awaiting upload from school' : 'Not included in current scope',
          },
          {
            name: 'CPOMS chronology export.csv',
            status: payload.connectCpoms ? 'Pending' : 'Missing',
            note: payload.connectCpoms ? 'Awaiting upload from school' : 'Not included in current scope',
          },
        ],
        adminUsers: [
          {
            name: trimmedAdminName,
            email: trimmedAdminEmail,
            role: 'School Admin',
            status: 'Invite Pending',
          },
        ],
        trackingNotes: `Owner: ${trimmedAdminName}. New onboarding created for ${trimmedName}. Next step: confirm integration route and school-side contacts.`,
      },
      accounts: [
        {
          id: `${schoolId}-admin`,
          name: trimmedAdminName,
          role: 'School Admin',
          email: trimmedAdminEmail,
          classes: '-',
          status: 'Invited',
          source: 'Manual',
          lastAccess: 'Pending setup',
        },
        ...buildPlaceholderAccounts(prefix, schoolId).filter((account) => account.role === 'Teacher'),
      ],
    };

    persist([newSchool, ...schools]);
    return newSchool;
  }

  function getSchoolById(id: string) {
    return schools.find((school) => school.id === id);
  }

  function updateOnboardingStage(schoolId: string, stage: OnboardingStage) {
    persist(
      updateSchoolRecord(schools, schoolId, (school) => {
        const nextStatus = inferOnboardingStatus(stage, school.onboarding.connectors, school.onboarding.csvImports);
        return {
          ...school,
          status: inferSchoolStatus(stage, school.onboarding.trainingMode),
          onboarding: {
            ...school.onboarding,
            stage,
            status: nextStatus,
          },
        };
      }),
    );
  }

  function updateTrackingNotes(schoolId: string, notes: string) {
    persist(
      updateSchoolRecord(schools, schoolId, (school) => ({
        ...school,
        onboarding: {
          ...school.onboarding,
          trackingNotes: notes,
        },
      })),
    );
  }

  function updateConnectors(schoolId: string, connectors: SchoolConnectorSettings) {
    persist(
      updateSchoolRecord(schools, schoolId, (school) => {
        const nextStatus = inferOnboardingStatus(school.onboarding.stage, connectors, school.onboarding.csvImports);
        return {
          ...school,
          onboarding: {
            ...school.onboarding,
            connectors,
            status: nextStatus,
          },
        };
      }),
    );
  }

  function markCsvImportDone(schoolId: string, name: string) {
    persist(
      updateSchoolRecord(schools, schoolId, (school) => {
        const csvImports = school.onboarding.csvImports.map((file) =>
          file.name === name ? { ...file, status: 'Imported' as const, note: 'Uploaded to onboarding workspace' } : file,
        );
        const nextStatus = inferOnboardingStatus(school.onboarding.stage, school.onboarding.connectors, csvImports);
        return {
          ...school,
          onboarding: {
            ...school.onboarding,
            csvImports,
            status: nextStatus,
          },
        };
      }),
    );
  }

  function addProvisionedAdminUser(schoolId: string, user: Omit<ProvisionedAdminUser, 'status'>) {
    persist(
      updateSchoolRecord(schools, schoolId, (school) => {
        const existingAccount = school.accounts.find((account) => account.email.toLowerCase() === user.email.toLowerCase());
        return {
          ...school,
          onboarding: {
            ...school.onboarding,
            adminUsers: [
              ...school.onboarding.adminUsers,
              {
                ...user,
                status: 'Invite Pending',
              },
            ],
          },
          accounts: existingAccount
            ? school.accounts.map((account) =>
                account.email.toLowerCase() === user.email.toLowerCase()
                  ? { ...account, name: user.name, role: user.role, status: 'Invited', source: 'Manual' }
                  : account,
              )
            : [
                {
                  id: `${schoolId}-account-${Date.now()}`,
                  name: user.name,
                  role: user.role,
                  email: user.email,
                  classes: '-',
                  status: 'Invited',
                  source: 'Manual',
                  lastAccess: 'Pending setup',
                },
                ...school.accounts,
              ],
        };
      }),
    );
  }

  function updateSupportAccount(
    schoolId: string,
    accountId: string,
    updates: Partial<Pick<SchoolSupportAccount, 'email' | 'status'>>,
  ) {
    persist(
      updateSchoolRecord(schools, schoolId, (school) => ({
        ...school,
        accounts: school.accounts.map((account) =>
          account.id === accountId
            ? {
                ...account,
                ...updates,
              }
            : account,
        ),
      })),
    );
  }

  function suspendSupportAccount(schoolId: string, accountId: string) {
    updateSupportAccount(schoolId, accountId, { status: 'Suspended' });
  }

  function reactivateSupportAccount(schoolId: string, accountId: string) {
    updateSupportAccount(schoolId, accountId, { status: 'Active' });
  }

  const value = useMemo<AdminDataContextValue>(
    () => ({
      schools,
      addSchool,
      getSchoolById,
      updateOnboardingStage,
      updateTrackingNotes,
      updateConnectors,
      markCsvImportDone,
      addProvisionedAdminUser,
      updateSupportAccount,
      suspendSupportAccount,
      reactivateSupportAccount,
    }),
    [schools],
  );

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) {
    throw new Error('useAdminData must be used within AdminDataProvider');
  }
  return ctx;
}
