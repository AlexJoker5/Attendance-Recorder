import { lazy } from 'react';

export const appRoutes = [
  { path: '/', component: lazy(() => import('@/features/reports/pages/DashboardPage')) },
  { path: '/semesters', component: lazy(() => import('@/features/semesters/pages/SemestersPage')) },
  { path: '/groups', component: lazy(() => import('@/features/groups/pages/GroupsPage')) },
  {
    path: '/groups/:groupId',
    component: lazy(() => import('@/features/groups/pages/GroupDetailsPage')),
  },
  {
    path: '/classes/:classId',
    component: lazy(() => import('@/features/classes/pages/ClassDetailsPage')),
  },
  {
    path: '/sessions/:sessionId',
    component: lazy(() => import('@/features/attendance/pages/SessionPage')),
  },
  { path: '/students', component: lazy(() => import('@/features/students/pages/StudentsPage')) },
  {
    path: '/students/:studentId',
    component: lazy(() => import('@/features/students/pages/StudentDetailsPage')),
  },
  {
    path: '/students/:studentId/edit',
    component: lazy(() => import('@/features/students/pages/StudentEditPage')),
  },
  { path: '/imports', component: lazy(() => import('@/features/imports/pages/ImportsPage')) },
  {
    path: '/imports/:sessionId',
    component: lazy(() => import('@/features/imports/pages/ImportSessionPage')),
  },
  { path: '/reports', component: lazy(() => import('@/features/reports/pages/ReportsPage')) },
];
