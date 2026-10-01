import { STORAGE_KEYS } from '@/app/const/storageKeys';
import { createSeed } from '@/app/lib/seedData';
import { stampCreatedDates } from '@/app/lib/recordCreatedDates';
import type { AppData } from '@/app/types/appData';

const key = STORAGE_KEYS.workspace;
export function readLocalData(): AppData {
  const raw = localStorage.getItem(key);
  if (!raw) {
    const seed = createSeed();
    stampCreatedDates(undefined, seed);
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  const parsed: unknown = JSON.parse(raw);
  if (
    !parsed ||
    typeof parsed !== 'object' ||
    !('version' in parsed) ||
    parsed.version !== 1 ||
    !('students' in parsed) ||
    !Array.isArray(parsed.students)
  )
    throw new Error('Local data could not be read. Keep a backup before clearing browser storage.');
  return parsed as AppData;
}
export function writeLocalData(previousRevision: number, data: AppData) {
  const current = localStorage.getItem(key);
  const previous = current ? (JSON.parse(current) as AppData) : undefined;
  if (previous && previous.revision !== previousRevision)
    throw new Error('Data changed in another tab. Reload this page before saving.');
  stampCreatedDates(previous, data);
  data.revision = previousRevision + 1;
  localStorage.setItem(key, JSON.stringify(data));
}
