# Name-only Zoom attendance imports

Updated October 16, 2026. These rules replace email-only attendance matching. Registered student emails and additional contact emails are retained, but they do not influence attendance matches and are no longer requested in attendance column mapping. Student registration/enrollment import keeps its existing email requirements.

## Review and approval

- Exact registered names or previously approved Zoom names match automatically within the enrolled group. Matching ignores case and repeated whitespace and normalizes Unicode. It does not remove all spaces, punctuation, or personal prefixes for automatic matching.
- Close names are suggestions only. Select the correct student to confirm; the personal current Zoom name is selected for remembering when it differs from an existing approved/registered name. Apply attendance to save the approval. Uncheck it to make a session-only match.
- A report value such as `Current Name (Original Name)` is split into two names. The original name is offered separately, unchecked. Saving the current name does not silently approve the name in parentheses.
- If current/original names point to different enrolled students, the row stays unresolved and describes the conflict. No first-match shortcut is used.
- Generic device names cannot be approved as student aliases. Examples include iPhone and numbered variants, iPad, Samsung/Galaxy, Android, common Redmi/OPPO/Vivo models, Zoom User, and generated Windows desktop/laptop labels. The maintained list matches complete labels, not device words embedded in personal names. It is a bounded list of common forms, not an exhaustive device catalogue.
- Approved names persist on the student profile across sessions, browsers, and semesters through Supabase. Student details has an Approved Zoom names panel to add or remove them. Removing a saved alias does not modify the registered name or past attendance. The registered name itself still matches normally.
- Names already owned by another student cannot be silently transferred. A manual session-only selection is possible; correct the saved name in student details before approving it for another profile.

## Ignored report rows

Automatically ignored rows remain visible with an explanation:

1. `In waiting room` is Yes/True/1.
2. A host/co-host role, a `(Host)`/`(Co-host)` name suffix, or the exact meeting host name.
3. The teacher-designated co-host Helen / Naw Su Thinzar Maung, including their parenthesized report form.
4. A current display name that is a recognized generic device label.

A real current name followed by `(iPhone)` can still match the real student. The original device name is excluded from saving. Ignored rows never create attendance credit and cannot be reassigned from the review table. A waiting-room entry does not hide a separate valid in-meeting entry from the same person. Repeated joins and rename variants resolved to one student produce one attendance result.

Ignoring a row does not immediately mark any student Absent. Existing session finalization rules handle unmarked eligible students. Attendance keep/replace conflicts still require a choice; repeated rows for one student share that choice.

The review table shows possible students, saved-name controls, original names, and report row numbers. Approvals are saved only when the reviewed import is applied. Import undo restores eligible attendance cells and keeps approved names until explicitly removed.

## Supabase setup before deployment

1. In the existing Supabase project, ensure the current `008_multi_tenant_workspace.sql` migration is already installed. Do not change the project's authentication or ownership rules for this update.
2. Open the complete local `supabase/009_zoom_name_matching.sql` file and run it in **SQL Editor** as the database administrator. It adds `students.zoom_names`, name-decision evidence, and updated existing workspace/student-save/import functions. It retains contact emails, past imports, audit history, attendance undo, original-file checks, and the current account scoping.
3. The migration runs in a transaction and can be reapplied. Resolve any SQL error before deploying. Do not rerun older function-defining migrations afterward because they would replace the new functions.
4. Deploy the frontend changes normally to Vercel. No environment-variable, Worker route, or Worker code change is needed.
5. Refresh the app. The new workspace response includes `zoomMatchingVersion: 1`; until it does, connected name approvals/imports show a migration-required message instead of silently losing saved names. Local preview works without SQL.

The `supabase/` directory is deliberately ignored by this repository's existing .gitignore. The migration exists locally and must be applied manually; pushing frontend changes does not run SQL on Supabase.

## Supplied report verification

The provided registration workbook contains 26 names. The Zoom sample has 75 data rows with `Name (original name)` and `In waiting room` columns. The initial name review identifies 20 waiting-room rows, 2 host rows, and 3 designated co-host rows for automatic exclusion. It initially matches 35 report rows and leaves 15 report rows for review. These are row counts, not unique student attendance totals or confirmed absences.

No real attendance has been imported by the coding agent, and no uncertain identity has been approved on the owner's behalf. In-memory verification uses the source report and disposable data. Hosted migration and end-to-end import remain owner-operated.

## Manual review after deployment

1. Open the intended October 14 session and import the supplied report. Check the destination before applying.
2. Confirm the name mapping selects `Name (original name)`, not `Host name`, and the waiting-room mapping selects `In waiting room`. Ignore reasons should agree with the report.
3. Review names such as concatenated names and personal prefixes. Select the student only after confirming the identity; inspect Remember this Zoom name.
4. For a current exact match with an original name in parentheses, explicitly select the original-name checkbox if it should be remembered. Leaving it unchecked must not save it.
5. Resolve every remaining row or Ignore it, choose keep/replace for existing attendance conflicts, then Apply attendance once. Verify one result per student on the session page.
6. Refresh and inspect Student details → Approved Zoom names. Import another report containing an approved name and confirm automatic matching without email.
7. Remove a saved name and confirm that it no longer matches automatically in a later preview, while past attendance stays unchanged. Close-name suggestions can still appear for manual review.
8. Confirm registration import still validates student email as before, and attendance import gives the same decisions whether attendee emails are absent, changed, or conflicting.

## Implementation locations

- `src/utils/mapZoomReport.ts`: column detection and row extraction, shared with the workbook reader.
- `src/features/imports/lib`: splitting current/original names, ignored-row rules, name suggestions, initial review and import application.
- `src/features/imports/const/zoomNameRules.ts`: common device labels and the teacher-designated co-host exclusion.
- `src/features/imports/components`: resolution and explicit name-approval controls.
- `src/features/students/lib`, `schemas`, `components`: persistent name ownership, validation, and profile management.
- `supabase/009_zoom_name_matching.sql`: additive persistence and authoritative import workflow.
