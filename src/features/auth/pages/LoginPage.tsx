import { STORAGE_KEYS } from '@/app/const/storageKeys';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { Panel } from '@/components/ui/Panel';
import { RecordForm } from '@/components/ui/RecordForm';
import { localMode, supabase, supabaseConfigurationError } from '@/lib/supabase';
import { Check, Languages } from 'lucide-react';
import { useLogin } from '../hooks/useLogin';
import { loginSchema } from '../schemas/loginSchema';
export default function LoginPage(props: Parameters<typeof useLogin>[0]) {
  const model = useLogin(props);
  if (!model) return null;
  const { i18n, t, onLogin, show, signIn, setShow, error } = model;
  return (
    <div className="login-page">
      <div className="login-shell">
        <header className="actions justify-between mb-8">
          <div className="brand">
            <span className="brandmark">
              <Check />
            </span>
            Attendance Admin
          </div>
          <Button onClick={() => void i18n.changeLanguage(i18n.language === 'en' ? 'my' : 'en')}>
            <Languages size={18} />
            {i18n.language === 'en' ? 'မြန်မာ' : 'English'}
          </Button>
        </header>
        <div className="login-layout">
          <section className="login-story">
            <span className="eyebrow">{t('YOUR TEACHING WORKSPACE')}</span>
            <h1>{t('A clear view of every class.')}</h1>
            <p>
              {t('Manage your groups, plan weekly sessions, and review attendance in one place.')}
            </p>
          </section>
          <Panel title={t('Sign in to your workspace')}>
            {localMode ? (
              <div className="form-stack">
                <p className="callout">
                  {t('Local preview')} ·{' '}
                  {t('Sample data is stored in this browser. Supabase is not connected.')}
                </p>
                <Button
                  variant="primary"
                  onClick={() => {
                    sessionStorage.setItem(STORAGE_KEYS.localSession, 'yes');
                    onLogin();
                  }}
                >
                  {t('Open local preview')}
                </Button>
                <p className="muted">
                  {t(
                    'Use sample data here. Local preview access is available only in development.',
                  )}
                </p>
              </div>
            ) : !supabase ? (
              <p className="callout warning">
                {t(
                  supabaseConfigurationError ||
                    'Setup required. Configure Supabase before signing in. Local preview is disabled in production.',
                )}
              </p>
            ) : (
              <>
                <RecordForm
                  schema={loginSchema}
                  defaults={{ email: '', password: '' }}
                  fields={[
                    { name: 'email', label: 'Email address', type: 'email' },
                    { name: 'password', label: 'Password', type: show ? 'text' : 'password' },
                  ]}
                  onSave={signIn}
                  label="Sign in"
                >
                  <label className="actions">
                    <input
                      type="checkbox"
                      checked={show}
                      onChange={(event) => setShow(event.target.checked)}
                    />
                    {t('Show password')}
                  </label>
                  {error && <ErrorState>{error}</ErrorState>}
                </RecordForm>
              </>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
