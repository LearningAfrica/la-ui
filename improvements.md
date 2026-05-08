# UI / Performance Improvements — Working Notes

Live document. Each entry: observation → impact → suggested fix.

## Top Priority — Recommended Fix Order

Ranked by impact × surface area. Each item shows where the rest of the doc covers it.

### P0 — Highest impact, blocks correctness
1. **Tablet sidebar overflow.** SidebarProvider stays expanded at `md` (768) so tables and 4-col stat grids overflow horizontally on every page (system/users, system/organizations, client/courses, client/members, client/live-sessions). Auto-collapse to icon-rail at `md`. _One fix → fixes ~8 pages._
2. **Status/role badge color collision with brand orange.** "Verified", "Active", "Instructor", "Free" all render in `--primary`. Indistinguishable from CTAs. Introduce semantic tokens (`success`, `warning`, `info`) and a categorical role palette; reserve orange for primary actions only. _Fixes /system/users, /system/organizations, /client/members, /client/my-courses._
3. **Live-sessions table breaks below `lg`.** Topic column wraps one word per line; CTA truncates. Replace table with a card list at `md` and below.
4. **HTML entity rendered raw** on category card title (`AI &amp;…`). Trace double-escape in category title rendering.
5. **Implementation leak in my-learning empty state.** "...once the learning API is integrated." Swap for user-facing copy.

### P1 — High impact polish
6. **Courses table has too many columns.** 9 columns squeeze the right edge, "Manage" action gets clipped. Fold Type/Price/Visibility into a meta line; sticky right Actions column.
7. **Devtools tab overflow not blocking but noisy.** "No Image" placeholders dominate the courses table — replace with initials block.
8. **Client dashboard stats** stay 2×2 on desktop. Use `xl:grid-cols-4`. Hide "Coming soon" placeholder cards entirely until data is wired.
9. **Profile pages waste desktop width** (`/system/profile`, `/client/profile`). Either cap form at ~720px and add a side panel, or center the card with intentional empty space.
10. **Sidebar inner scrollbar visible** on org-admin sidebar at typical laptop heights. Hide-on-idle scrollbar styling.

### P2 — Visual / brand
11. **Orange overuse on landing.** 3 full-bleed orange sections (hero CTA / Get Started / footer CTA). Reserve for one section.
12. **Inline link orange = button orange** on auth pages; collapses hierarchy.
13. **Sidebar identity tile is inconsistent** between system (square orange) and client (circular outlined). Pick one.
14. **Tablet hero on landing loses the orbital visual.** Either keep it on tablet or rebalance.
15. **Sign-up tablet drops the value-prop side panel.** Keep a condensed version.

### P3 — Content + UX
16. **"Invites" naming collision** between members-tab badge ("invites I sent") and `/invitations` page ("invites to me").
17. **Course preview "Enroll"** stays clickable on a course with zero lessons. Disable.
18. **Course preview "No lessons yet"** dim-orange button reads as "disabled primary"; should be neutral disabled.
19. **Certificates page** could show a watermarked sample certificate to anchor expectation in empty state.
20. **Instructor `/courses` shows every org course as Manage-able**, including ones the instructor didn't create. Filter to owned courses by default OR disable Manage on non-owned rows.
21. **Instructor "My Courses" actually shows all org courses.** Rename to "Catalogue" or filter to authored content.

---

## Performance — Cold Boot (shipped 2026-05-06)

- **`QueryClient` was module-level singleton** in `app/providers/query-provider.tsx`. Risk: cache bleed across SSR requests. **Fix:** moved into `useState(() => new QueryClient())`.
- **Devtools shipped to prod.** `TanStackDevtools` always mounted; vite `devtools()` plugin always active. **Fix:** lazy-import devtools panel under `import.meta.env.DEV`; gate vite plugin behind `mode === "development"`.
- **No link prefetching.** Every nav = cold module + data round-trip. **Fix:** added `prefetch="intent"` on hot-path links (sidebars, dashboard header, landing header, lesson reader header, admin courses table).
- **No top-level page-transition indicator.** **Fix:** new `<TopLoader />` driven by `useNavigation()`, mounted in `app-layout.tsx`. 100ms grace before reveal to skip flashes on cached navs.

