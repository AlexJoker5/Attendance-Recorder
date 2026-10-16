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
  matchingRule?: string;
  id: string;
  sessionId: string;
  filename: string;
  at: string;
  count: number;
  changes: ImportChange[];
  undoneAt?: string;
  summary?: { restored: number; preserved: number };
}
export interface ZoomReportRow {
  name: string;
  email: string;
  waitingRoom?: boolean;
  role?: string;
  hostName?: string;
  sourceRow?: number;
  rejoins?: number;
}
export interface ImportRow extends ZoomReportRow {
  id: string;
  name: string;
  email: string;
  studentId: string;
  // Kept optional for reading older local import history; never used for new matches.
  saveEmail?: boolean;
  displayName?: string;
  originalName?: string;
  namesToSave?: string[];
  ignoreReason?: string;
  matchMethod?: 'registered_name' | 'zoom_name' | 'manual';
  suggestions?: string[];
  decision: (typeof IMPORT_DECISIONS)[number];
  description: string;
  rejoins?: number;
}
