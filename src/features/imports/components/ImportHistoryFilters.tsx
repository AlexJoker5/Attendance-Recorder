import { Select } from '@/components/ui/Select';
import { useTranslation } from 'react-i18next';
import type { ImportsModel } from '../hooks/useImportHistory';

export type ImportHistoryFiltersProps = Pick<ImportsModel, 'filter' | 'setFilter'>;
export function ImportHistoryFilters({ filter, setFilter }: ImportHistoryFiltersProps) {
  const { t } = useTranslation();
  return (
    <div className="filter-bar">
      <Select
        aria-label={t('Import status')}
        value={filter}
        onValueChange={(value) => setFilter(value)}
        options={[
          { value: 'all', label: t('All imports') },
          { value: 'applied', label: t('Applied') },
          { value: 'undone', label: t('Undone') },
        ]}
      />
    </div>
  );
}
