import { CheckCircle } from 'lucide-react';
import { useToast } from '../common/Toast';

export default function SettingsPage() {
  const { addToast } = useToast();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">School configuration and preferences</p>
      </div>

      {/* School details */}
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
            <p className="text-gray-400 text-xs">Total Pupils</p>
            <p className="font-medium text-gray-700">500</p>
          </div>
        </div>
      </div>

      {/* Alert preferences */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Alert Preferences</h3>
        <div className="space-y-3">
          {[
            { label: 'Email notifications for high-risk alerts', defaultChecked: true },
            { label: 'Dashboard notifications for all alerts', defaultChecked: true },
            { label: 'Weekly summary email to school admin', defaultChecked: false },
            { label: 'Notify form tutor when pupil flagged', defaultChecked: true },
          ].map(pref => (
            <label key={pref.label} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={pref.defaultChecked}
                onChange={() => addToast('Preference updated', 'success')}
                className="w-4 h-4 text-sky-600 rounded border-gray-300 focus:ring-sky-500"
              />
              <span className="text-sm text-gray-700">{pref.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Data sources */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Connected Data Sources</h3>
        <div className="space-y-3">
          {[
            { name: 'Arbor MIS', status: 'Connected', desc: 'Attendance, SEND, FSM data' },
            { name: 'Class Charts', status: 'Connected', desc: 'Behaviour incidents' },
            { name: 'Google Classroom', status: 'Connected', desc: 'Homework submissions' },
          ].map(source => (
            <div key={source.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">{source.name}</p>
                <p className="text-xs text-gray-400">{source.desc}</p>
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                <CheckCircle className="w-4 h-4" /> {source.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
