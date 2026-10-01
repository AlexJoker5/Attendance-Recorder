import { useAppData } from '@/app/hooks/useAppData';
import { useWorkspace } from '@/app/hooks/useWorkspace';
import { roster } from '@/features/attendance/lib/attendanceSelectors';
import { emailOwner } from '@/features/students/lib/studentEmails';
import { uid } from '@/utils/uid';
import { useRef, useState } from 'react';
import type { OriginalFileMetadata } from '../types/originalFileTypes';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { storeOriginal } from '../api/originalFiles';
import { applyImport } from '../lib/importRules';
import type { ImportRow } from '../types/importTypes';
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
  const students = roster(data, cls.id).map((enrollment) =>
    data.students.find((item) => item.id === enrollment.studentId)!,
  );
  function update(id: string, values: Partial<ImportRow>) {
    setRows((prior) => prior.map((row) => (row.id === id ? { ...row, ...values } : row)));
  }
  const reviewWorkbook = (raw: { name: string; email: string }[], original: File) => {
    prepared.current = null;
    setFile(original);
    setError('');
    setRows(
      raw.map((row) => {
        const owner = emailOwner(data, row.email);
        const enrolled = owner && students.some((student) => student.id === owner.id);
        return {
          id: uid(),
          ...row,
          studentId: enrolled ? owner.id : '',
          saveEmail: false,
          decision: '',
          description: enrolled
            ? 'Matched by email'
            : owner
              ? `Email belongs to ${owner.name} (${owner.email}), who is not enrolled in this group. Resolve manually or ignore.`
              : row.email
                ? 'Unknown email — select a student or ignore.'
                : 'Missing email — select a student or ignore.',
        };
      }),
    );
  };
  const applyReviewedImport = async () => {
    setBusy(true);
    setError('');
    try {
      if (!file) throw new Error('Choose a report first.');
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
