import { normalizeZoomName } from '@/features/students/lib/studentZoomNames';
import { EXCLUDED_ZOOM_NAMES, ZOOM_DEVICE_NAME, ZOOM_ROLE_NAME } from '../const/zoomNameRules';

export function splitZoomName(name: string) {
  const value = name.trim();
  if (ZOOM_ROLE_NAME.test(value))
    return { displayName: value.replace(ZOOM_ROLE_NAME, '').trim(), originalName: '' };
  const parts = /^(.*?)\s*\(\s*([^()]*)\s*\)\s*$/u.exec(value);
  return parts && parts[1].trim()
    ? { displayName: parts[1].trim(), originalName: parts[2].trim() }
    : { displayName: value, originalName: '' };
}

export function ignoredZoomName(name: string) {
  const key = normalizeZoomName(name);
  if (EXCLUDED_ZOOM_NAMES.has(key)) return 'Ignored: teacher-designated co-host.';
  if (ZOOM_DEVICE_NAME.test(key)) return 'Ignored: generic device name.';
  return '';
}

export function automaticIgnore(row: {
  name: string;
  waitingRoom?: boolean;
  role?: string;
  hostName?: string;
}) {
  if (row.waitingRoom) return 'Ignored: waiting room only.';
  if (/^(?:host|co[ -]?host)$/iu.test(row.role?.trim() || '') || ZOOM_ROLE_NAME.test(row.name))
    return 'Ignored: meeting host or co-host.';
  const { displayName, originalName } = splitZoomName(row.name);
  if (row.hostName && normalizeZoomName(displayName) === normalizeZoomName(row.hostName))
    return 'Ignored: meeting host or co-host.';
  if ([displayName, originalName].some((name) => EXCLUDED_ZOOM_NAMES.has(normalizeZoomName(name))))
    return 'Ignored: teacher-designated co-host.';
  // A real renamed attendee may have a device name in parentheses. Ignore only
  // when the current displayed name itself is a generic device label.
  return ignoredZoomName(displayName);
}
