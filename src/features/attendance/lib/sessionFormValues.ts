import type { SessionAttendanceValues } from '../schemas/sessionAttendanceSchema';
import type { ClassSession } from '../types/attendanceTypes';
export function sessionFormValues(session: ClassSession): SessionAttendanceValues {
  return {
    cells: Object.fromEntries(
      Object.entries(session.attendance).map(([id, cell]) => [
        id,
        { status: cell.status, remark: cell.remark },
      ]),
    ),
  };
}
