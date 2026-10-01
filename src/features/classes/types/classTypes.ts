export interface TeachingClass {
  id: string;
  createdAt?: string;
  groupId: string;
  name: string;
  weekday: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  archived: boolean;
  completed: boolean;
}
