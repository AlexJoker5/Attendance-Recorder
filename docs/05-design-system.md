# Attendance Admin: design direction v1

Confirmed preferences: light dashboard, indigo accents, comfortable spacing, English and Myanmar. Temporary name: Attendance Admin. Final name is still open.

Open `design/dashboard.html` alongside `design/tokens.css`. It works as a local browser file and makes no API calls. All displayed people and attendance are fictional sample data. There is no login, actual workbook parsing, upload, Supabase mutation, or Excel generation in the preview.

## App shell

- White sidebar with brand, primary navigation, design-preview navigation, and administrator identity.
- White top navbar with breadcrumb, semester selector, and English/Myanmar switch.
- Light gray canvas with groups and class cards as primary content; analytics sit below them.
- Sidebar becomes a menu on small screens. Wide attendance tables scroll inside their panels.
- No decorative illustrations or large gradients. Emphasize readable records, labels, and restrained color.

## Reusable tokens

`design/tokens.css` is the canonical source for the React/Tailwind implementation.

| Token family | Values |
|---|---|
| Brand | Indigo #4F46E5; hover #4338CA; soft #EEF2FF |
| Surfaces | Canvas #F6F7FB; panels #FFFFFF |
| Text | Primary #182230; secondary #5F6B7C |
| Borders | 1px solid #E2E6EF |
| Status | Present green #147D56; Leave amber #925B0B; failures red #B42338; soft backgrounds defined in CSS |
| Type sizes | 12 caption, 13 table/control, 14 body, 16 card heading, 20 section, 28 page title, 30 statistic |
| Fonts | Segoe UI, Myanmar Text, Noto Sans Myanmar, system fallback |
| Line height | 1.6 English, 1.85 Myanmar |
| Spacing | 4, 8, 12, 16, 20, 24, 32px |
| Corners | 6px fields/buttons, 10px navigation/small containers, 14px panels |
| Controls | Minimum 42px height; allow expansion for Myanmar content |
| Layout | 244px desktop sidebar; 76px minimum navbar |

Use semantic CSS variables in final components rather than duplicating hex colors or arbitrary font sizes. Map those variables into the chosen Tailwind version during React setup. Production font bundling should preserve the agreed metrics and be checked with Myanmar labels.

## Component rules

- Primary action: solid indigo; secondary action: white with border; destructive actions: labeled and explained.
- Statuses always include text. Color alone must not communicate pass/fail.
- Light shadows only for panels; stronger shadow for dialogs.
- Every interactive control has visible keyboard focus. Native dialogs support Escape and return focus.
- Remarks are editable on session pages only. Read-only matrix entries link to a session.
- Withdrawal/transfer prompts state the failure consequence and require a reason. Reversal explains that restoring enrollment recalculates results and does not guarantee passing.
- Extras show a persistent Excluded label and explanation.

## Try the prototype

1. Switch English/Myanmar in the navbar.
2. Open a class; switch Sessions and Attendance overview.
3. Open the sample extra session, change statuses/remarks, save a draft, and finalize; unmarked becomes Absent.
4. Open Import reports, resolve Su's unmatched email, and try the additional-email checkbox.
5. Open Students, inspect Aung Aung, withdraw or transfer with a reason, then reverse it.
6. Open Reports and download the sample CSV.
7. Open Design system to review colors, typography, and components.

Session editing and lifecycle actions affect this browser tab's sample data only. Reloading resets it. File selection shows the filename only. Excel export and actual imports are explicitly reserved for implementation.

## Review before final UI implementation

- Decide the final app name when ready.
- Review Myanmar labels for your preferred terminology.
- Review whether the spacing is comfortable on your normal screen.
- Keep this token file as the baseline; record future visual changes here before spreading them across pages.

## Clickable breadcrumb navigation

Navbar breadcrumbs are real links to Overview, Groups & classes, the selected group, class, and session as appropriate. The current page is identified with aria-current. Links preserve semester context, support keyboard navigation and browser history, and remain available on mobile. The HTML prototype uses hash routes; the final React app should use equivalent router links.

## Shared table controls

All prototype tables include search, relevant filters, clickable sortable column headers, and pagination (5/10/25/50 rows). Filters and sorting apply to the complete table before pagination. Search/filter/sort/page-size changes return to page one; empty results show an explanation and disabled pagination. Table preferences survive navigation within the tab and are scoped by semester/class/session. Session edits remain attached to the original student record regardless of visible row order.

Students filter by group and enrollment standing; class sessions by type, review status and date range; attendance matrix by threshold standing; session attendance by status/source; import review by match status. Current sort uses aria-sort and all controls are keyboard accessible with English/Myanmar labels.

The prototype processes sample rows in the browser. The final Supabase implementation must apply equivalent filtering, stable ordering, counting, and pagination in database queries so every matching record is considered, not just the current downloaded page. Finalization and whole-session actions must always operate on the full session, regardless of current table filters.


## Comfortable form spacing and focus

Use 20px between form fields, 8px between labels and controls, and 12px between action buttons. Dialog sections use 24px spacing; footers remain visible while scrolling long forms. Inputs, selects and textareas retain a 1px border on focus, use the indigo border color, and show a subtle 3px translucent focus shadow. Keyboard focus indicators remain on buttons, links and checkboxes. These values are shared in design/tokens.css.
