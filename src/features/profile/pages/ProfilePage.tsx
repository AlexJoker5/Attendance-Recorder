import { useWorkspace } from '@/app/hooks/useWorkspace';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { PageHeading } from '@/components/ui/PageHeading';
import { Panel } from '@/components/ui/Panel';
import { RecordForm } from '@/components/ui/RecordForm';
import { useTutorial } from '@/features/tutorial/context/TutorialContext';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { CheckCircle2, Compass, KeyRound, Mail, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  updateEmailSchema,
  updateNameSchema,
  updatePasswordSchema,
  type UpdateEmailValues,
  type UpdateNameValues,
  type UpdatePasswordValues,
} from '../schemas/profileSchema';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { notify } = useWorkspace();
  const { startTour } = useTutorial();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Name state
  const [nameError, setNameError] = useState('');
  const [nameSuccess, setNameSuccess] = useState('');

  // Email state
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');

  // Password state
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    async function loadUser() {
      if (!supabase) return;
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        setUser(data.user);
      } catch {
        // user fetch failed
      } finally {
        setLoading(false);
      }
    }
    void loadUser();
  }, []);

  const handleUpdateName = async (values: UpdateNameValues) => {
    if (!supabase) return;
    setNameError('');
    setNameSuccess('');
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          full_name: values.fullName,
          name: values.fullName,
        },
      });
      if (error) throw error;
      if (data.user) setUser(data.user);
      setNameSuccess(t('Name updated successfully.'));
      notify(t('Name updated successfully.'));
    } catch (reason) {
      setNameError(reason instanceof Error ? reason.message : t('Could not update name.'));
    }
  };

  const handleUpdateEmail = async (values: UpdateEmailValues) => {
    if (!supabase) return;
    setEmailError('');
    setEmailSuccess('');
    try {
      const { data, error } = await supabase.auth.updateUser({
        email: values.email,
      });
      if (error) throw error;
      if (data.user) setUser(data.user);
      setEmailSuccess(
        t('Confirmation email sent! Check your new inbox to confirm the change.'),
      );
      notify(t('Confirmation email sent!'));
    } catch (reason) {
      setEmailError(reason instanceof Error ? reason.message : t('Could not update email.'));
    }
  };

  const handleUpdatePassword = async (values: UpdatePasswordValues) => {
    if (!supabase) return;
    setPasswordError('');
    setPasswordSuccess('');
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });
      if (error) throw error;
      setPasswordSuccess(t('Password updated successfully.'));
      notify(t('Password updated successfully.'));
    } catch (reason) {
      setPasswordError(reason instanceof Error ? reason.message : t('Could not update password.'));
    }
  };

  if (loading) return <div className="empty">{t('Loading…')}</div>;

  const displayName =
    (user?.user_metadata?.full_name as string) ||
    (user?.user_metadata?.name as string) ||
    user?.email?.split('@')[0] ||
    'User';
  const provider = user?.app_metadata?.provider || 'email';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="grid gap-6 max-w-4xl">
      <PageHeading title={t('User profile')} />

      {/* User Information Summary Card */}
      <Panel>
        <div className="flex flex-wrap items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-brand/10 text-brand flex items-center justify-center text-2xl font-bold border border-brand/20">
            {initial}
          </div>
          <div className="grid gap-1 min-w-0 flex-1">
            <h2 className="text-xl font-bold truncate">{displayName}</h2>
            <p className="text-muted text-sm truncate flex items-center gap-1.5">
              <Mail size={15} />
              {user?.email}
            </p>
          </div>
          <div className="actions">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-surface-muted border text-muted uppercase tracking-wider">
              <Shield size={13} />
              {provider === 'google' ? 'Google Account' : 'Email & Password'}
            </span>
          </div>
        </div>
      </Panel>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Update Full Name */}
        <Panel title={t('Personal details')}>
          <div className="grid gap-4">
            <p className="text-sm text-muted">
              {t('Change your display name as shown in the workspace.')}
            </p>
            {nameSuccess && (
              <p className="callout success flex items-center gap-2">
                <CheckCircle2 size={16} />
                {nameSuccess}
              </p>
            )}
            <RecordForm
              key={`name-${user?.id}`}
              schema={updateNameSchema}
              defaults={{ fullName: displayName }}
              fields={[{ name: 'fullName', label: 'Display Name', type: 'text' }]}
              onSave={handleUpdateName}
              label={t('Save name')}
            >
              {nameError && <ErrorState>{nameError}</ErrorState>}
            </RecordForm>
          </div>
        </Panel>

        {/* Change Email Address */}
        <Panel title={t('Email address')}>
          <div className="grid gap-4">
            <p className="text-sm text-muted">
              {t('Updating your email sends a confirmation link to your new address.')}
            </p>
            {emailSuccess && (
              <p className="callout success flex items-center gap-2">
                <CheckCircle2 size={16} />
                {emailSuccess}
              </p>
            )}
            <RecordForm
              key={`email-${user?.email}`}
              schema={updateEmailSchema}
              defaults={{ email: user?.email || '' }}
              fields={[{ name: 'email', label: 'New Email Address', type: 'email' }]}
              onSave={handleUpdateEmail}
              label={t('Update email')}
            >
              {emailError && <ErrorState>{emailError}</ErrorState>}
            </RecordForm>
          </div>
        </Panel>
      </div>

      {/* Change Password Card */}
      <Panel title={t('Security & Password')}>
        <div className="grid gap-4 max-w-lg">
          <div className="flex items-center gap-2 text-sm text-muted">
            <KeyRound size={16} />
            <p>{t('Choose a strong password with at least 6 characters.')}</p>
          </div>
          {passwordSuccess && (
            <p className="callout success flex items-center gap-2">
              <CheckCircle2 size={16} />
              {passwordSuccess}
            </p>
          )}
          <RecordForm
            key="password-change"
            schema={updatePasswordSchema}
            defaults={{ password: '', confirmPassword: '' }}
            fields={[
              {
                name: 'password',
                label: 'New password',
                type: showPassword ? 'text' : 'password',
              },
              {
                name: 'confirmPassword',
                label: 'Confirm new password',
                type: showPassword ? 'text' : 'password',
              },
            ]}
            onSave={handleUpdatePassword}
            label={t('Change password')}
          >
            <label className="actions text-sm">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              {t('Show password')}
            </label>
            {passwordError && <ErrorState>{passwordError}</ErrorState>}
          </RecordForm>
        </div>
      </Panel>

      {/* Help & Tutorials */}
      <Panel title={t('Help & Tutorials')}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="grid gap-1">
            <h3 className="text-base font-bold">{t('Interactive Guided Tour')}</h3>
            <p className="text-sm text-muted">
              {t('Replay the step-by-step game quest guide to review key features and shortcuts.')}
            </p>
          </div>
          <Button variant="primary" onClick={startTour} className="shrink-0 self-start sm:self-center">
            <Compass size={16} />
            {t('Replay Tutorial Tour')}
          </Button>
        </div>
      </Panel>
    </div>
  );
}
