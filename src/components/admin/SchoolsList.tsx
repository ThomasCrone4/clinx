import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, CheckCircle2, Database, Brain, Cable } from 'lucide-react';
import { getPupilStats } from '../../services/dataService';
import { useAppData } from '../../context/AppDataContext';
import { useToast } from '../common/Toast';

type SchoolStatus = 'Active' | 'Onboarding' | 'Training';
type IntegrationMode = 'Direct API Integration' | 'Scheduled CSV Import' | 'Hybrid Setup';
type TrainingMode = 'Historical CSV Training' | 'API Backfill Training' | 'Go Live Without Training';

type SchoolRow = {
  id: string;
  name: string;
  location: string;
  pupils: number;
  highRisk: number;
  alerts: number;
  status: SchoolStatus;
  onboardingStage: string;
  integration: string;
};

type OnboardingForm = {
  schoolName: string;
  location: string;
  pupilEstimate: string;
  adminName: string;
  adminEmail: string;
  integrationMode: IntegrationMode;
  trainingMode: TrainingMode;
  connectArbor: boolean;
  connectClassCharts: boolean;
  connectCpoms: boolean;
};

const emptyForm: OnboardingForm = {
  schoolName: '',
  location: '',
  pupilEstimate: '600',
  adminName: '',
  adminEmail: '',
  integrationMode: 'Hybrid Setup',
  trainingMode: 'Historical CSV Training',
  connectArbor: true,
  connectClassCharts: true,
  connectCpoms: true,
};

