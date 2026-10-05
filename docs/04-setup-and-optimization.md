# Supabase and Vercel setup

Prepared September 29, 2026 from the official documentation linked below. Nothing has been deployed or applied to a hosted project. Use the smallest suitable setup first; this is one administrator's app.

## What is provided

- `supabase/001_schema.sql`: baseline tables, constraints, indexes, owner-only read policies, private storage, audit triggers, student creation and enrollment lifecycle RPCs, and attendance summary view.
- `supabase/002_allow_owner.sql`: manually allow your existing Auth account, after replacing the email placeholder.
- `supabase/003_owner_access.sql`: caller-only owner authorization check.
- `supabase/004_connected_workflows.sql`: additive relational reads/writes, schedule/enrollment/attendance/import/undo workflows, and original-file metadata access.
- `deployment/vercel.json`: Vite deployment template to copy into the final app root.
- `deployment/.env.example`: browser-safe configuration names.

001 is the schema foundation. Apply 003 and 004 after the owner setup to enable the connected React app. Transactional helpers enforce profile/email edits, schedules, enrollment credits, attendance, import review, and revision-aware undo. Email ownership conflicts require administrator resolution; the importer cannot claim another student's email. Direct browser writes to core tables remain denied. Read 10-connected-supabase.md for the exact migration order. The HTML preview remains a separate design artifact.

## Supabase: create and configure

