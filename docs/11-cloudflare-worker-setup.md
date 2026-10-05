# Cloudflare Worker setup for Attendance Admin

Prepared October 2, 2026. You deploy the Worker in your own Cloudflare account, then update the Vercel settings. The application code and ready-to-paste Worker are included in this project. This guide does not require a paid domain, a Supabase custom-domain add-on, or a Cloudflare API token shared with anyone.

Your supplied website address is **https://www.lap-attendance.vercel.app**. Both this address and **https://lap-attendance.vercel.app** are included as exact allowed origins in case your Vercel deployment uses the non-www address. No wildcard Vercel origins are allowed. Check the final address in your browser after loading the app. Reachability of either address from the user's network has not been verified by the coding agent.

## 1. Prepare these values

Have your Cloudflare account, your existing Supabase project URL, and access to the Vercel project settings ready. The Supabase URL looks like `https://abcdefghijklmnopqrst.supabase.co`. It is the same original URL you already use in `VITE_SUPABASE_URL`.

Keep the publishable key in your existing frontend environment settings. Do not enter your database password, Supabase secret/service-role key, or owner login password into the Worker. No stored API key is needed there.

## 2. Create the Worker on the Free plan

1. Sign in at [Cloudflare dashboard](https://dash.cloudflare.com/).
2. Open **Workers & Pages** and select **Create application**.
3. Choose the basic Worker/Hello World option if your dashboard offers it. Name the Worker **attendance-api**, then deploy it.
4. If Cloudflare asks you to choose your account's `workers.dev` subdomain, choose one and continue. Keep the account on **Workers Free**.
5. Your Worker address will look like `https://attendance-api.YOUR_SUBDOMAIN.workers.dev`. Copy the actual address Cloudflare provides.

Dashboard choices vary. If your Create application page only offers Git-based templates and no basic Worker/editor flow, use the short CLI alternative in step 10, then return to step 4. Do not import the React app as a Cloudflare website.

Cloudflare documents application creation under [Dashboard setup](https://developers.cloudflare.com/workers/get-started/dashboard/), and supplies a `workers.dev` address without requiring you to onboard a custom domain. [workers.dev routing](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/)

## 3. Paste the prepared Worker code

1. Open the **attendance-api** Worker and select **Edit code** (if available in your dashboard).
2. On your computer, open `C:\Users\MPSS\Desktop\LAP\attendance-app\cloudflare\supabase-proxy\worker.js` in your editor.
3. Copy the **entire file**. Replace the default Worker editor code with it. Do not copy a TypeScript source file or only part of the generated file.
4. Click **Deploy** / **Save and deploy**.
5. Turn your VPN off and open `https://attendance-api.YOUR_SUBDOMAIN.workers.dev/health`.

Before configuring the upstream, the expected response includes:

```json
{
  "ok": true,
  "service": "attendance-api",
  "configured": false,
  "message": "Set SUPABASE_URL to your original https://PROJECT_REF.supabase.co origin in Worker Settings."
}
```

This confirms that you can reach the Worker. If the browser shows a DNS/TLS/network error instead, stop before changing the app's API endpoint. Try your other usual connection (mobile data versus Wi-Fi) and report which connection works.

## 4. Set the Cloudflare variables

Open **Workers & Pages → attendance-api → Settings → Variables and Secrets → Add**. Add the following as **Text** variables:

| Variable name     | Value                                                                                                                 |
| ----------------- | --------------------------------------------------------------------------------------------------------------------- |
| `SUPABASE_URL`    | Your original `https://PROJECT_REF.supabase.co` URL                                                                   |
| `ALLOWED_ORIGINS` | `https://www.lap-attendance.vercel.app,https://lap-attendance.vercel.app,http://127.0.0.1:5179,http://localhost:5179` |

Do not include `/rest/v1`, `/auth/v1`, `/health`, query parameters, or quotes in the values. The origin list is one comma-separated line. The local addresses allow you to manually verify the app from your normal Vite development server. You may omit those two origins for production-only access.

Click **Deploy** to apply the variables. These steps follow Cloudflare's [environment-variable instructions](https://developers.cloudflare.com/workers/configuration/environment-variables/#add-environment-variables-via-the-dashboard).

Open `/health` again. The expected response is:

```json
{ "ok": true, "service": "attendance-api", "configured": true }
```

`configured: true` means the variables have valid syntax. It does **not** prove that the project exists, is awake, or accepts your login. The app verification below confirms the complete route.

## 5. Deploy the updated application code

Publish the application changes from this task through your usual Git/Vercel workflow. They include `src/lib/supabase.ts`, its configuration helper, the login setup messages, and `.env.example`. The Worker folder is tracked separately from the ignored `deployment/`, `design/`, and `supabase/` folders.

If Vercel builds an older commit without the new proxy setting, setting the variable alone will not reroute requests. Check that the deployment includes this change before proceeding.

## 6. Configure Vercel

Open **Vercel → your Attendance Admin project → Settings → Environment Variables**. For the **Production** environment, use:

| Variable                        | Value                                                                       |
| ------------------------------- | --------------------------------------------------------------------------- |
| `VITE_DATA_MODE`                | `supabase`                                                                  |
| `VITE_SUPABASE_URL`             | Keep your original `https://PROJECT_REF.supabase.co` URL                    |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Keep your existing publishable key                                          |
| `VITE_SUPABASE_PROXY_URL`       | The Worker origin, e.g. `https://attendance-api.YOUR_SUBDOMAIN.workers.dev` |

The proxy value must not end in `/health`. Save the settings, then create a **new production deployment** of the updated code. Vite embeds these values during the build. Existing deployments do not pick up changes automatically. [Vercel environment variables](https://vercel.com/docs/environment-variables), [Vite environment variables](https://vite.dev/guide/env-and-mode)

Choose **Config**, not Secret, for all four frontend variables. Keep the `VITE_` prefix. Vercel supports it; Vite needs it to expose this public configuration to browser code. A browser-exposure warning is expected for the Supabase publishable key. Never use a secret/service-role key. Cloudflare Worker variables stay unprefixed (`SUPABASE_URL` and `ALLOWED_ORIGINS`).

Do not add arbitrary preview deployment domains to the allowlist. If you need a preview, explicitly configure its origin and the intended Supabase project.

## 7. Verify from Myanmar with the VPN off

Use your hosted app and manually perform these actions:

1. Sign in with your existing owner email and password.
2. Open the dashboard and student list; refresh the page and confirm you remain signed in.
3. Make a small intended change, save, refresh, and confirm it persisted.
4. Upload a report you are ready to import and follow the usual session review process. Download the stored original from import history.
5. Confirm you can sign out and sign in again. Let the app remain open long enough to confirm session refresh works during ordinary use.

In browser Developer Tools → **Network**, Supabase API requests from Myanmar/unknown locations should go to your **workers.dev** hostname. Other recognized IP countries initially connect directly to Supabase. See [Automatic connection routing](12-automatic-connection-routing.md) for the saved fallback behavior. Auth uses `/auth/v1/...`, database requests use `/rest/v1/rpc/...`, and original files use `/storage/v1/...`. Successful Worker responses include `X-Attendance-Proxy: cloudflare`. Once a direct network failure is saved, no later request or page load should try the direct API again in that browser.

The app preserves the existing Supabase login-storage key when switching hosts, though an expired session may still require login. Your original project URL can still appear in the built configuration; what matters for reachability is the destination of actual API requests.

## 8. Optional local development

Add the actual Worker origin to your existing `.env`:

```env
VITE_DATA_MODE=supabase
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_EXISTING_PUBLISHABLE_KEY
VITE_SUPABASE_PROXY_URL=https://attendance-api.YOUR_SUBDOMAIN.workers.dev
```

Restart the Vite server after changing environment settings. Start it yourself when ready:

```powershell
Set-Location 'C:\Users\MPSS\Desktop\LAP\attendance-app'
npm run dev
```

Open http://127.0.0.1:5179. The Worker allows that exact origin. `.env` is ignored by Git; do not commit it. The coding agent does not leave the development server running.

## 9. Troubleshooting

| Symptom                                | What to check                                                                                                                                   |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `/health` is unreachable with VPN off  | The Worker hostname itself may be unreachable on that connection. Compare Wi-Fi/mobile data before switching the app.                           |
| `configured: false`                    | Set the Worker variable `SUPABASE_URL` to the original project origin and deploy the variable change.                                           |
| Worker root `/` returns 404            | Expected. Use `/health`; this Worker serves API traffic, not a homepage.                                                                        |
| CORS error / origin denied             | Compare the app's final browser origin with `ALLOWED_ORIGINS`, including www, protocol and port. Add only the exact intended origin and deploy. |
| Requests still go directly to Supabase | Deploy the updated frontend code, set the proxy variable for the correct Vercel environment, and rebuild. Hard-refresh afterward.               |
| Proxy URL setup message                | Use an HTTPS origin only. Remove `/health`, other paths, query strings and surrounding quotes.                                                  |
| 502 from Worker                        | Check the original Supabase URL, project status, and upstream reachability. The Worker could not complete the upstream request.                 |
| Supabase 401/403 response              | Check the publishable key, owner account, session and existing owner/RLS configuration. The proxy does not grant access.                        |
| API route is not supported             | This Worker supports the current app's password Auth routes, four RPCs and original-report bucket only. New features may need a route added.    |
| Request-header preflight denied        | Compare the requested header with `FORWARDED_HEADERS` before allowing it; SDK upgrades can add headers.                                         |
| Cloudflare 1027 / 1102                 | Check daily request usage / CPU limits in Cloudflare.                                                                                           |

The current app does not use Realtime, OAuth, magic links or password-reset email links. Those need separate routing/redirect work if added later. The proxy does not make Supabase's administration dashboard or email links automatically reachable.

Automatic routing requires both frontend URLs. Do not clear `VITE_SUPABASE_PROXY_URL` to force direct access. A saved direct-failure preference can be reset by clearing its project-specific localStorage entry, which explicitly permits the app to select a fresh route on the next visit. No database migration or data transfer is involved. See [Automatic connection routing](12-automatic-connection-routing.md).

## 10. Optional CLI deployment if no dashboard editor is available

The repository includes `wrangler.jsonc`. From PowerShell, use these commands:

```powershell
Set-Location 'C:\Users\MPSS\Desktop\LAP\attendance-app'
npm run build:worker
npx wrangler@4 login
npx wrangler@4 deploy --config cloudflare/supabase-proxy/wrangler.jsonc
```

If npm asks permission to download Wrangler, accept. `login` opens Cloudflare's own browser authorization page. Authorize your account yourself. `deploy` publishes the included Worker and prints its URL. Use the dashboard to add the variables from step 4, then continue through the remaining steps. The configuration preserves dashboard variables on subsequent CLI deployments. No automatic Git deploy is configured for the Worker.

For later code changes, run `npm run build:worker` and repaste the generated `worker.js`, or rerun the CLI deploy command. [Wrangler deployment commands](https://developers.cloudflare.com/workers/wrangler/commands/workers/), [Wrangler keep_vars setting](https://developers.cloudflare.com/workers/wrangler/configuration/)

## Cost and scope

The Worker uses only ordinary HTTP forwarding and needs no paid bindings. Workers Free currently allows 100,000 requests/day across the account and 10 ms CPU per invocation; network waiting time is excluded from CPU time. Preflight requests also reach the Worker, although browsers can cache their permission response. The existing 10 MiB report limit remains enforced by the app and Supabase. Check usage in Cloudflare occasionally. Supabase/Vercel quotas remain separate. [Cloudflare limits](https://developers.cloudflare.com/workers/platform/limits/)

The supplied code is prepared for owner deployment. Local compilation does not establish Myanmar ISP reachability, Cloudflare account configuration, or live Supabase login/storage success. Complete the manual steps above before relying on the proxy for attendance work.
