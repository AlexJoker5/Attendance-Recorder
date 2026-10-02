function apiOrigin(value: string, allowLocal: boolean) {
  try {
    const url = new URL(value);
    const local =
      allowLocal &&
      url.protocol === 'http:' &&
      ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
    if (
      (!local && url.protocol !== 'https:') ||
      url.username ||
      url.password ||
      url.pathname !== '/' ||
      url.search ||
      url.hash
    )
      return null;
    return url;
  } catch {
    return null;
  }
}

export function supabaseConfig(original: string, proxy: string, key: string, development: boolean) {
  if (!original || !key)
    return { error: 'Set the Supabase project URL and publishable key before signing in.' };
  const upstream = apiOrigin(original, development);
  if (!upstream)
    return { error: 'The Supabase project URL must be a valid HTTPS origin without a path.' };
  const endpoint = proxy ? apiOrigin(proxy, development) : upstream;
  if (!endpoint)
    return { error: 'The Supabase proxy URL must be a valid HTTPS origin without a path.' };
  return {
    url: endpoint.origin,
    key,
    // Match the SDK's existing default, even when the transport hostname changes.
    storageKey: `sb-${upstream.hostname.split('.')[0]}-auth-token`,
  };
}
