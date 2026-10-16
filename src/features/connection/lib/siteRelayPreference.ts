import { SITE_RELAY_PREFERENCE_PREFIX } from '../const/connectionConfig';

function preferenceKey(original: string) {
  return SITE_RELAY_PREFERENCE_PREFIX + new URL(original).hostname;
}

export function prefersSiteRelay(original: string) {
  try {
    return localStorage.getItem(preferenceKey(original)) === 'site';
  } catch {
    return false;
  }
}

export function rememberSiteRelay(original: string) {
  try {
    localStorage.setItem(preferenceKey(original), 'site');
  } catch {
    // The router still remembers this choice for the current page.
  }
}
