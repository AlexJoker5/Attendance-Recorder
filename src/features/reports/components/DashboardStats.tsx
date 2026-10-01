import { StatCard } from '@/components/ui/StatCard';
import { useTranslation } from 'react-i18next';
import type { DashboardModel } from '../hooks/useDashboard';

export type DashboardStatsProps = Pick<DashboardModel, 'stats'>;
export function DashboardStats({ stats }: DashboardStatsProps) {
  const { t } = useTranslation();
  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
      {stats.map((stat) => (
        <StatCard key={stat.label} label={t(stat.label)} value={stat.value} icon={stat.icon} />
      ))}
    </div>
  );
}
