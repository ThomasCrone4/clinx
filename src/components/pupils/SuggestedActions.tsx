import { Lightbulb, Info } from 'lucide-react';
import type { Pupil } from '../../types/domain';

type Suggestion = {
  condition: (pupil: Pupil) => boolean;
  text: string;
};

const suggestions: Suggestion[] = [
  { condition: (pupil) => pupil.attendance < 85, text: 'Review attendance pattern with attendance officer' },
  { condition: (pupil) => pupil.wellbeingScore <= 4, text: 'Schedule a one-to-one check-in with the pupil' },
  { condition: (pupil) => pupil.behaviourIncidents >= 3, text: 'Discuss recent behaviour with Head of Year' },
  { condition: (pupil) => pupil.attendance < 80, text: 'Escalate to attendance lead if there is no improvement within 5 school days' },
  { condition: (pupil) => pupil.send !== 'None', text: 'Discuss with SENCO whether support adjustments are still appropriate' },
  { condition: (pupil) => pupil.homeworkPct < 60, text: 'Review homework expectations and any barriers to completion' },
  { condition: () => true, text: 'Consider pastoral review meeting and set a follow-up date' },
];

type SuggestedActionsProps = {
  pupil: Pupil;
};

export default function SuggestedActions({ pupil }: SuggestedActionsProps) {
  const applicable = suggestions.filter((suggestion) => suggestion.condition(pupil)).slice(0, 5);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
        <Lightbulb className="w-4 h-4 text-amber-500" />
        Suggested Actions
      </h4>

      <ul className="space-y-2 mb-4">
        {applicable.map((suggestion, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
            {suggestion.text}
          </li>
        ))}
      </ul>

      <div className="flex items-start gap-2 pt-3 border-t border-gray-100">
        <Info className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
        <p className="text-xs text-gray-400 leading-relaxed">
          These are low-burden next steps based on data schools already collect. Staff should use professional judgement
          and local safeguarding procedures.
        </p>
      </div>
    </div>
  );
}
