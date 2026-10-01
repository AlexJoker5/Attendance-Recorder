# Student attendance app: development specification

Status: updated October 1, 2026. The React app and local workflows are implemented alongside the preserved HTML design and baseline SQL. Relational Supabase workflow persistence, production original-file storage, representative Zoom validation, and deployment remain pending. See [React implementation](08-react-implementation.md).

Companion documents: [database design](02-database-design.md) and [page layouts](03-page-layouts.md).

## Purpose and stack

Build a private attendance app for one administrator. Register students, organize weekly classes into four-month semesters, import Zoom attendance files, resolve matches, and track attendance requirements.

Use React, Vite, Tailwind CSS, Supabase, and Vercel. This app does not join Zoom meetings or record participants live. No Zoom API integration is required for file imports.

## Confirmed product rules

### Access

- Only the owner's manually created Supabase Auth account can access the app.
- No public sign-up or student accounts.
- Use email and password login. Passwords belong in Supabase Auth, never application tables.
- Protect database records and uploaded files, not just pages in the interface.
- The owner's actual account ID and email will be supplied during setup.

### Students and enrollment

- Full name and primary email are required. Phone and notes are optional proposed fields.
- No visible student ID is needed. Use permanent internal identifiers.
- Keep a student's profile across semesters. Additional verified emails mean administrator-approved emails, not email-link verification.
- Emails must be unique across both primary and additional emails for all students. Compare trimmed, case-insensitive values; do not remove dots or plus suffixes.
- Each semester has new teaching groups, even if names and students are unchanged.
- A student may have only one group enrollment in each semester.
- Enrollment includes every class in that group. There is no individual class selection.
- Each class has its own weekly schedule and sessions.
- A student joining partway through receives Present credit for earlier held sessions in the semester for their classes. Store the reason separately as pre-enrollment credit.
- Preserve actual historical records and surface conflicts instead of silently replacing them with credit.

### Sessions

- Generate dates from semester boundaries and a weekly schedule; do not assume four months equals 16 sessions.
- Support rescheduling, cancelling, and adding makeup or extra sessions. Extra sessions never count toward attendance percentages or leave-limit calculations. Their attendance may still be recorded for reference.
- Keep session occurrence state (scheduled, held, cancelled) separate from attendance review state (unrecorded, draft, finalized).
- Proposed default: Asia/Yangon time zone. Store scheduled instants consistently and use the configured zone for local dates.
- Cancelled, future, and extra sessions do not affect attendance statistics.

### Matching and importing

- Accept CSV and XLSX. The actual Zoom file format remains unvalidated until a representative report is provided.
- Select semester, group, class, and session before import. Preview the target prominently.
- Preview rows and permit name/email column mapping and Excel worksheet selection.
- Only email can match automatically. Names are shown for manual identification, never fuzzy-matched or saved as aliases.
- Check primary and additional verified emails. An automatic match must also satisfy enrollment for the session's group.
- Unknown or blank emails require manual selection, or an explicit decision to ignore the row.
- Show clear conflict descriptions: email, current owner, selected student, and the reason automatic processing stopped.
- Offer to save an unknown email as an additional verified email during manual matching. The checkbox starts unchecked.
- A blank email cannot be saved. It supports only a session-specific match.
- Preserve the primary email when adding an additional email.
- A conflicting additional email may be explicitly reassigned; a primary email cannot be moved from an import. Profile correction is a separate action.
- Existing approved emails can be viewed and removed. Removal changes future matching, not historical attendance.
- Combine repeated attendee rows into one attendance record per student per session.
- Preserve the original uploaded file privately, including after undoing the import.

### Finalization and merging

- Save review work as a draft without affecting finalized statistics.
- Finalize only after outstanding rows have been resolved or explicitly ignored.
- Mark matched students Present and remaining eligible, unmarked students Absent.
- Preserve pre-enrollment credits, Leave, and manual decisions. Show conflicting changes for resolution.
- Additional reports merge by default. Absence from a later report never erases presence from an earlier one.
- A new match may change an absence generated by finalization to Present.
- Keep remarks during imports and status changes.
- Retain provenance linking all contributing reports to the resulting attendance record.

### Attendance and results

- Statuses are Present, Absent, and Leave. Unmarked is a temporary lack of a settled status.
- Every record may have an optional remark.
- Attendance edits occur only on the individual session page. Summary tables are read-only.
- Percentage = Present / (Present + Absent + Leave) x 100.
- Leave counts in the denominator, not as Present.
- At least 75% attendance is required. Compare the unrounded value.
- More than 3 Leaves per class per semester triggers failure for that class.
- Withdrawal or transfer immediately fails every class belonging to the original semester enrollment. Preserve the group assignment and records; transfer does not create a second enrollment.
- The owner can reverse either action with a reason. Restore active status and recalculate from preserved attendance; reversal does not guarantee passing if attendance or Leave rules still fail.
- Continue recording attendance after failure and recalculate if records are corrected.
- Mid-semester attendance below 75% is At risk. The fourth Leave produces Failed — leave limit exceeded.
- Final results require completed review of the class's semester sessions. Meeting attendance requirements does not imply academic grading beyond these rules.
- Pre-enrollment credits count as Present; disclose their count separately.
- No eligible finalized sessions means No attendance data, not 0% or Passed.

## Reporting and history

