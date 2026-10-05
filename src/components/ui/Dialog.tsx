import { X } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';

export function Dialog({
  title,
  children,
  onClose,
  isFooter = true,
  busy = false,
  footer,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  isFooter?: boolean;
  busy?: boolean;
  footer?: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const { t } = useTranslation();
  useEffect(() => {
    const dialog = ref.current;
    const prior = document.activeElement;
    dialog?.showModal();
    dialog
      ?.querySelector<HTMLElement>('input:not([type="checkbox"]), [role="combobox"], textarea')
      ?.focus();
    return () => {
      dialog?.close();
      if (prior instanceof HTMLElement) prior.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-label={title}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
    >
      <header className="dialog-header">
        <h2>{title}</h2>
        <Button aria-label={t('Close')} onClick={onClose} disabled={busy}>
          <X size={18} />
        </Button>
      </header>
      <div className="dialog-body">{children}</div>
      {isFooter && (
        <footer className="dialog-footer">
          <Button onClick={onClose} disabled={busy}>
            {t('Cancel')}
          </Button>
          {footer}
        </footer>
      )}
    </dialog>
  );
}
