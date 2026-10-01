import { getErrorMessage } from '@/utils/getErrorMessage';
import { useAppData } from '@/app/hooks/useAppData';
import { useWorkspace } from '@/app/hooks/useWorkspace';
import { recordEvent } from '@/app/lib/auditEvents';
import { exportSheet } from '@/utils/exportSheet';
import type { SpreadsheetFormat } from '@/utils/types/spreadsheetTypes';
import { uid } from '@/utils/uid';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { blankCell } from '../lib/attendanceCell';
import { roster } from '../lib/attendanceSelectors';
import { finalizeSession, removeSession } from '../lib/sessionRules';
import type { RescheduleSessionValues } from '../schemas/rescheduleSessionSchema';
import type { SessionAttendanceValues } from '../schemas/sessionAttendanceSchema';
import { sessionFormValues } from '../lib/sessionFormValues';
import { sessionAttendanceSchema } from '../schemas/sessionAttendanceSchema';
import type { ClassSession } from '../types/attendanceTypes';
export function useSessionAttendance({ session }: { session: ClassSession }) {
  const { t } = useTranslation();
  const { data, change } = useAppData();
  const { notify } = useWorkspace();
  const [filter, setFilter] = useState('all');
  const [source, setSource] = useState('all');
  const [error, setError] = useState('');
  const [dialog, setDialog] = useState<'finalize' | 'remove' | 'reschedule' | null>(null);
  const { register, control, handleSubmit, getValues, reset, formState } =
    useForm<SessionAttendanceValues>({
      resolver: zodResolver(sessionAttendanceSchema),
      defaultValues: sessionFormValues(session),
    });
  if (!data) return null;
  const cls = data.classes.find((item) => item.id === session.classId)!;
  const group = data.groups.find((item) => item.id === cls.groupId)!;
  const semester = data.semesters.find((item) => item.id === group.semesterId)!;
  const readonly = semester.archived || group.archived || cls.archived || session.removed;
  const students = roster(data, cls.id)
    .map((enrollment) => ({
      ...data.students.find((item) => item.id === enrollment.studentId)!,
      enrollment,
      cell: session.attendance[enrollment.studentId] || blankCell(),
    }))
    .filter(
      (student) =>
        (filter === 'all' || student.cell.status === filter) &&
        (source === 'all' || student.cell.source === source),
    );
  async function save(finalize = false) {
    const values = sessionAttendanceSchema.parse(getValues());
    const saved = await change((next) => {
      const current = next.sessions.find((item) => item.id === session.id)!;
      if (current.removed) throw new Error('Restore this session first.');
      let edited = false;
      Object.entries(values.cells).forEach(([id, value]) => {
        const cell = current.attendance[id] || blankCell();
        if (cell.status !== value.status || cell.remark !== value.remark) {
          current.attendance[id] = { ...cell, ...value, source: 'Manual', revision: uid() };
          edited = true;
        }
      });
      if (edited || !finalize) {
        current.finalized = false;
        next.classes.find((item) => item.id === cls.id)!.completed = false;
      }
      if (finalize) finalizeSession(next, session.id);
      recordEvent(next, `Saved session ${session.date}`);
    });
    const savedSession = saved.sessions.find((item) => item.id === session.id)!;
    reset(sessionFormValues(savedSession));
    notify(t(finalize ? 'Attendance finalized.' : 'Draft saved.'));
  }
  async function exportAttendance(format: SpreadsheetFormat) {
    try {
      await exportSheet(
        cls.name + '-' + session.date,
        [
          ['Class', 'Date', 'Student', 'Email', 'Status', 'Remark', 'Source', 'Review'],
          ...roster(data!, cls.id).map((enrollment) => {
            const student = data!.students.find((item) => item.id === enrollment.studentId)!;
            const cell = session.attendance[student.id] || blankCell();
            return [
              cls.name,
              session.date,
              student.name,
              student.email,
              cell.status,
              cell.remark,
              cell.source,
              session.finalized ? 'Finalized' : 'Draft',
            ];
          }),
        ],
        format,
      );
    } catch (reason) {
      setError(getErrorMessage(reason));
    }
  }
  const confirmSessionAction = async () => {
    try {
      if (dialog === 'finalize') await save(true);
      else {
        if (formState.isDirty)
          throw new Error('Save attendance changes before removing this session.');
        await change((next) => removeSession(next, session.id));
      }
      setDialog(null);
    } catch (reason) {
      setError(getErrorMessage(reason));
    }
  };

  const rescheduleSession = async (values: RescheduleSessionValues) => {
    if (formState.isDirty) throw new Error('Save attendance changes before rescheduling.');
    await change((next) => {
      if (values.date < semester.start || values.date > semester.end)
        throw new Error('Session date must be within the semester.');
      if (
        next.sessions.some(
          (item) => item.id !== session.id && item.classId === cls.id && item.date === values.date,
        )
      )
        throw new Error('Another session already uses this date.');
      if (
        session.finalized ||
        Object.values(session.attendance).some((cell) => cell.status !== 'Unmarked')
      )
        throw new Error(
          'This session has attendance. Keep its date and add another session instead.',
        );
      const current = next.sessions.find((item) => item.id === session.id)!;
      current.date = values.date;
      current.generated = false;
      recordEvent(next, 'Rescheduled session to ' + values.date);
    });
    setDialog(null);
  };
  return {
    rescheduleSession,
    session,
    group,
    cls,
    exportAttendance,
    readonly,
    t,
    formState,
    error,
    filter,
    setFilter,
    source,
    setSource,
    handleSubmit,
    save,
    setError,
    students,
    register,
    control,
    setDialog,
    dialog,
    semester,
    change,
    confirmSessionAction,
  };
}
export type SessionModel = NonNullable<ReturnType<typeof useSessionAttendance>>;
