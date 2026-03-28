import { useState } from 'react';
import { ClipboardCheck, Calendar, UserRound, BellRing } from 'lucide-react';
import { useToast } from '../common/Toast';
import type { Pupil } from '../../types/domain';

type ConcernWorkflowPanelProps = {
  pupil: Pupil;
};

const owners = ['Head of Year', 'DSL', 'Attendance Lead', 'Pastoral Lead', 'Form Tutor'];
const statuses = ['New concern', 'Monitoring', 'Action plan in place', 'Awaiting review'];

export default function ConcernWorkflowPanel({ pupil }: ConcernWorkflowPanelProps) {
  const { addToast } = useToast();
  const [owner, setOwner] = useState(pupil.riskLevel === 'High' ? 'DSL' : 'Head of Year');
  const [status, setStatus] = useState(pupil.riskLevel === 'High' ? 'Monitoring' : 'New concern');
  const [reviewDate, setReviewDate] = useState('2026-04-04');

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4">
        <ClipboardCheck className="w-4 h-4 text-sky-600" />
        Concern Workflow
      </h4>

      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            <UserRound className="w-3.5 h-3.5" />
            Assigned Owner
          </label>
          <select
            value={owner}
            onChange={(event) => {
              setOwner(event.target.value);
              addToast('Concern owner updated', 'success');
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
          >
            {owners.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            <BellRing className="w-3.5 h-3.5" />
            Workflow Status
          </label>
          <div className="grid grid-cols-2 gap-2">
            {statuses.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setStatus(item);
                  addToast('Workflow status updated', 'success');
                }}
                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                  status === item
                    ? 'bg-sky-50 border-sky-300 text-sky-700'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            <Calendar className="w-3.5 h-3.5" />
            Next Review Date
          </label>
          <input
            type="date"
            value={reviewDate}
            onChange={(event) => {
              setReviewDate(event.target.value);
              addToast('Review date saved', 'success');
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
          />
        </div>

        <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
          <p className="text-xs font-medium text-slate-700 mb-1">Suggested next step</p>
          <p className="text-sm text-slate-600">
            {pupil.riskLevel === 'High'
              ? 'Schedule a multi-agency or DSL review and confirm immediate safeguarding visibility.'
              : 'Review within pastoral team and agree whether additional classroom observation is needed.'}
          </p>
        </div>
      </div>
    </div>
  );
}
