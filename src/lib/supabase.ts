import type { Database } from '@/app/types/databaseTypes';
import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from './supabaseConfig';

const config = supabaseConfig(
  (import.meta.env.SUPABASE_URL ?? '').trim(),
  (import.meta.env.SUPABASE_PROXY_URL ?? '').trim(),
  (import.meta.env.SUPABASE_PUBLISHABLE_KEY ?? '').trim(),
  import.meta.env.DEV,
);
export const localMode = import.meta.env.DEV && import.meta.env.DATA_MODE !== 'supabase';
export const supabaseConfigurationError = config.error;
export const supabase =
  config.url && config.key
    ? createClient<Database>(config.url, config.key, { auth: { storageKey: config.storageKey } })
    : null;
