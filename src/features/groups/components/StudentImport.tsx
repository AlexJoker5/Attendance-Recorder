import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { ErrorState } from '@/components/ui/ErrorState';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { WorkbookMapper } from '@/features/imports/components/WorkbookMapper';
import { useStudentImport } from '../hooks/useStudentImport';
import { StudentImportTable } from './StudentImportTable';
export function StudentImport(props: Parameters<typeof useStudentImport>[0]) {
  const model = useStudentImport(props);
  if (!model) return null;
  const {
    t,
    onClose,
    group,
    semester,
    joined,
    setJoined,
    reviewWorkbook,
    rows,
    setRows,
    importStudents,
    error,
  } = model;
  return (
    <Dialog title={t('Import students')} onClose={onClose}>
      <p className="callout mb-5">
        {group.name} · {t('Enrollment includes every class in this group.')}
      </p>
      <div className="form-stack">
        <Field htmlFor="joined" label={t('Enrollment date')}>
          <Input
            id="joined"
            type="date"
            min={semester.start}
            max={semester.end}
            value={joined}
            onChange={(event) => setJoined(event.target.value)}
          />
        </Field>
        <WorkbookMapper onReview={reviewWorkbook} />
        {rows.length > 0 && (
          <>
            <StudentImportTable rows={rows} setRows={setRows} />
            <Button
              variant="primary"
              disabled={!rows.some((row) => row.selected)}
              onClick={importStudents}
            >
              {t('Import selected students')}
            </Button>
          </>
        )}
        {error && <ErrorState>{t(error)}</ErrorState>}
      </div>
    </Dialog>
  );
}
