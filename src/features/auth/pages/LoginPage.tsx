import { STORAGE_KEYS } from '@/app/const/storageKeys';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { Panel } from '@/components/ui/Panel';
import { RecordForm } from '@/components/ui/RecordForm';
import { localMode, supabase, supabaseConfigurationError } from '@/lib/supabase';
import { Check, Languages } from 'lucide-react';
import { useLogin } from '../hooks/useLogin';
import { forgotPasswordSchema, loginSchema, signUpSchema } from '../schemas/loginSchema';
export default function LoginPage(props: Parameters<typeof useLogin>[0]) {
  const model = useLogin(props);
  if (!model) return null;
  const {
    i18n,
    t,
    onLogin,
    mode,
    setMode,
    show,
    signIn,
    signUp,
    forgotPassword,
    signInWithGoogle,
    googleLoading,
    setShow,
    error,
    setError,
    success,
    setSuccess,
  } = model;
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
          <Panel
            title={
              mode === 'signup'
                ? t('Create an account')
                : mode === 'forgot'
                  ? t('Reset your password')
                  : t('Sign in to your workspace')
            }
          >
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
            ) : mode === 'forgot' ? (
              <>
                <p className="muted mb-4">
                  {t('Enter your email address and we will send you a link to reset your password.')}
                </p>
                {success && <p className="callout success">{success}</p>}
                <RecordForm
                  key="forgot"
                  schema={forgotPasswordSchema}
                  defaults={{ email: '' }}
                  fields={[{ name: 'email', label: 'Email address', type: 'email' }]}
                  onSave={forgotPassword}
                  label="Send reset link"
                >
                  {error && <ErrorState>{error}</ErrorState>}
                </RecordForm>
                <div className="auth-mode-switch">
                  <button
                    type="button"
                    className="link-button"
                    onClick={() => {
                      setMode('signin');
                      setError('');
                      setSuccess('');
                    }}
                  >
                    ← {t('Back to sign in')}
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="google-sign-in-button"
                  disabled={googleLoading}
                  onClick={signInWithGoogle}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  {t(googleLoading ? 'Redirecting…' : 'Sign in with Google')}
                </button>
                <div className="login-divider">
                  <span>{t('or')}</span>
                </div>
                {success && <p className="callout success">{success}</p>}
                {mode === 'signup' ? (
                  <RecordForm
                    key="signup"
                    schema={signUpSchema}
                    defaults={{ email: '', password: '' }}
                    fields={[
                      { name: 'email', label: 'Email address', type: 'email' },
                      {
                        name: 'password',
                        label: 'Password (at least 6 characters)',
                        type: show ? 'text' : 'password',
                      },
                    ]}
                    onSave={signUp}
                    label="Create account"
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
                ) : (
                  <RecordForm
                    key="signin"
                    schema={loginSchema}
                    defaults={{ email: '', password: '' }}
                    fields={[
                      { name: 'email', label: 'Email address', type: 'email' },
                      { name: 'password', label: 'Password', type: show ? 'text' : 'password' },
                    ]}
                    onSave={signIn}
                    label="Sign in"
                  >
                    <div className="actions justify-between text-sm">
                      <label className="actions">
                        <input
                          type="checkbox"
                          checked={show}
                          onChange={(event) => setShow(event.target.checked)}
                        />
                        {t('Show password')}
                      </label>
                      <button
                        type="button"
                        className="link-button"
                        onClick={() => {
                          setMode('forgot');
                          setError('');
                          setSuccess('');
                        }}
                      >
                        {t('Forgot password?')}
                      </button>
                    </div>
                    {error && <ErrorState>{error}</ErrorState>}
                  </RecordForm>
                )}
                <div className="auth-mode-switch">
                  {mode === 'signin' ? (
                    <span>
                      {t("Don't have an account?")}{' '}
                      <button
                        type="button"
                        className="link-button"
                        onClick={() => {
                          setMode('signup');
                          setError('');
                          setSuccess('');
                        }}
                      >
                        {t('Sign up')}
                      </button>
                    </span>
                  ) : (
                    <span>
                      {t('Already have an account?')}{' '}
                      <button
                        type="button"
                        className="link-button"
                        onClick={() => {
                          setMode('signin');
                          setError('');
                          setSuccess('');
                        }}
                      >
                        {t('Sign in')}
                      </button>
                    </span>
                  )}
                </div>
              </>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