## Open Performance Items

- **SSR mismatch.** `ssr: true` in `react-router.config.ts` but zero route loaders. Server ships shell, client refetches everything. Pick one:
  - Go SPA (`ssr: false`) + prerender shell → simplest given current data layer.
  - Or commit to SSR: add loaders for auth + first-page data on dashboards.
- **Prerender list is minimal.** Only `/`, `robots`, `sitemap`. Public pages (`/sign-in`, `/sign-up`, `/inquiry`) hit Netlify cold start unnecessarily.
- **Google Fonts via `<link rel=stylesheet>`** is render-blocking. Self-host Inter via `@fontsource/inter` (or similar) → kills external DNS + extra round-trip.
- **No `HydrateFallback` exports** on dashboard routes. Routes show empty during hydrate.

## Design — Landing Page (color)

Captured: `.playwright-mcp/screenshots/landing/initial-load.png`

- **Orange overuse.** Single saturated orange used as full-bleed background in 3 sections (hero CTA band, "Get Started", footer CTA). Repetition dilutes meaning. Reserve full orange for the single primary CTA; demote other sections to neutral with orange accent only.
- **No secondary accent.** Palette is orange + black/white. Adding a supporting hue (deep teal, plum, indigo) would let categories/states have visual identity without leaning on orange every time.
- **Section rhythm oscillates** dark → orange → dark → orange → dark → orange. Reads as repetition, not hierarchy. Try: dark hero → light surface for features → dark social proof → single orange CTA at bottom.
- **Gradient direction inconsistent.** Hero, stat band, footer CTA each use a different angle. Pick one (e.g. 135°) and apply uniformly, or drop gradients except on the primary CTA.
- **Stat band readability.** White icons + numbers on bright orange — contrast passes WCAG but visually loud. Soften with a subtle dark overlay or move the band to neutral background with orange icons.

## Responsive — Landing Page

Captured: `landing/desktop-1440.png`, `landing/tablet-768.png`, `landing/mobile-375.png`.

- **Tablet (768) loses the hero visual.** Orbital "LA" graphic with floating chips (150+ Courses / 500+ Learners / 100+ Certificates) disappears at md breakpoint, leaving a tall single-column text block. Tablet has horizontal room — either keep the visual or rebalance layout for two-column on `md`.
- **Desktop hero copy wraps to three lines** ("Transform Your / Organization's / Learning") because text column is too narrow next to the visual. Either bump heading size down on `lg` or let the text column take more width.
- **Tablet header collapses to hamburger early.** At 768 the desktop nav is hidden, but there's room for it. Move the breakpoint up (e.g. show nav at `md` not just `lg`).
- **Mobile is solid.** Logo→"LA", buttons full-width, social proof readable. No issues.

## Responsive — Auth Pages

Captured: `sign-in/{desktop,tablet,mobile}.png`, `sign-up/{desktop,tablet,mobile}.png`.

### Sign-in
- **Desktop wastes horizontal space.** Form is a centered ~400px card on a 1440 viewport with two faint orange gradient blobs filling the void. Either mirror sign-up's split (value-prop left, form right) or shrink the page to a single hero band.
- **Tablet/mobile are fine.** Form scales naturally.

### Sign-up
- **Desktop split is good** — left rail with feature list (Workspaces / Course Builder / Certificates) + social proof, form right. Best layout in the app so far.
- **Tablet drops the left rail entirely.** Whole value-prop content vanishes between `lg` and `md`. Either keep a condensed version on tablet (single feature row above form) or push the breakpoint where it disappears down to `sm`.
- **Mobile is fine.**

### Cross-cutting auth
- **Input border invisible on dark bg.** Hard to see field affordance until focused. Add `border-border/60` or a subtle inner shadow.
- **Inline link orange = button orange.** "Sign in", "Forgot password?", "Create account" all use the same primary orange as the CTA button. Hierarchy collapses. Use a softer hover-only orange or a neutral underline for inline links.
- **"Back to Home" placement** floats top-left — fine on desktop, on mobile it sits above the card with no breathing room.

## Responsive — System (super_admin) Dashboard