export default function SchoolsList() {
  const navigate = useNavigate();
  const stats = getPupilStats();
  const { unreadAlerts } = useAppData();
  const alerts = unreadAlerts;
  const { addToast } = useToast();

  const initialSchools = useMemo<SchoolRow[]>(
    () => [
      {
        id: 'school-dedworth',
        name: 'Dedworth Middle School',
        location: 'Windsor, UK',
        pupils: stats.total,
        highRisk: stats.high,
        alerts: alerts.length,
        status: 'Active',
        onboardingStage: 'Live',
        integration: 'Hybrid Setup',
      },
      {
        id: 'school-hillview',
        name: 'Hillview Academy',
        location: 'Reading, UK',
        pupils: 780,
        highRisk: 0,
        alerts: 0,
        status: 'Onboarding',
        onboardingStage: 'Integration discovery',
        integration: 'Direct API Integration',
      },
    ],
    [alerts.length, stats.high, stats.total],
  );

  const [schools, setSchools] = useState<SchoolRow[]>(initialSchools);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<OnboardingForm>(emptyForm);

  const onboardingSchools = schools.filter((school) => school.status !== 'Active').length;

  function closeModal() {
    setShowModal(false);
    setStep(1);
    setForm(emptyForm);
  }

  function createSchool(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.schoolName.trim() || !form.adminEmail.trim()) {
      addToast('Please complete the school and admin details first', 'warning');
      return;
    }

    setSchools((prev) => [
      {
        id: `school-${Date.now()}`,
        name: form.schoolName.trim(),
        location: form.location.trim() || 'Location pending',
        pupils: Number(form.pupilEstimate) || 0,
        highRisk: 0,
        alerts: 0,
        status: form.trainingMode === 'Go Live Without Training' ? 'Onboarding' : 'Training',
        onboardingStage:
          form.trainingMode === 'Go Live Without Training' ? 'Connector setup queued' : 'Historical model training queued',
        integration: form.integrationMode,
      },
      ...prev,
    ]);

    addToast('School onboarding created', 'success');
    closeModal();
  }

  return (
    <div className="max-w-6xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schools</h1>
          <p className="text-sm text-gray-500 mt-1">Manage live schools and new onboarding journeys</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 text-white text-sm rounded-lg font-medium hover:bg-sky-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add School
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Live Schools</p>
          <p className="text-3xl font-bold text-gray-900 mt-3">{schools.filter((school) => school.status === 'Active').length}</p>
          <p className="text-sm text-gray-500 mt-1">Currently running predictive workflows</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Onboarding Pipeline</p>
          <p className="text-3xl font-bold text-sky-700 mt-3">{onboardingSchools}</p>
          <p className="text-sm text-gray-500 mt-1">Schools being connected, trained, or configured</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Preferred Setup</p>
          <p className="text-3xl font-bold text-emerald-700 mt-3">Hybrid</p>
          <p className="text-sm text-gray-500 mt-1">API integrations plus historical CSV model training</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">School</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Location</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Pupils</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">High Risk</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Alerts</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Integration</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Stage</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {schools.map((school) => (
              <tr
                key={school.id}
                onClick={() => school.name === 'Dedworth Middle School' && navigate('/dashboard')}
                className={school.name === 'Dedworth Middle School' ? 'hover:bg-sky-50/50 cursor-pointer transition-colors' : 'hover:bg-gray-50/50'}
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{school.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{school.location}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{school.pupils}</td>
                <td className="px-4 py-3">
                  <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-0.5 rounded-full">{school.highRisk}</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{school.alerts}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{school.integration}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{school.onboardingStage}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      school.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-700'
                        : school.status === 'Training'
                          ? 'bg-violet-100 text-violet-700'
                          : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {school.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">New School Onboarding</h3>
                <p className="text-sm text-gray-500 mt-1">Set up school details, choose integrations, and define how model training should begin.</p>
              </div>
              <button onClick={closeModal}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { id: 1, label: 'School Setup' },
                { id: 2, label: 'Integrations' },
                { id: 3, label: 'Training & Review' },
              ].map((item) => (
                <div
                  key={item.id}
                  className={`rounded-lg border px-4 py-3 text-sm font-medium ${
                    step === item.id
                      ? 'bg-sky-50 border-sky-200 text-sky-700'
                      : step > item.id
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-white border-gray-200 text-gray-500'
                  }`}
                >
                  {item.label}
                </div>
              ))}
            </div>

            <form onSubmit={createSchool} className="space-y-5">
              {step === 1 && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                    <input
                      type="text"
                      value={form.schoolName}
                      onChange={(event) => setForm((prev) => ({ ...prev, schoolName: event.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                      placeholder="Riverside Academy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={form.location}
                      onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                      placeholder="Slough, UK"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Pupils</label>
                    <input
                      type="number"
                      value={form.pupilEstimate}
                      onChange={(event) => setForm((prev) => ({ ...prev, pupilEstimate: event.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lead Admin Name</label>
                    <input
                      type="text"
                      value={form.adminName}
                      onChange={(event) => setForm((prev) => ({ ...prev, adminName: event.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                      placeholder="Mrs. A. Turner"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lead Admin Email</label>
                    <input
                      type="email"
                      value={form.adminEmail}
                      onChange={(event) => setForm((prev) => ({ ...prev, adminEmail: event.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                      placeholder="a.turner@school.org.uk"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Integration Mode</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['Direct API Integration', 'Scheduled CSV Import', 'Hybrid Setup'] as IntegrationMode[]).map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, integrationMode: option }))}
                          className={`rounded-xl border p-4 text-left ${
                            form.integrationMode === option ? 'border-sky-300 bg-sky-50' : 'border-gray-200 bg-white'
                          }`}
                        >
                          <p className="text-sm font-semibold text-gray-900">{option}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { key: 'connectArbor', label: 'Arbor MIS', icon: Database },
                      { key: 'connectClassCharts', label: 'Class Charts', icon: Cable },
                      { key: 'connectCpoms', label: 'CPOMS', icon: CheckCircle2 },
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            [item.key]: !prev[item.key as keyof OnboardingForm],
                          }))
                        }
                        className={`rounded-xl border p-4 text-left ${
                          form[item.key as keyof OnboardingForm] ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200 bg-white'
                        }`}
                      >
                        <item.icon className="w-5 h-5 text-sky-600 mb-3" />
                        <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                        <p className="text-xs text-gray-500 mt-1">{form[item.key as keyof OnboardingForm] ? 'Included in onboarding' : 'Not included yet'}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Model Training Approach</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['Historical CSV Training', 'API Backfill Training', 'Go Live Without Training'] as TrainingMode[]).map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, trainingMode: option }))}
                          className={`rounded-xl border p-4 text-left ${
                            form.trainingMode === option ? 'border-violet-300 bg-violet-50' : 'border-gray-200 bg-white'
                          }`}
                        >
                          <Brain className="w-5 h-5 text-violet-600 mb-3" />
                          <p className="text-sm font-semibold text-gray-900">{option}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-slate-50 p-4">
                    <h4 className="text-sm font-semibold text-gray-900">Onboarding Summary</h4>
                    <div className="mt-3 space-y-2 text-sm text-gray-600">
                      <p><strong>School:</strong> {form.schoolName || 'Not set yet'}</p>
                      <p><strong>Integration:</strong> {form.integrationMode}</p>
                      <p><strong>Training:</strong> {form.trainingMode}</p>
                      <p>
                        <strong>Connected sources:</strong>{' '}
                        {[form.connectArbor && 'Arbor', form.connectClassCharts && 'Class Charts', form.connectCpoms && 'CPOMS']
                          .filter(Boolean)
                          .join(', ') || 'None selected'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => (step === 1 ? closeModal() : setStep((value) => value - 1))}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  {step === 1 ? 'Cancel' : 'Back'}
                </button>
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => setStep((value) => value + 1)}
                    className="px-4 py-2 bg-sky-600 text-white text-sm rounded-lg hover:bg-sky-700"
                  >
                    Continue
                  </button>
                ) : (
                  <button type="submit" className="px-4 py-2 bg-sky-600 text-white text-sm rounded-lg hover:bg-sky-700">
                    Create Onboarding
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
