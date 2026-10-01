import { Button } from '@/components/ui/Button';
import { LogOut, Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Breadcrumbs } from './Breadcrumbs';
import { LanguageSwitcher } from './LanguageSwitcher';
import { SemesterSelector } from './SemesterSelector';
import { useBreadcrumbs } from './hooks/useBreadcrumbs';
export function NavbarLayout({
  isSidebarOpen,
  onToggleSidebar,
  onSignOut,
}: {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onSignOut: () => Promise<void>;
}) {
  const { t } = useTranslation();
  const crumbs = useBreadcrumbs();
  return (
    <header className="topbar">
      <div className="actions min-w-0">
        <Button
          className="menu-toggle"
          aria-label={t('Toggle navigation')}
          aria-expanded={isSidebarOpen}
          aria-controls="workspace-navigation"
          onClick={onToggleSidebar}
        >
          <Menu size={18} />
        </Button>
        <Breadcrumbs items={crumbs} />
      </div>
      <div className="actions topbar-controls">
        <SemesterSelector />
        <LanguageSwitcher />
        <Button aria-label={t('Sign out')} onClick={() => void onSignOut()}>
          <LogOut size={16} />
          <span className="desktop-label">{t('Sign out')}</span>
        </Button>
      </div>
    </header>
  );
}
