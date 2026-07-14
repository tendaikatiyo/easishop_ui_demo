# UX: Navigation & wayfinding improvements

**Status:** Implemented (P0–P5)  
**Scope:** Make Find / Browse / Save easy to discover and switch between across mobile and desktop.

Mental model to design against:

| Job | User says | Primary surface |
|-----|-----------|-----------------|
| **Find** | “Milk / barcode” | Search |
| **Browse** | “Pick n Pay / Dairy” | Explore (Stores \| Aisles) |
| **Save** | “My shopping list” | Lists |

**Deals** = Find with a price-drop filter. **Profile** = account. **Home** = launchpad.

---

# P0 — Labeled Explore in mobile header (option 2)

**Priority:** P0  
**Decision:** Keep the 5-tab bottom nav; make Explore a **labeled** header control (icon + text), not icon-only.

## Problem

On desktop, **Explore** is a named item in the top nav and opens the drawer (Stores tab by default).

On mobile, Explore is only a **compass icon** in the sticky header (`aria-label` only). It sits outside the primary bottom tabs (Home, Search, Deals, Lists, Profile). Users who navigate via the tab bar often never discover stores/aisles.

Search is first-class on mobile; Explore is not — even though both are primary ways into inventory (**Find** vs **Browse**).

## Chosen solution (option 2)

Do **not** add Explore to the bottom tab bar.

Instead:

1. Keep bottom nav as: **Home | Search | Deals | Lists | Profile**.
2. Replace the mobile header icon-only compass with a **compact labeled control**: Compass icon + **Explore** text.
3. Behavior stays the same: tap opens the Explore sheet/drawer, default tab **Stores**.
4. Desktop Explore label stays as-is (already labeled).

**Rejected alternative (option 1):** Swap/merge a bottom tab for Explore (e.g. drop Deals from tabs). Deferred — more disruptive to an established 5-destination bar.

## Design specs

| Aspect | Spec |
|--------|------|
| Placement | Sticky header, right side (`md:hidden`), same slot as current compass button |
| Content | Compass icon + “Explore” label |
| Style | Match existing glass header chips (`glass-soft`); pill/rounded-full; tap target ≥ 44px height where possible |
| Active / open | Visually active when drawer is open and/or when on `/store/*` or `/category/*` (parity with desktop `onBrowsePage \|\| open`) |
| Action | `openBrowse("stores")` |
| Accessibility | Visible text label preferred; keep `aria-expanded` on the control; don’t rely on icon alone |

### Layout constraints

- Header already has: Back (non-home) | EasiShop logo | [spacer] | Explore.
- Label must stay **short** so it doesn’t collide with the logo on narrow widths.
- Prefer `inline-flex items-center gap-1.5` with `px-2.5` / `px-3` rather than `size="icon"` only.
- If space is extremely tight, still show text at a smaller size rather than dropping back to icon-only.

## Implementation touchpoints

| File | Change |
|------|--------|
| `frontend/src/components/layout/app-shell.tsx` | Mobile header `Button`: remove icon-only sizing; add “Explore” text next to `Compass`; keep `openBrowse("stores")` |

No change required to bottom `mobileNav`, category strip “All categories”, or Explore sheet tabs for this P0 alone.

## Acceptance criteria

- [x] On mobile, Explore is visible as **icon + “Explore”** in the header on Home and inner pages.
- [x] Tap opens Explore drawer on the **Stores** tab.
- [x] Bottom nav still has five items; Explore is **not** a sixth tab.
- [x] Desktop top nav Explore behavior and label unchanged.
- [x] Open / on store-or-category route still shows an active/selected state on the control.
- [x] Control remains usable on ~320px-wide viewports without overlapping the logo.

## Why this helps

Users always see a named **Browse** entry point next to brand chrome, aligned with desktop, without reinventing the tab bar. Find (Search tab) and Browse (header Explore) become peer, obvious jobs.

---

# P1 — One consistent Explore rule

**Priority:** P1  
**Depends on:** P0 (Discoverability); can ship copy/behavior polish independently.

## Problem

Header **Explore** defaults to **Stores**, while home leads with **Categories** / “All categories” (aisles). Sheet title says “Explore” regardless of tab. Users don’t get one clear rule for what Explore means.

