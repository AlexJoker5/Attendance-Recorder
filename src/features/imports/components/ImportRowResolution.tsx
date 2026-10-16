import { Select } from '@/components/ui/Select';
import { compareStudentNames } from '@/features/students/lib/studentNameOrder';
import type { ImportReviewTableColumnProps } from '../tables/importReviewColumns';
import type { ImportRow } from '../types/importTypes';
import { ZoomNameApproval } from './ZoomNameApproval';

export function ImportRowResolution({
  item,
  t,
  data,
  session,
  update,
  students,
}: ImportReviewTableColumnProps & { item: ImportRow }) {
  if (item.ignoreReason)
    return (
      <p className="muted">
        {t('Automatically ignored. No attendance credit is given for this row.')}
      </p>
    );
  const selected = students.find((student) => student.id === item.studentId);
  const cell = session.attendance[item.studentId];
  const conflict =
    cell &&
    (cell.status === 'Leave' ||
      (cell.status === 'Absent' && cell.source !== 'Finalization') ||
      cell.source === 'Pre-enrollment credit');
  const suggestions = (item.suggestions || [])
    .map((id) => students.find((student) => student.id === id))
    .filter((student) => !!student);
  return (
    <div className="form-stack min-w-72 max-w-xl">
      {!item.studentId && !!suggestions.length && (
        <p className="callout">
          {t('Possible matches — please review')}:{' '}
          {suggestions.map((student) => student.name).join(', ')}
        </p>
      )}
      <Select
        aria-label={t('Match student') + ' ' + item.name}
        value={item.studentId}
        onValueChange={(value) => update(item.id, { studentId: value })}
        options={[
          { value: '', label: t('Choose student') },
          { value: 'ignore', label: t('Ignore attendee') },
          ...[...students].sort(compareStudentNames).map((student) => ({
            value: student.id,
            label: `${student.name} · ${student.email}`,
          })),
        ]}
      />
      {selected && (
        <>
          <ZoomNameApproval
            row={item}
            student={selected}
            students={data.students}
            update={update}
          />
          {conflict && (
            <>
              <p className="muted">
                {t('Existing attendance')}: {t(cell.status)} · {t(cell.source)}
              </p>
              <Select
                aria-label={t('Existing attendance') + ' ' + item.name}
                value={item.decision}
                onValueChange={(value) =>
                  update(item.id, { decision: value as ImportRow['decision'] })
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
}