Captured: `system-dashboard/{desktop,tablet,mobile}.png`.

### Desktop (1440)
- **Lots of empty space** below the stats + quick-actions row. Dashboard ends ~halfway down the viewport. Either add a chart strip / activity feed, or compact the existing blocks (e.g. quick actions inline with stats).
- **Header is verbose.** Toggle + "Learning Africa" wordmark + "Admin Dashboard" + sidebar already reads "Learning Africa | System Admin". Drop one of the wordmarks.
- **Sidebar header card** ("LA" + name + "System Admin") is bulky and duplicated by the avatar+username block at the bottom. Pick one.

### Tablet (768)
- **Sidebar takes ~33% of width** when persistent. Forces stats into 2×2 instead of 4×1, and quick-actions/recent-inquiries can no longer sit side-by-side. Collapse the sidebar to icons-only at `md` breakpoint.

### Mobile (375)
- **Header is overcrowded:** toggle / wordmark / theme / bell / avatar — orange wordmark sits right against the toggle icon. Hide wordmark when toggle is visible, or shrink to "LA" mark only.
- Stat card stacking is fine.

### Color
- **Stat icon hues** mix neutral (blue), brand orange (pending), green, red. The "Pending Review" orange tile collides semantically with the brand orange used elsewhere — every other use of orange is "primary action", here it means "warning/wait". Use yellow/amber for pending so brand orange stays exclusively a CTA/identity color.
- **"Logout" in red** at the sidebar bottom is good — but "Approved" green badge in Recent Inquiries uses a similar saturation. Keep destructive red and success green visually distinct.

## Responsive — System Tables (inquiries, users, organizations)

Captured: `system-inquiries/*`, `system-users/*`, `system-organizations/*`.

### Critical: tablet horizontal overflow
- **At 768 the sidebar stays expanded (~250px) and the table + 4-col stat grid don't fit in the remaining ~500px.** Both inquiries and organizations show horizontal scrollbars; stat cards bleed off the right edge.
- **Fix:** auto-collapse sidebar to icon-rail at `md` breakpoint, OR keep sidebar wide but switch the page container from a fixed grid to a CSS grid that wraps stat cards (`md:grid-cols-2 xl:grid-cols-4`) and tables to a card-stack layout below `lg`.

### Status badge color collision
- **"Verified" badges in system/users render in primary brand orange.** All 7 verified users are bright orange pills — visually reads as "warning/pending" because brand orange is used as a CTA accent everywhere else.
- **"Active" status on /system/organizations is also orange.** Same problem.
- **Fix:** use green/emerald for positive states (`Verified`, `Active`); reserve orange exclusively for the brand/CTA. Yellow/amber for pending; red for deactivated/declined.

### Data table density
- Desktop rows are tall (~50px) with subdued separators. Fine. But on tablet/mobile (when forced into compact layout) the same row uses oversized avatar + name+email two-liner. Consider a stacked card on mobile.
- **Action column on /system/inquiries** has a single eye icon. Either make rows clickable or drop the column.

### Sidebar
- **Sidebar header card** (orange "LA" tile + "Learning Africa / System Admin") and **footer user block** ("FO" tile + Felix Orinda + email) duplicate identity info. Pick one — header for branding, footer for user, but don't repeat the orange-tile-with-name pattern.

## Responsive — System Profile

Captured: `system-profile/{desktop,tablet,mobile}.png`.

- **Desktop wastes huge horizontal space.** Profile content sits in a centered ~700px column on a 1440 viewport. ~600px of empty rail on each side. Either widen the form, add a side panel (security tips, recent activity), or center the form on a card-style background to make the empty space intentional.
- **Tablet/mobile fine.**
- **Status color inconsistency vs tables:** Verified + Active here render correctly in green. The same fields on `/system/users` and `/system/organizations` render in brand orange. Same badge component should produce the same color — looks like the table cell and profile page use different badge implementations.

## Responsive — Client (org admin) Dashboard

Captured: `client-dashboard/{desktop,tablet,mobile}.png`.