## Solution

Commit to:

| Control | Meaning | Opens |
|---------|---------|--------|
| **Explore** (header / desktop nav) | Discovery hub | Drawer, **Stores** tab |
| **All categories** (category strip) | Aisles shortcut | Drawer, **Aisles** tab |

### Copy / UI polish

- Sheet title can stay **Explore**, or dynamically reflect the active tab (**Stores** / **Aisles**) — pick one approach and use it everywhere.
- Avoid implying Explore is categories-first when the default tab is Stores.
- Keep Aisles \| Stores segmented control as the way to switch modes inside the drawer.

## Implementation touchpoints

| File / area | Change |
|-------------|--------|
| `category-picker.tsx` | Align sheet title / empty states / placeholders with the chosen rule |
| `category-strip.tsx` | Confirm “All categories” always opens aisles (already intended) |
| `app-shell.tsx` | Explore always `openBrowse("stores")` (already intended) |
| Home / any remaining “Browse” copy | Align wording with Explore / All categories |

## Acceptance criteria

- [x] Every Explore entry point opens Stores by default.
- [x] Every “All categories” entry point opens Aisles.
- [x] Sheet labeling matches the rule (static “Explore” *or* dynamic tab title — consistent).
- [x] No user-facing “Browse” leftover for the same action.

---

# P2 — Home section order / store CTA polish

**Priority:** P2  
**Depends on:** P0/P1 helpful but not required.

## Problem

Home order today is roughly:

**Search (hero) → Categories → Deals → Stores → Featured**

Stores are concrete and brand-forward, but they sit below categories and deals. Header Explore promotes Stores first; home does not. The redundant full-width “Explore all stores” pill was removed — good — but mobile users scrolling home may still miss stores unless order or a short CTA helps.

## Solution

Prefer a clearer browse ladder on home:

1. **Search** (hero) — Find  
2. **Stores** — Browse by retailer (few, logos, high recognition)  
3. **Categories** — Browse by aisle (many, abstract)  
4. **Deals / featured** — Promoted Find  

### Optional CTA (if stores stay lower)

If section order is not changed, add a quiet text/link CTA near categories or after hero, e.g. “Browse by store”, that calls `openBrowse("stores")` — not a second full-width pill.

Desktop **See all** on the stores section can remain (opens Explore → Stores).

## Implementation touchpoints

| File / area | Change |
|-------------|--------|
| `app/page.tsx` | Reorder `HomeStores` vs `CategoryStrip` / deals if adopting the ladder above |
| `home-stores.tsx` | Keep compact “See all”; avoid restoring the redundant mobile pill |
| `category-strip.tsx` | Optional cross-link to stores only if order stays category-first |

## Acceptance criteria

- [x] Home browse path matches the agreed ladder *or* a single clear store CTA exists when stores are below the fold.
- [x] No duplicate “Explore all stores”-style mobile pill.
- [x] Hero search remains the first viewport job.

---

# P3 — Search shortcut while deep in store/category

**Priority:** P3  
**Depends on:** None (orthogonal to Explore labeling).

## Problem

Users deep in `/store/[slug]` or `/category/[slug]` often want to pivot to keyword search (“milk in this context / globally”) without mentally resetting via Home. Mobile has the Search tab; desktop has a header capsule off-home. Category/store pages themselves don’t invite the pivot.

## Solution

Keep Search one tap away while browsing:

- **Mobile:** Bottom Search tab is enough for a global pivot; optionally add a compact search affordance on store/category page headers (capsule or “Search products” link → `/search`).
- **Desktop:** Keep header search capsule on non-home routes; ensure it appears on store/category pages.
- **Nice-to-have:** Placeholder or query scope hint (“Search all stores” vs future in-store filter) — only if backend can support scope later; don’t fake in-store search.

## Implementation touchpoints

| File / area | Change |
|-------------|--------|
| `app-shell.tsx` | Confirm desktop search capsule shows on `/store/*` and `/category/*` |
| `store/[slug]/page.tsx`, `category/[slug]/page.tsx` | Optional inline search CTA → `/search` |
| `search-capsule.tsx` | Reuse if embedding a compact control on browse pages |

