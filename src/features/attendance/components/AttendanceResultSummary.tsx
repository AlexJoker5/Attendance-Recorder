import { Badge } from '@/components/ui/Badge';
import { useTranslation } from 'react-i18next';
export function AttendanceResultSummary({ label, reasons }: { label: string; reasons: string[] }) {
  const { t } = useTranslation();
  return (
    <>
      <Badge tone={label === 'Failed' ? 'danger' : label === 'At risk' ? 'warning' : 'neutral'}>
        {t(label)}
      </Badge>
      <small>{reasons.map((reason) => t(reason)).join(' · ')}</small>
    </>
  );
}
