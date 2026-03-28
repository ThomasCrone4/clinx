import { useState } from 'react';
import { Building2, Brain, Cable, CheckCircle2, Clock3, FileSpreadsheet, ShieldCheck } from 'lucide-react';

type OnboardingSchool = {
  id: string;
  name: string;
  owner: string;
  stage: 'Discovery' | 'Integration Setup' | 'Historical Training' | 'Go-Live Readiness';
  status: 'On Track' | 'Needs Input' | 'Ready';
  integrationMode: string;
  trainingMode: string;
  nextMilestone: string;
  connectedSources: string[];
  checklist: Array<{
    label: string;
    complete: boolean;
  }>;
};

const onboardingSchools: OnboardingSchool[] = [
  {
    id: 'hillview',
    name: 'Hillview Academy',
    owner: 'S. Patel',
    stage: 'Integration Setup',
    status: 'On Track',
    integrationMode: 'Direct API Integration',
    trainingMode: 'Historical CSV Training',
    nextMilestone: 'Confirm Arbor and CPOMS credentials',
    connectedSources: ['Arbor', 'Class Charts', 'CPOMS'],
    checklist: [
      { label: 'Commercial agreement confirmed', complete: true },
      { label: 'Named school onboarding lead assigned', complete: true },
      { label: 'API credentials requested', complete: true },
      { label: 'Historical CSV export scheduled', complete: false },
      { label: 'Model validation workshop booked', complete: false },
      { label: 'Go-live date agreed', complete: false },
    ],
  },
  {
    id: 'riverside',
    name: 'Riverside Academy',
    owner: 'A. Turner',
    stage: 'Historical Training',
    status: 'Needs Input',
    integrationMode: 'Hybrid Setup',
    trainingMode: 'API Backfill Training',
    nextMilestone: 'Receive two years of outcome history for training',
    connectedSources: ['Arbor', 'CPOMS'],
    checklist: [
      { label: 'School setup created', complete: true },
      { label: 'Connector scope agreed', complete: true },
      { label: 'Backfill window confirmed', complete: false },
      { label: 'Training dataset mapped', complete: false },
      { label: 'Safeguarding review completed', complete: false },
      { label: 'Pilot staff selected', complete: false },
    ],
  },
  {
    id: 'oakfield',
    name: 'Oakfield College',
    owner: 'L. Morris',
    stage: 'Go-Live Readiness',
    status: 'Ready',
    integrationMode: 'Scheduled CSV Import',
    trainingMode: 'Historical CSV Training',
    nextMilestone: 'Approve pilot launch for Year 7 and Year 8',
    connectedSources: ['CSV Attendance', 'CSV Behaviour', 'CPOMS'],
    checklist: [
      { label: 'Historical model training complete', complete: true },
      { label: 'School validation session complete', complete: true },
      { label: 'Notification routing configured', complete: true },
      { label: 'Pilot cohort chosen', complete: true },
      { label: 'Staff onboarding materials shared', complete: true },
      { label: 'Go-live sign-off pending', complete: false },
    ],
  },
];

export default function OnboardingHub() {
  const [selectedId, setSelectedId] = useState(onboardingSchools[0].id);
  const selectedSchool = onboardingSchools.find((school) => school.id === selectedId) || onboardingSchools[0];
  const completeCount = selectedSchool.checklist.filter((item) => item.complete).length;

  return (
    <div className="max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Onboarding Hub</h1>
        <p className="text-sm text-gray-500 mt-1">Track school rollout from discovery through integration, training, and go-live readiness.</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Schools In Flight', value: onboardingSchools.length, icon: Building2, tone: 'text-sky-700', bg: 'bg-sky-50 border-sky-200' },
          { label: 'Integration Workstreams', value: '5', icon: Cable, tone: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
          { label: 'Training Pipelines', value: '3', icon: Brain, tone: 'text-violet-700', bg: 'bg-violet-50 border-violet-200' },
          { label: 'Ready To Launch', value: onboardingSchools.filter((school) => school.status === 'Ready').length, icon: CheckCircle2, tone: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
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

      <div className="grid grid-cols-[1fr_1.5fr] gap-6 items-start">
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Onboarding Pipeline</h2>
            <div className="space-y-3">
              {onboardingSchools.map((school) => (
                <button
                  key={school.id}
                  onClick={() => setSelectedId(school.id)}
                  className={`w-full text-left rounded-xl border p-4 transition-colors ${
                    selectedSchool.id === school.id ? 'border-sky-300 bg-sky-50' : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{school.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Owner: {school.owner}</p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        school.status === 'Ready'
                          ? 'bg-emerald-100 text-emerald-700'
                          : school.status === 'Needs Input'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-sky-100 text-sky-700'
                      }`}
                    >
                      {school.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">{school.stage}</p>
                  <p className="text-xs text-gray-500 mt-1">{school.nextMilestone}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{selectedSchool.name}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedSchool.stage} · Owned by {selectedSchool.owner}
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                {completeCount}/{selectedSchool.checklist.length} complete
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-5">
              <div className="rounded-xl border border-gray-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Integration</p>
                <p className="text-sm font-semibold text-gray-900 mt-2">{selectedSchool.integrationMode}</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Training</p>
                <p className="text-sm font-semibold text-gray-900 mt-2">{selectedSchool.trainingMode}</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Next Milestone</p>
                <p className="text-sm font-semibold text-gray-900 mt-2">{selectedSchool.nextMilestone}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Connected Sources</h3>
              <div className="space-y-3">
                {selectedSchool.connectedSources.map((source) => (
                  <div key={source} className="flex items-center gap-3 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2">
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
                  Use historical exports to train the first model safely before asking the school to rely on live predictions.
                </p>
                <p className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  Validate chronology mapping and alert routing with safeguarding leads before go-live.
                </p>
                <p className="flex items-start gap-2">
                  <Clock3 className="w-4 h-4 text-violet-600 mt-0.5 shrink-0" />
                  Launch with a small cohort first, then widen once staff confidence and outcome tracking look healthy.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Checklist</h3>
            <div className="space-y-3">
              {selectedSchool.checklist.map((item) => (
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
    </div>
  );
}
