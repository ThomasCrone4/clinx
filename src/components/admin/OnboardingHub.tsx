import { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  Brain,
  Cable,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileSpreadsheet,
  KeyRound,
  ShieldCheck,
  Upload,
  UserPlus,
} from 'lucide-react';
import {
  useAdminData,
  type OnboardingStage,
  type SchoolConnectorSettings,
} from '../../context/AdminDataContext';
import { useToast } from '../common/Toast';

type AdminForm = {
  name: string;
  email: string;
  role: string;
};

const emptyAdminForm: AdminForm = {
  name: '',
  email: '',
  role: 'School Admin',
};

export default function OnboardingHub() {
  const {
    schools,
    getSchoolById,
    updateOnboardingStage,
    updateTrackingNotes,
    updateConnectors,
    markCsvImportDone,
    addProvisionedAdminUser,
  } = useAdminData();
  const { addToast } = useToast();
  const onboardingSchools = useMemo(
    () => schools.filter((school) => school.status !== 'Active'),
    [schools],
  );

  const initialSchoolId = onboardingSchools[0]?.id ?? '';
  const [selectedId, setSelectedId] = useState(initialSchoolId);
  const [showSchoolMenu, setShowSchoolMenu] = useState(false);
  const [connectorForm, setConnectorForm] = useState<SchoolConnectorSettings>({
    arborToken: '',
    classChartsToken: '',
    cpomsRoute: '',
  });
  const [adminForm, setAdminForm] = useState<AdminForm>(emptyAdminForm);
  const [stageOverride, setStageOverride] = useState<OnboardingStage>('Discovery');
  const [trackingNotes, setTrackingNotes] = useState('');

  useEffect(() => {
    if (!onboardingSchools.length) {
      return;
    }

    if (!selectedId || !onboardingSchools.some((school) => school.id === selectedId)) {
      setSelectedId(onboardingSchools[0].id);
    }
  }, [onboardingSchools, selectedId]);

  const selectedSchool = getSchoolById(selectedId) ?? onboardingSchools[0];
  const completeCount = selectedSchool?.onboarding.checklist.filter((item) => item.complete).length ?? 0;

  useEffect(() => {
    if (!selectedSchool) {
      return;
    }

    setConnectorForm(selectedSchool.onboarding.connectors);
    setAdminForm(emptyAdminForm);
    setStageOverride(selectedSchool.onboarding.stage);
    setTrackingNotes(selectedSchool.onboarding.trackingNotes);
  }, [selectedSchool]);

  const readyToLaunch = useMemo(
    () => onboardingSchools.filter((school) => school.onboarding.status === 'Ready').length,
    [onboardingSchools],
  );

  const integrationWorkstreams = useMemo(
    () =>
      onboardingSchools.filter(
        (school) =>
          school.onboarding.connectors.arborToken.trim() ||
          school.onboarding.connectors.classChartsToken.trim() ||
          school.onboarding.connectors.cpomsRoute.trim(),
      ).length,
    [onboardingSchools],
  );

  function selectSchool(id: string) {
    setSelectedId(id);
    setShowSchoolMenu(false);
  }

  function saveConnectors(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedSchool) return;
    updateConnectors(selectedSchool.id, connectorForm);
    addToast(`Connector settings saved for ${selectedSchool.name}`, 'success');
  }

  function addAdminUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedSchool) return;
    if (!adminForm.name.trim() || !adminForm.email.trim()) {
      addToast('Please complete the admin user details', 'warning');
      return;
    }

    addProvisionedAdminUser(selectedSchool.id, {
      name: adminForm.name.trim(),
      email: adminForm.email.trim(),
      role: adminForm.role,
    });
    setAdminForm(emptyAdminForm);
    addToast('School admin user created and invite queued', 'success');
  }

  function saveTrackingUpdate() {
    if (!selectedSchool) return;
    updateTrackingNotes(selectedSchool.id, trackingNotes);
    if (stageOverride !== selectedSchool.onboarding.stage) {
      updateOnboardingStage(selectedSchool.id, stageOverride);
    }
    addToast(`Tracking notes saved for ${selectedSchool.name}`, 'success');
  }

  function statusClasses(status: string): string {
    if (status === 'Ready') return 'bg-emerald-100 text-emerald-700';
    if (status === 'Needs Input') return 'bg-amber-100 text-amber-700';
    return 'bg-sky-100 text-sky-700';
  }

  if (!selectedSchool) {
    return (
      <div className="max-w-5xl space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Onboarding Hub</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track hybrid rollout between Clinx and school leads, from discovery through integrations, historical training, and go-live readiness.
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900">No Schools In Onboarding</h2>
          <p className="text-sm text-gray-500 mt-2">
            All current schools are marked as active. New schools will appear here once onboarding starts.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Onboarding Hub</h1>
        <p className="text-sm text-gray-500 mt-1">
          Track hybrid rollout between Clinx and school leads, from discovery through integrations, historical training, and go-live readiness.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Selected School</label>
          <button
            type="button"
            onClick={() => setShowSchoolMenu((value) => !value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-left flex items-center justify-between gap-4 hover:border-sky-300 focus:ring-2 focus:ring-sky-500 outline-none"
          >
            <div className="min-w-0">
              <p className="font-medium text-gray-900 truncate">{selectedSchool.name}</p>
              <p className="text-xs text-gray-500 mt-0.5 truncate">{selectedSchool.onboarding.stage}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusClasses(
                  selectedSchool.onboarding.status,
                )}`}
              >
                {selectedSchool.onboarding.status}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${showSchoolMenu ? 'rotate-180' : ''}`}
              />
            </div>
          </button>

          {showSchoolMenu && (
            <div className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
              {onboardingSchools.map((school) => (
                <button
                  key={school.id}
                  type="button"
                  onClick={() => selectSchool(school.id)}
                  className={`w-full px-4 py-3 text-left flex items-center justify-between gap-4 transition-colors ${
                    selectedSchool.id === school.id ? 'bg-sky-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{school.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{school.onboarding.stage}</p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${statusClasses(
                      school.onboarding.status,
                    )}`}
                  >
                    {school.onboarding.status}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-start justify-between gap-6 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Tracking Notes</h2>
            <p className="text-sm text-gray-500 mt-1">
              Quick working notes for onboarding progress, blockers, and next actions across Clinx and the school.
            </p>
          </div>
          <button
            onClick={saveTrackingUpdate}
            className="px-4 py-2 bg-sky-600 text-white text-sm rounded-lg font-medium hover:bg-sky-700"
          >
            Save Tracking Update
          </button>
        </div>
        <div className="grid grid-cols-[280px_1fr] gap-4 items-start">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mark Onboarding Stage</label>
            <select
              value={stageOverride}
              onChange={(event) => setStageOverride(event.target.value as OnboardingStage)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
            >
              <option>Discovery</option>
              <option>Integration Setup</option>
              <option>Historical Training</option>
              <option>Go-Live Readiness</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={trackingNotes}
              onChange={(event) => setTrackingNotes(event.target.value)}
              className="w-full min-h-28 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
              placeholder="Add rollout notes, blockers, school requests, or internal handover context..."
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: 'Schools In Flight',
            value: onboardingSchools.length,
            icon: Building2,
            tone: 'text-sky-700',
            bg: 'bg-sky-50 border-sky-200',
          },
          {
            label: 'Integration Workstreams',
            value: integrationWorkstreams,
            icon: Cable,
            tone: 'text-emerald-700',
            bg: 'bg-emerald-50 border-emerald-200',
          },
          {
            label: 'Training Pipelines',
            value: onboardingSchools.filter((school) => school.status === 'Training').length,
            icon: Brain,
            tone: 'text-violet-700',
            bg: 'bg-violet-50 border-violet-200',
          },
          {
            label: 'Ready To Launch',
            value: readyToLaunch,
            icon: CheckCircle2,
            tone: 'text-amber-700',
            bg: 'bg-amber-50 border-amber-200',
          },
        ].map((item) => (
          <div key={item.label} className={`rounded-xl border p-4 ${item.bg}`}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{item.label}</p>
              <item.icon className={`w-4 h-4 ${item.tone}`} />
            </div>
            <p className={`text-3xl font-bold mt-3 ${item.tone}`}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{selectedSchool.name}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {selectedSchool.onboarding.stage} - Owned by {selectedSchool.onboarding.owner}
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              {completeCount}/{selectedSchool.onboarding.checklist.length} complete
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-5">
            <div className="rounded-xl border border-gray-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Integration</p>
              <p className="text-sm font-semibold text-gray-900 mt-2">{selectedSchool.onboarding.integrationMode}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Training</p>
              <p className="text-sm font-semibold text-gray-900 mt-2">{selectedSchool.onboarding.trainingMode}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Next Milestone</p>
              <p className="text-sm font-semibold text-gray-900 mt-2">{selectedSchool.onboarding.nextMilestone}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-sky-200 bg-sky-50 p-5">
          <p className="text-sm text-sky-800">
            Schools do not need a separate onboarding portal. Clinx handles onboarding directly through demo follow-up,
            kickoff, and the named school contacts tracked below.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
              <KeyRound className="w-5 h-5 text-sky-600" />
              Connector Setup
            </h3>
            <form onSubmit={saveConnectors} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Arbor API Token</label>
                <input
                  type="text"
                  value={connectorForm.arborToken}
                  onChange={(event) => setConnectorForm((prev) => ({ ...prev, arborToken: event.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                  placeholder="Paste Arbor token"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class Charts Token</label>
                <input
                  type="text"
                  value={connectorForm.classChartsToken}
                  onChange={(event) =>
                    setConnectorForm((prev) => ({ ...prev, classChartsToken: event.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                  placeholder="Paste Class Charts token"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CPOMS Route</label>
                <input
                  type="text"
                  value={connectorForm.cpomsRoute}
                  onChange={(event) => setConnectorForm((prev) => ({ ...prev, cpomsRoute: event.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                  placeholder="Weekly secure export"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-sky-600 text-white text-sm rounded-lg hover:bg-sky-700"
              >
                Save Connector Settings
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
              <Upload className="w-5 h-5 text-emerald-600" />
              Historical CSV Imports
            </h3>
            <div className="space-y-3">
              {selectedSchool.onboarding.csvImports.map((file) => (
                <div key={file.name} className="rounded-lg border border-gray-200 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{file.note}</p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        file.status === 'Imported'
                          ? 'bg-emerald-100 text-emerald-700'
                          : file.status === 'Pending'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {file.status}
                    </span>
                  </div>
                  {file.status !== 'Imported' && (
                    <button
                      onClick={() => {
                        markCsvImportDone(selectedSchool.id, file.name);
                        addToast(`${file.name} marked as imported`, 'success');
                      }}
                      className="mt-3 px-3 py-1.5 text-xs font-medium bg-sky-50 text-sky-700 rounded-lg hover:bg-sky-100"
                    >
                      Mark as Imported
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
              <UserPlus className="w-5 h-5 text-violet-600" />
              Create School Admin User
            </h3>
            <form onSubmit={addAdminUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={adminForm.name}
                  onChange={(event) => setAdminForm((prev) => ({ ...prev, name: event.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                  placeholder="School leader or DSL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={adminForm.email}
                  onChange={(event) => setAdminForm((prev) => ({ ...prev, email: event.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                  placeholder="head@school.org.uk"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={adminForm.role}
                  onChange={(event) => setAdminForm((prev) => ({ ...prev, role: event.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                >
                  <option>School Admin</option>
                  <option>DSL</option>
                  <option>Attendance Lead</option>
                </select>
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-violet-600 text-white text-sm rounded-lg hover:bg-violet-700"
              >
                Create User
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Provisioned Users</h3>
            <div className="space-y-3">
              {selectedSchool.onboarding.adminUsers.map((user) => (
                <div key={`${user.email}-${user.role}`} className="rounded-lg border border-gray-200 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                      <p className="text-xs text-gray-400 mt-1">{user.role}</p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        user.status === 'Created'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {user.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Connected Sources</h3>
            <div className="space-y-3">
              {selectedSchool.onboarding.connectedSources.map((source) => (
                <div
                  key={source}
                  className="flex items-center gap-3 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2"
                >
                  <Cable className="w-4 h-4 text-emerald-700" />
                  <span className="text-sm font-medium text-emerald-800">{source}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Path</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p className="flex items-start gap-2">
                <FileSpreadsheet className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
                Start with historical exports to train the first model safely before moving into live scoring.
              </p>
              <p className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                Validate chronology mapping and alert routing with safeguarding leads before go-live, especially where
                outcome data is batch-fed rather than live.
              </p>
              <p className="flex items-start gap-2">
                <Clock3 className="w-4 h-4 text-violet-600 mt-0.5 shrink-0" />
                Use a hybrid rollout: let Clinx handle the technical setup while school leads confirm routing, users, and launch readiness.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Checklist</h3>
          <div className="space-y-3">
            {selectedSchool.onboarding.checklist.map((item) => (
              <div key={item.label} className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    item.complete ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {item.complete ? <CheckCircle2 className="w-4 h-4" /> : <Clock3 className="w-3.5 h-3.5" />}
                </span>
                <span className={`text-sm ${item.complete ? 'text-gray-900' : 'text-gray-600'}`}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

