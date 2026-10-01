import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { useTranslation } from 'react-i18next';

export function WorkspaceLoadError({
  message,
  retry,
  busy,
}: {
  message: string;
  retry: () => void;
  busy: boolean;
}) {
  const { t } = useTranslation();
  return (
    <div className="form-stack">
      <ErrorState>{message}</ErrorState>
      <div className="actions">
        <Button disabled={busy} onClick={retry}>
          {t('Retry')}
        </Button>
      </div>
    </div>
  );
}
