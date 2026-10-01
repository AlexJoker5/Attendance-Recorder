import type { AppData } from '@/app/types/appData';
import { uid } from '@/utils/uid';
import type { ClassSession } from '../types/attendanceTypes';
import { blankCell } from './attendanceCell';
import { roster } from './attendanceSelectors';
export function makeSession(
  data: AppData,
  classId: string,
  date: string,
  generated = false,
  extra = false,
): ClassSession {
  return {
    id: uid(),
    classId,
    date,
    generated,
    extra,
    removed: false,
    finalized: false,
    attendance: Object.fromEntries(
      roster(data, classId).map((item) => [item.studentId, blankCell()]),
    ),
  };
}
