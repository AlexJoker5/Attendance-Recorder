import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { exportSheet } from '@/utils/exportSheet';
import { ArrowUpFromLine } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ImportSessionModel } from '../hooks/useImportReview';
import { WorkbookMapper } from './WorkbookMapper';

export type ImportWorkbookPanelProps = Pick<
  ImportSessionModel,
  'readonly' | 'reviewWorkbook' | 'students'
>;
export function ImportWorkbookPanel({
  readonly,
  reviewWorkbook,
  students,
}: ImportWorkbookPanelProps) {
  const { t } = useTranslation();
  return readonly ? (
    <p>{t('Restore the semester, group, class, and session before importing.')}</p>
  ) : (
    <Panel>
      <WorkbookMapper purpose="attendance" onReview={reviewWorkbook} />
      <Button
        className="mt-5"
        onClick={() =>
          void exportSheet(
            'sample-attendance-report',
            [
              ['Name (original name)', 'In waiting room'],
              [students[0]?.name || 'Example Student', 'Yes'],
              [(students[0]?.name || 'Example Student') + ' (My Zoom nickname)', 'No'],
              ['Different Zoom name', 'No'],
              ['iPhone', 'No'],
              ['Teacher (Host)', 'No'],
            ],
            'csv',
          )
        }
      >
        <ArrowUpFromLine size={16} />
        {t('Download sample report (CSV)')}
      </Button>
    </Panel>
  );
}
