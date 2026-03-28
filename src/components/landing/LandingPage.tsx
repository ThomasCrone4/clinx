import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Zap, Bell, BarChart3, ArrowRight } from 'lucide-react';
import { useToast } from '../common/Toast';

export default function LandingPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [showDemoForm, setShowDemoForm] = useState(false);
  const [demoForm, setDemoForm] = useState({
    name: '',
    email: '',
    role: 'School leader',
    school: '',
    pupils: '600',
    systems: 'Arbor, Class Charts, CPOMS export',
    priorities: '',
  });

  const features = [
    {
      icon: Zap,
      title: 'Uses Existing School Data',
      desc: 'Connects attendance, behaviour, attainment, and pastoral data from systems schools already use, without asking staff to collect extra information.',
    },
    {
      icon: BarChart3,
      title: 'Predicts Future Negative Outcomes',
      desc: 'Machine learning learns from historical patterns in school data and later recorded outcomes, helping schools spot pupils who may need support earlier.',
    },
    {
      icon: Bell,
      title: 'Adds Little Extra Workload',
      desc: 'Targeted alerts and suggested next steps are routed to the right staff, so teachers can act without duplicating work already happening elsewhere.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-sky-600" />
          <span className="text-xl font-bold text-sky-700">Clinx</span>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="px-5 py-2 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors"
        >
          Login
        </button>
      </header>

      <section className="max-w-4xl mx-auto text-center py-24 px-6">
        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
          Predict negative outcomes earlier from <span className="text-sky-600">data schools already hold</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          Clinx learns from past patterns across systems like Arbor, Class Charts, and CPOMS to help schools intervene
          earlier, without asking staff to collect more data or maintain another monitoring system.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {[
            'No new data collection',
            'Minimal extra workload',
            'Built for earlier intervention',
          ].map((message) => (
            <span
              key={message}
              className="px-4 py-2 rounded-full border border-sky-100 bg-sky-50 text-sm font-medium text-sky-800"
            >
              {message}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setShowDemoForm(true)}
            className="px-8 py-3 bg-sky-600 text-white rounded-lg font-semibold text-lg hover:bg-sky-700 transition-colors flex items-center gap-2"
          >
            Request a Demo <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors"
          >
            Login
          </button>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900">Why schools care</h2>
          <p className="text-gray-500 mt-3">
            Clinx is designed to recognise patterns already present across a school&apos;s existing systems, then surface
            pupils who may be heading toward a negative outcome so staff can step in sooner.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="bg-sky-50 rounded-xl p-8 border border-sky-100">
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-sky-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 grid grid-cols-3 gap-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm font-semibold text-gray-900">Input data</p>
            <p className="text-sm text-gray-500 mt-2">Attendance, behaviour, homework, attainment, safeguarding chronology, and other signals already held in school systems.</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm font-semibold text-gray-900">Pattern learning</p>
            <p className="text-sm text-gray-500 mt-2">The model learns which combinations of signals tended to appear before later negative outcomes in historical data.</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm font-semibold text-gray-900">School action</p>
            <p className="text-sm text-gray-500 mt-2">Staff see early warning, likely outcomes, and suggested low-burden next steps without duplicate data entry.</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between text-sm text-gray-400">
          <span>(c) 2026 Clinx. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-600">Privacy Policy</a>
            <a href="#" className="hover:text-gray-600">Terms of Service</a>
            <a href="#" className="hover:text-gray-600">Contact</a>
          </div>
        </div>
      </footer>

      {showDemoForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Request a Demo</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Tell us a little about your school and current systems so we can tailor the demo.
                </p>
              </div>
              <button onClick={() => setShowDemoForm(false)} className="text-sm text-gray-400 hover:text-gray-600">
                Close
              </button>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                addToast("Demo request received! We'll be in touch.", 'success');
                setShowDemoForm(false);
                setDemoForm({
                  name: '',
                  email: '',
                  role: 'School leader',
                  school: '',
                  pupils: '600',
                  systems: 'Arbor, Class Charts, CPOMS export',
                  priorities: '',
                });
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={demoForm.name}
                    onChange={(event) => setDemoForm((prev) => ({ ...prev, name: event.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                    placeholder="Jane Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Work Email</label>
                  <input
                    type="email"
                    value={demoForm.email}
                    onChange={(event) => setDemoForm((prev) => ({ ...prev, email: event.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                    placeholder="j.smith@school.org.uk"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={demoForm.role}
                    onChange={(event) => setDemoForm((prev) => ({ ...prev, role: event.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                  >
                    <option>School leader</option>
                    <option>DSL / safeguarding lead</option>
                    <option>Trust leader</option>
                    <option>Data / MIS lead</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                  <input
                    type="text"
                    value={demoForm.school}
                    onChange={(event) => setDemoForm((prev) => ({ ...prev, school: event.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                    placeholder="Riverside Academy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Approx. Pupils</label>
                  <input
                    type="number"
                    value={demoForm.pupils}
                    onChange={(event) => setDemoForm((prev) => ({ ...prev, pupils: event.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Systems</label>
                  <input
                    type="text"
                    value={demoForm.systems}
                    onChange={(event) => setDemoForm((prev) => ({ ...prev, systems: event.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                    placeholder="Arbor, Class Charts, CPOMS export"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">What would you most like to see?</label>
                <textarea
                  value={demoForm.priorities}
                  onChange={(event) => setDemoForm((prev) => ({ ...prev, priorities: event.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none min-h-28"
                  placeholder="For example: safeguarding prediction, attendance intervention, workload reduction, onboarding and integrations..."
                />
              </div>

              <div className="rounded-lg bg-sky-50 border border-sky-200 p-4 text-sm text-sky-800">
                Clinx demos can be tailored around your existing data stack, likely onboarding route, and whether you want to
                see CSV-based historical training, live MIS scoring, or a phased hybrid rollout.
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDemoForm(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 text-white text-sm rounded-lg hover:bg-sky-700"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
