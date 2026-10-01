# Frontend structure and refactoring conventions

Updated October 1, 2026. This structure implements the owner's approved component, constants, schema, and utility organization. The same workflows now use either the development-only local repository or the connected relational Supabase repository. See 10-connected-supabase.md before enabling connected saves.

## Folder responsibilities

`src/app` owns routing, providers, the whole-workspace data cache/repository, shared application configuration, and the combined AppData model. Individual domain types and record-response schemas live in their owning feature. app/schemas/workspaceSchema.ts composes those schemas; app/lib/workspaceChanges.ts builds changed-entity transport payloads. app/api/supabaseRepository.ts calls owner-checked transactional database functions. The sample-data generator lives in app/lib/seedData.ts.

`src/components/layout` owns AdminLayout, SidebarLayout, NavbarLayout, MainLayout, Breadcrumbs, AppFooter, SemesterSelector, and LanguageSwitcher. AdminLayout composes the shell. useBreadcrumbs resolves route relationships; Breadcrumbs renders clickable links. MainLayout supplies the development preview banner and loading/error/archive states. WorkspaceWelcome guides empty databases to the first semester. WorkspaceLoadError provides a reusable retry action.

`src/components/ui` owns custom shared primitives. One exported UI component per PascalCase .tsx file. Heading supplies shared markup; PageHeading uses h1 and SectionHeading uses h2. ButtonLink provides navigation with button styling. ExportButtons, StatCard, EmptyState, and ErrorState handle repeated presentation. Class overrides use cn() and tailwind-merge.

`src/components/ui/table` owns DataTable, its toolbar, pagination, sort button, hook, types, and default page sizes. TanStack Table continues to supply sorting, global search, and pagination. Search labels/placeholders are configurable. Feature-specific filters and column factories stay in the feature; action callbacks delegate workflow changes to feature hooks.

Each feature uses these folders when it has content for them:

`pages/`: route-level composition and screen actions.
`components/`: meaningful sections, forms, feature tables, and dialogs.
`hooks/`: form/workflow state, repository mutations, notifications, and orchestration.
`schemas/`: Zod 4 validation and inferred form-value types.
`const/`: fixed statuses, options, policy thresholds, defaults, and validation limits.
`types/`: domain models and feature-specific types.
`tables/`: typed column factories and row selectors when actual transformation is needed.
`lib/`: pure domain calculations, validation, schedule/enrollment/import/undo rules, and field metadata builders.
`api/`: feature-specific persistence, such as import originals.

Pages remain default exports; reusable components, hooks, schemas, constants, and utilities use named exports. Page/component files use PascalCase; other files use camelCase. Cross-folder imports use @/; imports within a feature use relative paths.

## Constants and schemas

Use .ts for constants and schemas; .tsx is only needed when a file contains JSX, including table-cell renderers. Fixed tuples use as const, and status types derive from those tuples. For example, attendance/const/attendanceStatus.ts supplies both select options and the Zod enum. attendancePolicy.ts supplies the 75% minimum and the three-leave limit used by results and the shared explanation.

Zod schemas live in their own feature: loginSchema, groupSchema, enrollmentSchema, enrollmentActionSchema, sessionSchema, sessionAttendanceSchema, and rescheduleSessionSchema are no longer declared inside pages or components. Handler types reuse z.infer-derived exports rather than repeating object shapes. Derived rows, counts, dates, and validation that depends on stored records remain functions or hook calculations.

## Excel and CSV utilities

Generic spreadsheet reading and exporting live in src/utils/readWorkbook.ts and src/utils/exportSheet.ts. Format definitions, limits, and workbook types live under utils/const and utils/types. SheetJS remains lazily imported. Accepted formats, upload limits, CSV formula protection, and browser downloads retain their existing behavior.

Attendance matching, conflict decisions, additional-email ownership, applying imports, undo, and report row construction remain in features. Workbook mapping UI lives in imports/components and useWorkbookMapper. Keeping business rules out of generic file utilities allows student imports and attendance imports to share the same file reader without sharing their policies.