1. Create a dedicated project. For use from Myanmar, compare available nearby regions; Singapore is a reasonable starting candidate. Keep any future server-side functions close to the database.
2. Keep the generated database password outside the repository. It is not your app login password.
3. In SQL Editor, run `001_schema.sql` once on a fresh project. It creates application tables without dropping existing ones. Use a versioned migration for later changes, not repeated execution of the baseline.
4. In Authentication → Users, manually create your email/password account. Confirm that account through the administrative creation flow. Never insert plaintext passwords into SQL tables.
5. In Auth settings, disable **Allow new users to sign up** and **Allow anonymous sign-ins**. Keep email/password enabled; leave unused social providers off. Disabling sign-up permits existing accounts to sign in. [Auth configuration](https://supabase.com/docs/guides/auth/general-configuration)
6. Replace the email placeholder in `002_allow_owner.sql` with your exact account email and execute it. The database looks up your Auth user ID; only one administrator is permitted. If that account's email later changes, update the allowlist through SQL Editor after reviewing the change.
7. Use the project URL and **publishable key** for the frontend. The publishable key is intended for browser use; authorization comes from Auth plus RLS. Never put a secret key or database password in the browser. [Supabase API keys](https://supabase.com/docs/guides/getting-started/api-keys)
8. Set the Auth Site URL to the final HTTPS domain. Allow only the redirect routes used by the app; add localhost for local development and a dedicated preview URL if needed. Avoid broadly allowing unrelated preview domains. [Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls)

Password-reset email delivery should be tested before launch. Configure custom SMTP if using a self-service recovery flow; do not assume the development mail service is a production recovery solution.

## Supabase: storage and access

- The schema creates `zoom-originals` as a **private** bucket, initially limited to 10 MiB per file.
- Store each original at `<owner-auth-id>/<import-id>/<generated-filename>.csv` or `.xlsx`. Keep the human filename in the import record.
- Upload with overwrite disabled. No client update/delete policy is provided, preserving originals even when an import is undone.
- Only the approved owner can upload or retrieve objects. Use authenticated downloads or short-lived signed URLs; never use a public bucket URL.
- File extension checks are only one layer. The importer must validate actual CSV/XLSX structure, decompressed workbook size, and row limits. MIME types vary across spreadsheet tools, so validate with representative files before adding restrictive MIME allowlists.

Supabase supports private bucket access through policies and bucket-level limits. [Storage fundamentals](https://supabase.com/docs/guides/storage/buckets/fundamentals), [Storage access control](https://supabase.com/docs/guides/storage/security/access-control)

## Supabase: useful optimization settings

| Area                | Starting choice                                     | Why                                                                                                                |
| ------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Database size       | Smallest suitable plan/compute                      | One administrator does not need a large database server initially.                                                 |
| Realtime            | Leave off for these tables                          | Refetch after a save; no live multi-user collaboration is required.                                                |
| Frontend connection | Supabase Data API                                   | Do not create raw database connections from a browser.                                                             |
| Query scope         | Filter by semester/class/session and paginate lists | Avoid downloading the complete attendance history for every page.                                                  |
| RLS                 | Owner helper wrapped in a scalar SELECT             | The helper does not depend on each row and can be evaluated once per statement.                                    |
| Indexes             | Use supplied group/session/student lookup indexes   | Supports the expected screens; add more only for measured slow queries.                                            |
| Charts              | Query summary data and cache within the app         | Invalidate after relevant edits; avoid frequent background polling.                                                |
| Upload path         | Browser → Supabase Storage                          | Avoid routing files through a Vercel function unnecessarily.                                                       |
| Connection pooling  | No pool tuning needed for browser Data API use      | If serverless raw SQL is added later, use an appropriate pooler rather than one persistent connection per request. |

Use Performance Advisor and real query plans before increasing resources. Security-invoker views preserve the underlying RLS behavior. [RLS guidance](https://supabase.com/docs/guides/database/postgres/row-level-security), [Connection options](https://supabase.com/docs/guides/database/connecting-to-postgres), [Production guidance](https://supabase.com/docs/guides/deployment/going-into-prod)

Low-activity Free projects may pause, so verify availability before weekly class administration. Do not assume an app used once a week will always stay awake. Choose a paid plan if uninterrupted availability becomes necessary. [Production availability guidance](https://supabase.com/docs/guides/deployment/going-into-prod)

Keep separate backups of the **database and original report files**. Database backups do not contain Storage object contents. On Free, arrange periodic database exports and offline copies of uploaded originals; paid backup features have plan-specific retention. [Backup documentation](https://supabase.com/docs/guides/platform/backups)

## Vercel: deploy the final React app

The Vite project, package.json, lockfile, root vercel.json and production build now exist. Read docs/08-react-implementation.md before deployment: connected relational workflows are implemented, but applying 004 and hosted workflow verification remain pending. Production builds keep local preview access disabled.

1. Put `attendance-app` in its own repository, or explicitly select its directory if using a larger repository. It must not use the sibling Environment project's root.
2. Import the repository into Vercel and select **Vite**.
3. Set project root to the directory containing the future `package.json`.
4. Build command: `npm run build`. Output directory: `dist`. Install using the package manager matching the committed lockfile. Use a supported Node LTS version consistently in local development and Vercel.
5. Use the included root `vercel.json`. Its rewrite serves the SPA entry point for routes such as `/students/...` and excludes `/api` for the connection-routing function. Do not overwrite it with the older deployment template. [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite)
6. Add `VITE_DATA_MODE=supabase`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, and `VITE_SUPABASE_PROXY_URL` as **Config** variables in Vercel. See [Automatic connection routing](12-automatic-connection-routing.md). Use a separate staging Supabase project for previews, or leave preview data access unconfigured. Do not let unreviewed preview code write to your production student data.
7. Set the Supabase Auth URL configuration to match the deployed domain. Redeploy after build-time environment variables change. Vite includes `VITE_` variables in the client bundle, so only browser-safe values belong there. [Vercel environment variables](https://vercel.com/docs/environment-variables), [Vite environment variables](https://vite.dev/guide/env-and-mode)
8. Check login, logout, direct-link refresh, file download, and both desktop and mobile layouts on the deployed domain before real data use.

## Vercel: cost and performance choices

- Use the static Vite frontend initially. Add server functions only when there is a specific need.
- Load XLSX import/export code only when opening those workflows; avoid making every dashboard visit download the spreadsheet parser.
- Reuse the design tokens and a small icon set; avoid loading multiple UI frameworks.
- In production, bundle/subset appropriate licensed fonts for English and Myanmar rather than relying on third-party font requests. The preview uses local system fallbacks to open offline.
- Keep normal Vite asset hashing and Vercel static delivery. Do not publicly cache protected API responses.
- Review usage occasionally; no background scraping, cron jobs, or always-on bot is needed.
- Vercel Hobby is intended for personal, non-commercial use. Check whether your class administration use qualifies; a single user does not itself establish eligibility. Choose an appropriate plan for commercial use. [Vercel Hobby plan](https://vercel.com/docs/plans/hobby)

## Launch validation still required

- Test the actual Supabase Auth and Storage integrations; local PostgreSQL tests only validate SQL behavior with minimal platform stubs.
- Prove deny behavior for anonymous and non-owner accounts, including direct data requests and original file downloads.
- Manually verify the supplied transactional workflows after applying 004; keep direct table writes denied.
- Verify actual Zoom reports, failed import retries, duplicate files, and undo behavior.
- Check Myanmar wording with the owner and bundle a consistent production font.
