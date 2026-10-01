import { useAppData } from '@/app/hooks/useAppData';
import { useWorkspace } from '@/app/hooks/useWorkspace';
import { recordEvent } from '@/app/lib/auditEvents';
import { uid } from '@/utils/uid';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { applySchedule, scheduleDiff } from '../lib/scheduleRules';
import { weeklyDates } from '../lib/weeklyDates';
import type { ClassValues } from '../schemas/classSchema';
import type { TeachingClass } from '../types/classTypes';

export function useClassForm({
  groupId,
  existing,
  onClose,
}: {
  groupId: string;
  existing?: TeachingClass;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const { data, change } = useAppData();
  const { notify } = useWorkspace();
  const [review, setReview] = useState<{ values: ClassValues; revision: number } | null>(null);
  if (!data) return null;
  const group = data.groups.find((item) => item.id === groupId)!;
  const semester = data.semesters.find((item) => item.id === group.semesterId)!;
  const plan = review && scheduleDiff(data, { ...existing!, ...review.values });
  const saveClass = async (values: ClassValues) => {
    if (values.startDate < semester.start || values.endDate > semester.end)
      throw new Error('Class dates must be within this semester.');
    if (!weeklyDates(values.startDate, values.endDate, values.weekday).length)
      throw new Error('This range contains no sessions on the selected weekday.');
    if (!review) {
      setReview({ values, revision: data.revision });
      return;
    }
    if (
      review.revision !== data.revision ||
      JSON.stringify(review.values) !== JSON.stringify(values)
    ) {
      setReview(null);
      throw new Error('Schedule data changed. Preview the changes again.');
    }
    await change((next) => {
      if (semester.archived || group.archived)
        throw new Error('Restore the semester and group first.');
      if (
        next.classes.some(
          (cls) =>
            cls.groupId === groupId &&
            cls.id !== existing?.id &&
            cls.name.toLowerCase() === values.name.toLowerCase(),
        )
      )
        throw new Error('A class with this name already exists in the group.');
      const cls: TeachingClass = {
        id: existing?.id || uid(),
        groupId,
        archived: false,
        completed: false,
        ...existing,
        ...values,
      };
      if (existing)
        Object.assign(
          next.classes.find((item) => item.id === existing.id)!,
          cls,
        );
      else next.classes.push(cls);
      applySchedule(next, cls);
      recordEvent(next, 'Saved class ' + cls.name);
    });
    onClose();
    notify(t('Class saved.'));
  };

  return { t, existing, onClose, group, semester, review, setReview, saveClass, plan };
}
export type ClassFormModel = NonNullable<ReturnType<typeof useClassForm>>;
