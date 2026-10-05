import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Panel } from '@/components/ui/Panel';
import { LoaderCircle, WifiOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ConnectionSnapshot } from '../types/connectionTypes';

export function ConnectionStatus({
  snapshot,
  onRetry,
  overlay = false,
}: {
  snapshot: ConnectionSnapshot;
  onRetry: () => void;
  overlay?: boolean;
}) {
  const { t } = useTranslation();
  const failed = snapshot.phase === 'error';
  const content = (
    <>
      <div className="actions mb-6 justify-between">
        <span className="font-semibold">Attendance Admin</span>
        <LanguageSwitcher />
      </div>
      <div className="grid gap-4" role={failed ? 'alert' : 'status'} aria-live="polite">
        {failed ? (
          <WifiOff className="text-brand" size={28} aria-hidden="true" />
        ) : (
          <LoaderCircle
            className="text-brand animate-spin motion-reduce:animate-none"
            size={28}
            aria-hidden="true"
          />
        )}
        <p>{t(snapshot.message)}</p>
        {failed && (
          <Button variant="primary" onClick={onRetry} autoFocus>
            {t('Retry connection')}
          </Button>
        )}
      </div>
    </>
  );
  if (overlay)
    return (
      <Dialog title={t('Attendance connection')} onClose={() => {}} isFooter={false} busy>
        {content}
      </Dialog>
    );
  return (
    <div className="grid min-h-dvh place-items-center p-6" aria-label={t('Attendance connection')}>
      <Panel className="w-full max-w-md">{content}</Panel>
    </div>
  );
}
