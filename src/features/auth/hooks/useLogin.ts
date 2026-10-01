import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { LoginValues } from '../schemas/loginSchema';

export function useLogin({ onLogin }: { onLogin: () => void }) {
  const { t, i18n } = useTranslation();
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
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
    try {
      await login(values);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Sign in failed.');
    }
  };

  return { i18n, t, onLogin, show, signIn, setShow, error };
}
export type LoginModel = NonNullable<ReturnType<typeof useLogin>>;
