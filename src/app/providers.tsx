import { NOTICE_DURATION_MS, STORAGE_KEYS } from '@/app/const/storageKeys';
import { queryClient } from '@/lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { WorkspaceContext } from './workspaceContext';

export function AppProviders({ children }: { children: ReactNode }) {
  const [semesterId, setId] = useState(
    localStorage.getItem(STORAGE_KEYS.semester) || 'semester-example',
  );
  const [notice, setNotice] = useState('');
  function setSemesterId(id: string) {
    localStorage.setItem(STORAGE_KEYS.semester, id);
    setId(id);
  }
  function notify(message: string) {
    setNotice(message);
    window.setTimeout(
      () => setNotice((current) => (current === message ? '' : current)),
      NOTICE_DURATION_MS,
    );
  }
  return (
    <QueryClientProvider client={queryClient}>
      <WorkspaceContext.Provider value={{ semesterId, setSemesterId, notify }}>
        {children}
        {notice && (
          <div className="toast" role="status">
            {notice}
          </div>
        )}
      </WorkspaceContext.Provider>
    </QueryClientProvider>
  );
}
