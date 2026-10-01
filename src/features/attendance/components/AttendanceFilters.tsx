import { Select } from '@/components/ui/Select';
import { useTranslation } from 'react-i18next';
import { ATTENDANCE_SOURCE_FILTERS } from '../const/attendanceSources';
import { ATTENDANCE_STATUS_FILTERS } from '../const/attendanceStatus';
import type { SessionModel } from '../hooks/useSessionAttendance';

export type AttendanceFiltersProps = Pick<
  SessionModel,
  'filter' | 'setFilter' | 'source' | 'setSource'
>;
export function AttendanceFilters({
  filter,
  setFilter,
  source,
  setSource,
}: AttendanceFiltersProps) {
  const { t } = useTranslation();
  return (
    <div className="filter-bar">
      <Select
        aria-label={t('Filter by status')}
        value={filter}
        onValueChange={(value) => setFilter(value)}
        options={ATTENDANCE_STATUS_FILTERS.map((value) => ({
          value: value,
          label: t(value === 'all' ? 'All statuses' : value),
        }))}
      />
      <Select
        aria-label={t('Filter by source')}
        value={source}
        onValueChange={(value) => setSource(value)}
        options={ATTENDANCE_SOURCE_FILTERS.map((value) => ({
          value: value,
          label: t(value === 'all' ? 'All sources' : value),
        }))}
      />
    </div>
  );
}
