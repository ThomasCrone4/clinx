import { useState } from 'react';
import { Database, CheckCircle2, ShieldCheck, RefreshCw, FileSpreadsheet, Cable, Eye } from 'lucide-react';
import { getArborSnapshot, getClassChartsSnapshot, getCpomsSnapshot } from '../../services/dataService';
import { useToast } from '../common/Toast';

const sourceTabs = ['Arbor MIS', 'Class Charts', 'CPOMS'] as const;
type SourceTab = typeof sourceTabs[number];

export default function DataSourcesPage() {
  const arbor = getArborSnapshot();
  const classCharts = getClassChartsSnapshot();
  const cpoms = getCpomsSnapshot();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<SourceTab>('Arbor MIS');

  const sourceCards = [
    {
      name: 'Arbor MIS',
      mode: 'CSV export or MIS API',
      status: 'Healthy',
      sync: arbor.students[0]?.last_synced_at || '2026-03-28T08:00:00Z',
      detail: `${arbor.students.length} student records and ${arbor.attendance_marks.length} attendance marks available`,
    },
    {
      name: 'Class Charts',
      mode: 'API feed or scheduled export',
      status: 'Healthy',
      sync: classCharts.behaviour_events[0]?.logged_at || '2026-03-28T08:15:00Z',
      detail: `${classCharts.behaviour_events.length} behaviour rows and ${classCharts.homework_feed.length} homework rows available`,
    },
    {
      name: 'CPOMS',
      mode: 'Historical chronology export or scheduled batch import',
      status: 'Monitoring',
      sync: cpoms.concerns[0]?.created_at || '2026-03-28T08:20:00Z',
      detail: `${cpoms.concerns.length} historical concern records available for outcome training and chronology review`,
    },
  ];

  const previewRows =
    activeTab === 'Arbor MIS'
      ? arbor.students.slice(0, 4).map((row) => ({
          id: row.student_id,
          one: row.legal_first_name,
          two: row.legal_last_name,
          three: row.registration_form,
          four: row.sen_status,
        }))
      : activeTab === 'Class Charts'
        ? classCharts.behaviour_events.slice(0, 4).map((row) => ({
            id: row.behaviour_id,
            one: row.pupil_name,
            two: row.activity_type,
            three: row.teacher_name,
            four: row.logged_at.slice(0, 10),
          }))
        : cpoms.concerns.slice(0, 4).map((row) => ({
            id: row.concern_id,
            one: row.pupil_name,
            two: row.category,
            three: row.priority,
            four: row.status,
          }));

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Sources / Import Centre</h1>
          <p className="text-sm text-gray-500 mt-1">
            Show how Clinx can learn from systems schools already use, without requiring extra data collection or a scary upload-first workflow.
          </p>
        </div>
        <button
          onClick={() => addToast('Sample connector health refreshed', 'success')}
          className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white text-sm rounded-lg font-medium hover:bg-sky-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Health
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {sourceCards.map((source) => (
          <div key={source.name} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-sky-600" />
                <span className="text-sm font-semibold text-gray-800">{source.name}</span>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                source.status === 'Healthy' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {source.status}
              </span>
            </div>
            <p className="text-sm text-gray-600">{source.mode}</p>
            <p className="text-sm text-gray-600 mt-1">{source.detail}</p>
            <p className="text-xs text-gray-400 mt-3">Latest sample sync: {source.sync.replace('T', ' ').replace('Z', ' UTC')}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1.4fr_1fr] gap-6">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Sample Payload Preview</h2>
              <p className="text-sm text-gray-500 mt-1">Representative upstream records for demos, mapping conversations, and technical discovery</p>
            </div>
            <div className="flex bg-slate-100 rounded-lg p-1">
              {sourceTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeTab === tab ? 'bg-white text-sky-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Record ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Field 1</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Field 2</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Field 3</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Field 4</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {previewRows.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3 text-xs text-gray-500">{row.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.one}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.two}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.three}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.four}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
              <Cable className="w-5 h-5 text-emerald-600" />
              Mapping Confidence
            </h2>
            <div className="space-y-3">
              {[
                { label: 'Pupil identity matching', value: '98%', note: 'UPN, pupil ID, and form registration available' },
                { label: 'Attendance coverage', value: '96%', note: 'AM/PM session marks available from Arbor sample feed' },
                { label: 'Behaviour coverage', value: '91%', note: 'Class Charts behaviour rows linked to class and teacher' },
                { label: 'Safeguarding chronology', value: '84%', note: 'Historical CPOMS exports mapped for outcome training and review' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">{item.label}</span>
                    <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                  </div>
                  <p className="text-xs text-gray-500">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Why this matters for the model</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p>Clinx uses Arbor and Class Charts as current model inputs, then learns from later outcome data such as historical CPOMS exports to identify pupils whose current patterns look similar.</p>
              <p>That means schools do not need to create new forms, surveys, or manual tracking processes just to benefit from predictive insight.</p>
              <p>The goal is earlier support with less staff effort, using data that already exists across MIS, behaviour, homework, and chronology systems.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
              <Eye className="w-5 h-5 text-sky-600" />
              What Schools See in a Demo
            </h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                No real upload required: this page demonstrates readiness without asking for live safeguarding files.
              </p>
              <p className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                Source-to-platform mapping is visible, which helps schools trust that prediction can happen from data they already hold.
              </p>
              <p className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                Safeguarding data is represented carefully, with chronology-style records used mainly as historical outcome labels unless a school has an agreed export route.
              </p>
            </div>
          </div>

          <div className="bg-sky-50 rounded-xl border border-sky-200 p-5">
            <p className="text-sm text-sky-700">
              In a real deployment, many schools would start with historical CSV exports for model training, then layer in live Arbor or Class Charts connections for current scoring.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
