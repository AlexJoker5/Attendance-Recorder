import { Panel } from '@/components/ui/Panel';
import { useTranslation } from 'react-i18next';
import type { GroupDetailsModel } from '../hooks/useGroupDetails';
import { GroupEnrollmentTable } from './GroupEnrollmentTable';

export type GroupEnrollmentPanelProps = Pick<GroupDetailsModel, 'rows'>;
export function GroupEnrollmentPanel({ rows }: GroupEnrollmentPanelProps) {
  const { t } = useTranslation();
  return (
    <Panel title={t('Enrolled students')}>
      <GroupEnrollmentTable rows={rows} />
    </Panel>
  );
}
