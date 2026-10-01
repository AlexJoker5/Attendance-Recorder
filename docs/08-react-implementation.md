# React implementation

Updated October 1, 2026. The React/Vite project now exists in `LAP/attendance-app`, beside `Environment`. The HTML design remains in `design/` as a reference.

## Start locally

Prerequisite: a Node.js version supported by the pinned Vite/ESLint packages, and npm. The implementation was built locally with Node 25.2.1 and npm 11.6.2; use a compatible supported Node LTS for hosting.

```powershell
cd C:\Users\MPSS\Desktop\LAP\attendance-app
npm ci
npm run dev
```

Open http://127.0.0.1:5179 and choose **Open local preview**. All people shown are examples. Edits persist in this browser's local storage; original imported files persist in IndexedDB. They do not sync between browsers or devices. The older HTML preview at port 5178 uses separate data.

## Implemented local workflows

- Semester creation, editing, archival and restoration. Date edits cannot exclude existing enrollment/schedule/session dates.
- Group creation and editing. Empty groups can be deleted; linked groups are archived and restored.
- Class creation/editing with inclusive date ranges, weekly day and times. Changes require a preview. Attendance/manual sessions are retained; unused generated sessions may be removed; manual removals remain excluded.
- Generated sessions, manual regular/extra sessions, removal/restoration and rescheduling of unmarked sessions. Class completion is explicit and requires finalized regular sessions.
- Individual student registration/editing, reusable profiles, one group per semester, enrollment in every group class, student-list import with worksheet/header/column mapping.
- Student details, additional email removal, withdrawal/transfer/reversal with reasons and history. No second group enrollment is created by transfer.
- Session attendance editing, remarks, draft saves and finalization of the full roster. Earlier regular sessions receive pre-enrollment credit when applicable.
- CSV/XLSX attendance import with mapping, email-only automatic matching, manual matching, ignoring rows, additional-email approval, conflict descriptions, duplicate-row merging and keep/replace decisions.
- Import history, impact preview, undo that preserves later changes, and local original-file download.
- Live dashboard statistics, per-class results and explanations, session/result/matrix CSV/XLSX exports.
- Shared sorting/search/filter/pagination, clickable breadcrumbs, responsive layouts, English/Myanmar resources and shared HTML design tokens.

## Confirmed development conventions

Strict TypeScript; named component functions; default page exports; named component/utility exports. PascalCase page/component files, camelCase schema/type/hook/API/utility files. Feature folders under `src/features`, shared UI in `src/components/ui`, layout in `src/components/layout`. Cross-folder imports use `@/`; local feature imports are relative.

React Hook Form and Zod 4 handle record forms. Tailwind CSS plus shared CSS tokens style custom UI; tailwind-merge handles overrides. TanStack Table v8 supplies table logic. TanStack Query manages the repository cache and mutations. Lucide supplies icons. Recharts and SheetJS load separately from the initial page. i18next supplies translations. npm dependencies are pinned with a lockfile.

Prettier: two spaces, single quotes, semicolons, trailing commas, 100-column target. ESLint includes TypeScript and React Hooks rules. React Compiler is not enabled.

```powershell
npm run typecheck
npm run lint
npm run format:check
npm run build
npm run preview
```

No automated test packages, test commands, or new test cases were added. The owner will manually review workflows. Pre-existing SQL/HTML verification files are preserved as historical project assets.

## Supabase connected workflows

Local sample data is available only through Vite development mode. Production builds require Supabase configuration and owner login.

Email/password login and owner authorization are wired. The owner confirmed successful real login. After scripts 001, 002, and 003, apply supabase/004_connected_workflows.sql to enable relational data reads/writes and private original-file storage. Read [Connected Supabase setup](10-connected-supabase.md) for the exact next steps.

The authorized user now sees the administrator dashboard. An empty database shows a first-semester setup action; an unapplied workflow migration shows an actionable retry screen. Local preview data does not migrate automatically.

The workspace repository sends changed entities to an owner-checked transaction. Separate SQL helpers own semesters, groups, classes/schedules, students/emails, enrollments, sessions, attendance, import review, and undo. The relational schema and direct-write restrictions remain. A revision counter rejects stale saves from other tabs/devices; sequential saves are queued in the browser. Responses are validated by feature-owned record schemas.

Original reports upload to private Supabase Storage, are hashed for same-session duplicate detection, and remain available after undo. Import before/after values come from the database; later edits are preserved by revision/content checks. The database enforces class completion, finalized rosters, enrollment dates, and scheduled end-time finalization.

The repository initially caches a consistent owner workspace; table pagination is in the browser. Feature-scoped paginated reads are the future optimization for much larger histories. Reports and dashboard statistics derive from those persisted records.

TypeScript, lint, formatting, production-build checks, and a local PostgreSQL walkthrough validate implementation behavior without adding a test suite or new test cases. The walkthrough uses platform stand-ins; actual hosted Storage and network behavior remain for manual review. No hosted SQL or settings were changed by the coding agent.

The actual Zoom sample is still needed to verify columns, worksheets, dates, and repeated-join formats. The generic CSV/XLSX parser accepts files up to 10 MiB and up to 5,000 worksheet rows. Some dynamic validation/conflict messages remain English; final Myanmar wording needs owner review.

Root vercel.json supports SPA refreshes. Deployment remains pending and no paid infrastructure was introduced.

## Approved frontend refactor

Updated October 1, 2026. Layouts, shared headings and table controls, feature sections/dialogs, workflows, schemas, constants, and domain types now have separate owners. Generic Excel/CSV read/export functions live in src/utils. See [Frontend structure and refactoring conventions](09-frontend-architecture.md) for the current folder responsibilities and manual review checklist.