### Desktop (1440)
- **Stats render 2×2 even on wide viewports.** With ~1100px of content area there's room for 4-up. Set `xl:grid-cols-4`. Currently leaves dead air right of cards.
- **Sidebar inner scrollbar visible.** Org admin sidebar has 3 section groups (Overview / Workspace / Learning) + header + footer + org switcher; on a 900px-tall viewport the inner nav scrolls and shows a bright scrollbar. Hide via `scrollbar-thin` + `scrollbar-track-transparent`, or only show on hover.
- **3 of 4 stat cards say "Coming soon".** Placeholder noise. Either hide unfinished cards behind a feature flag or show a skeleton/disabled state instead of the literal string.
- **"Invite Members" Quick Action is a full-width gradient orange button** — same visual weight as the landing hero CTA. For a routine in-app action this is over-emphasized. Demote to a normal primary button or make it look like the other quick-action rows.

### Tablet (768)
- **Sidebar stays expanded → narrow content column.** Same problem as system side: stats forced into 2×2, Quick Actions sits in ~480px column. Auto-collapse the sidebar to icon-rail at `md`.

### Mobile (375)
- **Clean.** Stats stack 1-up, full width. No issues observed.

### Sidebar header
- **"Acme / admin" tile uses a circular outlined avatar with a different icon style** vs the system sidebar's square orange tile. Pick one identity-tile pattern and reuse.
- **Org switcher chevrons** are good — clear affordance.

## Responsive — Client Tables (courses, members, live-sessions, categories)

### /client/dashboard/courses
- **Too many columns for a dense table:** Course / Category / Modules / Lessons / Type / Price / Visibility / Created / Actions = 9 columns. Most data is short and binary (Free/—/Public/0). At desktop the rightmost columns including "Manage" action button get clipped by the scrollbar.
- **"No Image" placeholder** is a large grey picture-frame icon for courses without thumbnails — every empty thumbnail draws the eye. Use a small initials block (e.g. "PM" for "Product management basics") on a muted gradient instead.
- **Fix:** collapse Type/Price/Visibility into a meta line under the course title; use a sticky right-edge Actions column.

### /client/dashboard/categories
- **Bug: HTML entity rendered raw.** Title "AI & Machine Learning" displays the ampersand entity literally on tablet card title. Looks like the title is being escaped twice somewhere — trace the category title rendering path.
- Card grid layout is good — visual content suits cards better than rows.
- **3 stat cards** (Total/Courses Organized/This Page) cluster fine on desktop.

### /client/dashboard/members
- **5 stat cards** (Total/Active/Admins/Instructors/Learners) — at desktop they fit in one row but cramped; at tablet they go 2-up leaving the 5th orphaned. Consider 4 stats max, or move the 5th into the table header.
- **Color collisions:** Role "Instructor" badge is brand orange. Status "Active" pill is brand orange. Two different meanings sharing the same hue in the same row.
- **Fix:** Roles get distinct hues from a categorical palette (purple/cyan/teal). Statuses are semantic (green=active, amber=pending, red=suspended). Brand orange stays exclusively a CTA.

### /client/dashboard/live-sessions
- **Worst responsive failure seen so far.** At tablet (768) and mobile (375) the table renders Topic column one word per line ("Python / data / types / and / control / flow"). Starts/Date column similarly stacks each token vertically.
- **Schedule Session CTA gets truncated** at tablet — button text "Schedule Sess..." cut off; avatar in header chopped in half.
- **Fix:** Below `lg` swap the table for a card list (topic title + meta row of date · duration · status · ⋮ menu).

## Cross-cutting (all tables)
- **Tablet sidebar overflow** is the dominant defect across the entire app. Fix in one place: collapse the SidebarProvider into icon-rail (~64px) at `md` breakpoint.
- **Brand-orange overuse for status/role badges.** Reserve `--primary` for the CTA accent only. Build a small semantic-color token set: `success`, `warning`, `info`, `neutral`, plus a categorical scale (`role-1` … `role-5`) for non-semantic chips.

## Responsive — Course Detail Flows

### /courses/:id/modules
- Empty-state OK. Same tablet table-overflow problem ("Acti..." truncated), mobile horizontal scrollbar visible.

