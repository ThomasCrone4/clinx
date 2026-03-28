import { ShieldCheck, Database, Activity, FileWarning } from 'lucide-react';
import { getSourceData } from '../../services/dataService';
import type { Pupil } from '../../types/domain';

type SignalConfidencePanelProps = {
  pupil: Pupil;
};

export default function SignalConfidencePanel({ pupil }: SignalConfidencePanelProps) {
  const sourceData = getSourceData();
  const arborMarks = sourceData.arbor.attendance_marks.filter((item) => item.student_id === pupil.id);
  const classChartsEvents = sourceData.classCharts.behaviour_events.filter((item) => item.pupil_id === pupil.id);
  const cpomsConcerns = sourceData.cpoms.concerns.filter((item) => item.pupil_id === pupil.id);

  const confidence =
    pupil.riskLevel === 'High' ? 92 : pupil.riskLevel === 'Medium' ? 78 : 64;

  const sources = [
    {
      label: 'Arbor MIS',
      icon: Database,
      metric: `${arborMarks.length} attendance marks`,
      detail: `${pupil.attendance}% attendance, SEND ${pupil.send}`,
      status: 'Healthy',
    },
    {
      label: 'Class Charts',
      icon: Activity,
      metric: `${classChartsEvents.length} behaviour/homework records`,
      detail: `${pupil.behaviourIncidents} behaviour incidents, homework ${pupil.homeworkPct}%`,
      status: classChartsEvents.length > 0 ? 'Healthy' : 'Monitoring',
    },
    {
      label: 'CPOMS',
      icon: FileWarning,
      metric: `${cpomsConcerns.length} linked concerns`,
      detail: cpomsConcerns[0]?.category || 'No open concern logged',
      status: cpomsConcerns.length > 0 ? 'Connected' : 'No linked case',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Explainability & Confidence
        </h4>
        <span className="text-sm font-semibold text-emerald-700">{confidence}% confidence</span>
      </div>

      <div className="space-y-3">
        {sources.map((source) => (
          <div key={source.label} className="rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between gap-3 mb-1">
              <div className="flex items-center gap-2">
                <source.icon className="w-4 h-4 text-sky-600" />
                <span className="text-sm font-medium text-gray-800">{source.label}</span>
              </div>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {source.status}
              </span>
            </div>
            <p className="text-sm text-gray-700">{source.metric}</p>
            <p className="text-xs text-gray-500 mt-1">{source.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-3">
        <p className="text-xs font-medium text-amber-800 mb-1">How this score should be used</p>
        <p className="text-sm text-amber-700">
          Clinx is surfacing a likely future concern based on patterns that previously led to negative outcomes. Staff
          should combine this with professional judgement, existing pastoral knowledge, and any recent safeguarding chronology.
        </p>
      </div>
    </div>
  );
}
