import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { ErrorState } from '@/components/ui/ErrorState';
import { Input } from '@/components/ui/Input';
import { localMode } from '@/lib/supabase';
import { useClassShare } from '../hooks/useClassShare';
import { shareUrl } from '../lib/shareLinks';

export function ClassShareDialog({ classId, onClose }: { classId: string; onClose: () => void }) {
  const { t } = useTranslation();
  const model = useClassShare(classId);
  const [notice, setNotice] = useState('');
  const { query, mutation, confirmation, busy } = model;
  const url = query.data?.token ? shareUrl(query.data.token) : '';
  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setNotice('Link copied.');
    } catch {
      setNotice('Copy was unavailable. Select the link and copy it manually.');
    }
  }
  return (
    <Dialog title={t('Share class')} onClose={onClose} isFooter={false} busy={busy}>
      <div className="space-y-6">
        <div className="space-y-3">
          <p>
            {t(
              'Anyone with this link can view all students, finalized sessions, attendance, and remarks for this class.',
            )}
          </p>
          <p className="muted">
            {t(
              'Emails, phone numbers, private notes, Zoom reports, and audit history are hidden. The shared page is read-only.',
            )}
          </p>
        </div>
        {localMode && (
          <p className="callout">
            {t(
              'Local preview links work only in this browser. Use Supabase mode on your hosted app to share with students.',
            )}
          </p>
        )}
        {query.isPending && <p role="status">{t('Loading sharing settings…')}</p>}
        {query.isError && (
          <div className="space-y-3">
            <ErrorState>{t(query.error.message)}</ErrorState>
            <Button onClick={() => void query.refetch()}>{t('Refresh sharing settings')}</Button>
          </div>
        )}
        {query.isSuccess && (
          <>
            {url ? (
              <div className="space-y-3">
                <label className="block" htmlFor="class-share-link">
                  {t('Public class link')}
                </label>
                <Input
                  id="class-share-link"
                  readOnly
                  value={url}
                  onFocus={(event) => event.target.select()}
                />
                <div className="actions">
                  <Button variant="primary" onClick={() => void copy()} disabled={busy}>
                    {t('Copy link')}
                  </Button>
                  <a className="button" href={url} target="_blank" rel="noopener noreferrer">
                    {t('Open shared page')}
                  </a>
                  <Button
                    onClick={() => {
                      setNotice('');
                      model.setConfirmation('replace');
                    }}
                    disabled={busy || query.isFetching}
                  >
                    {t('Replace link')}
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setNotice('');
                      model.setConfirmation('revoke');
                    }}
                    disabled={busy || query.isFetching}
                  >
                    {t('Revoke link')}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p>{t('This class does not have an active public link.')}</p>
                <Button
                  variant="primary"
                  disabled={busy || query.isFetching}
                  onClick={() => {
                    setNotice('');
                    void model.change('create');
                  }}
                >
                  {t(busy ? 'Creating…' : 'Create link')}
                </Button>
              </div>
            )}
            {confirmation && (
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-canvas)] p-5 space-y-4">
                <h3>{t(confirmation === 'revoke' ? 'Revoke this link?' : 'Replace this link?')}</h3>
                <p>
                  {t(
                    confirmation === 'revoke'
                      ? 'The current link will stop working. You can create a new link later.'
                      : 'The current link will stop working. Share the new link with your students.',
                  )}
                </p>
                <p className="muted">
                  {t('Information already viewed or copied cannot be recalled.')}
                </p>
                <div className="actions">
                  <Button disabled={busy} onClick={() => model.setConfirmation(null)}>
                    {t('Cancel')}
                  </Button>
                  <Button
                    variant="danger"
                    disabled={busy || query.isFetching}
                    onClick={() => void model.change(confirmation)}
                  >
                    {t(
                      busy
                        ? 'Updating…'
                        : confirmation === 'revoke'
                          ? 'Revoke link'
                          : 'Replace link',
                    )}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
        {mutation.isError && <ErrorState>{t(mutation.error.message)}</ErrorState>}
        {notice && <p role="status">{t(notice)}</p>}
      </div>
    </Dialog>
  );
}
