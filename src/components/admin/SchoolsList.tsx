import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, CheckCircle2, Database, Brain, Cable } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { useToast } from '../common/Toast';
import type { IntegrationMode, NewSchoolPayload, TrainingMode } from '../../context/AdminDataContext';

const emptyForm: NewSchoolPayload = {
  schoolName: '',
  location: '',
  pupilEstimate: '600',
  adminName: '',
  adminEmail: '',
  integrationMode: 'Hybrid Rollout',
  trainingMode: 'Historical CSV Training',
  connectArbor: true,
  connectClassCharts: true,
  connectCpoms: true,
};

export default function SchoolsList() {
  const navigate = useNavigate();
  const { schools, addSchool } = useAdminData();
  const { addToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<NewSchoolPayload>(emptyForm);

  const onboardingSchools = schools.filter((school) => school.status !== 'Active').length;
  const activeSchools = schools.filter((school) => school.status === 'Active').length;
  const totalPupils = schools.reduce((sum, school) => sum + school.pupils, 0);
  const totalAlerts = schools.reduce((sum, school) => sum + school.alerts, 0);
  const hybridSchools = schools.filter((school) => school.onboarding.integrationMode === 'Hybrid Rollout').length;
  const trainingSchools = schools.filter((school) => school.status === 'Training').length;

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

    addSchool(form);
    addToast('School onboarding created', 'success');
    closeModal();
  }

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schools</h1>
          <p className="text-sm text-gray-500 mt-1">Manage live schools, rollout progress, and new onboarding journeys</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 text-white text-sm rounded-lg font-medium hover:bg-sky-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add School
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">School Rollout Workspace</h2>
          <p className="text-sm text-gray-500 mt-1">
            Add new schools, track integration pathways, and manage historical-training rollouts in one place.
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/onboarding')}
          className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 text-white text-sm rounded-lg font-medium hover:bg-sky-700 transition-colors"
        >
          <Cable className="w-4 h-4" /> Open Onboarding Hub
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Total Schools</p>
          <p className="text-3xl font-bold text-gray-900 mt-3">{schools.length}</p>
          <p className="text-sm text-gray-500 mt-1">Managed across live and onboarding environments</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Live Schools</p>
          <p className="text-3xl font-bold text-emerald-700 mt-3">{activeSchools}</p>
          <p className="text-sm text-gray-500 mt-1">Currently running predictive workflows</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Onboarding Pipeline</p>
          <p className="text-3xl font-bold text-sky-700 mt-3">{onboardingSchools}</p>
          <p className="text-sm text-gray-500 mt-1">Schools being connected, trained, or configured</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Managed Pupils</p>
          <p className="text-3xl font-bold text-gray-900 mt-3">{totalPupils}</p>
          <p className="text-sm text-gray-500 mt-1">Across all schools in the Clinx workspace</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Cable className="w-4 h-4 text-sky-600" />
            <h3 className="text-sm font-semibold text-gray-700">Integration Pipeline</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{onboardingSchools} schools</p>
          <p className="text-sm text-gray-500 mt-1">
            Schools currently moving through onboarding, training, or go-live preparation.
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-4 h-4 text-violet-600" />
            <h3 className="text-sm font-semibold text-gray-700">Training Readiness</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{trainingSchools} active jobs</p>
          <p className="text-sm text-gray-500 mt-1">
            Historical backfill and staged retraining pipelines currently in progress.
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Database className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-semibold text-gray-700">Default Rollout</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{hybridSchools} hybrid</p>
          <p className="text-sm text-gray-500 mt-1">
            Live MIS data with historical CSV-based training remains the main setup path.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-700">School Portfolio</h3>
            <p className="text-sm text-gray-500 mt-1">Click a school to open account support and organisation-level admin tools.</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Active Alerts</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">{totalAlerts}</p>
          </div>
        </div>
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
                onClick={() => navigate(`/admin/schools/${school.id}`)}
                className="hover:bg-sky-50/50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{school.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{school.location}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{school.pupils}</td>
                <td className="px-4 py-3">
                  <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-0.5 rounded-full">{school.highRisk}</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{school.alerts}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{school.onboarding.integrationMode}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{school.onboarding.stage}</td>
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
                <p className="text-sm text-gray-500 mt-1">Set up school details, choose a realistic data route, and define how historical training should begin.</p>
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
                      {(['CSV-First Setup', 'Live MIS/API + CSV Outcomes', 'Hybrid Rollout'] as IntegrationMode[]).map((option) => (
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
                      { key: 'connectCpoms', label: 'CPOMS historical export', icon: CheckCircle2 },
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            [item.key]: !prev[item.key as keyof NewSchoolPayload],
                          }))
                        }
                        className={`rounded-xl border p-4 text-left ${
                          form[item.key as keyof NewSchoolPayload] ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200 bg-white'
                        }`}
                      >
                        <item.icon className="w-5 h-5 text-sky-600 mb-3" />
                        <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                        <p className="text-xs text-gray-500 mt-1">{form[item.key as keyof NewSchoolPayload] ? 'Included in onboarding' : 'Not included yet'}</p>
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
                      {(['Historical CSV Training', 'Scheduled Batch Retraining', 'Pilot Without Model'] as TrainingMode[]).map((option) => (
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
