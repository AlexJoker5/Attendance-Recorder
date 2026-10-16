import { ErrorState } from '@/components/ui/ErrorState';
import { normalizeZoomName, zoomNameOwners } from '@/features/students/lib/studentZoomNames';
import type { Student } from '@/features/students/types/studentTypes';
import { useTranslation } from 'react-i18next';
import type { ImportRow } from '../types/importTypes';
import { ignoredZoomName } from '../lib/zoomNames';

export function ZoomNameApproval({
  row,
  student,
  students,
  update,
}: {
  row: ImportRow;
  student: Student;
  students: Student[];
  update: (id: string, values: Partial<ImportRow>) => void;
}) {
  const { t } = useTranslation();
  const candidates = [
    ...new Set(
      [row.displayName || row.name, row.originalName].filter((name): name is string => !!name),
    ),
  ];
  return (
    <div className="grid gap-3">
      {candidates.map((name) => {
        const saved = zoomNameOwners([student], name).length > 0;
        const excluded = ignoredZoomName(name);
        const owners = zoomNameOwners(students, name, student.id);
        const checked = (row.namesToSave || []).some(
          (value) => normalizeZoomName(value) === normalizeZoomName(name),
        );
        return (
          <div key={name} className="grid gap-2">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={saved || checked}
                disabled={saved || !!excluded || owners.length > 0}
                onChange={(event) =>
                  update(row.id, {
                    namesToSave: event.target.checked
                      ? [...(row.namesToSave || []), name]
                      : (row.namesToSave || []).filter(
                          (value) => normalizeZoomName(value) !== normalizeZoomName(name),
                        ),
                  })
                }
              />
              <span>
                {t(
                  saved
                    ? 'Already approved Zoom name'
                    : name === row.originalName
                      ? 'Save original name in parentheses'
                      : 'Remember this Zoom name',
                )}
                : <strong className="break-words">{name}</strong>
              </span>
            </label>
            {!!excluded && (
              <p className="muted">{t('This device or excluded name will not be saved.')}</p>
            )}
            {!!owners.length && (
              <ErrorState>
                {t('Name ownership conflict')}: {owners.map((owner) => owner.name).join(', ')}.{' '}
                {t(
                  'This match applies only to this session. Remove the conflicting name in student details before saving it for another student.',
                )}
              </ErrorState>
            )}
          </div>
        );
      })}
      <p className="muted">
        {t(
          'Selected names are saved when you apply attendance. The registered name stays unchanged.',
        )}
      </p>
    </div>
  );
}
