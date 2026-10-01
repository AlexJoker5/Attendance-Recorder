import { supabase } from '@/lib/supabase';
import { workspaceChanges } from '../lib/workspaceChanges';
import { workspaceSchema } from '../schemas/workspaceSchema';
import type { AppData } from '../types/appData';

function databaseError(error: { code?: string; message: string }) {
  if (error.code === 'PGRST202')
    return new Error(
      'Database workflows are not installed. Run supabase/004_connected_workflows.sql in your Supabase SQL Editor, then retry.',
    );
  if (error.message.includes('Workspace changed'))
    return new Error(
      'Data changed in another tab or device. The latest records have been reloaded. Review your changes and save again.',
    );
  return new Error(error.message);
}
export async function readSupabaseData(): Promise<AppData> {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase.rpc('attendance_workspace');
  if (error) throw databaseError(error);
  const result = workspaceSchema.safeParse(data);
  if (!result.success)
    throw new Error(
      'Database records use an incompatible format. Apply the latest database migration and retry.',
    );
  return result.data;
}
export async function writeSupabaseData(previous: AppData, next: AppData): Promise<AppData> {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase.rpc('attendance_commit', {
    p_revision: previous.revision,
    p_changes: workspaceChanges(previous, next),
  });
  if (error) throw databaseError(error);
  const result = workspaceSchema.safeParse(data);
  if (!result.success)
    throw new Error(
      'The save completed, but the response could not be read. Reload before making another change.',
    );
  return result.data;
}
