import type { Database } from '@/app/types/databaseTypes';
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const localMode = import.meta.env.DEV && import.meta.env.VITE_DATA_MODE !== 'supabase';
export const supabase = url && key ? createClient<Database>(url, key) : null;
