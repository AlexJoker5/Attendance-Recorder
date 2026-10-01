import { supabase } from '@/lib/supabase';
import { MAX_SPREADSHEET_FILE_BYTES } from '@/utils/const/spreadsheetLimits';
import { ORIGINALS_BUCKET } from '../const/storageConfig';
import type { OriginalFileMetadata } from '../types/originalFileTypes';
import { z } from 'zod';

const originalSchema = z.object({ path: z.string(), filename: z.string() });
export async function uploadSupabaseOriginal(
  id: string,
  file: File,
): Promise<OriginalFileMetadata> {
  if (!supabase) throw new Error('Supabase is not configured.');
  if (!file.size || file.size > MAX_SPREADSHEET_FILE_BYTES)
    throw new Error('Choose a non-empty file up to 10 MiB.');
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (extension !== 'csv' && extension !== 'xlsx') throw new Error('Choose a CSV or XLSX file.');
  const { data, error: authError } = await supabase.auth.getUser();
  if (authError || !data.user) throw new Error('Sign in again before uploading.');
  const bytes = await file.arrayBuffer();
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  const sha256 = Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
  const path = data.user.id + '/' + id + '/original.' + extension;
  const { error } = await supabase.storage
    .from(ORIGINALS_BUCKET)
    .upload(path, file, { upsert: false });
  if (error) throw new Error('Could not upload the original report: ' + error.message);
  return { path, sha256, byteSize: file.size, fileType: extension };
}
export async function downloadSupabaseOriginal(id: string) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase.rpc('attendance_original', { p_import: id });
  if (error) throw new Error(error.message);
  const original = originalSchema.parse(data);
  const { data: file, error: downloadError } = await supabase.storage
    .from(ORIGINALS_BUCKET)
    .download(original.path);
  if (downloadError || !file)
    throw new Error(downloadError?.message || 'Original report is unavailable.');
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = original.filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
