import type { ReactNode } from 'react';
import { LockKeyhole } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { Badge } from '@/components/ui/Badge';
import { localMode } from '@/lib/supabase';
import { usePublicMetadata } from '../hooks/usePublicMetadata';

export function PublicLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  usePublicMetadata();
  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--color-border)] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-bold">Attendance Admin</span>
            <Badge>
              <LockKeyhole size={13} className="mr-1 inline" />
              {t('Read-only')}
            </Badge>
          </div>
          <LanguageSwitcher />
        </div>
      </header>
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-8">
        {localMode && (
          <p className="callout">{t('Local preview · This link works only in this browser.')}</p>
        )}
        {children}
      </main>
    </div>
  );
}
