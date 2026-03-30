import { Database, CheckCircle2, ShieldCheck, Lock, Workflow, Eye, Users } from 'lucide-react';

const sourceCards = [
  {
    name: 'Arbor MIS',
    status: 'In use',
    summary: 'Attendance, timetable, form, SEND, FSM, and pupil profile context',
    purpose: 'Helps Clinx understand current school context and spot early attendance or engagement drift.',
  },
  {
    name: 'Class Charts',
    status: 'In use',
    summary: 'Behaviour, homework, class context, and classroom pattern changes',
    purpose: 'Adds day-to-day classroom signals that help surface pupils who may need support sooner.',
  },
  {
    name: 'Pastoral history',
    status: 'Where available',
    summary: 'Past concern or chronology context from existing school safeguarding records',
    purpose: 'Supports pattern learning and review without asking staff to maintain another pastoral system.',
  },
];

const signalGroups = [
  {
    title: 'Attendance and punctuality',
    description: 'Session attendance, trends, and absence patterns that often appear before wider concerns.',
  },
  {
    title: 'Behaviour and homework',
    description: 'Day-to-day classroom signals that can show disengagement or a shift in routine early.',
  },
  {
    title: 'Pupil context',
    description: 'Form, year group, SEND, and other school context that helps Clinx interpret signals fairly.',
  },
  {
    title: 'Pastoral history',
    description: 'Past recorded concern context, where available, to help the model learn which patterns mattered.',
  },
];

const noExtraWorkItems = [
  'No separate forms for teachers to fill in',
  'No duplicate copying between systems',
  'No additional daily monitoring process to maintain',
  'No need for staff to learn a second pastoral workflow just to get earlier insight',
];

const accessItems = [
  'Named pupils are visible only to authorised staff within your school.',
  'Clinx internal admins work from ID-based views when supporting setup or account issues.',
  'Alerts are shown by role, so the right staff see the right concerns.',
  'The school stays the operational owner of its pastoral and safeguarding decisions.',
];

const trustItems = [
  {
    icon: Users,
    title: 'School ownership stays local',
    body: 'Clinx helps staff see patterns earlier, but it does not replace professional judgement or existing school processes.',
  },
  {
    icon: Eye,
    title: 'Insight should be explainable',
    body: 'Predictions are shown alongside visible signals and context so staff can understand why a pupil has been surfaced.',
  },
];

const rolloutSteps = [
  'Clinx works with your team to understand your current systems and pastoral model.',
  'Existing data sources are aligned so Clinx can begin spotting patterns across them.',
  'School staff then see earlier insight in one place, without changing normal data collection.',
];

export default function DataSourcesPage() {
  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Your Data</h1>
        <p className="text-sm text-gray-500 mt-1">
          How Clinx uses existing school data, who can see what, and the principles behind access and visibility in the platform.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {sourceCards.map((source) => (
          <div key={source.name} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-sky-600" />
                <span className="text-sm font-semibold text-gray-800">{source.name}</span>
              </div>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  source.status === 'In use' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {source.status}
              </span>
            </div>
            <p className="text-sm text-gray-700">{source.summary}</p>
            <p className="text-xs text-gray-500 mt-3">{source.purpose}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1.15fr_0.85fr] gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900">What Clinx uses from existing systems</h2>
            <p className="text-sm text-gray-500 mt-1">
              The goal is to recognise early patterns across the systems schools already rely on every day.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-5">
              {signalGroups.map((group) => (
                <div key={group.title} className="rounded-xl border border-gray-200 bg-slate-50/60 p-4">
                  <p className="text-sm font-semibold text-gray-900">{group.title}</p>
                  <p className="text-sm text-gray-600 mt-2">{group.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Lock className="w-5 h-5 text-sky-600" />
              Access, Privacy and Visibility
            </h2>
            <div className="space-y-3 mt-4">
              {accessItems.map((item) => (
                <p key={item} className="flex items-start gap-2 text-sm text-gray-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900">What staff do not need to do</h2>
            <div className="space-y-3 mt-4">
              {noExtraWorkItems.map((item) => (
                <p key={item} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </p>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900">Trust and judgement in practice</h2>
            <div className="space-y-4 mt-4">
              {trustItems.map((item) => (
                <div key={item.title} className="rounded-xl border border-gray-200 bg-slate-50/60 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <item.icon className="w-4 h-4 text-sky-600" />
                    <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                  </div>
                  <p className="text-sm text-gray-600">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Workflow className="w-5 h-5 text-sky-600" />
              How rollout usually works
            </h2>
            <div className="space-y-3 mt-4">
              {rolloutSteps.map((step, index) => (
                <div key={step} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold flex items-center justify-center shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-600">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
