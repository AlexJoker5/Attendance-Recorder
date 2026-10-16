import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { PageHeading } from '@/components/ui/PageHeading';
import { readPublicClass } from '../api/sharingRepository';
import { PublicShareError } from '../api/sharingErrors';
import { PublicLayout } from '../components/PublicLayout';
import { PublicAccessError } from '../components/PublicAccessError';
import { parseShareKey, publicClassPath } from '../lib/shareLinks';
import { PublicClassPage } from './PublicClassPage';
import { PublicSessionPage } from './PublicSessionPage';

function SharedPage() {
  const { pathname, hash } = useLocation();
  const { t } = useTranslation();
  const token = parseShareKey(hash);
  const match = /^\/shared(?:\/sessions\/([^/]+))?\/?$/.exec(pathname);
  const sessionId = match?.[1];
  const valid = !!token && !!match;
  const query = useQuery({
    queryKey: ['public-class', token, sessionId ?? null],
    queryFn: ({ signal }) => readPublicClass(token!, sessionId, signal),
    enabled: valid,
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: 'always',
    refetchOnReconnect: 'always',
  });
  if (!valid) return <PublicAccessError error={new PublicShareError(403)} />;
  if (query.isError)
    return <PublicAccessError error={query.error} onRetry={() => void query.refetch()} />;
  if (!query.data || query.isFetching) return <p role="status">{t('Loading shared class…')}</p>;
  const data = query.data;
  const session = sessionId ? data.sessions.find((item) => item.id === sessionId) : null;
  if (sessionId && !session) return <PublicAccessError error={new PublicShareError(403)} />;
  return (
    <>
      {session && (
        <nav aria-label={t('Breadcrumb')}>
          <ButtonLink to={publicClassPath(token)}>{t('Back to class')}</ButtonLink>
        </nav>
      )}
      <PageHeading
        title={data.class.name}
        description={`${data.class.groupName} · ${data.class.semesterName}`}
        actions={
          <Button onClick={() => void query.refetch()} disabled={query.isFetching}>
            {t('Refresh')}
          </Button>
        }
      />
      {session ? (
        <PublicSessionPage data={data} session={session} />
      ) : (
        <PublicClassPage data={data} token={token} />
      )}
    </>
  );
}
export default function PublicPortal() {
  // Public data never enters the signed-in workspace cache or persisted storage.
  const [client] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={client}>
      <PublicLayout>
        <SharedPage />
      </PublicLayout>
    </QueryClientProvider>
  );
}
