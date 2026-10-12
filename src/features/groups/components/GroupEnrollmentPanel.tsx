import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { useTranslation } from 'react-i18next';
import type { GroupDetailsModel } from '../hooks/useGroupDetails';
import { GroupEnrollmentTable } from './GroupEnrollmentTable';

export type GroupEnrollmentPanelProps = Pick<
  GroupDetailsModel,
  'rows' | 'promptUnenrollSingle' | 'readonly' | 'setDialog'
>;
export function GroupEnrollmentPanel({
  rows,
  promptUnenrollSingle,
  readonly,
  setDialog,
}: GroupEnrollmentPanelProps) {
  const { t } = useTranslation();
  return (
    <Panel>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="m-0 text-xl font-semibold">{t('Enrolled students')}</h2>
        {rows.length > 0 && (
          <Button
            variant="danger"
            disabled={readonly}
            onClick={() => setDialog('unenrollAll')}
          >
            {t('Unenroll all students')}
          </Button>
        )}
      </div>
      <GroupEnrollmentTable
        rows={rows}
        promptUnenrollSingle={promptUnenrollSingle}
        readonly={readonly}
      />
    </Panel>
  );
}

