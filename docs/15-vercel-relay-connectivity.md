# Vercel relay for Myanmar connectivity

On October 16, 2026, with the owner reporting VPN off on Mytel, checks from the task's Windows execution environment reached the Vercel website and `/api/connectionRoute` with HTTP 200. The Supabase project connection timed out; the Worker's `/health` timed out and its Auth settings connection reset during HTTPS setup. The owner also reports intermittent failures on MPT. This supports a network-path problem; it does not identify a specific censoring mechanism or prove the behavior of every Mytel/MPT connection.

The existing frontend loaded successfully. Its connection preparation prevented sign-in because neither API hostname could be reached. Switching only between those two hosts cannot resolve that situation.

## What changed

The hosted app now has a third connection option:

```text
Browser → https://lap-attendance.vercel.app/api/supabase/... → Supabase
```

The browser reaches the same site that serves the app. Vercel forwards the request to the fixed Supabase project from its own network. This uses [external rewrites](https://vercel.com/docs/routing/rewrites), not a new serverless upload function.

The existing direct-first decision and Worker recovery are retained. If both fail with a network error, the hosted app tries the website relay. On a successful connection check it stores `attendance-site-relay:<project-hostname> = site` in browser localStorage. Future page loads, sign-ins, and refreshes then use the website relay immediately without probing either failed host or repeating country lookup. LocalStorage is scoped to that browser and website origin. If storage is unavailable, the choice lasts only for the current page.

Once selected, a website relay failure shows the existing Retry control and keeps that route selected. It does not repeatedly try the blocked hosts. Read-only requests can recover across a connection change. Writes and uploads are never automatically replayed after an uncertain response.

## Deploy: your steps

1. Deploy this frontend **together with the updated root `vercel.json`** through your normal Git/Vercel workflow. Deploying only built static files without the Vercel routing configuration is insufficient.
2. Keep your existing public configuration variables. No new environment variable, Supabase SQL migration, Worker update, paid domain, or package is needed for this change.
3. In the deployed `vercel.json`, the relay's fixed upstream is `https://gddjgyhpvxuylfrylwmv.supabase.co`, taken from this app's currently published public configuration. If you later change Supabase projects, update these rewrite destinations together with `VITE_SUPABASE_URL`; do not point them to a URL supplied by a visitor.
4. With the VPN off, open [the relayed Auth settings endpoint](https://lap-attendance.vercel.app/api/supabase/auth/v1/settings). Opening it directly supplies no API key, so a JSON error about a missing API key is expected and proves HTTP reachability. A 404, SPA HTML, timeout, or TLS error means this deployment or route is not working yet. Do not paste keys into the URL.
5. Open the normal app and let connection preparation finish. On the first failed direct/Worker attempt, it can take roughly two five-second checks before the website relay is tried.
6. In DevTools → Network, verify requests use `/api/supabase/auth/v1/settings`, followed by relayed login/session requests and `/api/supabase/rest/v1/rpc/attendance_workspace`.
7. Reload the page. When the successful relay preference is saved, there should be no browser request to either `supabase.co` or `workers.dev`.
8. Verify sign-in, read-only public links, a normal attendance save, and original report upload/download. Check a representative larger report too; the actual deployed proxy path must be exercised before claiming upload compatibility.
9. Repeat with VPN off on MPT when available. A successful Mytel check does not establish MPT reliability, and vice versa.

Plain `npm run dev` has no Vercel external rewrites. Connected Vite development retains the existing direct/Worker behavior; local sample preview still skips network preparation. Vite's static preview server also does not provide Vercel rewrites. Verify the relay on an actual Vercel deployment.

## Scope and security

`vercel.json` permits only the app's Auth paths, six named RPCs, and original-report upload/download paths. Other paths stay outside the relay and the SPA catch-all excludes `/api`. The destination host is fixed. Incoming request methods, query parameters, and bodies are forwarded; Supabase still enforces Auth, ownership/RLS, share-token scope, and storage policies. No service-role key is added.

The relay sends no browser cookies. Only the client's ordinary API key and the request's existing authorization are used. Public sharing continues to omit the owner's authorization token. Private responses have no-store headers at browser and CDN levels, and Vercel rewrite caching is explicitly disabled. No request-body or token logging is introduced.

Both the existing free-plan usage limits and Vercel proxy limits still apply. This is not an unlimited-bandwidth service. The relay can help when Vercel is reachable but the API hostnames are not; it cannot help if the Vercel site itself becomes unreachable. A paid custom domain is not required for the current approach.

## Validation boundary

The pre-change network failures above were observed with VPN off as reported by the owner. The new relay needs deployment before its actual Vercel-to-Supabase route can be checked. Local lint/build and isolated request simulations do not prove that hosted sign-in, uploads, or all Myanmar providers work.
