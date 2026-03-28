import { Lightbulb, Info } from 'lucide-react';

const suggestions = [
  { condition: (p) => p.attendance < 85, text: 'Review attendance pattern with attendance officer' },
  { condition: (p) => p.wellbeingScore <= 4, text: 'Schedule a one-to-one check-in with the pupil' },
  { condition: (p) => p.behaviourIncidents >= 3, text: 'Discuss recent behaviour with Head of Year' },
  { condition: (p) => p.attendance < 80, text: 'Contact parent/guardian to discuss attendance concerns' },
  { condition: (p) => p.send !== 'None', text: 'Discuss with SENCO if additional support may be needed' },
  { condition: (p) => p.homeworkPct < 60, text: 'Review homework expectations and any barriers to completion' },
  { condition: () => true, text: 'Consider referral to pastoral team' },
];

export default function SuggestedActions({ pupil }) {
  const applicable = suggestions.filter(s => s.condition(pupil)).slice(0, 5);

  return (
    <div className="w-72 shrink-0">
      <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-6">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          Consider the following actions
        </h4>

        <ul className="space-y-2 mb-4">
          {applicable.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
              {s.text}
            </li>
          ))}
        </ul>

        <div className="flex items-start gap-2 pt-3 border-t border-gray-100">
          <Info className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
          <p className="text-xs text-gray-400 leading-relaxed">
            These are suggestions only. Staff should use professional judgement.
          </p>
        </div>
      </div>
    </div>
  );
}
