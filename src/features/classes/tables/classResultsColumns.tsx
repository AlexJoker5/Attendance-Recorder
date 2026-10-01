import { formatPercentage } from '@/utils/formatPercentage';
import type { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router';
import type { ClassDetailsModel } from '../hooks/useClassDetails';
type ClassResultsRow = ClassDetailsModel['results'][number];
export type ClassResultsTableColumnProps = Pick<ClassDetailsModel, 't'>;

export function createClassResultsColumns({
  t,
}: ClassResultsTableColumnProps): ColumnDef<ClassResultsRow>[] {
  return [
    {
      id: 'student',
      accessorFn: (row) => row.student.name,
      header: t('Student'),
      cell: ({ row }) => (
        <Link to={'/students/' + row.original.student.id}>{row.original.student.name}</Link>
      ),
    },
    { accessorKey: 'present', header: t('Present') },
    { accessorKey: 'absent', header: t('Absent') },
    { accessorKey: 'leaves', header: t('Leave') },
    { accessorKey: 'credits', header: t('Pre-enrollment credit') },
    {
      accessorKey: 'percentage',
      header: t('Attendance'),
      cell: ({ row }) => formatPercentage(row.original.percentage),
    },
    {
      accessorKey: 'label',
      header: t('Result'),
      cell: ({ row }) => (
        <>
          {t(row.original.label)}
          <small>{row.original.reasons.map((reason) => t(reason)).join(' · ')}</small>
        </>
      ),
    },
  ];
}
