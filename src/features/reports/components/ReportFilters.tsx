import { Select } from '@/components/ui/Select';
import { useTranslation } from 'react-i18next';
import { RESULT_FILTERS } from '../const/resultStatus';
import type { ReportsModel } from '../hooks/useAttendanceReports';

export type ReportFiltersProps = Pick<
  ReportsModel,
  'group' | 'setGroup' | 'setClass' | 'groups' | 'cls' | 'classes' | 'result' | 'setResult'
>;
export function ReportFilters({
  group,
  setGroup,
  setClass,
  groups,
  cls,
  classes,
  result,
  setResult,
}: ReportFiltersProps) {
  const { t } = useTranslation();
  return (
    <div className="filter-bar">
      <Select
        aria-label={t('Filter by group')}
        value={group}
        onValueChange={(value) => {
          setGroup(value);
          setClass('all');
        }}
        options={[
          { value: 'all', label: t('All groups') },
          ...groups.map((item) => ({ value: item.id, label: item.name })),
        ]}
      />
      <Select
        aria-label={t('Filter by class')}
        value={cls}
        onValueChange={(value) => setClass(value)}
        options={[
          { value: 'all', label: t('All classes') },
          ...classes
            .filter((item) => group === 'all' || item.groupId === group)
            .map((item) => ({ value: item.id, label: item.name })),
        ]}
      />
      <Select
        aria-label={t('Filter by result')}
        value={result}
        onValueChange={(value) => setResult(value)}
        options={RESULT_FILTERS.map((value) => ({
          value: value,
          label: t(value === 'all' ? 'All results' : value),
        }))}
      />
    </div>
  );
}
