import { APP_NAME, APP_TIME_ZONE } from '@/app/const/appConfig';
import { localMode } from '@/lib/supabase';
import { useTranslation } from 'react-i18next';
export function AppFooter() {
  const { t } = useTranslation();
  return (
    <footer className="app-footer">
      {APP_NAME} · {t(localMode ? 'Local preview' : 'Private workspace')} · {APP_TIME_ZONE}
    </footer>
  );
}
