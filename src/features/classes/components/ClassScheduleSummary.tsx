import { Badge } from '@/components/ui/Badge';
import { useTranslation } from 'react-i18next';
import type { ClassDetailsModel } from '../hooks/useClassDetails';

export type ClassScheduleSummaryProps = Pick<ClassDetailsModel, 'cls'>;
export function ClassScheduleSummary({ cls }: ClassScheduleSummaryProps) {
  const { t } = useTranslation();
  return (
    <p className="muted mb-6">
      {cls.startDate} → {cls.endDate} {cls.archived && <Badge>{t('Archived')}</Badge>}{' '}
      {cls.completed && <Badge tone="success">{t('Completed')}</Badge>}
    </p>
  );
}
