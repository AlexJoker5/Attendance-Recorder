import { Button } from '@/components/ui/Button';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { useTutorial } from '@/features/tutorial/context/TutorialContext';
import { Compass, LogOut, Menu, User } from 'lucide-react';
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
  const { startTour } = useTutorial();
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
        <Button
          aria-label={t('Tutorial Guide')}
          title={t('Tutorial Guide')}
          onClick={startTour}
        >
          <Compass size={16} />
          <span className="desktop-label">{t('Tutorial')}</span>
        </Button>
        <ButtonLink to="/profile" aria-label={t('User profile')} data-tour="topbar-profile">
          <User size={16} />
          <span className="desktop-label">{t('Profile')}</span>
        </ButtonLink>
        <Button aria-label={t('Sign out')} onClick={() => void onSignOut()}>
          <LogOut size={16} />
          <span className="desktop-label">{t('Sign out')}</span>
        </Button>
      </div>
    </header>
  );
}
