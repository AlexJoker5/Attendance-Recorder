import { localMode } from '@/lib/supabase';
import type { AppData } from '../types/appData';
import { readLocalData, writeLocalData } from './localRepository';
import { readSupabaseData, writeSupabaseData } from './supabaseRepository';

export function readWorkspace(): AppData | Promise<AppData> {
  return localMode ? readLocalData() : readSupabaseData();
}
export async function writeWorkspace(previous: AppData, next: AppData): Promise<AppData> {
  if (!localMode) return writeSupabaseData(previous, next);
  writeLocalData(previous.revision, next);
  return next;
}
