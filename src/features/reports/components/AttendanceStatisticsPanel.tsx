import { Panel } from '@/components/ui/Panel';
import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import type { DashboardModel } from '../hooks/useDashboard';
const Chart = lazy(() =>
  import('../components/AttendanceChart').then((module) => ({ default: module.AttendanceChart })),
);
export type AttendanceStatisticsPanelProps = Pick<DashboardModel, 'results'>;
export function AttendanceStatisticsPanel({ results }: AttendanceStatisticsPanelProps) {
  const { t } = useTranslation();
  return (
    <Panel title={t('Attendance statistics')}>
      <Suspense fallback={<p>{t('Loading…')}</p>}>
        <Chart
          present={results.reduce((sum, row) => sum + row.present, 0)}
          absent={results.reduce((sum, row) => sum + row.absent, 0)}
          leave={results.reduce((sum, row) => sum + row.leaves, 0)}
        />
      </Suspense>
      <p className="muted mt-3">
        {t('Finalized regular sessions only. Extra and removed sessions are excluded.')}
      </p>
    </Panel>
  );
}
