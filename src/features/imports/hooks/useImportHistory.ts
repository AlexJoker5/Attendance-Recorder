import { useAppData } from '@/app/hooks/useAppData';
import { useWorkspace } from '@/app/hooks/useWorkspace';
import { selectedSemester } from '@/app/lib/workspaceSelectors';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { downloadOriginal } from '../api/originalFiles';
import { undoImport, undoPlan } from '../lib/importUndo';
export function useImportHistory() {
  const { t } = useTranslation();
  const { data, change } = useAppData();
  const { semesterId } = useWorkspace();
  const [selected, setSelected] = useState('');
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  if (!data) return null;
  const semester = selectedSemester(data, semesterId);
  const groups = data.groups
    .filter((item) => item.semesterId === semester.id)
    .map((item) => item.id);
  const classes = data.classes.filter((cls) => groups.includes(cls.groupId)).map((cls) => cls.id);
  const sessions = data.sessions
    .filter((session) => classes.includes(session.classId))
    .map((session) => session.id);
  const rows = data.imports
    .filter(
      (log) =>
        sessions.includes(log.sessionId) &&
        (filter === 'all' || (filter === 'undone') === !!log.undoneAt),
    )
    .map((log) => {
      const session = data.sessions.find((item) => item.id === log.sessionId)!;
      const cls = data.classes.find((item) => item.id === session.classId)!;
      return { ...log, destination: cls.name + ' · ' + session.date };
    })
    .reverse();
  const log = data.imports.find((item) => item.id === selected);
  const plan = selected ? undoPlan(data, selected) : [];
  const downloadSelectedOriginal = async () => {
    if (!log) return;
    try {
      await downloadOriginal(log.id);
    } catch (reason) {
      setError(String(reason));
    }
  };
  const undoSelectedImport = async () => {
    if (!log) return;
    try {
      await change((next) => {
        undoImport(next, log.id);
        const session = next.sessions.find((item) => item.id === log.sessionId)!;
        next.classes.find((item) => item.id === session.classId)!.completed = false;
      });
    } catch (reason) {
      setError(String(reason));
    }
  };

  return {
    t,
    filter,
    setFilter,
    rows,
    setSelected,
    setError,
    log,
    plan,
    downloadSelectedOriginal,
    semester,
    undoSelectedImport,
    error,
  };
}
export type ImportsModel = NonNullable<ReturnType<typeof useImportHistory>>;
