import { Panel } from '@/components/ui/Panel';
import { useTranslation } from 'react-i18next';
import type { StudentDetailsModel } from '../hooks/useStudentDetails';

export type StudentProfilePanelProps = Pick<StudentDetailsModel, 'student'>;
export function StudentProfilePanel({ student }: StudentProfilePanelProps) {
  const { t } = useTranslation();
  return (
    <Panel title={t('Student details')}>
      <dl className="details">
        <dt>{t('Primary email')}</dt>
        <dd>{student.email}</dd>
        <dt>{t('Phone')}</dt>
        <dd>{student.phone || '—'}</dd>
        <dt>{t('Notes')}</dt>
        <dd className="whitespace-pre-wrap">{student.notes || '—'}</dd>
      </dl>
    </Panel>
  );
}