## Acceptance criteria

- [x] From any store or category page, Search is reachable in ≤1 tap (tab or in-page control).
- [x] Desktop header search remains available off home on browse routes.
- [x] Pivot goes to existing Search UX (no half-broken scoped search unless API supports it).

---

# P4 — Add-to-list confirmation → View list

**Priority:** P4  
**Depends on:** None (strengthens Save loop).

## Problem

Add-to-list from product cards/`+` is fast, but feedback is easy to miss. The Lists tab badge helps reconnect, but the loop “I saved something → go see it” isn’t explicit. Empty-list guidance already points people to browse; the reverse path after add is weaker.

## Solution

After a successful add (or create-list-and-add):

1. Short confirmation (toast, inline flash, or sheet success moment — match dialog/sheet conventions).
2. Primary secondary action: **View list** → `/lists/[id]`.
3. Keep existing list badge on nav as the persistent cue.

### From list detail

Add an obvious **Add more** action → Search (`/search`) or Explore (`openBrowse("stores")`) so Save → Find/Browse closes the loop.

## Implementation touchpoints

| File / area | Change |
|-------------|--------|
| `add-to-list-button.tsx` / `list-sheet.tsx` | Success confirmation + View list |
| Toast / lightweight feedback pattern | Prefer existing UI primitives; avoid new toast stack unless one exists |
| `lists/[id]/page.tsx` | “Add more” CTA to Search and/or Explore |

## Acceptance criteria

- [x] User can go from add success to the target list in one tap.
- [x] List detail offers a clear path back into Find or Browse.
- [x] Confirmation is non-blocking and matches bubble/dialog visual language where a sheet is used.

---

# P5 — Hierarchical back vs pure `history.back()`

**Priority:** P5  
**Depends on:** None (quality / predictability).

## Problem

Mobile header `BackButton` uses `router.back()` when `history.length > 1`, else `/`. After Search → product → list → product (or drawer-related hops), Back can feel random. Breadcrumbs help desktop more than phone.

## Solution

Prefer **hierarchical parent** when the route has a clear parent:

| Route | Preferred parent |
|-------|------------------|
| `/product/[id]` | Referrer if same-session browse; else `/search` or Home |
| `/lists/[id]` | `/lists` |
| `/category/[slug]` | Home `#categories` or open Explore aisles — pick one |
| `/store/[slug]` | Home stores section or Explore stores |
| `/profile/*` | `/profile` |
| Legal / FAQ | `/` or Profile utility section on mobile |

Fall back to `history.back()` only when parent is ambiguous *and* history exists.

On mobile, a quiet parent link under the page title (in addition to or instead of opaque Back) can reinforce orientation. Keep breadcrumbs on desktop.

## Implementation touchpoints

| File / area | Change |
|-------------|--------|
| `back-button.tsx` | Optional `fallbackHref` / context-aware parent |
| List / profile / store / category pages | Pass hierarchical fallback or inline “Back to …” |
| Breadcrumbs | Keep on desktop pages; don’t rely on them alone for mobile |

## Acceptance criteria

- [x] List detail Back always lands on `/lists` (or equivalent explicit parent).
- [x] Profile subpages Back land on `/profile`.
- [x] Product Back never dumps the user out of the app unexpectedly when a safe in-app parent exists.
- [x] Behavior documented so future pages pass a parent href where known.

---

# Suggested ship order

| Order | ID | Outcome |
|-------|----|---------|
| 1 | **P0** | Explore labeled and findable on mobile |
| 2 | **P1** | One mental model for Explore vs All categories |
| 3 | **P2** | Home browse ladder matches that model |
| 4 | **P4** | Save loop feels complete (high user value, small surface) |
| 5 | **P3** | Browse → Search pivot polish |
| 6 | **P5** | Predictable Back (deeper / more edge cases) |

---

# What not to do

- Don’t put Search, Explore, Categories, Stores, and Deals all as equal chrome items.
- Don’t remove the Explore drawer; unifying aisles + stores there is correct.
- Don’t rely only on home scrolling for Discover.
- Don’t restore a redundant full-width “Explore all stores” pill once header Explore is labeled (P0).
