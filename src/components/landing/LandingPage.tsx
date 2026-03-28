import { useNavigate } from 'react-router-dom';
import { Shield, Zap, Bell, BarChart3, ArrowRight } from 'lucide-react';
import { useToast } from '../common/Toast';

export default function LandingPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const features = [
    {
      icon: Zap,
      title: 'Cross-System Intelligence',
      desc: 'Connects attendance, behaviour, academic, and wellbeing data from your existing school systems into a single picture.',
    },
    {
      icon: BarChart3,
      title: 'AI Pattern Detection',
      desc: 'Machine learning identifies emerging risk patterns weeks before they become visible through traditional monitoring.',
    },
    {
      icon: Bell,
      title: 'Staff Alerts',
      desc: 'Targeted, actionable alerts delivered to the right staff members — form tutors, subject teachers, safeguarding leads.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
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

      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center py-24 px-6">
        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
          Early intervention starts with{' '}
          <span className="text-sky-600">better data</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          Clinx connects fragmented school systems to identify children who need
          support — before crisis point.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => addToast('Demo request received! We\'ll be in touch.', 'success')}
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

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-3 gap-8">
          {features.map(f => (
            <div key={f.title} className="bg-sky-50 rounded-xl p-8 border border-sky-100">
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-sky-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between text-sm text-gray-400">
          <span>© 2026 Clinx. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-600">Privacy Policy</a>
            <a href="#" className="hover:text-gray-600">Terms of Service</a>
            <a href="#" className="hover:text-gray-600">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
