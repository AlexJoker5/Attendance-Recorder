import { APP_NAME } from '@/app/const/appConfig';
import { localMode } from '@/lib/supabase';
import { cn } from '@/lib/cn';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router';
import { NAVIGATION_ITEMS } from './const/navigationItems';
export function SidebarLayout({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="menu-backdrop"
          aria-label={t('Close navigation')}
          onClick={onClose}
        />
      )}
      <aside id="workspace-navigation" className={cn('sidebar', isOpen && 'open')}>
        <Link to="/" className="brand">
          <span className="brandmark">
            <Check size={20} />
          </span>
          {APP_NAME}
        </Link>
        <p className="nav-caption">{t('WORKSPACE')}</p>
        <nav aria-label={t('Main navigation')}>
          {NAVIGATION_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={onClose}
              className={({ isActive }) => cn('nav-item', isActive && 'active')}
            >
              <item.icon size={19} />
              {t(item.label)}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <strong>{t('Administrator')}</strong>
          <p className="muted">{t(localMode ? 'Local preview' : 'Private workspace')}</p>
        </div>
      </aside>
    </>
  );
}
