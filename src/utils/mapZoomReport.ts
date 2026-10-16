import type { ZoomReportRow } from '@/features/imports/types/importTypes';

export function detectZoomReportColumns(headers: string[]) {
  const find = (pattern: RegExp) => headers.findIndex((header) => pattern.test(header.trim()));
  const name = find(/^name\s*\(original name\)$/iu);
  return {
    nameColumn:
      name >= 0
        ? name
        : Math.max(
            0,
            headers.findIndex((header) => !/host/iu.test(header) && /name/iu.test(header)),
          ),
    emailColumn: headers.findIndex((header) => !/host/iu.test(header) && /e-?mail/iu.test(header)),
    waitingRoomColumn: find(/^(?:in waiting room|waiting room)$/iu),
    roleColumn: find(/^(?:role|meeting role|participant role)$/iu),
    hostNameColumn: find(/^host name$/iu),
  };
}

export function mapZoomReport(
  rows: string[][],
  headers: string[],
  nameColumn: number,
  emailColumn: number,
  waitingRoomColumn: number,
  firstDataRow = 2,
): ZoomReportRow[] {
  const { roleColumn, hostNameColumn } = detectZoomReportColumns(headers);
  return rows.flatMap((row, index) =>
    row.some((value) => value.trim())
      ? [
          {
            name: row[nameColumn]?.trim() || '',
            email: emailColumn >= 0 ? (row[emailColumn] || '').trim().toLowerCase() : '',
            waitingRoom:
              waitingRoomColumn >= 0 &&
              /^(?:yes|true|1)$/iu.test(row[waitingRoomColumn]?.trim() || ''),
            role: roleColumn >= 0 ? row[roleColumn]?.trim() : '',
            hostName: hostNameColumn >= 0 ? row[hostNameColumn]?.trim() : '',
            sourceRow: index + firstDataRow,
          },
        ]
      : [],
  );
}
