# Testing the interactive prototype

Open `design/dashboard.html` with the entire design folder beside it, or use the running localhost preview. The adjacent JavaScript and vendor files are required. This is a local prototype, not the deployed React/Supabase app.

## Import attendance for a particular class and date

1. Open **Groups & classes**, then **Open class**.
2. Find the date in **Sessions**. Search, date filters, sorting and pagination are available.
3. Click **Import report** on that row. Alternatively open the session, then click **Import Zoom report**.
4. Check **Group · Class** and **Session date** at the top of the import screen.
5. Choose a CSV or XLSX file. Select the worksheet, header row, attendee-name column and email column if automatic detection needs adjustment.
6. Click **Review matches**. Only email matches are automatic. Select a student or ignore each unmatched attendee. Names never automatically assign attendance.
7. Optionally check **Save additional email** for a manual match. The primary email stays unchanged. Emails already owned by another student cannot be saved; the conflict message names that student. Uncheck the option to use a session-only match.
8. For existing Leave or Absent attendance, explicitly keep the status or replace it with Present. Conflicting decisions for duplicate attendee rows are rejected.
9. Click **Apply attendance**. Repeated attendees map to one student/session record. Unmentioned students remain unchanged. The session becomes a draft for review.
10. Review statuses and remarks on the session page, then **Finalize attendance**. Remaining Unmarked students become Absent.

Use **Download test report (CSV)** on the upload screen if you do not have your Zoom file yet. It includes a matching email, an unknown email, a missing email, and a repeated attendee.

If the date is missing, click **Add session**, choose a date, and indicate whether it is an extra session. Extra sessions do not count toward attendance or leave limits. The prototype allows one session per class/date. Class creation now generates sessions for every selected weekday between its start and end dates, inclusive. Cross-year ranges are supported. Each session can be removed manually and restored later. Removed sessions are excluded from the active schedule, import choices, attendance overview and dashboard counts.

## Groups and classes

- **Create group** is at the top of Groups & classes.
- **Create class** is inside each group; enter its name, start date, end date, weekly day, start time and end time. A preview shows the generated session count and first/last dates.
- **Edit group** renames the group and updates its linked students/classes.
- **Edit class** changes its name/schedule. Existing session dates are preserved. Class group reassignment is not offered because it would change enrollment ownership.
- Empty records can be deleted. Records with linked students, classes or sessions are archived instead; their history remains readable and **Restore** reactivates them.
- New classes use all students currently enrolled in their group. Use Import students inside the group to upload a CSV/XLSX student list. Map the name/email columns, choose an enrollment date, preview the results and import selected eligible rows. Existing students in the group and duplicate file emails are skipped; another-group enrollment or an invalid/missing email is blocked with an explanation. Each imported student is enrolled in all group classes, including classes created afterward. Earlier finalized regular sessions receive Present credit.

## Local storage and limitations

Group/class edits, session statuses/remarks, saved additional emails and import summaries persist in browser local storage. HTTP preview and file URLs have separate storage. The selected original file exists only in memory; this prototype does not permanently retain originals, upload to Supabase, authenticate the owner, synchronize tabs/devices, or implement import undo. Use sample data here.

The dashboard counters and class attendance overview use the current prototype session data. The two illustrative dashboard charts and the Reports sample export remain based on the original sample dataset and are labeled accordingly. Session CSV exports use current records. Production XLSX exports remain planned.

New workflow forms currently use English alongside the existing English/Myanmar navigation and attendance labels; complete Myanmar translation and wording review are still required.

## Verified on 2026-09-30

- Created a test group/class, renamed both, changed the weekly day, and deleted both empty test records.
- Archived and restored a populated group without losing sessions.
- Imported a CSV into Group A / English / September 12, manually matched an unknown email, ignored a missing-email guest, and merged repeated student rows.
- Explicitly kept an existing Leave status; reload preserved the result.
- Saved an additional email and confirmed a subsequent XLSX import matched it automatically; removed the test alias through student details afterward.
- Added October 3 as a regular sample session, navigated to it through table pagination, and confirmed its import destination. Duplicate September 12 session creation was blocked.
- Student action reads Go to details; import arrow points down and session export arrow points up.
- No browser console errors observed in the tested flows.

