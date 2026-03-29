import { Brain, ShieldAlert, CalendarClock, Sparkles } from 'lucide-react';
import { getSourceData } from '../../services/dataService';
import type { Pupil } from '../../types/domain';

type PredictedOutcomesPanelProps = {
  pupil: Pupil;
};

type PredictedOutcome = {
  label: string;
  likelihood: string;
  rationale: string;
};

export default function PredictedOutcomesPanel({ pupil }: PredictedOutcomesPanelProps) {
  const sourceData = getSourceData();
  const cpomsConcerns = sourceData.cpoms.concerns.filter((item) => item.pupil_id === pupil.id);

  const outcomes: PredictedOutcome[] = [];

  if (cpomsConcerns.length > 0 || pupil.wellbeingScore <= 4) {
    outcomes.push({
      label: 'Pastoral or safeguarding support may be needed',
      likelihood: pupil.riskLevel === 'High' ? 'High likelihood' : 'Moderate likelihood',
      rationale:
        cpomsConcerns.length > 0
          ? 'Past concern context already exists, so the model is treating current pattern drift as a stronger signal.'
          : 'Low wellbeing and multi-system pattern drift resemble pupils who later required pastoral or safeguarding support.',
    });
  }

  if (pupil.attendance < 85 || pupil.attendanceTrend === 'Declining') {
    outcomes.push({
      label: 'Persistent absence or attendance intervention',
      likelihood: pupil.attendance < 80 ? 'High likelihood' : 'Moderate likelihood',
      rationale:
        'Attendance decline is one of the strongest early patterns seen before later concerns in similar pupils.',
    });
  }

  if (pupil.behaviourIncidents >= 3 || pupil.homeworkPct < 60) {
    outcomes.push({
      label: 'Behaviour or disengagement support may be needed',
      likelihood: pupil.behaviourIncidents >= 5 ? 'High likelihood' : 'Moderate likelihood',
      rationale:
        'Behaviour and homework shifts from Class Charts suggest disengagement that often precedes wider pastoral concerns.',
    });
  }

  if (outcomes.length === 0) {
    outcomes.push({
      label: 'No immediate escalation predicted',
      likelihood: 'Low likelihood',
      rationale:
        'Current cross-system signals do not strongly resemble the historical patterns that led to later concern outcomes.',
    });
  }

  const interventionWindow =
    pupil.riskLevel === 'High' ? 'Action recommended this week' : pupil.riskLevel === 'Medium' ? 'Review within 10 school days' : 'Monitor through normal routines';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Brain className="w-4 h-4 text-sky-600" />
            Likely Areas to Watch
          </h4>
          <p className="text-xs text-gray-500 mt-1">
            Based on current signals across existing school systems and past recorded concerns where available.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-100 text-sky-700">
          Prevention-focused
        </span>
      </div>

      <div className="space-y-3">
        {outcomes.slice(0, 3).map((outcome) => (
          <div key={outcome.label} className="rounded-lg border border-gray-200 p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{outcome.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{outcome.rationale}</p>
                </div>
              </div>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 shrink-0">
                {outcome.likelihood}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
          <p className="flex items-center gap-2 text-xs font-medium text-slate-700">
            <CalendarClock className="w-4 h-4 text-slate-500" />
            Recommended timing
          </p>
          <p className="text-sm text-slate-800 mt-1">{interventionWindow}</p>
        </div>
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3">
          <p className="flex items-center gap-2 text-xs font-medium text-emerald-700">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Workload impact
          </p>
          <p className="text-sm text-emerald-800 mt-1">Uses existing data already held by school systems. No extra data entry needed.</p>
        </div>
      </div>
    </div>
  );
}
