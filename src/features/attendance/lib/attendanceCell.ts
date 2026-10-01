import { uid } from '@/utils/uid';
import type { AttendanceCell } from '../types/attendanceTypes';
export function blankCell(): AttendanceCell {
  return { status: 'Unmarked', remark: '', source: '—', revision: uid() };
}
