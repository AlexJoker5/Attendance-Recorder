import { AttendanceResultSummary } from '@/features/attendance/components/AttendanceResultSummary';
import { formatPercentage } from '@/utils/formatPercentage';
import type { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router';
import type { ReportsModel } from '../hooks/useAttendanceReports';
type AttendanceResultsRow = ReportsModel['rows'][number];
export type AttendanceResultsTableColumnProps = Pick<ReportsModel, 't'>;

export function createAttendanceResultsColumns({
  t,
}: AttendanceResultsTableColumnProps): ColumnDef<AttendanceResultsRow>[] {
  return [
    {
      id: 'student',
      accessorFn: (row) => row.student.name,
      header: t('Student'),
      cell: ({ row }) => (
        <Link to={'/students/' + row.original.student.id}>{row.original.student.name}</Link>
      ),
    },
    { id: 'group', accessorFn: (row) => row.group.name, header: t('Group') },
    { id: 'class', accessorFn: (row) => row.cls.name, header: t('Class') },
    { accessorKey: 'present', header: t('Present') },
    { accessorKey: 'absent', header: t('Absent') },
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
