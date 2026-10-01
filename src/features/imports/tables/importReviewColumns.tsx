import { Badge } from '@/components/ui/Badge';
import { ErrorState } from '@/components/ui/ErrorState';
import { Select } from '@/components/ui/Select';
import { emailOwner } from '@/features/students/lib/studentEmails';
import type { ColumnDef } from '@tanstack/react-table';
import type { ImportSessionModel } from '../hooks/useImportReview';
import type { ImportRow } from '../types/importTypes';
export type ImportReviewTableDataProps = Pick<ImportSessionModel, 'rows' | 'filter'>;
export type ImportReviewTableColumnProps = Pick<
  ImportSessionModel,
  't' | 'data' | 'session' | 'update' | 'students'
>;
export function selectImportReviewRows({ rows, filter }: ImportReviewTableDataProps) {
  return rows.filter(
    (row) =>
      filter === 'all' ||
      (filter === 'unresolved'
        ? !row.studentId
        : filter === 'ignored'
          ? row.studentId === 'ignore'
          : !!row.studentId && row.studentId !== 'ignore'),
  );
}
export function createImportReviewColumns({
  t,
  data,
  session,
  update,
  students,
}: ImportReviewTableColumnProps): ColumnDef<ReturnType<typeof selectImportReviewRows>[number]>[] {
  return [
    {
      accessorKey: 'name',
      header: t('Zoom attendee'),
      cell: ({ row }) => (
        <>
          <strong>{row.original.name || t('Unnamed attendee')}</strong>
          <small>{row.original.email || t('No email')}</small>
        </>
      ),
    },
    {
      id: 'description',
      accessorFn: (row) => row.description,
      header: t('Match status'),
      cell: ({ row }) => (
        <>
          <Badge tone={row.original.studentId ? 'neutral' : 'warning'}>
            {t(
              row.original.studentId === 'ignore'
                ? 'Ignored'
                : row.original.studentId
                  ? 'Matched'
                  : 'Needs review',
            )}
          </Badge>
          <small>{t(row.original.description)}</small>
        </>
      ),
    },
    {
      id: 'resolution',
      header: t('Resolution'),
      cell: ({ row }) => {
        const item = row.original;
        const selected = data.students.find((student) => student.id === item.studentId);
        const owner = emailOwner(data, item.email);
        const cell = session.attendance[item.studentId];
        const conflict =
          cell &&
          (cell.status === 'Leave' ||
            (cell.status === 'Absent' && cell.source !== 'Finalization') ||
            cell.source === 'Pre-enrollment credit');
        return (
          <div className="form-stack min-w-64">
            <Select
              aria-label={t('Match student') + ' ' + item.name}
              value={item.studentId}
              onValueChange={(value) =>
                update(item.id, {
                  studentId: value,
                  saveEmail: false,
                  decision: '',
                })
              }
              options={[
                { value: '', label: t('Choose student') },
                { value: 'ignore', label: t('Ignore attendee') },
                ...students.map((student) => ({
                  value: student.id,
                  label: (
                    <>
                      {student.name} · {student.email}
                    </>
                  ),
                })),
              ]}
            />
            {selected && (
              <>
                <label className="actions">
                  <input
                    type="checkbox"
                    checked={item.saveEmail}
                    disabled={!item.email || item.email === selected.email}
                    onChange={(event) => update(item.id, { saveEmail: event.target.checked })}
                  />
                  {t('Save additional email')}
                </label>
                {owner && owner.id !== selected.id && (
                  <ErrorState>
                    {t('Email conflict')}: {item.email} → {owner.name} ({owner.email}).{' '}
                    {t(
                      'Uncheck Save additional email for a session-only match. Correct email ownership in student details before saving it for another student.',
                    )}
                  </ErrorState>
                )}
                {conflict && (
                  <>
                    <p className="muted">
                      {t('Existing attendance')}: {t(cell.status)} · {t(cell.source)}
                    </p>
                    <Select
                      aria-label={t('Existing attendance') + ' ' + item.name}
                      value={item.decision}
                      onValueChange={(value) =>
                        update(item.id, {
                          decision: value as ImportRow['decision'],
                        })
                      }
                      options={[
                        { value: '', label: t('Choose decision') },
                        { value: 'keep', label: t('Keep existing status') },
                        { value: 'replace', label: t('Replace with Present') },
                      ]}
                    />
                  </>
                )}
              </>
            )}
          </div>
        );
      },
    },
  ];
}
