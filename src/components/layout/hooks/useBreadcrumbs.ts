import { useAppData } from '@/app/hooks/useAppData';
import { useLocation } from 'react-router';
import { ROUTE_LABELS } from '../const/navigationItems';
import type { BreadcrumbItem } from '../types/layoutTypes';
export function useBreadcrumbs() {
  const { data } = useAppData();
  const location = useLocation();
  const parts = location.pathname.split('/').filter(Boolean);
  const crumbs: BreadcrumbItem[] = [{ name: 'Overview', path: '/' }];
  let cls = data?.classes.find((item) => item.id === parts[1]);
  if (parts[0] === 'sessions' || (parts[0] === 'imports' && parts[1])) {
    const session = data?.sessions.find((item) => item.id === parts[1]);
    cls = data?.classes.find((item) => item.id === session?.classId);
  }
  if (
    ['groups', 'classes', 'sessions'].includes(parts[0]) ||
    (parts[0] === 'imports' && parts[1])
  ) {
    crumbs.push({ name: 'Groups & classes', path: '/groups' });
    const group = data?.groups.find((item) => item.id === (cls?.groupId || parts[1]));
    if (group) crumbs.push({ name: group.name, path: '/groups/' + group.id });
    if (cls) crumbs.push({ name: cls.name, path: '/classes/' + cls.id });
    const session = data?.sessions.find((item) => item.id === parts[1]);
    if (session) crumbs.push({ name: session.date, path: '/sessions/' + session.id });
    if (parts[0] === 'imports' && parts[1])
      crumbs.push({ name: 'Import report', path: location.pathname });
  } else if (parts[0]) {
    crumbs.push({ name: ROUTE_LABELS[parts[0]] || parts[0], path: '/' + parts[0] });
    if (parts[0] === 'students' && parts[1]) {
      const student = data?.students.find((item) => item.id === parts[1]);
      if (student) crumbs.push({ name: student.name, path: '/students/' + student.id });
      if (parts[2] === 'edit') crumbs.push({ name: 'Edit student', path: location.pathname });
    }
  }

  return crumbs;
}
