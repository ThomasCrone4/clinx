import { HelpCircle } from 'lucide-react';

export default function HelpPage() {
  const faqs = [
    {
      q: 'What do the risk scores mean?',
      a: 'Risk scores (0-100%) indicate how closely a pupil\'s current pattern resembles historical patterns that later led to negative outcomes or significant support needs. High risk (>75%) means a stronger pattern match and more urgent review. Medium (50-75%) means emerging concern. Low (<50%) means no strong current pattern match.',
    },
    {
      q: 'How are predictions generated?',
      a: 'Clinx combines attendance, behaviour, academic, wellbeing, and contextual signals from systems schools already use. The model learns from past data patterns and later outcomes, such as CPOMS chronology, to identify pupils whose current signals may suggest a future negative outcome without any extra data entry from teachers.',
    },
    {
      q: 'What should I do when a pupil is flagged?',
      a: 'Review the pupil detail page for context, contributing signals, and predicted outcomes. Consider the suggested actions. Use professional judgement; Clinx provides decision support, not diagnoses. Acknowledge the alert so other staff know it has been seen, then follow normal pastoral or safeguarding processes.',
    },
    {
      q: 'Where does the data come from?',
      a: 'Clinx connects to your school\'s existing systems: Arbor MIS (attendance, SEND, FSM), Class Charts (behaviour and homework), and CPOMS (safeguarding chronology). The aim is to work with data schools already collect rather than creating new forms or admin processes.',
    },
    {
      q: 'Will this create extra workload for teachers?',
      a: 'The intention is the opposite. Clinx is designed to reduce time spent manually piecing together signals from different systems by surfacing likely concerns early and routing them to the right staff with clear context.',
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
