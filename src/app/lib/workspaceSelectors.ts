import type { AppData } from '../types/appData';
export function selectedSemester(data: AppData, semesterId: string) {
  return data.semesters.find((item) => item.id === semesterId) || data.semesters[0];
}
