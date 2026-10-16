import { lazy, Suspense } from 'react';
import { useLocation } from 'react-router';
import { ConnectionBoundary } from '@/features/connection/components/ConnectionBoundary';
import { initializeSupabaseTransport } from '@/lib/supabase';
import { App } from './App';
import { AppProviders } from './providers';

const PublicPortal = lazy(() => import('@/features/sharing/pages/PublicPortal'));

export function AppEntry() {
  const { pathname } = useLocation();
  if (pathname === '/shared' || pathname.startsWith('/shared/')) {
    return (
      <ConnectionBoundary key="public" initialize={initializeSupabaseTransport}>
        <Suspense
          fallback={
            <p className="p-8" role="status">
              Loading shared class…
            </p>
          }
        >
          <PublicPortal />
        </Suspense>
      </ConnectionBoundary>
    );
  }
  return (
    <ConnectionBoundary key="admin">
      <AppProviders>
        <App />
      </AppProviders>
    </ConnectionBoundary>
  );
}