Spreadsheet parser: vendored SheetJS CE 0.20.3 from the official distribution. See `design/vendor/LICENSE-sheetjs.txt` for its license.


## Student imports and scheduling update (2026-09-30)

Browser verified: student CSV import preview detects duplicate emails, missing emails and another-group conflicts; applying an eligible row populates session rosters and survives reload. The Schedule example group demonstrates a Saturday class from October 15, 2026 to February 20, 2027: 19 generated sessions, October 17 through February 20. Removing a generated session reduced the active count to 18, and restoring returned it to 19. A sample student remains in this clearly named example group for review.

Scheduling checks passed for inclusive endpoints, a cross-year range, reversed dates, and February 29 in a leap year. Changing existing class dates/schedules does not regenerate its sessions; existing dates and manual removals remain intact.


## Owner login UI preview

The design now opens with an owner sign-in screen. Open Demo login details and use Fill demo credentials, then Sign in. Demo email: owner@attendance.example. Demo password: PreviewOnly2026!

The UI demonstrates required fields, invalid credentials, password show/hide, English/Myanmar labels, returning to the requested dashboard page, tab-session persistence, and Sign out. Public registration is omitted. Browser tests confirmed invalid-login feedback, return to Students, signed-in reload, and a signed-out direct session URL showing the login screen.

This is a browser-side demonstration, with publicly readable demo credentials. It provides no actual access protection for hosted files or local sample data. Production protection requires Supabase Auth plus owner authorization and RLS. Never put a real password in the prototype source.


## Finding withdrawal and transfer

Open Students, then Go to details for any student. Enrollment actions offers Withdraw and Transfer. Enter a required reason and confirm. The original group remains assigned, attendance is preserved, and all class results show Failed. The same section then offers Reverse withdrawal / transfer; reversing restores Active and recalculates attendance results without guaranteeing a pass. Reasons and timestamps are retained in Enrollment history. These actions now work for every prototype student and persist in browser local storage.


## Student details and editing

Go to details now opens a dedicated student page with contact information, class results, enrollment actions/history and additional verified emails. Edit student opens a separate form for name, primary email, phone and notes. Save validates required fields and global email ownership across primary/additional emails. An optional checkbox retains the previous primary email as an additional verified email. Cancel leaves the profile unchanged. Group, enrollment status, attendance and history are retained. Student pages support their own URL, breadcrumbs, Back/Forward, and refresh through the demo login gate.

Verified student-page checks: global duplicate email ownership is rejected; Cancel discards a draft; name, email, phone and notes survive reload after Save; retaining the old primary email creates an additional verified email; class attendance and enrollment history remain intact; withdrawal opens from the details page; browser Back/Forward restores details and edit routes. Test contact edits were restored afterward.


## Semester management

Open Semester management in the sidebar. Create a semester with a name and inclusive start/end dates. Open semester switches the workspace; the navbar selector provides the same switch. Every new semester starts empty and requires fresh groups, classes and enrollment records. Reusing a student through CSV/XLSX import links to their existing contact profile while creating independent attendance and enrollment history for this semester. Contact edits and verified emails are shared across semesters.

Edit semester can change the name and dates; ranges excluding an existing class or active session are rejected. New class date defaults use the selected semester bounds, and classes, manually added sessions and enrollment dates are validated within those bounds. The old sample Semester 2 range was expanded through February 20, 2027 to retain the previously created cross-year class. Archive semester preserves records in read-only mode; Restore semester enables edits again.

Verified: created Semester 3 Example (April 1-July 31, 2027), found an empty workspace, created a fresh Group A, reused Aung Aung with a new enrollment and no previous class results/history, generated 18 Saturday sessions, switched back to the original 11-student semester, rejected an invalid range contraction, and confirmed archive read-only state survived reload. Semester data is stored locally in a separate versioned key; the earlier prototype storage remains available as a migration backup. Production Supabase persistence remains future work.


