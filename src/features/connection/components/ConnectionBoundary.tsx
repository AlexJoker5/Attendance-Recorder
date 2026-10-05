import { connectionRouter, initializeSupabaseConnection } from '@/lib/supabase';
import { queryClient } from '@/lib/queryClient';
import { useEffect, useState, useSyncExternalStore, type ReactNode } from 'react';
import type { ConnectionSnapshot } from '../types/connectionTypes';
import { ConnectionStatus } from './ConnectionStatus';

const idleSnapshot: ConnectionSnapshot = { phase: 'ready', route: null, message: '' };
const idleSubscribe = () => () => {};
const idleGetSnapshot = () => idleSnapshot;

export function ConnectionBoundary({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(
    connectionRouter?.subscribe ?? idleSubscribe,
    connectionRouter?.getSnapshot ?? idleGetSnapshot,
  );
  const [initialized, setInitialized] = useState(!connectionRouter);

  useEffect(() => {
    let disposed = false;
    void initializeSupabaseConnection()
      .then(() => {
        if (!disposed) setInitialized(true);
      })
      .catch(() => {
        // The router exposes the error through its external store and Retry control.
      });
    return () => {
      disposed = true;
    };
  }, []);

  function retry() {
    void initializeSupabaseConnection()
      .then(() => {
        setInitialized(true);
        // Resume failed reads after recovery. Mutations are never automatically replayed.
        void queryClient.invalidateQueries();
      })
      .catch(() => {});
  }

  if (!initialized) return <ConnectionStatus snapshot={snapshot} onRetry={retry} />;
  const blocked = snapshot.phase !== 'ready';
  return (
    <>
      {/* Keep mounted workflows intact while blocking interaction during reconnection. */}
      <div inert={blocked}>{children}</div>
      {blocked && <ConnectionStatus snapshot={snapshot} onRetry={retry} overlay />}
    </>
  );
}