- Home page centers on groups and classes in the selected semester, with statistics and analytics.
- Provide read-only class matrices, student details, and group summaries. Results remain separate by class.
- Exports: session attendance, class-semester attendance, and student-semester report, in both XLSX and CSV.
- Multiple tables may use Excel worksheets or separate CSV files. Export the applied filters and calculation context.
- Include remarks, status totals, leave counts, percentage, and result where relevant.
- Record attendance corrections, import actions, and email association changes.
- Undo previews its impact. Preserve later manual corrections, other import evidence, and the original file.

## Proposed implementation defaults

These defaults make the design implementable; they are not additional requirements explicitly chosen by the owner.

- Apply pending email saves and reassignments when finalizing an import, after rechecking conflicts.
- Count Leave toward failure only in finalized, held, attendance-counting sessions; show pending Leave separately while drafting.
- Permit reopening attendance for correction, then refinalize. Exclude that draft session from official summaries and visibly indicate the pending review.
- Use a version check when saving so two open browser tabs cannot overwrite each other silently.
- Add all group members to newly created classes from that class's first session. No obligations exist before the class began.
- Retain historical students and semesters through archival. Do not cascade-delete their attendance.
- While withdrawn/transferred, propose freezing future attendance generation for that enrollment while keeping the failure override. On reversal, preview missing held sessions for review; do not automatically credit the withdrawn period as a new late enrollment. This restoration detail remains an implementation default. A second same-semester group enrollment remains rejected.
- Use explicit class completion after all applicable sessions are held or cancelled and attendance is finalized. Do not declare a final pass just because the calendar end date arrives.
- For class average attendance, average students' individual unrounded percentages with data; disclose exclusions. Group-level student risk counts count distinct people, with class-specific details available.

## Delivery phases

1. Foundation: authentication, protected storage/database access, students and email management.
2. Academic setup: semesters, groups, classes, schedules, sessions, enrollment and credit previews.
3. Attendance: session editing, remarks, draft/finalization, calculations, history.
4. Importing: upload, preview/mapping, matching, conflict resolution, evidence merging, original-file retention, undo.
5. Review and export: groups/classes home, analytics, read-only matrices, XLSX and CSV reports.
6. Validation and release: representative Zoom report testing, access-policy checks, owner manual review, Vercel configuration.

## Acceptance scenarios

1. An unapproved authenticated account and an anonymous user cannot read or modify data or download uploads.
2. An unknown Zoom email matched manually can be saved as an additional email without changing the primary; the next import matches it automatically.
3. A blank email requires manual action even when the attendee's name exactly matches a student.
4. A conflicting email displays both students and cannot be reassigned silently.
5. Rejoins and duplicate files cannot create multiple student/session attendance records.
6. A second report adds presence; it does not remove presence from the first. Manual Leave conflicts require resolution.
7. Finalization creates absences only for eligible, still-unmarked students and preserves remarks and prior credits.
8. A late joiner receives credit for earlier held sessions, including when an earlier session is finalized later.
9. Twelve Present, one Absent, three Leave yields 75% and meets requirements; twelve Present and four Leave yields 75% and fails the leave limit.
10. A value below 75% cannot pass through display rounding. Zero eligible sessions returns no result.
11. Undoing one import keeps presence supported by another import and keeps later manual corrections.
12. New semester groups reuse student profiles and approved emails without carrying forward attendance or leave totals.

## Production inputs and supplied setup assets

- Zoom reports will be provided later. Actual header/date/worksheet/rejoin parsing remains unvalidated until then; other work may proceed.
- Supabase SQL is supplied in `supabase/001_schema.sql`, with manual account authorization in `002_allow_owner.sql`. Follow [setup and optimization](04-setup-and-optimization.md) for Supabase and Vercel. Project/account configuration is still needed before deployment.
- Temporary app name: **Attendance Admin**. The final name remains undecided.
- Confirmed visual direction: light admin dashboard, indigo accents, comfortable spacing, English and Myanmar, persistent sidebar and navbar. The [design system](05-design-system.md) and `design/tokens.css` are the baseline for final development.
- Extra sessions are excluded from percentages and Leave limits.
- Withdrawal/transfer causes a reversible enrollment failure; keep the original group and historical records.

## Additional acceptance scenarios

13. A Leave in an extra session does not lower attendance or consume the three-Leave allowance.
14. Withdrawal/transfer fails all classes in the original enrollment without deleting any attendance or creating another enrollment.
15. Reversal removes only the lifecycle failure reason; independent attendance/Leave failures remain.
16. Sidebar, navbar, shared type/color/border tokens, and language switching remain consistent across pages.


## Confirmed React conventions

React, strict TypeScript, Vite and Tailwind CSS with shared CSS design tokens. Custom reusable UI with tailwind-merge; React Hook Form, Zod 4 and the Zod resolver; React Router; Supabase JavaScript client; TanStack Query and Table; Lucide; Recharts; i18next/react-i18next; SheetJS Community Edition. ESLint and Prettier with eslint-config-prettier. npm with pinned dependencies and a committed lockfile.

Use feature-based folders, named component functions, default page exports, named reusable-component/utility exports, PascalCase page/component files, camelCase type/schema/utility files, alias imports across folders and relative imports within features. Format with two spaces, single quotes, semicolons, trailing commas and a 100-column target. Comments explain business rules and unusual decisions.

The owner manually reviews app output. Do not introduce automated test packages, test commands, or write new test cases. Existing design/SQL validation assets remain historical references.
