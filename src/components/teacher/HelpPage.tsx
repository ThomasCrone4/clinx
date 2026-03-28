import { HelpCircle, Shield, AlertTriangle, BarChart3, MessageSquare } from 'lucide-react';

export default function HelpPage() {
  const faqs = [
    {
      q: 'What do the risk scores mean?',
      a: 'Risk scores (0-100%) indicate the likelihood a pupil may need additional support. They combine attendance, behaviour, academic, and wellbeing data. High risk (>75%) means significant pattern shifts detected. Medium (50-75%) means emerging concerns. Low (<50%) means no current concerns.',
    },
    {
      q: 'How are risk scores calculated?',
      a: 'Risk scores combine: Attendance (35%), Behaviour (25%), Academic performance (20%), Wellbeing survey (15%), and Context factors like FSM/SEND status (5%). Higher scores indicate more risk factors.',
    },
    {
      q: 'What should I do when a pupil is flagged?',
      a: 'Review the pupil detail page for context. Consider the suggested actions. Use professional judgement — Clinx provides data, not diagnoses. Log your observations in the Notes tab. Acknowledge the alert so other staff know it\'s been seen.',
    },
    {
      q: 'Where does the data come from?',
      a: 'Clinx connects to your school\'s existing systems: Arbor MIS (attendance, SEND, FSM), Class Charts (behaviour), and Google Classroom (homework). Data is synced automatically.',
    },
    {
      q: 'Who can see pupil data?',
      a: 'Teachers see data for pupils in their classes only. School admins see all pupils. Site admins manage platform-level settings. All access is logged for safeguarding compliance.',
    },
  ];

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-sm text-gray-500 mt-1">Common questions and guidance for using Clinx</p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <details key={i} className="bg-white rounded-xl border border-gray-200 group">
            <summary className="px-5 py-4 cursor-pointer text-sm font-medium text-gray-900 hover:text-sky-700 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-sky-500 shrink-0" />
              {faq.q}
            </summary>
            <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3 ml-6">
              {faq.a}
            </div>
          </details>
        ))}
      </div>

      <div className="bg-sky-50 rounded-xl border border-sky-200 p-5">
        <h3 className="text-sm font-semibold text-sky-800 mb-2">Need more help?</h3>
        <p className="text-sm text-sky-700">Contact your school admin or email support@clinx.uk</p>
      </div>
    </div>
  );
}
