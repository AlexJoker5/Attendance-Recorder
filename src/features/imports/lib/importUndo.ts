import { recordEvent } from '@/app/lib/auditEvents';
import type { AppData } from '@/app/types/appData';
import { uid } from '@/utils/uid';
export function undoPlan(data: AppData, importId: string) {
  const log = data.imports.find((item) => item.id === importId);
  const session = data.sessions.find((item) => item.id === log?.sessionId);
  return (log?.changes || []).map((change) => {
    const current = session?.attendance[change.studentId];
    return {
      ...change,
      safe:
        !log?.undoneAt &&
        !!current &&
        current.revision === change.after.revision &&
        current.status === change.after.status &&
        current.source === change.after.source &&
        current.remark === change.after.remark,
    };
  });
}
export function undoImport(data: AppData, importId: string) {
  const log = data.imports.find((item) => item.id === importId)!;
  if (log.undoneAt) throw new Error('This import was already undone.');
  const session = data.sessions.find((item) => item.id === log.sessionId)!;
  const plan = undoPlan(data, importId);
  let restored = 0;
  plan.forEach((change) => {
    if (change.safe) {
      session.attendance[change.studentId] = { ...change.before, revision: uid() };
      restored++;
    }
  });
  if (restored) session.finalized = false;
  log.undoneAt = new Date().toISOString();
  log.summary = { restored, preserved: plan.length - restored };
  recordEvent(
    data,
    `Undid ${log.filename}: ${restored} restored; ${plan.length - restored} later changes preserved`,
  );
}
