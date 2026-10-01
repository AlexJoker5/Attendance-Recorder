import { Select } from '@/components/ui/Select';
import { useTranslation } from 'react-i18next';
import { STUDENT_STATUS_FILTERS } from '../const/enrollmentStatus';
import type { StudentsModel } from '../hooks/useStudentsPage';

export type StudentFiltersProps = Pick<
  StudentsModel,
  'group' | 'setGroup' | 'data' | 'semester' | 'status' | 'setStatus'
>;
export function StudentFilters({
  group,
  setGroup,
  data,
  semester,
  status,
  setStatus,
}: StudentFiltersProps) {
  const { t } = useTranslation();
  return (
    <div className="filter-bar">
      <Select
        aria-label={t('Filter by group')}
        value={group}
        onValueChange={(value) => setGroup(value)}
        options={[
          { value: 'all', label: t('All groups') },
          { value: 'unenrolled', label: t('Not enrolled') },
          ...data.groups
            .filter((item) => item.semesterId === semester.id)
            .map((item) => ({ value: item.id, label: item.name })),
        ]}
      />
      <Select
        aria-label={t('Filter by status')}
        value={status}
        onValueChange={(value) => setStatus(value)}
        options={STUDENT_STATUS_FILTERS.map((item) => ({
          value: item,
          label: t(item === 'all' ? 'All statuses' : item),
        }))}
      />
    </div>
  );
}
