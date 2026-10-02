# Connect the implemented workflows to Supabase

Updated October 1, 2026. The React app now has a relational Supabase repository and private original-report storage. The owner confirmed that login reaches the previous "Owner access confirmed" screen. That screen has been replaced by the normal administrator layout.

## If login already works

1. Open `supabase/004_connected_workflows.sql` in this project.
2. In your existing Supabase project, open **SQL Editor → New query**.
3. Copy the complete file into the query and **Run** it as the administrative database role.
4. Expect a successful query. Notices about an existing column, index, or trigger are normal when reapplying this migration. An ERROR is not success.
5. Refresh the React app at **http://127.0.0.1:5179**. If the screen still shows the missing-migration message, select **Retry**. Sign in again if needed.
6. With an empty database, the app shows **Create your first semester**. Create the semester, add its group, create a class with its inclusive date range and weekly schedule, then register/enroll students.
7. Refresh after saving a record to manually verify persistence. The records should remain and be visible in Supabase Table Editor.

If the development server is stopped, start it yourself:

```powershell
Set-Location 'C:\Users\MPSS\Desktop\LAP\attendance-app'
npm run dev
```

Keep your existing .env settings:

```env
VITE_DATA_MODE=supabase
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_ACTUAL_KEY
```

No additional account, package, secret key, or paid service is required for this integration. A publishable key is intended for frontend use; data access is controlled by Auth and database policies. Never place a secret/service-role key or database password in frontend configuration. [Supabase API keys](https://supabase.com/docs/guides/getting-started/api-keys)

## Created Date columns

After 004 has been applied, run the complete **supabase/005_created_dates.sql** file in **SQL Editor → New query**, then refresh the app. If 004 is already installed, only 005 is needed for this update. This migration exposes existing database-created timestamps and does not rewrite dates or records. It preserves the RPC's owner check and existing permissions.

All 13 table views now include a sortable Created Date column with date and time in Asia/Yangon. Student rows use registration creation; semester/session rows use their record creation; group enrollment, semester history, and computed attendance results use semester enrollment creation. Attendance rows use attendance record creation; import history and changes use the time the import was applied. Results are calculated live and have no separate saved creation date.

Unsaved import previews show **Not saved yet**. Legacy local records or responses from the older RPC show **Not recorded** until an actual stored timestamp is available. The app does not substitute a join date, session date, or today's date. New local records receive timestamps once when saved; edits, restoration, and undo preserve them. Import history's previous Imported at column is represented by Created Date rather than displaying the same timestamp twice.

## Migration order for a fresh project

Run 001_schema.sql once on a fresh project. Manually create/confirm the owner under Authentication → Users, then apply 002_allow_owner.sql with that email. Apply 003_owner_access.sql, then 004_connected_workflows.sql, then 005_created_dates.sql.

For the owner's already-configured project, apply 004 if needed, followed by 005. Do not rerun 001 or recreate the owner.

004 is additive and can be reapplied. It adds a private revision counter, session generation/removal metadata, completion preservation, attendance change tokens, workflow activity descriptions, and a relational import-change table. It preserves records, original files, owner-only read policies, and the prohibition on direct browser table writes.

## What is connected

- Semester, group, and class creation/editing; archive/restore; deletion of empty groups/classes.
- Weekly session generation, schedule changes, manual sessions, soft removal/restore, and rescheduling without discarding attendance.
- Student registration/editing, primary/additional email ownership, student-list import, and enrollment into every class in the selected group.
- Withdrawal/transfer/reversal with a required reason and database-derived lifecycle history. The original enrollment remains.
- Attendance drafts, remarks, finalization, earlier regular-session credits, and class completion.
- Attendance import review, manual email matching, approval of additional emails, duplicate-file protection, stored raw reviewed rows and attendance evidence.
- Private original CSV/XLSX upload/download, import history, and undo that preserves later changes.
- Dashboard statistics and report exports use the records returned by Supabase.

The actual Zoom report sample is still required to confirm its worksheet/column/date formats. This implementation connects the existing generic CSV/XLSX flow; it does not invent a Zoom-specific mapping.

## Save and access behavior

The app sends changed entities to an owner-checked transaction. Feature-specific SQL helpers validate and write the existing relational tables. JSON is a transport format; there is no JSON workspace snapshot table.

A private revision counter serializes changes, including changes through the earlier RPCs. Every save supplies the revision last read by the app. If another tab/device changed records, the entire stale save is rejected and the cache refreshes. Review unsaved form values before submitting again. Mutations within one browser are queued. Database functions can be called through Supabase RPC. [Supabase database functions](https://supabase.com/docs/guides/database/functions)

Import before/after state is captured by the database. Undo compares the import's attendance revision, status, source, and remark before restoring it. Emails approved during import remain saved. Original files remain stored.

Finalization is permitted only after the scheduled session ends. Earlier regular sessions count as pre-enrollment credit. Approved leave remains in the attendance denominator; more than three leaves fails that class. Extra, removed, and draft sessions do not contribute to results.

A new enrollment in an already-finalized regular session receives Present credit when the session precedes its join date. Other already-finalized dates receive Absent where no attendance exists, keeping finalized rosters complete.

## Storage and operational limits

Original files upload directly into the private zoom-originals bucket at owner-auth-id/import-id/original.csv or original.xlsx. The frontend hashes the original file, uploads without overwrite, then commits the reviewed import. The database checks the owner-specific path and that the object exists. Downloads require the signed-in owner.

Files are limited to 10 MiB and worksheet rows to 5,000. The server validates reviewed-row count and rejects repeated unresolved/conflicting decisions. Weekly schedules are limited to 520 occurrences.

Storage upload and database commit are separate operations. If the database save fails after upload, retrying in the same review screen reuses that uploaded original. Navigating away can leave an unreferenced object; inspect imports.storage_path before manually cleaning such objects in the dashboard. Never remove a file referenced by an import, including an undone import.

The repository currently reads one consistent owner workspace and caches it; table search/sort/pagination remain in the browser. Files are downloaded only on request. This fits the initial single-administrator workflow. Large attendance histories should move to feature-scoped, paginated RPC reads before significantly expanding usage.

Local preview remains available only through Vite development mode with VITE_DATA_MODE=local. Its data and originals stay separate from Supabase and are not migrated automatically. Sign-out clears the in-memory workspace cache.

## Verification and remaining work

TypeScript, lint, formatting, and production-build checks verify the frontend. SQL compilation and a local PostgreSQL walkthrough use isolated platform stand-ins, not the hosted Supabase service. No automated test suite or new test cases are included.

The owner needs to apply any remaining migrations (004 and 005) and manually check real login, CRUD, refresh persistence, file upload/download, undo, and denial of unauthorized access in the hosted project. Real Storage/network behavior and the supplied Zoom sample cannot be confirmed by the local SQL walkthrough.

No hosted SQL or settings were changed by the coding agent. Vercel deployment and final Myanmar wording review remain separate steps.
