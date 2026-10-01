import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { SPREADSHEET_ACCEPT } from '@/utils/const/spreadsheetFormats';
import { useTranslation } from 'react-i18next';
import type { WorkbookMapperModel } from '../hooks/useWorkbookMapper';

export type WorkbookFileInputProps = Pick<WorkbookMapperModel, 'busy' | 'loadWorkbook'>;
export function WorkbookFileInput({ busy, loadWorkbook }: WorkbookFileInputProps) {
  const { t } = useTranslation();
  return (
    <Field htmlFor="report-file" label={t('Report file (CSV or XLSX)')}>
      <Input
        id="report-file"
        type="file"
        accept={SPREADSHEET_ACCEPT}
        disabled={busy}
        onChange={loadWorkbook}
      />
    </Field>
  );
}
