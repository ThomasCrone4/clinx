import { useState } from 'react';
import type { ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { getPupilById } from '../../services/dataService';
import RiskBadge from '../common/RiskBadge';
import PupilOverview from './PupilOverview';
import AttendanceTab from './AttendanceTab';
import BehaviourTab from './BehaviourTab';
import AcademicTab from './AcademicTab';
import WellbeingTab from './WellbeingTab';
import NotesTab from './NotesTab';
import SuggestedActions from './SuggestedActions';
import ConcernWorkflowPanel from './ConcernWorkflowPanel';
import SignalConfidencePanel from './SignalConfidencePanel';
import PredictedOutcomesPanel from './PredictedOutcomesPanel';

const tabs = ['Overview', 'Attendance', 'Behaviour', 'Academic', 'Wellbeing', 'Notes'] as const;
type PupilDetailTab = typeof tabs[number];

export default function PupilDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<PupilDetailTab>('Overview');
  const pupil = getPupilById(id);

  if (!pupil) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Pupil not found</p>
      </div>
    );
  }

  const tabComponents: Record<PupilDetailTab, ReactNode> = {
    Overview: <PupilOverview pupil={pupil} />,
    Attendance: <AttendanceTab pupil={pupil} />,
    Behaviour: <BehaviourTab pupil={pupil} />,
    Academic: <AcademicTab pupil={pupil} />,
    Wellbeing: <WellbeingTab pupil={pupil} />,
    Notes: <NotesTab pupil={pupil} />,
  };

  return (
    <div className="max-w-7xl space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-sky-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{pupil.id}</h1>
              <RiskBadge level={pupil.riskLevel} score={pupil.riskScore} size="lg" />
            </div>
            <p className="text-gray-600">Year {pupil.year} - Form {pupil.form}</p>
            <div className="flex items-center gap-2 mt-2">
              {pupil.send !== 'None' && (
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">{pupil.send}</span>
              )}
              {pupil.fsm && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">FSM</span>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-400">Data last synced: 28 Mar 2026, 08:00</p>
        </div>
      </div>

      {pupil.riskLevel !== 'Low' && (
        <div
          className={`rounded-xl border p-5 ${
            pupil.riskLevel === 'High' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
          }`}
        >
          <h3 className="flex items-center gap-2 text-sm font-semibold mb-3">
            <AlertTriangle className={`w-4 h-4 ${pupil.riskLevel === 'High' ? 'text-red-600' : 'text-amber-600'}`} />
            Why this pupil was flagged
          </h3>
          <ul className="space-y-2">
            {pupil.aiExplanation.map((factor, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                <span>
                  {factor.text} {factor.trend && <span className="text-gray-500">{factor.trend}</span>}
                  <span className="text-xs text-gray-400 ml-1">(Source: {factor.source})</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 pt-3 border-t border-gray-200/50">
            <p className="text-xs text-gray-500">
              Risk breakdown - Attendance: {pupil.riskBreakdown.attendance}/35, Behaviour: {pupil.riskBreakdown.behaviour}/25,
              Academic: {pupil.riskBreakdown.academic}/20, Wellbeing: {pupil.riskBreakdown.wellbeing}/15, Context:{' '}
              {pupil.riskBreakdown.context}/5 = <strong>{pupil.riskScore}/100</strong>
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <PredictedOutcomesPanel pupil={pupil} />
        <SignalConfidencePanel pupil={pupil} />
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          <div className="flex gap-1 bg-white rounded-xl border border-gray-200 p-1 mb-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab ? 'bg-sky-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {tabComponents[activeTab]}
        </div>

        {pupil.riskLevel !== 'Low' && (
          <div className="w-72 shrink-0 space-y-4">
            <SuggestedActions pupil={pupil} />
            <ConcernWorkflowPanel pupil={pupil} />
          </div>
        )}
      </div>
    </div>
  );
}