## Individual student registration and enrollment

Students now offers Register student and Enroll existing student. Register requires a name and globally unique primary email, with optional phone/notes. Also enroll defaults on when an active group is available; uncheck it to save only the shared contact profile. Registered students lists profiles across semesters, with details/edit pages and an Enroll action for profiles not enrolled in the selected semester. Semester enrollments lists only the selected semester's records.

To enroll an existing student, choose the semester in the navbar, open Students, select Enroll existing student, search/select a profile, choose its group and enrollment date, then Confirm enrollment. Enrollment includes all group classes and credits earlier finalized regular sessions as Present. An existing enrollment in any group in this semester is blocked, including withdrawn/transferred records; retain or reverse that original enrollment instead. Groups also offer Enroll student beside Import students.

Verified individual registration rejected Aung Aung's existing email; saving a unique contact without enrollment increased registered profiles without changing semester enrollment count. Enrolling the example in Group B credited earlier held sessions and showed 100% attendance. A second same-semester Group A enrollment was blocked. Enrolling the same profile in Semester 3 created fresh Group A attendance/history, with no finalized attendance and no inherited leave counts; reload preserved it. The example profile remains available for review. All records remain local prototype data.


## Class schedule editing
Edit class now previews additions, unused generated removals, attendance/manual sessions retained, manually removed dates skipped, and schedule-removed dates restored. Saving applies only the reviewed plan; input changes invalidate it. Session indices and attendance dates remain stable. History is retained on the class. Zoom sample validation and Supabase remain deferred.


## Local history, results and reports
New imports have a cell-level before/after audit and ownership revisions. Undo restores only unchanged cells owned by that import, preserves later edits/imports, retains verified emails, and returns affected attendance to draft. Originals are downloadable during this tab lifetime only; private permanent storage remains deferred. Legacy imports without an audit cannot be undone.
Results share exact 75% comparisons, finalized regular sessions only, leaves included in denominator, >3 leaves immediate failure, and lifecycle failure. Attendance below threshold remains provisional until semester end and all regular sessions are finalized. Dashboard aggregates selected-semester active-class data; CSV and actual XLSX exports cover semester results and class matrices.


## Scope and language review
React conversion is ON HOLD at the user request pending detailed technology-stack confirmation. No React scaffold, package install, or build has been added to the project. HTML prototype work continues. Shared Myanmar UI wording covers common navigation, forms, schedule preview, reports, import history, statuses and controls. Proper names, filenames and stored user remarks remain as entered. Final Myanmar wording should be reviewed by the owner with real classroom data.


## Verification — local workflows
Ten automated checks passed for inclusive cross-year schedules, attendance/manual preservation, manual-removal exclusions, the 75% boundary, excluded extra/removed/draft sessions, four-leave failure, withdrawal/reversal, pending result explanations, undo fingerprints, and later import ownership. Browser checks saved/reloaded schedule changes and restored the original weekly day. Import review merged repeated Aung rows, matched an unknown email manually for this session, and ignored a guest. After a later manual change, undo preserved that student and restored the untouched student. Test attendance was returned to Unmarked afterward.
Actual CSV and XLSX downloads were parsed and verified against the displayed two-student semester results. Myanmar report labels, filters, mobile layout and one-pixel input focus borders were reviewed. Zoom sample validation is still pending. React remains on hold; no package.json, dependency installation or React build was added.
Run logic checks: node design/tests/local-workflows.cjs (from any directory; default source path is the current project prototype).

Final browser verification confirmed the preview resets after field edits; focused inputs have a 1px border, no outline, and the shared soft shadow. At 390px viewport the reports page no longer overflows. Report result filters retained their selected value and matching records when switching English→Myanmar→English. Browser console reported no errors. Archived semesters still allow reading import audits and exporting reports; undo remains unavailable until restored.
