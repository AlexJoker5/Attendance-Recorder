import {
  BookOpen,
  CalendarDays,
  FileDown,
  GraduationCap,
  LayoutDashboard,
  Users,
} from 'lucide-react';
export const NAVIGATION_ITEMS = [
  { path: '/', label: 'Overview', icon: LayoutDashboard },
  { path: '/groups', label: 'Groups & classes', icon: BookOpen },
  { path: '/students', label: 'Students', icon: Users },
  { path: '/imports', label: 'Import history', icon: FileDown },
  { path: '/reports', label: 'Reports', icon: GraduationCap },
  { path: '/semesters', label: 'Semesters', icon: CalendarDays },
] as const;
export const ROUTE_LABELS: Record<string, string> = {
  students: 'Students',
  semesters: 'Semesters',
  imports: 'Import history',
  reports: 'Reports',
};
