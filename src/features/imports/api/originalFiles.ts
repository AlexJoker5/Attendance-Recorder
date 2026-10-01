import { localMode } from '@/lib/supabase';
import { downloadSupabaseOriginal, uploadSupabaseOriginal } from './supabaseOriginals';

async function database() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('attendance-originals', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('files');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
export async function storeOriginal(id: string, file: File) {
  if (!localMode) return uploadSupabaseOriginal(id, file);
  const db = await database();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction('files', 'readwrite');
      transaction.objectStore('files').put(file, id);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  } finally {
    db.close();
  }
}
export async function downloadOriginal(id: string) {
  if (!localMode) return downloadSupabaseOriginal(id);
  const db = await database();
  try {
    const file = await new Promise<File | undefined>((resolve, reject) => {
      const request = db.transaction('files').objectStore('files').get(id);
      request.onsuccess = () => resolve(request.result as File | undefined);
      request.onerror = () => reject(request.error);
    });
    if (!file) throw new Error('Original file is not available in this browser.');
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  } finally {
    db.close();
  }
}
