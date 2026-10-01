import { useAppData } from '@/app/hooks/useAppData';
import { useWorkspace } from '@/app/hooks/useWorkspace';
import { selectedSemester } from '@/app/lib/workspaceSelectors';
import { today } from '@/utils/dateUtils';
import { BookOpen, CalendarDays, TriangleAlert, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { reportRows } from '../lib/reportRows';
export function useDashboard() {
  const { data } = useAppData();
  const { semesterId } = useWorkspace();
  const { t } = useTranslation();
  if (!data) return null;
  const semester = selectedSemester(data, semesterId);
  const groups = data.groups.filter((group) => group.semesterId === semester.id && !group.archived);
  const classes = data.classes.filter(
    (cls) => !cls.archived && groups.some((group) => group.id === cls.groupId),
  );
  const sessions = data.sessions.filter(
    (session) => !session.removed && classes.some((cls) => cls.id === session.classId),
  );
  const results = reportRows(data, semester.id).filter((row) =>
    classes.some((cls) => cls.id === row.cls.id),
  );
  const risk = new Set(
    results
      .filter((row) => row.label === 'Failed' || row.label === 'At risk')
      .map((row) => row.student.id),
  ).size;
  const stats = [
    {
      label: 'Enrolled students',
      value: data.enrollments.filter((item) => item.semesterId === semester.id).length,
      icon: Users,
    },
    { label: 'Active classes', value: classes.length, icon: BookOpen },
    {
      label: 'Pending attendance review',
      value: sessions.filter((session) => !session.finalized && session.date <= today()).length,
      icon: CalendarDays,
    },
    { label: 'Students requiring attention', value: risk, icon: TriangleAlert },
  ];
  const upcoming = sessions
    .filter((session) => !session.finalized)
    .sort(
      (a, b) =>
        Math.abs(+new Date(a.date) - +new Date(today())) -
        Math.abs(+new Date(b.date) - +new Date(today())),
    )
    .slice(0, 5);

  return { t, semester, stats, results, upcoming, classes, groups, data };
}
export type DashboardModel = NonNullable<ReturnType<typeof useDashboard>>;
