import type { FormField } from '@/components/ui/types/recordFormTypes';
import type { Semester } from '@/features/semesters/types/semesterTypes';
import { WEEKDAYS as weekdays } from '../const/scheduleDefaults';
import type { ClassValues } from '../schemas/classSchema';
export function classFormFields(semester: Semester): FormField<ClassValues>[] {
  return [
    { name: 'name', label: 'Class name' },
    {
      name: 'weekday',
      label: 'Weekly day',
      type: 'select',
      numeric: true,
      options: weekdays.map((day, value) => ({ value, label: day })),
    },
    {
      name: 'startDate',
      label: 'Class start date',
      type: 'date',
      min: semester.start,
      max: semester.end,
    },
    {
      name: 'endDate',
      label: 'Class end date',
      type: 'date',
      min: semester.start,
      max: semester.end,
    },
    { name: 'startTime', label: 'Start time', type: 'time' },
    { name: 'endTime', label: 'End time', type: 'time' },
  ];
}
