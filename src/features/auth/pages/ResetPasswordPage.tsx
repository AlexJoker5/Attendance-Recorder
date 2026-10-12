import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { Panel } from '@/components/ui/Panel';
import { RecordForm } from '@/components/ui/RecordForm';
import { supabase } from '@/lib/supabase';
import { Check, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { resetPasswordSchema, type ResetPasswordValues } from '../schemas/loginSchema';

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (values: ResetPasswordValues) => {
    if (!supabase) {
      setError('Supabase configuration is missing.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: values.password,
      });
      if (updateError) throw updateError;
      setSuccess(true);
      window.setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-shell max-w-md mx-auto">
        <header className="actions justify-center mb-8">
          <div className="brand">
            <span className="brandmark">
              <Check />
            </span>
            Attendance Admin
          </div>
        </header>

        <Panel title={t('Choose a new password')}>
          {success ? (
            <div className="grid gap-4 py-4 text-center">
              <div className="flex justify-center text-success">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-lg font-semibold">{t('Password updated!')}</h2>
              <p className="muted">
                {t('Your password has been changed successfully. Redirecting to workspace…')}
              </p>
              <Button variant="primary" onClick={() => (window.location.href = '/')}>
                {t('Go to workspace')}
              </Button>
            </div>
          ) : (
            <>
              <p className="muted mb-4">
                {t('Enter your new password below (at least 6 characters).')}
              </p>
              <RecordForm
                key="reset-password"
                schema={resetPasswordSchema}
                defaults={{ password: '', confirmPassword: '' }}
                fields={[
                  {
                    name: 'password',
                    label: 'New password',
                    type: show ? 'text' : 'password',
                  },
                  {
                    name: 'confirmPassword',
                    label: 'Confirm new password',
                    type: show ? 'text' : 'password',
                  },
                ]}
                onSave={handleResetPassword}
                label={loading ? 'Updating…' : 'Save new password'}
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
  );
}
