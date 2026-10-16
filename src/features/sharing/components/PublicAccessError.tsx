import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { PublicShareError } from '../api/sharingErrors';

export function PublicAccessError({ error, onRetry }: { error: Error; onRetry?: () => void }) {
  const { t } = useTranslation();
  const forbidden = error instanceof PublicShareError && error.status === 403;
  return (
    <Panel title={t(forbidden ? 'Forbidden' : 'Unable to load shared class')}>
      <div className="space-y-5" role="alert">
        <p>
          {t(
            forbidden
              ? 'This link is invalid, has been revoked, or does not allow this session. Ask your teacher for the current class link.'
              : error.message,
          )}
        </p>
        {onRetry && <Button onClick={onRetry}>{t('Try again')}</Button>}
      </div>
    </Panel>
  );
}
