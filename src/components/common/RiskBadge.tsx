import type { RiskLevel } from '../../types/domain';

const colors: Record<RiskLevel, string> = {
  High: 'bg-red-100 text-red-700 border-red-200',
  Medium: 'bg-amber-100 text-amber-700 border-amber-200',
  Low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const dots: Record<RiskLevel, string> = {
  High: 'bg-red-500',
  Medium: 'bg-amber-500',
  Low: 'bg-emerald-500',
};

type RiskBadgeProps = {
  level: RiskLevel;
  score?: number;
  size?: 'sm' | 'lg';
};

export default function RiskBadge({ level, score, size = 'sm' }: RiskBadgeProps) {
  const padding = size === 'lg' ? 'px-3 py-1.5 text-sm' : 'px-2 py-0.5 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${colors[level]} ${padding}`}>
      <span className={`w-2 h-2 rounded-full ${dots[level]}`} />
      {level}
      {score !== undefined && ` (${score}%)`}
    </span>
  );
}
