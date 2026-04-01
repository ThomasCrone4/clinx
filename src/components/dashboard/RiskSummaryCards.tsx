import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getPupilStats } from '../../services/dataService';

export default function RiskSummaryCards() {
  const stats = getPupilStats();
  const navigate = useNavigate();

  const cards = [
    { label: 'High Risk', count: stats.high, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', risk: 'High' },
    { label: 'Medium Risk', count: stats.medium, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', risk: 'Medium' },
    { label: 'Low Risk', count: stats.low, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', risk: 'Low' },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map(c => (
        <button
          key={c.label}
          onClick={() => navigate(`/dashboard/pupils?risk=${encodeURIComponent(c.risk)}`)}
          className={`${c.bg} border ${c.border} rounded-xl p-5 text-left transition-colors hover:brightness-[0.98] hover:border-opacity-80`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">{c.label}</span>
            <c.icon className={`w-5 h-5 ${c.color}`} />
          </div>
          <p className={`text-3xl font-bold ${c.color}`}>{c.count}</p>
          <p className="text-xs text-gray-500 mt-1">of {stats.total} pupils</p>
        </button>
      ))}
    </div>
  );
}
