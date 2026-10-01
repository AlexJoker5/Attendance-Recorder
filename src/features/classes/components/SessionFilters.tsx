import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useTranslation } from 'react-i18next';
import { SESSION_STATE_FILTERS, SESSION_TYPE_FILTERS } from '../const/scheduleDefaults';
import type { ClassDetailsModel } from '../hooks/useClassDetails';

export type SessionFiltersProps = Pick<
  ClassDetailsModel,
  'state' | 'setState' | 'type' | 'setType' | 'from' | 'setFrom' | 'to' | 'setTo'
>;
export function SessionFilters({
  state,
  setState,
  type,
  setType,
  from,
  setFrom,
  to,
  setTo,
}: SessionFiltersProps) {
  const { t } = useTranslation();
  return (
    <div className="filter-bar">
      <Select
        aria-label={t('Review status')}
        value={state}
        onValueChange={(value) => setState(value)}
        options={SESSION_STATE_FILTERS.map((value) => ({ value: value, label: t(value) }))}
      />
      <Select
        aria-label={t('Session type')}
        value={type}
        onValueChange={(value) => setType(value)}
        options={SESSION_TYPE_FILTERS.map((value) => ({ value: value, label: t(value) }))}
      />
      <Input
        aria-label={t('From date')}
        type="date"
        value={from}
        onChange={(event) => setFrom(event.target.value)}
      />
      <Input
        aria-label={t('To date')}
        type="date"
        value={to}
        onChange={(event) => setTo(event.target.value)}
      />
    </div>
  );
}
