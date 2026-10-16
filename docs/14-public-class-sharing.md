# Read-only public class sharing

The administrator can share one class with anyone who has its link. Students do not sign in. Each link permits only that class, all its enrolled students, and its finalized sessions. Draft and removed sessions are denied, including requests made directly to the API. The existing admin portal still requires login.

## Enable it on your hosted app

1. In your existing Supabase project, open **SQL Editor → New query**.
2. Open `supabase/010_public_class_sharing.sql` locally. Copy the whole file, run it in SQL Editor, and confirm Success. Apply it after migration 009 on the current 008 workspace schema. It is additive, can be reapplied, and does not enable any public links automatically.
3. Open your existing Cloudflare Worker → **Edit code**. Replace the entire code with the updated `cloudflare/supabase-proxy/worker.js`, then **Deploy**. Keep the existing `SUPABASE_URL` and allowed origins. Two explicit RPC routes were added; an old Worker will reject them.
4. Publish the frontend changes through your normal Git/Vercel workflow. No new environment variables, keys, packages, or Cloudflare bindings are required.
5. Sign in to your hosted portal, open a class, and click **Share class → Create link → Copy link**. Open it in a private browser window before giving it to students.

The `/supabase/` directory is intentionally ignored by Git in this project. Deploying the frontend does **not** apply this SQL. The coding agent has not changed hosted SQL, Cloudflare, or Vercel settings.

## What students see

- Class, group, semester names, and the class student list.
- Only finalized, non-removed sessions, with their existing Week numbering, dates, and times in the semester timezone.
- All enrolled students' Present, Absent, Leave or Unmarked status and remarks inside a published session.
- Search, sorting, pagination, language selection, and a Refresh button.

Extra sessions can be viewed if finalized but still do not count toward attendance. A shared class with no finalized sessions shows its roster and an empty-session message. All enrollment lifecycle states remain in the roster; no lifecycle reasons are published.

The public API never returns contact emails, phone numbers, private student notes, alternate Zoom names, originals, import evidence, audit events, or internal attendance sources. Remarks are intentionally public: anything typed into an attendance remark is visible on the shared finalized session.

## Link controls

- **Create link** enables sharing for this class only. The dialog can retrieve the same active link later.
- **Replace link** invalidates the previous link and creates a new one; redistribute it to students.
- **Revoke link** disables sharing until you create another link.

The link stays active until replaced, revoked, or its class is deleted. Link possession grants read access: it may be forwarded. Revocation blocks subsequent requests, including page navigation, refresh, and focus-triggered revalidation. It cannot retract data that someone has already seen, copied, or left open without further requests. Moving a session back to Draft removes it from future public responses.

## Data boundary

`private.class_share_links` stores a cryptographically random 256-bit token and its SHA-256 lookup hash. The raw token is stored privately so only the class owner can retrieve the existing link. Neither anonymous nor authenticated users have table access to the link store. The owner-only sharing RPC checks the class's semester owner and uses expected-token checks to prevent stale browser tabs replacing newer links.

The only anonymous RPC is `attendance_public_class`. It resolves the class from the token, verifies session ownership and finalization, and constructs a small explicit JSON response. Invalid, revoked, cross-class, draft, and removed-session requests all get HTTP 403. No anonymous SELECT or write grants are added to the workspace tables. Admin RPCs retain their existing authentication and owner checks. Public calls contain a publishable API key but never the signed-in owner's token or cookies. Public startup initializes connection routing without creating a Supabase Auth client.

Links use `/shared#key=...` and `/shared/sessions/SESSION_ID#key=...`. The fragment is not sent in normal page requests or referrer headers; the token goes in the RPC body. Application and Worker code do not log request bodies. Public pages have noindex/nofollow and private/no-store headers; those are supporting measures, while access is enforced by the database function. No search-index secrecy or protection from an authorized reader copying data is promised.

The public API is included in the existing safe-read fallback list. Sharing changes are not automatically replayed after interrupted writes; the dialog re-reads settings to discover the result.

## Local review

Local preview supports the same UI and field projection using browser sample data. These links work only in that same browser profile, not on another device or in a private window. Hosted sharing requires the SQL migration and updated Worker above. Local preview is disabled in production.

## Manual release walkthrough

1. Finalize a session, keep a second in Draft, and remove a third. Share the class.
2. Open the link while signed out. Check the full class roster and only the finalized session. Open its attendance and remarks; there should be no edit actions.
3. Check browser Network → `attendance_public_class`. Verify there is no owner Authorization header, no cookies, and no emails, phones, original Zoom data, or audit history in the JSON.
4. With that token, request a Draft, removed, or different-class session ID. Each must return 403 and render Forbidden, with no protected session details.
5. Try an altered token, a link without a token, and an unknown path under `/shared/`. Each must render Forbidden.
6. Revoke the link in admin. Refresh the student window: Forbidden. Create another link; the original remains denied. Replace it and verify the same behavior.
7. Return a published session to Draft; refresh its shared details and confirm Forbidden.
8. Confirm a second signed-in account cannot read or change another owner's sharing settings. Confirm normal private admin pages still require login.
9. Repeat on your usual Myanmar connection with VPN off, and through your normal VPN. This validates actual Worker/direct reachability, which local build checks cannot establish.
