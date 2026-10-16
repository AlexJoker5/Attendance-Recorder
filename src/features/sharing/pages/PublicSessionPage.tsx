import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/table/DataTable';
import { publicAttendanceColumns, publicSessionName } from '../tables/publicColumns';
import type { PublicClass, PublicSession } from '../types/sharingTypes';

export function PublicSessionPage({
  data,
  session,
}: {
  data: PublicClass;
  session: PublicSession;
}) {
  const { t } = useTranslation();
  const counts = (['Present', 'Absent', 'Leave', 'Unmarked'] as const).map((status) => ({
    status,
    count: data.attendance.filter((row) => row.status === status).length,
  }));
  return (
    <div className="space-y-6">
      <div className="panel space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2>{publicSessionName(session, t)}</h2>
          <Badge tone="success">{t('Finalized')}</Badge>
        </div>
        <p>
          {session.date} · {session.startTime}–{session.endTime} · {data.class.timezone}
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {counts.map(({ status, count }) => (
            <span key={status}>
              {t(status)}: <strong>{count}</strong>
            </span>
          ))}
        </div>
      </div>
      <DataTable
        data={data.attendance}
        columns={publicAttendanceColumns(t)}
        showCreatedDate={false}
        searchPlaceholder="Search students"
      />
      <p className="muted">
        {t(
          'If your attendance is incorrect, contact your teacher. Changes can only be made in the admin portal.',
        )}
      </p>
    </div>
  );
}