### /courses/:id/preview
- **Desktop split** (text left, hero thumbnail right) is good.
- **"No lessons yet" CTA** rendered as dim brand-orange button — looks like a disabled-primary. Should be neutral disabled style (grey).
- **"Enroll" stays enabled** even when there are zero lessons. Should be disabled with hint.
- **Empty "Course Content" block** for admins lacks a one-click action. Add an "Add module" CTA inline for admin role.
- Tablet/mobile stack acceptably.

### /courses/:id/edit
- **Desktop form spans the full content column** (~1100px). Long inputs at that width hurt scannability. Cap form at ~720px; use the freed right column for a Publish/Status side panel (visibility toggle, save state, last-saved time).
- Premium/Private switches in a 2-up grid → stacks on tablet; fine.
- Image upload dropzone is unnecessarily tall; could be ~50% the height.

### /courses/:id/lessons/:contentId
- _Not captured — no lesson content available in the test course. Re-audit once a course with modules+content is seeded._

## Responsive — Profile + Ancillary

### /client/profile
- Same column-width problem as /system/profile: ~700px form on a 1440 viewport with empty rails. Add a side panel or cap form width and center.
- Verified + Active here render in green correctly.

### /client/dashboard/invitations
- Empty state confirmed; pure dark canvas with a centered envelope + "No Invitations".
- **Naming collision**: sidebar shows "Invites 4" badge on Members tab, but `/invitations` page is empty. Two different concepts ("invites I've sent to my org" vs "invitations to me as a user") share the word. Disambiguate copy.

### /client/dashboard/certificates
- Empty state, fine.
- "View and download your earned certificates" subhead — no preview/sample to anchor expectation. Could include a sample certificate thumbnail watermarked "Example" so users see what they'll get.

### /client/dashboard/my-courses
- Card grid of available courses in the workspace. Card has thumbnail + category chip + title + description + book icon (lessons count?). Looks decent.
- "Free" pill on every card is brand orange — yet again. Same color collision; "Free" should be neutral or success.

### /client/dashboard/my-learning
- **Bug: implementation-detail leak.** Empty state copy reads: _"Your enrolled courses will appear here once the learning API is integrated."_ End users should never see the word "API". Swap for: _"You haven't enrolled in any courses yet. Browse the catalogue to get started."_

## Responsive — Instructor Role

Captured: `instructor-dashboard/*`, `instructor-courses/*`, `instructor-my-courses/*`, `instructor-live-sessions/*`.

### Sidebar (correct gating)
- Instructor view drops "Members" — good role-based gating.
- Sidebar header tag reads `instructor` instead of `admin` — clean.

### /client/dashboard (instructor variant)
- **New hero card** at top: orange-tinted band with "Acme — Instructor dashboard…" + `+ New Course` CTA. Different from admin's plain "Workspace administration overview" header.
- Different stats: My Courses / Total Learners / Avg Completion / Categories — instructor-relevant.
- Same desktop 2×2 stat layout problem; same Quick Actions area.
- Hero card border + background uses the brand orange tint — adds yet another orange band on the page (now alongside the orange "Invite Members" / CTAs). Soften to a neutral surface with a single orange accent stripe.

### /client/dashboard/courses (instructor sees same all-courses table)
- **Permissions ambiguity.** Instructor sees every course in the org with a "Manage" button on each row — including courses they didn't create. Either (a) filter the table to "courses I own" by default with a "Show all" toggle, or (b) keep the all-courses view but disable Manage on rows the user doesn't own.
- "+ Create Course" is the right CTA placement.

### /client/dashboard/my-courses (instructor)
- **Naming is misleading.** "My Courses" page actually shows _all courses available in the organization_ ("Browse courses available in your organization"). For an instructor, "My Courses" should mean "courses I authored". Either rename this page to "Catalogue" / "All Courses" and add a real "My Courses" filtered view, or keep the name and filter the data.
- Card grid + "Free" pills carry forward the brand-orange-for-status problem.

### /client/dashboard/live-sessions (instructor)
- Identical to admin. Instructor can schedule sessions — appropriate. Same tablet/mobile breakage as before.

### Cross-cutting
- All P0 issues from the consolidated list still apply to the instructor surface (sidebar overflow at 768, badge color collisions, table responsiveness). One-fix-many-pages remains the right strategy.






