import { normalizeZoomName } from '@/features/students/lib/studentZoomNames';
import type { Student } from '@/features/students/types/studentTypes';

function similarity(first: string, second: string) {
  const a = normalizeZoomName(first)
    .slice(0, 200)
    .replace(/[^\p{L}\p{N}]/gu, '');
  const b = normalizeZoomName(second)
    .slice(0, 200)
    .replace(/[^\p{L}\p{N}]/gu, '');
  if (!a || !b) return 0;
  const row = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i++) {
    let diagonal = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const above = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, diagonal + (a[i - 1] === b[j - 1] ? 0 : 1));
      diagonal = above;
    }
  }
  return 1 - row[b.length] / Math.max(a.length, b.length);
}

export function suggestNameMatches(names: string[], students: Student[]) {
  return students
    .map((student) => ({
      id: student.id,
      score: Math.max(
        ...names.flatMap((name) =>
          [student.name, ...(student.zoomNames || [])].map((candidate) =>
            similarity(name, candidate),
          ),
        ),
      ),
    }))
    .filter((item) => item.score >= 0.55)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, 3)
    .map((item) => item.id);
}
