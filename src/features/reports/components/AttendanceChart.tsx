import { EmptyState } from '@/components/ui/EmptyState';
import { useTranslation } from 'react-i18next';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function AttendanceChart({
  present,
  absent,
  leave,
}: {
  present: number;
  absent: number;
  leave: number;
}) {
  const { t } = useTranslation();
  const rows = [
    { name: t('Present'), total: present },
    { name: t('Absent'), total: absent },
    { name: t('Leave'), total: leave },
  ];
  if (!(present + absent + leave)) return <EmptyState>{t('No finalized attendance')}</EmptyState>;
  return (
    <div
      className="h-64 min-w-0"
      role="img"
      aria-label={`${t('Present')}: ${present}; ${t('Absent')}: ${absent}; ${t('Leave')}: ${leave}`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows}>
          <CartesianGrid stroke="var(--color-border)" vertical={false} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
          <Tooltip />
          <Bar
            dataKey="total"
            name={t('Attendance records')}
            fill="var(--color-brand)"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
