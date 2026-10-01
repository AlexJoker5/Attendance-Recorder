import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { MainLayout } from './MainLayout';
import { NavbarLayout } from './NavbarLayout';
import { SidebarLayout } from './SidebarLayout';
export function AdminLayout({
  children,
  onSignOut,
}: {
  children: ReactNode;
  onSignOut: () => Promise<void>;
}) {
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <>
      <a className="skip-link" href="#main">
        {t('Skip to content')}
      </a>
      <SidebarLayout isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <NavbarLayout
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((current) => !current)}
        onSignOut={onSignOut}
      />
      <MainLayout>{children}</MainLayout>
    </>
  );
}
