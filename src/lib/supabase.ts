import type { Database } from '@/app/types/databaseTypes';
import { createConnectionRouter } from '@/features/connection/lib/createConnectionRouter';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { supabaseConfig } from './supabaseConfig';

const config = supabaseConfig(
  (import.meta.env.VITE_SUPABASE_URL ?? '').trim(),
  (import.meta.env.VITE_SUPABASE_PROXY_URL ?? '').trim(),
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '').trim(),
  import.meta.env.DEV,
);
export const localMode = import.meta.env.DEV && import.meta.env.VITE_DATA_MODE !== 'supabase';
export const supabaseConfigurationError = config.error;
export const connectionRouter =
  !localMode && config.url && config.proxy && config.key
    ? createConnectionRouter({
        original: config.url,
        proxy: config.proxy,
        key: config.key,
        development: import.meta.env.DEV,
      })
    : null;

export let supabase: SupabaseClient<Database> | null = null;
let initialization: Promise<void> | null = null;

export function initializeSupabaseConnection() {
  if (!connectionRouter) return Promise.resolve();
  if (initialization) return initialization;
  initialization = connectionRouter
    .initialize()
    .then(() => {
      if (supabase || !config.url || !config.key) return;
      // Delay SDK construction so session refresh cannot contact the direct API first.
      supabase = createClient<Database>(config.url, config.key, {
        auth: { storageKey: config.storageKey },
        global: { fetch: connectionRouter.fetch },
      });
    })
    .finally(() => {
      initialization = null;
    });
  return initialization;
}
