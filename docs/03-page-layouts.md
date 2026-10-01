# Page layouts and navigation

The original functional layouts now have an interactive HTML design preview in `design/dashboard.html`. Use a conventional admin dashboard with a persistent sidebar and top navbar, a light indigo theme, comfortable spacing, and English/Myanmar switching. The canonical tokens are in `design/tokens.css`; carry them into the React/Tailwind implementation. See [design system](05-design-system.md). Tables scroll within their panels on smaller screens.

## Navigation

- Home: semester groups, classes, and statistics.
- Students: profiles and enrollment history.
- Semesters: setup, groups, schedules, and sessions.
- Import history: searchable records and original files.
- Reports: export selection.

Login sits outside the protected layout. Sidebar contains primary navigation; navbar contains breadcrumbs, the semester selector, language switch, and account controls. Keep the selected semester visible throughout the app. No student-facing pages or role management are needed.

## Home: `/`

```text
[App name]                         [Semester selector] [Sign out]

[Students] [Groups] [Classes] [Attendance pending]
[Students below 75%] [Students over leave limit]

Group A                                      24 students
  English          Saturday 09:00-11:00       [Open class]
  8/16 finalized   Average 82%   At risk 3     Leave failures 1
  Mathematics      Sunday 13:00-15:00         [Open class]

Group B                                      18 students
  ...

[Attendance trend]       [Present / Absent / Leave breakdown]
[Class comparison]       [Students needing attention]
```

Count distinct students in top-level risk cards, but show affected classes in drilldowns. Charts use finalized eligible data, label credits, and show a useful empty state instead of zero percentages when there is no data. Group/class navigation remains the main content.

## Semester setup: `/semesters/:semesterId`

Show dates, time zone, groups, and semester state. Actions: create group, create next semester, copy setup/roster for review, archive.

Group details show classes and enrolled students. Enrollment requires student and joining date; all group classes are included. Show a preview of earlier sessions to credit. Attempting a second group enrollment explains the existing assignment.

Class setup collects weekly day/time and previews generated sessions. Support explicit future schedule edits, rescheduling, cancellation, makeup/extra sessions. Extras are visibly labeled Excluded and cannot be configured to count. Existing attendance impacts must be previewed.

## Class page: `/classes/:classId`

Header: semester, group, class, schedule, enrollment count, progress, export action.

Tabs:

1. Sessions: date, topic, scheduled/held/cancelled state, unrecorded/draft/finalized attendance, Open session.
2. Attendance overview: read-only student-by-session matrix, P/A/L with a legend, credit and remark indicators, totals, percentage, Leave count, standing.
3. Analytics: attendance trend and students needing attention.

Selecting a session date opens its session page. No inline attendance editing in matrices or analytics.

## Session page: `/sessions/:sessionId`

```text
Semester / Group / Class
Session date + time       Held | Draft       [Import report]

[Present: 20] [Absent: 0] [Leave: 2] [Unmarked: 2]

Student       Email          Status        Remark       Source
Aung Aung     ...            [Present v]   [text]       Import
Su Su         ...            [Leave v]     [text]       Manual
...

[Save draft]                               [Finalize attendance]

Imports: filename | time | state | review | download | undo
Change history
```

Finalized sessions show an Edit attendance action rather than immediately editable controls. Display conflicts before saving. A fourth Leave prompts an explanation of failure for this class but still permits accurate recording. Preserve existing remarks.

## Import review: `/sessions/:sessionId/imports/:importId`

Step 1: upload CSV/XLSX, choose worksheet, inspect preview, map columns. Highlight session/report date mismatches if reliable report metadata exists; never guess a date from the filename alone.

Step 2: review Matched / Needs input / Ignored / Not found filters, with counts and search.

Rows show original name/email, selected student, matching method, and action. Manual match offers an unchecked additional-email checkbox only for a usable unknown email. Names alone never trigger automatic matches.

Conflict panel example:

> This email is saved for Aung Aung, but you selected Su Su. Use the existing student, apply this match for this session only, or explicitly move the additional email. A primary email must be corrected on its owner's profile.

Step 3: finalization preview lists new presence, automatic absences, preserved Leave/manual records, pending email changes, and conflicts. Resolve or explicitly ignore outstanding rows before finalizing.

Show upload/parse/save errors with recoverable actions. A repeated file opens the prior import or offers explicit reprocessing; another file merges by default. Replacement is a separate impact-preview action.

## Students: `/students` and `/students/:studentId`

List: search name/email, filter semester/group/archive state, add student, proposed bulk registration action.

Profile: name, primary email, optional phone/notes, approved additional emails, enrollment history, read-only class summaries and remarks. Removing an email explains that past attendance is unchanged. Duplicate emails show their current owner.

Enrollment actions include Withdraw, Transfer, and Reverse action. Explain the all-classes failure consequence, require a reason, and preserve the original enrollment. Reversal recalculates attendance and Leave requirements; it does not promise a pass.

Bulk registration is a proposed convenience workflow: preview, column mapping, duplicate validation, and explicit correction before applying. It does not reuse Zoom attendance matching implicitly.

## Import history: `/imports`

Filter by semester/group/class/session/state. Show original filename, upload time, target, result, download, review, and undo preview. Keep undone imports and original files visible.

## Reports: `/reports`

Choose session, class-semester, or student-semester report; select scope and XLSX/CSV; preview summary and download.

Show whether sessions are pending or data is final. Use one workbook with sheets where useful, or separately named CSV files for separate tables. Include remark/source distinctions and avoid suggesting pre-enrollment credits were observed Zoom attendance.

## Common interface behavior

- Use clear labels alongside colors for statuses and failure reasons.
- Preserve entered data when recoverable errors occur.
- Explain conflicts with the records involved and concrete resolution choices.
- Show previewed effects for cancellation, enrollment date correction, replacement, and undo.
- No automatic notifications, external messages, or student portal in this scope.
- Pending input: real Zoom report layout, owner account configuration, and final app name. Visual baseline is approved: light/indigo, English/Myanmar, comfortable admin dashboard.

## Clickable breadcrumb navigation

Navbar breadcrumbs are real links to Overview, Groups & classes, the selected group, class, and session as appropriate. The current page is identified with aria-current. Links preserve semester context, support keyboard navigation and browser history, and remain available on mobile. The HTML prototype uses hash routes; the final React app should use equivalent router links.

## Shared table controls

All prototype tables include search, relevant filters, clickable sortable column headers, and pagination (5/10/25/50 rows). Filters and sorting apply to the complete table before pagination. Search/filter/sort/page-size changes return to page one; empty results show an explanation and disabled pagination. Table preferences survive navigation within the tab and are scoped by semester/class/session. Session edits remain attached to the original student record regardless of visible row order.

Students filter by group and enrollment standing; class sessions by type, review status and date range; attendance matrix by threshold standing; session attendance by status/source; import review by match status. Current sort uses aria-sort and all controls are keyboard accessible with English/Myanmar labels.

The prototype processes sample rows in the browser. The final Supabase implementation must apply equivalent filtering, stable ordering, counting, and pagination in database queries so every matching record is considered, not just the current downloaded page. Finalization and whole-session actions must always operate on the full session, regardless of current table filters.
