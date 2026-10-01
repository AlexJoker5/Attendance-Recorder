import { useAppData } from '@/app/hooks/useAppData';
import { useWorkspace } from '@/app/hooks/useWorkspace';
import { selectedSemester } from '@/app/lib/workspaceSelectors';
import { localMode } from '@/lib/supabase';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { AppFooter } from './AppFooter';
import { WorkspaceLoadError } from './WorkspaceLoadError';
import { WorkspaceWelcome } from './WorkspaceWelcome';

export function MainLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const { data, error, refetch, isFetching } = useAppData();
  const { semesterId } = useWorkspace();
  const { pathname } = useLocation();
  const semester = data && selectedSemester(data, semesterId);
  return (
    <main id="main" tabIndex={-1} className="main">
      {localMode && (
        <div className="mode-banner">
          {t('Local preview')} ·{' '}
          {t('Sample data is stored in this browser. Supabase is not connected.')}
        </div>
      )}
      {error ? (
        <WorkspaceLoadError
          message={error.message}
          retry={() => void refetch()}
          busy={isFetching}
        />
      ) : !data ? (
        <p>{t('Loading…')}</p>
      ) : !data.semesters.length && pathname !== '/semesters' ? (
        <WorkspaceWelcome />
      ) : (
        <>
          {semester?.archived && (
            <p className="callout warning mb-6">
              {t('Archived semester — restore it before editing attendance or enrollments.')}
            </p>
          )}
          {children}
        </>
      )}
      <AppFooter />
    </main>
  );
}
