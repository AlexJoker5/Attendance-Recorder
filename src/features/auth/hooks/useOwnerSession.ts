import { useWorkspace } from '@/app/hooks/useWorkspace';
import { STORAGE_KEYS } from '@/app/const/storageKeys';
import { queryClient } from '@/lib/queryClient';
import { localMode, supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export function useOwnerSession() {
  const { notify } = useWorkspace();
  const [signedIn, setSignedIn] = useState(
    localMode && sessionStorage.getItem(STORAGE_KEYS.localSession) === 'yes',
  );
  const [loading, setLoading] = useState(!localMode && !!supabase);
  useEffect(() => {
    if (localMode || !supabase) return;
    const client = supabase;
    let disposed = false;
    let latestCheck = 0;
    async function check() {
      const sequence = ++latestCheck;
      try {
        const { data, error } = await client.auth.getSession();
        if (error) throw error;
        const access = data.session ? await client.rpc('is_attendance_admin') : null;
        if (disposed || sequence !== latestCheck) return;
        const allowed = access?.data === true && !access.error;
        setSignedIn(allowed);
        if (!allowed) queryClient.clear();
      } catch {
        if (!disposed && sequence === latestCheck) {
          setSignedIn(false);
          queryClient.clear();
        }
      } finally {
        if (!disposed && sequence === latestCheck) setLoading(false);
      }
    }
    void check();
    const { data: listener } = client.auth.onAuthStateChange(() => {
      window.setTimeout(() => {
        if (!disposed) void check();
      }, 0);
    });
    return () => {
      disposed = true;
      listener.subscription.unsubscribe();
    };
  }, []);
  async function signOut() {
    if (localMode) sessionStorage.removeItem(STORAGE_KEYS.localSession);
    else {
      const result = await supabase?.auth.signOut();
      if (result?.error) {
        notify('Could not sign out. Please try again.');
        return;
      }
    }
    setSignedIn(false);
    queryClient.clear();
  }
  return { signedIn, loading, signOut, onLogin: () => setSignedIn(true) };
}
