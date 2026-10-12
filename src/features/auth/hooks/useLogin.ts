import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ForgotPasswordValues, LoginValues, SignUpValues } from '../schemas/loginSchema';

export function useLogin({ onLogin }: { onLogin: () => void }) {
  const { t, i18n } = useTranslation();
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  async function login(values: LoginValues) {
    if (!supabase) throw new Error('Supabase configuration is missing.');
    const response = await supabase.auth.signInWithPassword(values);
    if (response.error) throw response.error;
    const access = await supabase.rpc('is_attendance_admin');
    if (access.error || access.data !== true) {
      await supabase.auth.signOut();
      throw new Error('This account is not authorized for Attendance Admin.');
    }
    onLogin();
  }

  const signIn = async (values: LoginValues) => {
    setError('');
    setSuccess('');
    try {
      await login(values);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Sign in failed.');
    }
  };

  const signUp = async (values: SignUpValues) => {
    if (!supabase) {
      setError('Supabase configuration is missing.');
      return;
    }
    setError('');
    setSuccess('');
    try {
      const response = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });
      if (response.error) throw response.error;
      if (response.data.session) {
        const access = await supabase.rpc('is_attendance_admin');
        if (access.error || access.data !== true) {
          await supabase.auth.signOut();
          throw new Error('This account is not authorized for Attendance Admin.');
        }
        onLogin();
      } else {
        setSuccess(t('Registration successful! Please check your email to verify your account.'));
        setMode('signin');
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Sign up failed.');
    }
  };

  const forgotPassword = async (values: ForgotPasswordValues) => {
    if (!supabase) {
      setError('Supabase configuration is missing.');
      return;
    }
    setError('');
    setSuccess('');
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      if (resetError) throw resetError;
      setSuccess(
        t('Password reset instructions sent! Please check your email inbox to proceed.'),
      );
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not send reset email.');
    }
  };

  const signInWithGoogle = async () => {
    if (!supabase) {
      setError('Supabase configuration is missing.');
      return;
    }
    setError('');
    setSuccess('');
    setGoogleLoading(true);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (oauthError) throw oauthError;
      // Browser will redirect to Google — loading state stays until navigation.
    } catch (reason) {
      setGoogleLoading(false);
      setError(reason instanceof Error ? reason.message : 'Google sign in failed.');
    }
  };

  return {
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
  };
}
export type LoginModel = NonNullable<ReturnType<typeof useLogin>>;
