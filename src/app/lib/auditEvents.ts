import type { AppData } from '@/app/types/appData';
import { uid } from '@/utils/uid';
export function recordEvent(data: AppData, description: string) {
  data.events.push({ id: uid(), at: new Date().toISOString(), description });
}
