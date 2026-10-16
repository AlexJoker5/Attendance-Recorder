import { useAppData } from '@/app/hooks/useAppData';
import { useWorkspace } from '@/app/hooks/useWorkspace';
import { roster } from '@/features/attendance/lib/attendanceSelectors';
import { normalizeZoomName, zoomNameOwners } from '@/features/students/lib/studentZoomNames';
import { uid } from '@/utils/uid';
import { useRef, useState } from 'react';
import type { OriginalFileMetadata } from '../types/originalFileTypes';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { storeOriginal } from '../api/originalFiles';
import { applyImport } from '../lib/importRules';
import type { ImportRow, ZoomReportRow } from '../types/importTypes';
import { reviewZoomRows } from '../lib/reviewZoomRows';
import { localMode } from '@/lib/supabase';
import { ZOOM_MATCHING_RULE } from '../const/zoomNameRules';
export function useImportReview() {
  const { sessionId } = useParams();
  const { data, change } = useAppData();
  const { notify } = useWorkspace();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const prepared = useRef<{ id: string; file: File; original?: OriginalFileMetadata } | null>(null);
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState('all');
  const session = data?.sessions.find((item) => item.id === sessionId);
  if (!data || !session) return null;
  const cls = data.classes.find((item) => item.id === session.classId)!;
  const group = data.groups.find((item) => item.id === cls.groupId)!;
  const semester = data.semesters.find((item) => item.id === group.semesterId)!;
  const readonly = semester.archived || group.archived || cls.archived || session.removed;
  const namesReady = localMode || data.zoomMatchingVersion === 1;
  const students = roster(data, cls.id).map((enrollment) =>
    data.students.find((item) => item.id === enrollment.studentId)!,
  );
  function update(id: string, values: Partial<ImportRow>) {
    setRows((prior) => {
      const target = prior.find((row) => row.id === id);
      if (!target) return prior;
      return prior.map((row) => {
        if (row.ignoreReason) return row;
        const sameName = normalizeZoomName(row.name) === normalizeZoomName(target.name);
        if (values.studentId !== undefined && sameName) {
          const student = students.find((item) => item.id === values.studentId);
          const name = row.displayName || row.name;
          const canSave =
            student &&
            !zoomNameOwners([student], name).length &&
            !zoomNameOwners(data!.students, name, student.id).length;
          return {
            ...row,
            ...values,
            namesToSave: canSave ? [name] : [],
            decision: '',
            matchMethod: 'manual',
            description:
              values.studentId === 'ignore'
                ? 'Ignored by administrator during review.'
                : !values.studentId
                  ? 'Unrecognized Zoom name. Review suggestions or choose a student.'
                  : 'Manually confirmed name. Selected Zoom names will be remembered when attendance is applied.',
          };
        }
        // Apply a decision once for repeated rows of the same student, avoiding
        // incompatible keep/replace choices after reconnects and renamed joins.
        if (values.decision !== undefined && row.studentId === target.studentId)
          return { ...row, decision: values.decision };
        if (values.namesToSave && sameName) return { ...row, namesToSave: values.namesToSave };
        return row.id === id ? { ...row, ...values } : row;
      });
    });
  }
  const reviewWorkbook = (raw: ZoomReportRow[], original: File) => {
    prepared.current = null;
    setFile(original);
    setError('');
    setRows(reviewZoomRows(raw, students));
    setFilter('all');
  };
  const applyReviewedImport = async () => {
    setBusy(true);
    setError('');
    try {
      if (!file) throw new Error('Choose a report first.');
      if (!namesReady)
        throw new Error(
          'Install supabase/009_zoom_name_matching.sql before importing attendance or saving Zoom names.',
        );
      if (!prepared.current || prepared.current.file !== file)
        prepared.current = { id: uid(), file };
      const upload = prepared.current;
      const id = upload.id;
      const preview = structuredClone(data);
      applyImport(preview, session.id, rows, file.name, id);
      if (!upload.original) upload.original = await storeOriginal(id, file);
      await change((next) => {
        applyImport(next, session.id, rows, file.name, id);
        const log = next.imports.find((item) => item.id === id)!;
        log.original = upload.original;
        log.rows = structuredClone(rows);
        log.matchingRule = ZOOM_MATCHING_RULE;
        next.classes.find((item) => item.id === cls.id)!.completed = false;
      });
      notify(t('Attendance imported. Review the session before finalizing.'));
      navigate('/sessions/' + session.id);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Import failed.');
    } finally {
      setBusy(false);
    }
  };

  return {
    t,
    group,
    cls,
    session,
    semester,
    readonly,
    namesReady,
    reviewWorkbook,
    students,
    rows,
    file,
    filter,
    setFilter,
    data,
    update,
    error,
    busy,
    applyReviewedImport,
  };
}
export type ImportSessionModel = NonNullable<ReturnType<typeof useImportReview>>;
