# Validation notes

Date: September 29, 2026.

## SQL

Executed the baseline schema successfully on a fresh temporary PostgreSQL 18 instance. Minimal local Auth/Storage stand-ins supplied the platform schemas and JWT identity helpers. Fixtures used only fictional data and were rolled back.

Passed checks:

- Schema creation, audit triggers, and deferred primary-email enforcement.
- Case-insensitive email uniqueness and one group per student per semester.
- Exact 75% threshold and fourth-Leave failure.
- Exclusion of extra sessions from denominator and Leave count.
- Withdrawal failure, transfer failure, reversal, revision conflict rejection, and lifecycle audit entries.
- Owner creation/read access; non-owner and anonymous denial.
- Owner-only Storage metadata insert/read under the supplied policies.

Tests are in `supabase/tests`. Platform stand-ins are local-test-only and must never be applied to a real Supabase project. Actual Auth login, Storage API upload/download, hosted role defaults, and deployment remain to be integration-tested.

## HTML prototype

JavaScript syntax checked with Node. Browser review exercised:

- English and Myanmar navigation and typography.
- Individual session finalization: unmarked becomes Absent and remarks are preserved.
- Manual email matching and the optional additional-email checkbox.
- Withdrawal and reversal returning the original enrollment to Active.
- Class-specific rosters and session dates.
- Responsive layout and collapsible navigation at 390px width; no page-level horizontal overflow observed on the home page.
- Browser error log was empty during the tested workflows.

Desktop screenshot: `design/dashboard-preview.png`.

## Baseline scope limits (superseded where noted)

The 2026-09-30 workflow update now supports editable historical sessions, CSV/XLSX parsing, group/class CRUD, saved additional emails, and browser-local persistence. See [Prototype workflows](07-prototype-workflows.md) for current behavior and validation. The bullets below describe the earlier baseline.


- Historical sessions are read-only samples in the prototype. An extra session demonstrates the editable flow. The production app will support editing any appropriate session as specified.
- File selection only displays a filename. It does not parse or upload the file.
- CSV download is a sample export; XLSX export is planned.
- UI state resets on reload. There is no backend connection.
- Myanmar language wording remains open to the owner's review.
- Full import finalization, undo, enrollment credits, and additional-email transaction routines are not claimed complete by the baseline schema.
