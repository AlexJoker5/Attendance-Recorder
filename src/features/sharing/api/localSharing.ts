import { readLocalData } from '@/app/api/localRepository';
import { APP_TIME_ZONE } from '@/app/const/appConfig';
import { withSessionNames } from '@/features/classes/lib/sessionNames';
import { LOCAL_SHARES_KEY } from '../const/sharingConfig';
import { classShareSchema, publicClassSchema } from '../schemas/sharingSchemas';
import type { ClassShare, ShareAction } from '../types/sharingTypes';
import { PublicShareError } from './sharingErrors';

function readShares(): Record<string, ClassShare> {
  const value: unknown = JSON.parse(localStorage.getItem(LOCAL_SHARES_KEY) || '{}');
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('Local sharing settings could not be read.');
  return Object.fromEntries(
    Object.entries(value).map(([key, share]) => [key, classShareSchema.parse(share)]),
  );
}
export function readLocalShare(classId: string): ClassShare {
  return readShares()[classId] ?? { enabled: false, token: null };
}
export function changeLocalShare(
  classId: string,
  action: ShareAction,
  token: string | undefined,
  expected: string | null,
) {
  const shares = readShares();
  const current = shares[classId] ?? { enabled: false, token: null };
  if (current.token !== expected)
    throw new Error('The sharing link changed. Refresh before trying again.');
  if (action === 'create' && current.enabled)
    throw new Error('A link already exists. Refresh before trying again.');
  if (!readLocalData().classes.some((cls) => cls.id === classId))
    throw new Error('Class not found.');
  const next = classShareSchema.parse({
    enabled: action !== 'revoke',
    token: action === 'revoke' ? null : token,
  });
  shares[classId] = next;
  localStorage.setItem(LOCAL_SHARES_KEY, JSON.stringify(shares));
  return next;
}
export function readLocalPublicClass(token: string, sessionId?: string) {
  const entry = Object.entries(readShares()).find(
    ([, share]) => share.enabled && share.token === token,
  );
  if (!entry) throw new PublicShareError(403);
  const data = readLocalData();
  const cls = data.classes.find((item) => item.id === entry[0]);
  const group = data.groups.find((item) => item.id === cls?.groupId);
  const semester = data.semesters.find((item) => item.id === group?.semesterId);
  if (!cls || !group || !semester) throw new PublicShareError(403);
  const sessions = withSessionNames(data.sessions.filter((session) => session.classId === cls.id))
    .filter((session) => session.finalized && !session.removed)
    .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
  const selected = sessions.find((session) => session.id === sessionId);
  if (sessionId && !selected) throw new PublicShareError(403);
  const roster = data.enrollments
    .filter((enrollment) => enrollment.groupId === group.id)
    .flatMap((enrollment) => {
      const student = data.students.find((item) => item.id === enrollment.studentId);
      return student ? [{ name: student.name, studentId: student.id }] : [];
    })
    .sort((a, b) => a.name.localeCompare(b.name));
  // Deliberately project fields here too: local preview follows the public API contract.
  return publicClassSchema.parse({
    class: {
      name: cls.name,
      groupName: group.name,
      semesterName: semester.name,
      timezone: APP_TIME_ZONE,
    },
    sessions: sessions.map((session) => ({
      id: session.id,
      date: session.date,
      startTime: cls.startTime,
      endTime: cls.endTime,
      extra: session.extra,
      weekNumber: session.weekNumber,
    })),
    students: roster.map(({ name }) => ({ name })),
    attendance: selected
      ? roster.map(({ name, studentId }) => ({
          name,
          status: selected.attendance[studentId]?.status ?? 'Unmarked',
          remark: selected.attendance[studentId]?.remark ?? '',
        }))
      : [],
  });
}
