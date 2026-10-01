import type { AppData } from '@/app/types/appData';

export function roster(data: AppData, classId: string) {
  const cls = data.classes.find((item) => item.id === classId);
  return data.enrollments.filter((item) => item.groupId === cls?.groupId);
}
