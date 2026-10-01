import type { OriginalFileMetadata } from './originalFileTypes';
import type { AttendanceCell } from '@/features/attendance/types/attendanceTypes';
import { IMPORT_DECISIONS } from '../const/importDefaults';
export interface ImportChange {
  studentId: string;
  name: string;
  before: AttendanceCell;
  after: AttendanceCell;
}
export interface ImportRecord {
  original?: OriginalFileMetadata;
  rows?: ImportRow[];
  id: string;
  sessionId: string;
  filename: string;
  at: string;
  count: number;
  changes: ImportChange[];
  undoneAt?: string;
  summary?: { restored: number; preserved: number };
}
export interface ImportRow {
  id: string;
  name: string;
  email: string;
  studentId: string;
  saveEmail: boolean;
  decision: (typeof IMPORT_DECISIONS)[number];
  description: string;
}
