import { useState } from 'react';
import { BellRing, CheckCircle, ShieldAlert, Mail, CalendarClock, Users, SlidersHorizontal } from 'lucide-react';
import { useToast } from '../common/Toast';

export default function SettingsPage() {
  const { addToast } = useToast();
  const [digestMode, setDigestMode] = useState('Daily digest');
  const [notifyByEmail, setNotifyByEmail] = useState(true);
  const [notifyInApp, setNotifyInApp] = useState(true);
  const [notifyUrgentOnly, setNotifyUrgentOnly] = useState(false);
  const [notifyFormTutors, setNotifyFormTutors] = useState(true);

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">School configuration and school-wide alert defaults</p>
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

      <div className="grid grid-cols-[1.15fr_0.85fr] gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <BellRing className="w-4 h-4 text-sky-600" />
            School-wide Alert Defaults
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            These settings control leadership visibility and the default alert behaviour for the school.
          </p>

          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                <CalendarClock className="w-3.5 h-3.5" />
                Leadership Digest Preference
              </label>
              <select
                value={digestMode}
                onChange={(event) => {
                  setDigestMode(event.target.value);
                  addToast('School-wide digest preference updated', 'success');
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
                label: 'Email new concerns to school admins',
                checked: notifyByEmail,
                setter: setNotifyByEmail,
                icon: Mail,
              },
              {
                label: 'Show new concerns in the school admin workspace',
                checked: notifyInApp,
                setter: setNotifyInApp,
                icon: BellRing,
              },
              {
                label: 'Only surface urgent or high-risk concerns to leadership',
                checked: notifyUrgentOnly,
                setter: setNotifyUrgentOnly,
                icon: ShieldAlert,
              },
              {
                label: 'Include form tutor visibility where relevant',
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
                    addToast('School-wide alert setting saved', 'success');
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

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <SlidersHorizontal className="w-4 h-4 text-violet-600" />
              How This Differs From Teacher Preferences
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p className="flex items-start gap-2">
                <Users className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
                <span>This page sets school-wide defaults and leadership visibility.</span>
              </p>
              <p className="flex items-start gap-2">
                <Users className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
                <span>Teachers only control how they personally receive their own alerts.</span>
              </p>
              <p className="flex items-start gap-2">
                <Users className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
                <span>A teacher changing their preferences does not alter school-wide visibility or leadership defaults.</span>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