## Review and validation

Use TypeScript, ESLint, Prettier, and the production build for static/build validation. The owner manually reviews browser workflows. No test packages or automated test cases are part of this refactor. The development server stays stopped until the owner starts it again.

Manual review should cover navigation/breadcrumbs and mobile controls; table search/sort/filter/pagination; student registration/enrollment/email removal/lifecycle reversal; class schedule previews and session restoration; attendance draft/finalization/rescheduling; CSV/XLSX mapping, matching, conflicts, import history/undo; and report exports. The actual Zoom sample and hosted Supabase workflow verification remain pending. SQL compilation and a local database walkthrough use isolated platform stand-ins; the coding agent did not change hosted data.

## Custom dropdown and form validation

Select accepts explicit options, a controlled value, and onValueChange. It renders a button combobox and a styled listbox; no native select or option element is rendered. Menu rendering, keyboard/positioning behavior, types, and constants live under components/ui/select. The browser Popover API places the custom list above dialog and table clipping without introducing a component library. Arrow keys, Home/End, typeahead, Enter/Space, Escape, Tab, outside clicks, disabled options, and React Hook Form focus/blur are supported.

RecordForm and attendance status fields bind custom dropdowns through Controller. RecordForm disables native form validation so Zod provides the specified field messages rather than system email validation bubbles. Each user-facing feature schema supplies explicit required, format, range, and length messages, with English/Myanmar translations. getErrorMessage converts thrown Zod issues into readable text for action-level errors.

Shared global styles live in Tailwind's components layer so utilities can override margins, padding, sizing, and font styles. Table cells use middle vertical alignment. Controls retain a 1px focused border and the shared indigo focus shadow. Create/edit forms omit the Cancel footer using Dialog isFooter={false}; the close button and Escape remain available. Confirmation dialogs retain their footer. Class schedule preview keeps its purpose-specific first-step label, then uses Create or Update.

Student details provides Add additional email alongside the existing list/remove controls. A saved additional email is normalized, explicitly approved for future imports, and cannot duplicate the primary email, an existing alias, or another student's email ownership. The primary email is preserved, and changes use the same workspace repository in local and Supabase modes.

## Session names

The class Sessions table includes Session name before Session date. Regular sessions use Week 1, Week 2, and so on in date order across the class, before filtering, searching, sorting, or pagination. Sorting names compares week numbers numerically. Extra sessions show Extra session and do not advance the regular sequence. All removed regular sessions show Removed session and do not advance the current sequence. Removing Week 12 makes the next active regular session Week 12, with all later labels shifting down. Restoring a session inserts it back into date order and recalculates subsequent week labels. Names are derived from current session data, so changes to the class schedule may recalculate numbering. This is a display column and needs no database migration.

## Removing a session from its table row

Active session rows offer Remove session alongside Open session and Import report. A confirmation identifies the session date and explains that attendance/import records remain available while the session is excluded from results. The confirmation prevents duplicate submits and closing during its save, and displays save errors without dismissing the dialog. Removal uses the same attendance feature rule as the session details page, marks the session as manually removed, and reopens class completion. Choose Removed or All in the review-status filter to restore the session. Archived workspaces disable removal. This uses the existing connected workflow; no additional SQL migration is required.

## Shared creation-date column

DataTable automatically inserts one Created Date column before Actions (or at the end). Its reusable column factory reads a row's createdAt by default; derived tables provide a typed getCreatedAt selector and a description of the represented record. Dates and times use the selected English/Myanmar locale in Asia/Yangon. Sorting compares actual timestamps, puts missing dates last, and remains independent of pagination. Date text participates in table search. Preview rows have an explicit unsaved placeholder. Optional record schemas support old RPC/local records without inventing historical timestamps. Supabase migration 005 exposes the existing created_at columns; local saves preserve creation metadata by stable record identity. Import undo compares mutable attendance fields and revision, excluding immutable creation metadata.
