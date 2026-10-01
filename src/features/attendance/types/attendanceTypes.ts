import { ATTENDANCE_STATUSES } from '../const/attendanceStatus';
export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number];
export interface AttendanceCell {
  status: AttendanceStatus;
  remark: string;
  source: string;
  revision: string;
  createdAt?: string;
}
export interface ClassSession {
  id: string;
  createdAt?: string;
  classId: string;
  date: string;
  extra: boolean;
  generated: boolean;
  removed: boolean;
  removedBy?: 'manual' | 'schedule';
  finalized: boolean;
  attendance: Record<string, AttendanceCell>;
}
