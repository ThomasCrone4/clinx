import { ShieldCheck, Lock, Users, Database, Eye } from 'lucide-react';

const sections = [
  {
    icon: Lock,
    title: 'Role-based access',
    body: 'Named pupils are visible only to authorised staff within the school environment. Internal Clinx support views can operate from ID-based records when setup or account help is needed.',
  },
  {
    icon: Database,
    title: 'Existing-data-first approach',
    body: 'Clinx is designed to work from the data schools already hold across their current systems. It is not intended to create another daily data-entry process for teachers or leaders.',
  },
  {
    icon: Users,
    title: 'School ownership stays local',
    body: 'The school remains the operational owner of its pastoral and safeguarding processes. Clinx helps staff see patterns earlier, but it does not replace professional judgement or existing school workflows.',
  },
  {
    icon: Eye,
    title: 'Clear, explainable insight',
    body: 'Predictions should always be accompanied by visible signals and context, so staff can understand why a pupil has been surfaced and decide what action is appropriate.',
  },
];

export default function TrustPage() {
  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Trust, Privacy & Access</h1>
        <p className="text-sm text-gray-500 mt-1">
          The principles behind how Clinx handles visibility, school data, and staff decision support.
        </p>
      </div>

      <div className="rounded-xl border border-sky-200 bg-sky-50 p-5">
        <p className="text-sm text-sky-800">
          Clinx is designed to help schools notice concerns earlier while keeping operational ownership, visibility,
          and day-to-day workflow in the right hands.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {sections.map((section) => (
          <div key={section.title} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <section.icon className="w-4 h-4 text-sky-600" />
              <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{section.body}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          What this means in practice
        </h2>
        <div className="space-y-3 text-sm text-gray-600">
          <p>Teachers should see timely alerts and practical context without being asked to maintain another pastoral tool.</p>
          <p>School leaders should be able to control routing, escalation, and visibility in a way that fits existing structures.</p>
          <p>Clinx should support earlier intervention, not replace school judgement, safeguarding policy, or local knowledge.</p>
        </div>
      </div>
    </div>
  );
}
