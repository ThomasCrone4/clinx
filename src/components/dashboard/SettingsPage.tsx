import { useState } from 'react';
import { BellRing, CheckCircle, ShieldAlert, Database, Mail, CalendarClock } from 'lucide-react';
import { useToast } from '../common/Toast';
import { getSourceData } from '../../services/dataService';

const escalationRules = [
  {
    name: 'Critical attendance decline',
    trigger: 'Attendance drops below 85% and declines across 3 weeks',
    route: 'Attendance Lead + Head of Year',
    priority: 'High',
  },
  {
    name: 'Safeguarding concern bundle',
    trigger: 'Low wellbeing plus behaviour spike or CPOMS concern',
    route: 'DSL immediately',
    priority: 'High',
  },
  {
    name: 'Emerging pastoral concern',
    trigger: 'Three medium signals within a fortnight',
    route: 'Pastoral review queue',
    priority: 'Medium',
  },
];

export default function SettingsPage() {
  const { addToast } = useToast();
  const sourceData = getSourceData();
  const [digestMode, setDigestMode] = useState('Daily digest');
  const [notifyByEmail, setNotifyByEmail] = useState(true);
  const [notifyInApp, setNotifyInApp] = useState(true);
  const [notifyUrgentOnly, setNotifyUrgentOnly] = useState(false);
  const [notifyFormTutors, setNotifyFormTutors] = useState(true);

  const integrationCards = [
    {
      name: 'Arbor MIS',
      status: 'Healthy',
      detail: `${sourceData.arbor.students.length} students, ${sourceData.arbor.attendance_marks.length} attendance marks`,
      sync: sourceData.arbor.students[0]?.last_synced_at || '2026-03-28T08:00:00Z',
    },
    {
      name: 'Class Charts',
      status: 'Healthy',
      detail: `${sourceData.classCharts.behaviour_events.length} behaviour events, ${sourceData.classCharts.homework_feed.length} homework records`,
      sync: sourceData.classCharts.behaviour_events[0]?.logged_at || '2026-03-28T08:15:00Z',
    },
    {
      name: 'CPOMS',
      status: 'Monitoring',
      detail: `${sourceData.cpoms.concerns.length} concerns available for chronology matching`,
      sync: sourceData.cpoms.concerns[0]?.created_at || '2026-03-28T08:20:00Z',
    },
  ];

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">School configuration, notification preferences, and integration confidence</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">School Details</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400 text-xs">School Name</p>
            <p className="font-medium text-gray-700">Dedworth Middle School</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Address</p>
            <p className="font-medium text-gray-700">Smiths Lane, Windsor, SL4 5PE</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Type</p>
            <p className="font-medium text-gray-700">Middle School (Years 5-8)</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Pastoral Model</p>
            <p className="font-medium text-gray-700">Head of Year + DSL triage</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4">
            <BellRing className="w-4 h-4 text-sky-600" />
            Worry Notifications
          </h3>
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                <CalendarClock className="w-3.5 h-3.5" />
                Digest Preference
              </label>
              <select
                value={digestMode}
                onChange={(event) => {
                  setDigestMode(event.target.value);
                  addToast('Digest preference updated', 'success');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
              >
                <option>Immediate alerts</option>
                <option>Daily digest</option>
                <option>Weekly digest</option>
                <option>Urgent only</option>
              </select>
            </div>

            {[
              {
                label: 'Email notifications to school admin',
                checked: notifyByEmail,
                setter: setNotifyByEmail,
                icon: Mail,
              },
              {
                label: 'In-app notifications for all new concerns',
                checked: notifyInApp,
                setter: setNotifyInApp,
                icon: BellRing,
              },
              {
                label: 'Only interrupt staff for urgent/high-risk concerns',
                checked: notifyUrgentOnly,
                setter: setNotifyUrgentOnly,
                icon: ShieldAlert,
              },
              {
                label: 'Notify form tutor when a pupil enters monitoring',
                checked: notifyFormTutors,
                setter: setNotifyFormTutors,
                icon: CheckCircle,
              },
            ].map((item) => (
              <label key={item.label} className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={(event) => {
                    item.setter(event.target.checked);
                    addToast('Notification setting saved', 'success');
                  }}
                  className="mt-0.5 w-4 h-4 text-sky-600 rounded border-gray-300 focus:ring-sky-500"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            Escalation Rules
          </h3>
          <div className="space-y-3">
            {escalationRules.map((rule) => (
              <div key={rule.name} className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className="text-sm font-medium text-gray-800">{rule.name}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    rule.priority === 'High' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {rule.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{rule.trigger}</p>
                <p className="text-xs text-gray-500 mt-2">Routes to: {rule.route}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4">
          <Database className="w-4 h-4 text-emerald-600" />
          Integration Confidence
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {integrationCards.map((source) => (
            <div key={source.name} className="rounded-xl border border-gray-200 p-4 bg-slate-50/50">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-800">{source.name}</p>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  source.status === 'Healthy' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {source.status}
                </span>
              </div>
              <p className="text-sm text-gray-600">{source.detail}</p>
              <p className="text-xs text-gray-500 mt-3">Latest sync: {source.sync.replace('T', ' ').replace('Z', ' UTC')}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-lg bg-sky-50 border border-sky-200 p-4">
          <p className="text-sm text-sky-700">
            Clinx is currently simulating live CSV/API feeds from Arbor, Class Charts, and CPOMS so schools can see how
            source data quality, sync timing, and safeguarding chronology affect confidence in flagged concerns.
          </p>
        </div>
      </div>
    </div>
  );
}
