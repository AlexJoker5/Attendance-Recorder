import { AttendanceResultSummary } from '@/features/attendance/components/AttendanceResultSummary';
import { formatPercentage } from '@/utils/formatPercentage';
import type { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router';
import type { StudentDetailsModel } from '../hooks/useStudentDetails';
type StudentResultsRow = StudentDetailsModel['rows'][number];
export type StudentResultsTableColumnProps = Pick<StudentDetailsModel, 't'>;

export function createStudentResultsColumns({
  t,
}: StudentResultsTableColumnProps): ColumnDef<StudentResultsRow>[] {
  return [
    {
      id: 'class',
      accessorFn: (row) => row.cls.name,
      header: t('Class'),
      cell: ({ row }) => (
        <Link to={'/classes/' + row.original.cls.id}>{row.original.cls.name}</Link>
      ),
    },
    { accessorKey: 'present', header: t('Present') },
    { accessorKey: 'leaves', header: t('Leave') },
    {
      accessorKey: 'percentage',
      header: t('Attendance'),
      cell: ({ row }) => formatPercentage(row.original.percentage),
    },
    {
      accessorKey: 'label',
      header: t('Result'),
      cell: ({ row }) => (
        <AttendanceResultSummary label={row.original.label} reasons={row.original.reasons} />
      ),
    },
  ];
}
