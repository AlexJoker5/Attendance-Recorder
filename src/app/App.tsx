import { AdminLayout } from '@/components/layout/AdminLayout';
import { useOwnerSession } from '@/features/auth/hooks/useOwnerSession';
import LoginPage from '@/features/auth/pages/LoginPage';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, Route, Routes } from 'react-router';
import { appRoutes } from './router';

export function App() {
  const { t } = useTranslation();
  const { signedIn, loading, signOut, onLogin } = useOwnerSession();
  if (loading) return <div className="empty">{t('Loading…')}</div>;
  if (!signedIn) return <LoginPage onLogin={onLogin} />;
  return (
    <AdminLayout onSignOut={signOut}>
      <Suspense fallback={<div className="empty">{t('Loading…')}</div>}>
        <Routes>
          {appRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={<route.component />} />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AdminLayout>
  );
}
