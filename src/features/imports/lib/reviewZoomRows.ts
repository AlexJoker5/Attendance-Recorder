import { zoomNameOwners } from '@/features/students/lib/studentZoomNames';
import type { Student } from '@/features/students/types/studentTypes';
import { uid } from '@/utils/uid';
import type { ImportRow, ZoomReportRow } from '../types/importTypes';
import { suggestNameMatches } from './nameSuggestions';
import { automaticIgnore, splitZoomName } from './zoomNames';

export function reviewZoomRows(raw: ZoomReportRow[], students: Student[]): ImportRow[] {
  return raw.map((row) => {
    const names = splitZoomName(row.name);
    const ignoreReason = automaticIgnore(row);
    const candidates = [names.displayName, names.originalName].filter(Boolean);
    const owners = [
      ...new Map(
        candidates
          .flatMap((name) => zoomNameOwners(students, name))
          .map((student) => [student.id, student]),
      ).values(),
    ];
    const matched = !ignoreReason && owners.length === 1 ? owners[0] : undefined;
    return {
      ...row,
      ...names,
      id: uid(),
      email: row.email || '',
      studentId: ignoreReason ? 'ignore' : matched?.id || '',
      namesToSave: [],
      decision: '',
      ignoreReason,
      suggestions: !ignoreReason && !matched ? suggestNameMatches(candidates, students) : [],
      matchMethod: matched
        ? candidates.some((name) => zoomNameOwners([{ ...matched, zoomNames: [] }], name).length)
          ? 'registered_name'
          : 'zoom_name'
        : 'manual',
      description:
        ignoreReason ||
        (owners.length > 1
          ? 'Name conflict: these Zoom names identify more than one enrolled student. Choose a student manually.'
          : matched
            ? 'Matched by registered or approved Zoom name.'
            : 'Unrecognized Zoom name. Review suggestions or choose a student.'),
    };
  });
}
