import {
  Activity,
  AlertTriangle,
  BarChart3,
  Brain,
  Building2,
  CheckCircle2,
  FlaskConical,
  Gauge,
  ListChecks,
  ShieldCheck,
  Users,
  Wrench,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getPupilStats } from '../../services/dataService';
import { useAppData } from '../../context/AppDataContext';
import { useAdminData } from '../../context/AdminDataContext';

export default function SiteAdminDashboard() {
  const navigate = useNavigate();
  const stats = getPupilStats();
  const { unreadAlerts } = useAppData();
  const { schools } = useAdminData();

  const liveSchools = schools.filter((school) => school.status === 'Active').length;
  const onboardingSchools = schools.filter((school) => school.status !== 'Active').length;
  const modelReadySchools = schools.filter((school) => school.onboarding.status === 'Ready').length;
  const totalPupils = schools.reduce((sum, school) => sum + school.pupils, 0);
  const provisionedAdminUsers = schools.reduce((sum, school) => sum + school.onboarding.adminUsers.length, 0);
  const schoolsWithLiveConnectors = schools.filter(
    (school) =>
      Boolean(school.onboarding.connectors.arborToken.trim()) ||
      Boolean(school.onboarding.connectors.classChartsToken.trim()),
  ).length;

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Administration</h1>
          <p className="text-sm text-gray-500 mt-1">
            Internal Clinx platform analytics, model health, testing oversight, and operational controls.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/admin/schools')}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm rounded-lg font-medium hover:bg-gray-50"
          >
            Manage Schools
          </button>
          <button
            onClick={() => navigate('/admin/onboarding')}
            className="px-4 py-2 bg-sky-600 text-white text-sm rounded-lg font-medium hover:bg-sky-700"
          >
            Open Onboarding Hub
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Live Schools', value: liveSchools, icon: Building2, color: 'text-emerald-600' },
          { label: 'Pupils In System', value: totalPupils, icon: Users, color: 'text-sky-600' },
          { label: 'Unread Alerts', value: unreadAlerts.length, icon: AlertTriangle, color: 'text-amber-600' },
          { label: 'Model-Ready Schools', value: modelReadySchools, icon: BarChart3, color: 'text-violet-600' },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">{item.label}</span>
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-4 h-4 text-violet-600" />
            <h2 className="text-sm font-semibold text-gray-700">Model Status</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-violet-50 border border-violet-200 px-3 py-2">
              <span className="text-sm text-gray-700">Production wellbeing model</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                Healthy
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 border border-slate-200 px-3 py-2">
              <span className="text-sm text-gray-700">Schools ready for model launch</span>
              <span className="text-sm font-semibold text-gray-900">{modelReadySchools}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 border border-slate-200 px-3 py-2">
              <span className="text-sm text-gray-700">Retraining queue</span>
              <span className="text-sm font-semibold text-gray-900">{onboardingSchools}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <FlaskConical className="w-4 h-4 text-sky-600" />
            <h2 className="text-sm font-semibold text-gray-700">Testing And Validation</h2>
          </div>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="rounded-lg border border-gray-200 px-3 py-3">
              <p className="font-medium text-gray-900">Backtest cohort check</p>
              <p className="mt-1">Latest validation run completed against historical CSV-labelled cohorts.</p>
            </div>
            <div className="rounded-lg border border-gray-200 px-3 py-3">
              <p className="font-medium text-gray-900">False positive watch</p>
              <p className="mt-1">No elevated review flags in the latest internal governance review.</p>
            </div>
            <div className="rounded-lg border border-gray-200 px-3 py-3">
              <p className="font-medium text-gray-900">Release checks</p>
              <p className="mt-1">UI, routing, and onboarding flows are aligned to the current CSV-first product model.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Wrench className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-semibold text-gray-700">Internal Operations</h2>
          </div>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center justify-between rounded-lg bg-slate-50 border border-slate-200 px-3 py-2">
              <span>Support-managed schools</span>
              <span className="font-semibold text-gray-900">{schools.length}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 border border-slate-200 px-3 py-2">
              <span>Onboarding workstreams</span>
              <span className="font-semibold text-gray-900">{onboardingSchools}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 border border-slate-200 px-3 py-2">
              <span>Provisioned admin users</span>
              <span className="font-semibold text-gray-900">{provisionedAdminUsers}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
            <Gauge className="w-5 h-5 text-sky-600" />
            Platform Health
          </h2>
          <div className="space-y-3">
            {[
              { label: 'Schools with live connectors', value: `${schoolsWithLiveConnectors}`, tone: 'bg-sky-100 text-sky-700' },
              { label: 'Historical training posture', value: 'CSV-first', tone: 'bg-violet-100 text-violet-700' },
              { label: 'Chronology label mapping', value: 'Monitoring', tone: 'bg-amber-100 text-amber-700' },
              { label: 'Alert routing engine', value: 'Healthy', tone: 'bg-emerald-100 text-emerald-700' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
                <span className="text-sm text-gray-700">{item.label}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.tone}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
            <ListChecks className="w-5 h-5 text-violet-600" />
            Internal Admin Focus
          </h2>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="rounded-lg border border-gray-200 px-4 py-3">
              <p className="font-medium text-gray-900">Model governance review</p>
              <p className="mt-1">Check explainability outputs and outcome drift before widening rollout cohorts.</p>
            </div>
            <div className="rounded-lg border border-gray-200 px-4 py-3">
              <p className="font-medium text-gray-900">Onboarding prioritisation</p>
              <p className="mt-1">Riverside and Hillview still need data-readiness follow-up before training can close.</p>
            </div>
            <div className="rounded-lg border border-gray-200 px-4 py-3">
              <p className="font-medium text-gray-900">Internal support tooling</p>
              <p className="mt-1">Use school support views for account-level actions while keeping school data ownership local.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Activity className="w-4 h-4 text-sky-600" />
            Live Signals
          </h3>
          <p className="text-sm text-gray-600">
            Current platform state suggests stable signal ingestion across Arbor and Class Charts pathways used for live scoring.
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Safeguarding Posture
          </h3>
          <p className="text-sm text-gray-600">
            CPOMS remains positioned as historical or batch outcome data, keeping the product story realistic for near-term rollout.
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <CheckCircle2 className="w-4 h-4 text-violet-600" />
            Internal Release State
          </h3>
          <p className="text-sm text-gray-600">
            Core teacher, school-admin, and Clinx-admin journeys are now aligned around low-workload, existing-data-first workflows.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Model And Rollout Snapshot</h3>
            <p className="text-sm text-gray-500 mt-1">
              High-level internal view of school readiness, live coverage, and current model posture.
            </p>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">School</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Model Path</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Stage</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Managed Pupils</th>
            </tr>
          </thead>
          <tbody>
            {schools.map((school) => (
              <tr key={school.id} className="hover:bg-sky-50/30 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{school.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{school.onboarding.integrationMode}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{school.onboarding.stage}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      school.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-700'
                        : school.status === 'Training'
                          ? 'bg-violet-100 text-violet-700'
                          : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {school.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{school.pupils}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-sky-200 bg-sky-50 p-5">
        <p className="text-sm font-medium text-sky-900">
          Platform totals: {schools.length} schools, {totalPupils} pupils, {stats.high} high-risk pupils in the live school environment, and {unreadAlerts.length} unread alerts currently surfaced across the platform.
        </p>
      </div>
    </div>
  );
}
