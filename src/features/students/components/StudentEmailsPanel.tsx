import { useState } from 'react';
import { Plus } from 'lucide-react';
import { AdditionalEmailDialog } from './AdditionalEmailDialog';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { useTranslation } from 'react-i18next';
import type { StudentDetailsModel } from '../hooks/useStudentDetails';

export type StudentEmailsPanelProps = Pick<
  StudentDetailsModel,
  'student' | 'removeAdditionalEmail' | 'addAdditionalEmail'
>;
export function StudentEmailsPanel({
  student,
  removeAdditionalEmail,
  addAdditionalEmail,
}: StudentEmailsPanelProps) {
  const { t } = useTranslation();
  const [adding, setAdding] = useState(false);
  return (
    <Panel title={t('Additional verified emails')}>
      <div className="actions mb-4">
        <Button onClick={() => setAdding(true)}>
          <Plus size={16} />
          {t('Add additional email')}
        </Button>
      </div>
      <p className="muted mb-4">
        {t('Approved for future imports. The primary email stays unchanged.')}
      </p>
      {student.aliases.map((email) => (
        <div key={email} className="actions justify-between mb-3">
          <span className="break-all">{email}</span>
          <Button onClick={() => void removeAdditionalEmail(email)}>{t('Remove')}</Button>
        </div>
      ))}
      {!student.aliases.length && <p className="muted">{t('No additional emails.')}</p>}
      {adding && (
        <AdditionalEmailDialog onClose={() => setAdding(false)} onSave={addAdditionalEmail} />
      )}
    </Panel>
  );
}
