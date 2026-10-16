import { Button } from '@/components/ui/Button';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { studentSearchText } from '@/features/students/lib/studentSearchText';
import { compareStudentNames } from '@/features/students/lib/studentNameOrder';
import type { ColumnDef } from '@tanstack/react-table';
import type { GroupDetailsModel } from '../hooks/useGroupDetails';

type GroupEnrollmentRow = GroupDetailsModel['rows'][number];
export type GroupEnrollmentTableColumnProps = Pick<
  GroupDetailsModel,
  't' | 'promptUnenrollSingle' | 'readonly'
>;

export function createGroupEnrollmentColumns({
  t,
  promptUnenrollSingle,
  readonly,
}: GroupEnrollmentTableColumnProps): ColumnDef<GroupEnrollmentRow>[] {
  return [
    {
      id: 'name',
      accessorFn: (row) => studentSearchText(row.student),
      header: t('Student'),
      sortingFn: (a, b) => compareStudentNames(a.original.student, b.original.student),
      cell: ({ row }) => row.original.student.name,
    },
    { id: 'email', accessorFn: (row) => row.student.email, header: t('Email') },
    { accessorKey: 'joined', header: t('Enrollment date') },
    { accessorKey: 'status', header: t('Status') },
    {
      id: 'details',
      header: t('Actions'),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <ButtonLink to={'/students/' + row.original.studentId}>{t('Go to details')}</ButtonLink>
          <Button
            variant="danger"
            disabled={readonly}
            onClick={() => promptUnenrollSingle(row.original.id)}
          >
            {t('Unenroll')}
          </Button>
        </div>
      ),
    },
  ];
}
