import type { ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { compareStudentNames } from '@/features/students/lib/studentNameOrder';
import { publicClassPath } from '../lib/shareLinks';
import type { PublicAttendance, PublicSession } from '../types/sharingTypes';

export function publicSessionName(session: PublicSession, t: TFunction) {
  return session.extra ? t('Extra session') : t('Week {{number}}', { number: session.weekNumber });
}
export function publicSessionsColumns(token: string, t: TFunction): ColumnDef<PublicSession>[] {
  return [
    { id: 'name', header: t('Session Name'), accessorFn: (row) => publicSessionName(row, t) },
    { accessorKey: 'date', header: t('Session date') },
    { id: 'time', header: t('Time'), accessorFn: (row) => `${row.startTime}–${row.endTime}` },
    {
      id: 'status',
      header: t('Review status'),
      accessorFn: () => t('Finalized'),
      cell: () => <Badge tone="success">{t('Finalized')}</Badge>,
    },
    {
      id: 'actions',
      header: t('Actions'),
      enableSorting: false,
      cell: ({ row }) => (
        <ButtonLink to={publicClassPath(token, row.original.id)}>{t('View attendance')}</ButtonLink>
      ),
    },
  ];
}
export function publicAttendanceColumns(t: TFunction): ColumnDef<PublicAttendance>[] {
  return [
    {
      accessorKey: 'name',
      header: t('Student'),
      sortingFn: (a, b) => compareStudentNames(a.original, b.original),
    },
    {
      accessorKey: 'status',
      header: t('Attendance'),
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            tone={
              status === 'Present'
                ? 'success'
                : status === 'Leave'
                  ? 'warning'
                  : status === 'Absent'
                    ? 'danger'
                    : 'neutral'
            }
          >
            {t(status)}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'remark',
      header: t('Remark'),
      cell: ({ row }) => (
        <span className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
          {row.original.remark || '—'}
        </span>
      ),
    },
  ];
}
