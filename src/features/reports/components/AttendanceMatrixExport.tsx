import { ExportButtons } from '@/components/ui/ExportButtons';
import { Panel } from '@/components/ui/Panel';
import { Select } from '@/components/ui/Select';
import { useTranslation } from 'react-i18next';
import type { ReportsModel } from '../hooks/useAttendanceReports';

export type AttendanceMatrixExportProps = Pick<
  ReportsModel,
  'matrixClass' | 'classes' | 'setMatrixClass' | 'exportMatrix'
>;
export function AttendanceMatrixExport({
  matrixClass,
  classes,
  setMatrixClass,
  exportMatrix,
}: AttendanceMatrixExportProps) {
  const { t } = useTranslation();
  return (
    <Panel className="mt-6" title={t('Class attendance matrix')}>
      <p className="muted mb-5">
        {t(
          'Export regular sessions with statuses and remarks. Draft columns are labeled and excluded from results.',
        )}
      </p>
      <div className="actions">
        <Select
          className="max-w-xs"
          aria-label={t('Matrix class')}
          value={matrixClass || classes[0]?.id || ''}
          onValueChange={(value) => setMatrixClass(value)}
          options={classes.map((item) => ({ value: item.id, label: item.name }))}
        />
        <ExportButtons onExport={exportMatrix} disabled={!classes.length} />
      </div>
    </Panel>
  );
}
