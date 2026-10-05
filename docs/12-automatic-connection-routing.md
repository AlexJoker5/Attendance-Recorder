# Automatic connection routing

Implemented October 5, 2026. The application chooses a connection before initializing Supabase Auth. This feature uses the existing Vercel and Cloudflare setup, with no new package or geolocation subscription.

## Routing rules

| Condition                                                 | Connection                                                   |
| --------------------------------------------------------- | ------------------------------------------------------------ |
| This browser previously saved a direct-connection failure | Cloudflare immediately; skip country lookup and direct check |
| Public IP country is Myanmar (`MM`)                       | Cloudflare                                                   |
| Country is missing, invalid, unknown, or lookup fails     | Cloudflare                                                   |
| Any other recognized ISO country, including Singapore     | Direct Supabase                                              |
| Direct connection has a network failure or timeout        | Switch automatically to Cloudflare and save that preference  |

Country means the public IP location, including a VPN exit. Physical location, timezone, browser language, and GPS are not used. A visitor using a Singapore VPN is treated as Singapore unless a previous direct failure was saved in that browser.

The saved preference has no expiry. Refreshing, signing out, closing the browser, and later changes in IP country do not clear it. It is scoped to the browser, website origin, and original Supabase project hostname. Clearing browser site data removes it. If a browser blocks localStorage, the Worker remains selected for the current page but cannot be remembered after the page closes. Selecting the Worker merely because the country is Myanmar/unknown does not save a permanent failure preference.

## How it works

`api/connectionRoute.ts` is a small Vercel Function. It reads `x-vercel-ip-country` and returns only `{ "route": "direct" }` or `{ "route": "worker" }`. It does not return or store an IP address or country. Query parameters cannot override its decision. Its response disables browser and CDN caching so one visitor's decision cannot be reused for another.

The frontend waits for the decision, then checks `/auth/v1/settings` through the selected connection. Country lookup and each initial connection check have a five-second timeout. The check contacts the real Supabase API; it does not rely on the Worker's `/health` endpoint. Valid authentication/configuration error responses are not mistaken for network failures. A Supabase service error is reported without saving a permanent direct-failure preference.

Supabase is created only after preparation succeeds, so an existing session cannot refresh against the direct API before routing is known. Auth, RPCs, and private report storage use one shared transport. The original project-specific Auth storage key is preserved across connection changes.

While preparing or reconnecting, the app shows a loading screen in the chosen language. If the selected connection is unavailable, it shows a connection error with Retry. Once a direct failure is saved, Retry uses the Worker; it never returns to direct Supabase. Existing forms stay mounted during mid-session recovery.

Network failures during ordinary use also switch a direct connection to Cloudflare. Read-only requests can be retried through the Worker: GET/HEAD and the `is_attendance_admin`, `attendance_workspace`, and `attendance_original` RPCs. Responses are fully received before being treated as successful. Ordinary requests have a 60-second network deadline, allowing more time for uploads/downloads than the small startup check.

Writes and uploads are not blindly repeated after an uncertain response. The existing workspace error handler reloads current records through the selected route, and the UI asks the owner to review the latest records before retrying. An upload uses its existing unique storage path with overwrite disabled; check the import workflow before retrying. Supabase Auth retains its normal SDK session-refresh behavior. HTTP errors such as wrong credentials, validation failures, or insufficient permissions keep their normal handling.

## Deploy on Vercel

1. Keep these four variables as **Config**, scoped to **Production**:

   ```env
   VITE_DATA_MODE=supabase
   VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_EXISTING_PUBLISHABLE_KEY
   VITE_SUPABASE_PROXY_URL=https://YOUR_WORKER.workers.dev
   ```

2. Keep the original project URL separate from the Worker URL. Use only the publishable/legacy anon key; never a secret/service-role key. Connected mode now requires the Worker URL even when accessing from another country, because it is the fallback.
3. Publish the changed frontend, `api/connectionRoute.ts`, its shared routing modules, and root `vercel.json` through your usual Git/Vercel workflow. The SPA rewrite now excludes `/api` so the function is not replaced by `index.html`.
4. Create a new production deployment; Vite embeds the configuration at build time.
5. Open `https://lap-attendance.vercel.app/api/connectionRoute` (or your app's final origin). Expect JSON with `route`, not an HTML page. On a Myanmar connection without a VPN, expect `worker`. A Singapore VPN should return `direct`.
6. Open the app and verify the connection rules below.

The existing Worker already supports the `/auth/v1/settings` probe. No Worker code or variable change is required for this feature. Keep its exact `ALLOWED_ORIGINS` list aligned with the app's final production origin. Cloudflare's variables remain `SUPABASE_URL` and `ALLOWED_ORIGINS`, without `VITE_`.

## Local development

Continue using the existing `.env`. Plain `npm run dev` has no Vercel geolocation endpoint; connected development treats the country as unknown and uses Cloudflare directly. Local preview (`VITE_DATA_MODE=local`, development only) skips connection preparation entirely and continues using sample data. Vite preview also has no function runtime; a missing/non-JSON route response safely selects the Worker.

No development server is started automatically by this change. Restart yours after environment changes.

## Manual verification

- On a Myanmar connection, confirm Network requests go to the Worker from startup through login and workspace load.
- In a fresh browser profile with a Singapore VPN, confirm the route endpoint selects direct and API requests go to the original Supabase hostname.
- In that profile, use browser Developer Tools request blocking to block only the original Supabase hostname, then reload. Expect loading, automatic Worker recovery, and a saved `attendance-cloudflare-fallback:<project-hostname>` value of `worker` under Application/Storage → Local Storage.
- Remove the request block and refresh. There must be no direct Supabase request and no country lookup. Repeat after logout, browser restart, and a VPN country change.
- To check a late failure, allow a direct startup, block the original hostname, then open a page that loads attendance data. Expect automatic recovery and read retry through the Worker. During an uncertain write, review reloaded records before another save.
- Block the Worker too. Expect a connection error and Retry. After restoring the Worker, Retry must still use Cloudflare.
- Inspect a wrong-password response. It should show the ordinary sign-in error and not save a direct-failure preference.
- Confirm report upload/download, token refresh, owner authorization, local preview, and directly refreshed URLs such as `/students` still work.

Production IP headers, deployed function routing, and reachability from your ISP must be verified after deployment. Local builds do not establish those results. No automated test suite was added.

## References

- [Vercel IP country request headers](https://vercel.com/docs/headers/request-headers)
- [Vercel Node.js function handlers in api](https://vercel.com/docs/functions/runtimes/node-js)
- [Vercel rewrites](https://vercel.com/docs/routing/rewrites)
- [Vercel Config and Secret variable types](https://vercel.com/changelog/environment-variables-now-use-config-and-secret-types)
