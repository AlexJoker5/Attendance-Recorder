# Supabase connectivity proxy

Use the full [step-by-step setup guide](../../docs/11-cloudflare-worker-setup.md).

- `src/`: maintained TypeScript modules, constants and environment types.
- `worker.js`: generated standalone ES module for Cloudflare's dashboard editor. Copy the whole file, including its default export.
- `wrangler.jsonc`: optional CLI deployment configuration. Dashboard variables are retained on subsequent CLI deploys.
- `scripts/buildWorker.mjs`: bundles the source using the existing project dependencies. It does not read application environment files or deploy anything.

From the application root, run `npm run build:worker` to type-check and regenerate `worker.js`. Commit both source and generated module when publishing changes.

Runtime variables:

| Name              | Value                                                                        |
| ----------------- | ---------------------------------------------------------------------------- |
| `SUPABASE_URL`    | Original HTTPS project origin, for example `https://PROJECT_REF.supabase.co` |
| `ALLOWED_ORIGINS` | Optional comma-separated exact website origins; see the setup guide          |

The Worker does not require a stored API key. It forwards the client's publishable key and user token to the fixed project. It uses no KV, R2, D1, Durable Objects, scheduled tasks, or paid bindings.

Supported routes are explicitly listed in `src/const/proxyConfig.ts`. The current app needs password login/session refresh/user lookup/logout/settings, its four RPCs, and GET/HEAD/POST operations on the `zoom-originals` bucket. Realtime, OAuth/email redirects, other buckets, password reset, and other RPCs require a deliberate extension before use.

The public `/health` route checks reachability and configuration only. It does not contact Supabase or verify login. Supabase remains responsible for authentication, owner authorization, RLS and upload-size enforcement. Origin restrictions are browser controls, not authentication. Requests without an Origin header can still be made by non-browser clients and must pass Supabase authorization.

Requests use `cache: 'no-store'`; responses are marked private/no-store. Bodies are streamed; credentials, query strings, and bodies are not logged by application code. Worker observability is disabled in the optional Wrangler configuration. Cloudflare still processes traffic as the proxy provider.

Redirects are never automatically followed with credentials. Only redirects to supported routes on the same Supabase project are returned, rewritten to the Worker origin. Upstream errors keep their status/body; transport errors return a readable 502 response. There is no automatic fallback to the direct Supabase endpoint while a proxy URL is configured.
