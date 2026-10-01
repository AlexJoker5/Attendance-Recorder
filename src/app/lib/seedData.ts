import type { AppData } from '@/app/types/appData';
import { makeSession } from '@/features/attendance/lib/sessionFactory';
import { weeklyDates } from '@/features/classes/lib/weeklyDates';

export function createSeed(): AppData {
  const data: AppData = {
    version: 1,
    revision: 0,
    semesters: [
      {
        id: 'semester-example',
        name: 'Semester 1 · Sep–Dec 2026',
        start: '2026-09-01',
        end: '2026-12-31',
        archived: false,
      },
    ],
    groups: [
      { id: 'group-a', semesterId: 'semester-example', name: 'Group A', archived: false },
      { id: 'group-b', semesterId: 'semester-example', name: 'Group B', archived: false },
    ],
    classes: [
      {
        id: 'english',
        groupId: 'group-a',
        name: 'English',
        weekday: 6,
        startDate: '2026-09-01',
        endDate: '2026-12-31',
        startTime: '09:00',
        endTime: '10:30',
        archived: false,
        completed: false,
      },
      {
        id: 'speaking',
        groupId: 'group-b',
        name: 'Speaking practice',
        weekday: 0,
        startDate: '2026-09-01',
        endDate: '2026-12-31',
        startTime: '14:00',
        endTime: '15:30',
        archived: false,
        completed: false,
      },
    ],
    students: [],
    enrollments: [],
    sessions: [],
    imports: [],
    events: [],
  };
  [
    'Aung Aung',
    'Su Su',
    'Hla Hla',
    'Mya Mya',
    'Kyaw Kyaw',
    'Nandar',
    'Thiri',
    'Min Min',
    'Ei Ei',
    'Wai Wai',
    'Zaw Zaw',
    'May May',
  ].forEach((name, index) => {
    const id = 'example-student-' + index;
    data.students.push({
      id,
      name,
      email: name.toLowerCase().replaceAll(' ', '.') + '@example.com',
      phone: '',
      notes: '',
      aliases: [],
    });
    data.enrollments.push({
      id: 'example-enrollment-' + index,
      studentId: id,
      groupId: index < 8 ? 'group-a' : 'group-b',
      semesterId: 'semester-example',
      joined: '2026-09-01',
      status: 'active',
      history: [],
    });
  });
  data.classes.forEach((cls) =>
    weeklyDates(cls.startDate, cls.endDate, cls.weekday).forEach((date, index) => {
      const session = makeSession(data, cls.id, date, true);
      if (index < 3) {
        session.finalized = true;
        Object.values(session.attendance).forEach((cell, position) => {
          cell.status = position === index ? 'Leave' : position === 4 ? 'Absent' : 'Present';
          cell.source = 'Manual';
        });
      }
      data.sessions.push(session);
    }),
  );
  return data;
}
