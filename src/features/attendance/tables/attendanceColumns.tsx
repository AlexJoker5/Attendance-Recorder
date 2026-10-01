import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { ColumnDef } from '@tanstack/react-table';
import { MAX_ATTENDANCE_REMARK_LENGTH } from '../const/attendancePolicy';
import { ATTENDANCE_STATUSES } from '../const/attendanceStatus';
import type { SessionModel } from '../hooks/useSessionAttendance';
type AttendanceRow = SessionModel['students'][number];
export type AttendanceTableColumnProps = Pick<
  SessionModel,
  't' | 'readonly' | 'register' | 'control'
>;

export function createAttendanceColumns({
  t,
  readonly,
  register,
  control,
}: AttendanceTableColumnProps): ColumnDef<AttendanceRow>[] {
  return [
    {
      accessorKey: 'name',
      header: t('Student'),
      cell: ({ row }) => (
        <>
          <strong>{row.original.name}</strong>
          <small>{row.original.email}</small>
          <small>
            {row.original.enrollment.status !== 'active' ? t(row.original.enrollment.status) : ''}
          </small>
        </>
      ),
    },
    {
      id: 'status',
      accessorFn: (row) => row.cell.status,
      header: t('Attendance'),
      cell: ({ row }) => (
        <Controller
          control={control}
          name={`cells.${row.original.id}.status`}
          render={({ field, fieldState }) => (
            <div>
              <Select
                aria-label={t('Attendance') + ' ' + row.original.name}
                disabled={readonly}
                ref={field.ref}
                name={field.name}
                onBlur={field.onBlur}
                value={field.value}
                onValueChange={field.onChange}
                aria-invalid={!!fieldState.error}
                aria-describedby={
                  fieldState.error ? 'status-' + row.original.id + '-error' : undefined
                }
                options={ATTENDANCE_STATUSES.map((value) => ({ value, label: t(value) }))}
              />
              {fieldState.error && (
                <p className="error mt-2" id={'status-' + row.original.id + '-error'}>
                  {t(fieldState.error.message || 'Choose an attendance status.')}
                </p>
              )}
            </div>
          )}
        />
      ),
    },
    {
      id: 'remark',
      accessorFn: (row) => row.cell.remark,
      header: t('Remark'),
      cell: ({ row }) => (
        <Input
          className="min-w-48"
          aria-label={t('Remark') + ' ' + row.original.name}
          maxLength={MAX_ATTENDANCE_REMARK_LENGTH}
          disabled={readonly}
          {...register(`cells.${row.original.id}.remark`)}
        />
      ),
    },
    {
      id: 'source',
      accessorFn: (row) => row.cell.source,
      header: t('Source'),
      cell: ({ row }) => t(row.original.cell.source),
    },
  ];
}
