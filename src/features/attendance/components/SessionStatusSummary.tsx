import { Badge } from '@/components/ui/Badge';
import { useTranslation } from 'react-i18next';
import type { SessionModel } from '../hooks/useSessionAttendance';

export type SessionStatusSummaryProps = Pick<SessionModel, 'session' | 'formState'>;
export function SessionStatusSummary({ session, formState }: SessionStatusSummaryProps) {
  const { t } = useTranslation();
  return (
    <div className="actions mb-6">
      <Badge tone={session.finalized ? 'success' : 'warning'}>
        {t(session.finalized ? 'Finalized' : 'Draft')}
      </Badge>
      {session.extra && <Badge tone="warning">{t('Extra — excluded')}</Badge>}
      {session.removed && <Badge>{t('Removed')}</Badge>}
      {formState.isDirty && <Badge tone="warning">{t('Unsaved changes')}</Badge>}
    </div>
  );
}
