# Frontend Components Guide

Reference for every file under `frontend/src/components/`, plus the small app-level client helpers that sit next to routes. Stack: Next.js App Router, React Server Components where possible, and `"use client"` islands for interactivity.

## Hierarchy (big picture)

```
app/layout.tsx
├── AppShell                          # global chrome + CategoryPickerProvider
│   ├── HashScroll / NavigationHistory / NavigationLoader
│   ├── WelcomeOnboarding / ListSavePrompt
│   ├── BackButton, header search, Explore, bottom tabs
│   ├── <main>{children}</main>       # each page
│   └── SiteFooter → FeedbackDialog
└── Toaster (ui/sonner)

Pages compose section components → domain building blocks → ui/* primitives
```

| Folder | Role |
|--------|------|
| `layout/` | App chrome, nav UX, shared page shells |
| `home/` | Home-page sections |
| `product/` | Catalog UI: cards, categories, pricing, lists CTA |
| `lists/` | List create / pick sheet |
| `search/` | Search form and empty / no-results states |
| `profile/` | Shared profile page widgets |
| `auth/` | Sign-up / sign-in form |
| `ui/` | Design-system primitives (shadcn-style over Base UI) |

**Parent vs child:** “Parent” means it composes other domain components or mounts children. “Child” means it is mainly consumed by a parent. Many files are both.

---

## Layout (`components/layout/`)

### `app-shell.tsx`

| | |
|---|---|
| **Exports** | `AppShell` |
| **Type** | Client · **Parent (root shell)** |
| **Used by** | `app/layout.tsx` |

**What it does:** Global chrome around every page — sticky glass header, main content, desktop footer, mobile bottom tab bar (Home, Search, Explore, Lists, Profile). Mounts conversion onboarding (`WelcomeOnboarding`, `ListSavePrompt`).

**Logic:** Wraps the tree in `CategoryPickerProvider`. Mounts invisible nav helpers (`HashScroll`, `NavigationHistory`, `NavigationLoader`). Shows `BackButton` on mobile when not on `/`. Hides the header search capsule on home (hero owns search). Returning visitors get different search placeholder copy via `useReturningVisitor`. Lists tab badge uses `useDemoUser` + `totalListItems()`. Explore opens the category picker on the stores tab and looks “active” when the picker is open or the route is under `/category` / `/store`.

**Interacts with:** `BackButton`, `SiteFooter`, `WelcomeOnboarding`, `ListSavePrompt`, `HashScroll`, `NavigationHistory`, `NavigationLoader`, `CategoryPickerProvider` / `useCategoryPicker`, `useDemoUser`, `useReturningVisitor`, `Button`, list helpers.

---

### `back-button.tsx`

| | |
|---|---|
| **Exports** | `BackButton` |
| **Type** | Client · **Child** |
| **Used by** | `AppShell` (mobile header) |

**What it does:** Circular chevron-left control for “go back.”

**Logic (priority):** `fallbackHref` → forced nav parent from `getNavParent` → `router.back()` only if `canSafelyGoBack()` → otherwise parent href or `/`. Always calls `startPageTransition()` first so the top loader runs.

**Interacts with:** `canSafelyGoBack` (`navigation-history`), `startPageTransition` (`navigation-loader`), `getNavParent`, `Button`, Next router.

---

### `breadcrumbs.tsx`

| | |
|---|---|
| **Exports** | `Breadcrumbs`, `Crumb` |
| **Type** | Client · **Child** |
| **Used by** | Most content pages + `LegalPage` |

**What it does:** Desktop-only crumb trail (`Home → … → current`). Last item is text, not a link.

**Logic:** Renders a link only when `href` is set and the item is not last. Hidden on mobile (back button + tabs cover that role).

**Props:** `{ items: { label: string; href?: string }[] }`

---

### `feedback-dialog.tsx`

| | |
|---|---|
| **Exports** | `FeedbackDialog` |
| **Type** | Client · **Child** |
| **Used by** | `SiteFooter`, `app/profile/page.tsx` |

**What it does:** Controlled “Send feedback” dialog (message + optional email).

**Logic:** Local form state. Submit requires a non-empty message (toast error otherwise). Success clears fields, closes, and shows a success toast — **no backend call** (demo UX). Closing the dialog clears fields.

**Props:** `{ open: boolean; onOpenChange: (open: boolean) => void }`

**Interacts with:** Dialog / Input / Button (`ui/`), `sonner` toasts.

---

### `hash-scroll.tsx`

| | |
|---|---|
| **Exports** | `HashScroll` |
| **Type** | Client · **Child (effect only)** · renders `null` |
| **Used by** | `AppShell` |

**What it does:** After App Router navigations, smoothly scrolls to the URL hash (Next does not do this by default). Enables home `#stores` deep links, etc.

**Logic:** On pathname change and `hashchange`, `requestAnimationFrame` then `scrollIntoView({ behavior: "smooth" })`.

---

### `legal-page.tsx`

| | |
|---|---|
| **Exports** | `LegalPage` |
| **Type** | Server-friendly · **Parent** of breadcrumbs + article |
| **Used by** | `about`, `faq`, `privacy`, `terms` pages |

**What it does:** Shared layout for static legal/info pages: breadcrumbs, white article card, optional description, “Back home” link.

**Props:** `{ title: string; description?: string; children: React.ReactNode }`

**Interacts with:** `Breadcrumbs`, `next/link`.

---

### `navigation-history.tsx`

| | |
|---|---|
| **Exports** | `NavigationHistory`, `canSafelyGoBack` |
| **Type** | Client · **Parent of none** · effect component + helper |
| **Used by** | `AppShell` (mount); `BackButton` (`canSafelyGoBack`) |

**What it does:** Tracks in-app path history in `sessionStorage` (`easishop-path-stack`, max 40) so back can avoid leaving the site.

**Logic:** Push pathname when it is new; pop when navigating to the previous entry. `canSafelyGoBack()` is true when stack length > 1. SSR-safe (returns false without `window`).

---

### `navigation-loader.tsx`

| | |
|---|---|
| **Exports** | `NavigationLoader`, `startPageTransition` |
| **Type** | Client · **Both** (mounted in shell; helper used elsewhere) |
| **Used by** | `AppShell`; callers of `startPageTransition` (back, search, lists, etc.) |

**What it does:** Top green progress bar + delayed spinner during in-flight navigations.

**Logic:** Capture-phase clicks on same-origin internal `<a>` (skips hash / mailto / tel / modified clicks / same URL). Programmatic navigations fire custom event `easishop:navigate-start` via `startPageTransition()`. Shows UI only after ~180ms pending to avoid flash; clears on pathname/searchParams change; 10s safety timeout.

---

### `site-footer.tsx`

| | |
|---|---|
| **Exports** | `SiteFooter` |
| **Type** | Client · **Both** |
| **Used by** | `AppShell` |

**What it does:** Desktop-only footer: brand blurb, site links, Feedback button, copyright year.

**Logic:** Local `feedbackOpen` state drives `FeedbackDialog`. Feedback is a button, not a link.

**Interacts with:** `FeedbackDialog`, `@/lib/site-links`, `next/link`.

---

### `social-icons.tsx`

| | |
|---|---|
| **Exports** | `TikTokIcon`, `InstagramIcon`, `FacebookIcon`, `LinkedInIcon`, `WhatsAppIcon`, `GoogleIcon` |
| **Type** | Server-safe SVGs · **Child** |
| **Used by** | Profile, auth form, price-alert prompt |

**What it does:** Brand social icons (`currentColor`, optional `size`, default 16). `GoogleIcon` is multicolour. Shared internal `SocialSvg` wrapper for mono icons.

---

## Home (`components/home/`)

Home page (`app/page.tsx`) order: `HomeHero` → `HomeStores` → `CategoryStrip` (from product/) → `HomeDeals` → `HomeFeatured`.

### `home-hero.tsx`

| | |
|---|---|
| **Exports** | `HomeHero` |
| **Type** | Client · **Both** (child of home; parent of `SearchCapsule`) |

**What it does:** Full-bleed grocery hero with copy + hero search.

**Logic:** `useReturningVisitor()` swaps headline / subcopy (welcome-back vs first-visit South Africa prices story). Desktop/mobile sublines differ slightly. Hosts `SearchCapsule variant="hero"`.

**Interacts with:** `SearchCapsule`, `useReturningVisitor`, `next/image`.

---

### `home-stores.tsx`

| | |
|---|---|
| **Exports** | `HomeStores` |
| **Type** | Client · **Child** of home |

**What it does:** “Shop by store” grid (`id="stores"` for hash scroll) with retailer logos linking to `/store/[slug]`.

**Logic:** Cards come from `RETAILERS`. “See all” opens the category picker on the **stores** tab via `useCategoryPicker().openBrowse("stores")` instead of a separate browse route.

**Interacts with:** `useCategoryPicker`, `Button`, `RETAILERS`, `next/image` / `next/link`.

---

### `home-deals.tsx`

| | |
|---|---|
| **Exports** | `HomeDeals` (async) |
| **Type** | **Server** · **Both** |

**What it does:** Cream “Top deals of the day” section: up to 4 deal cards in a horizontal scroller, or an empty soft state.

**Logic:** `const deals = (await getDeals()).slice(0, 4)`. Early empty return omits “See all.”

**Interacts with:** `ProductCard`, `SeeAllDealsButton`, `getDeals` (`@/lib/products`).

---

### `home-featured.tsx`

| | |
|---|---|
| **Exports** | `HomeFeatured` (async) |
| **Type** | **Server** · **Both** |

**What it does:** “Popular right now” — up to 8 featured products in a responsive grid, or empty soft block.

**Logic:** `await getFeaturedProducts(8)`.

**Interacts with:** `ProductCard`, `getFeaturedProducts`.

---

### `see-all-deals-button.tsx`

| | |
|---|---|
| **Exports** | `SeeAllDealsButton` |
| **Type** | Client · **Child** of `HomeDeals` |

**What it does:** Ghost “See all” link to `/deals` with hover-nudging arrow.

**Logic:** Stateless; `Button` with `render={<Link href="/deals" />}` so it is a real anchor.

---

## Product (`components/product/`)

### `product-card.tsx`

| | |
|---|---|
| **Exports** | `ProductCard` |
| **Type** | Client · **Both** |
| **Used by** | Home deals/featured, search, deals, category, store, similar products |

**What it does:** Product tile — image, deal badge, add-to-list, lowest price + optional strikethrough was-price, retailer logo.

**Logic:** `getLowestPrice` / `getSavingsAmount` from catalog helpers. Whole card links to `/product/[id]`; add-to-list sits outside the main link and stops propagation. Container queries show was-price only when wide enough (`@[11rem]`).

**Interacts with:** `ProductImage`, `DealBadge`, `AddToListButton`, catalog + retailer logo helpers.

**Props:** `{ product: Product }`

---

### `product-image.tsx`

| | |
|---|---|
| **Exports** | `ProductImage` |
| **Type** | Client · **Child** |
| **Used by** | `ProductCard`, product detail page |

**What it does:** Safe product image; archive-box placeholder if `src` is null or load fails.

**Logic:** Local `failed` state; `next/image` `onError` flips to placeholder with `aria-label={alt}`.

**Props:** `{ src: string | null; alt: string; sizes?; priority?; className? }`

---

### `deal-badge.tsx`

| | |
|---|---|
| **Exports** | `DealBadge` |
| **Type** | Client · **Child** |
| **Used by** | `ProductCard`, `PriceComparisonPanel` |

**What it does:** Green savings chip (`↓ R…`). Hidden when `amount <= 0`.

**Props:** `{ amount: number; className?: string }`

---

### `add-to-list-button.tsx`

| | |
|---|---|
| **Exports** | `AddToListButton` |
| **Type** | Client · **Both** |
| **Used by** | `ProductCard`, product detail page |

**What it does:** Circular + / ✓ that opens `ListSheet` for a product.

**Logic:** `useDemoUser` + `isInAnyList` for saved state. Click `preventDefault` / `stopPropagation` so it works inside linked cards.

**Props:** `{ productId: string; productName: string; className?: string }`

**Interacts with:** `ListSheet`, list helpers, `Button`.

---

### `price-comparison-panel.tsx`

| | |
|---|---|
| **Exports** | `PriceComparisonPanel` |
| **Type** | Client · **Both** |
| **Used by** | Product detail page (mobile + desktop layouts) |

**What it does:** Sorted retailer prices, “Lowest” callout when unambiguous, best-value unit badge, external Buy buttons. When any partner store is missing a price, a collapsed coverage note under the list can expand to name unavailable stores (no Buy). Also mounts `CompareAhaTip` (first multi-price visit) and `PriceAlertPrompt`.

**Logic:** Uses `getPriceCoverage` (available rows only in the list; unavailable partners from `RETAILERS`). “Lowest” only when there are 2+ prices and the cheapest differs from the most expensive. Buy uses `Button` + `render={<a/>}` and `track("open_retailer", …)`. Expand/collapse fires `track("toggle_unavailable_retailers", …)`. Empty state is a dashed card plus a “We checked …” line listing partners.

**Props:** `{ product: Product }`

**Interacts with:** `DealBadge`, `CompareAhaTip`, `PriceAlertPrompt`, `Badge` / `Button` / `Card`, catalog coverage helpers, `track`.

---

### `similar-products.tsx`

| | |
|---|---|
| **Exports** | `SimilarProducts` (async) |
| **Type** | **Server** · **Both** |
| **Used by** | Product detail page |

**What it does:** “Similar products” grid on the PDP.

**Logic:** Naive similarity — first word of the product name → `searchProducts` → drop self → take 4. Returns `null` if empty (section omitted).

**Props:** `{ product: Product }`

---

### `skeletons.tsx`

| | |
|---|---|
| **Exports** | `ProductCardSkeleton`, `ProductGridSkeleton`, `PriceRowSkeleton`, `ListProductRowSkeleton`, `ListProductSkeleton` |
| **Type** | Server-safe · **Both** |
| **Used by** | Home / search / deals Suspense fallbacks; list detail |

**What it does:** Loading placeholders that mirror real card and list-row layouts.

**Notes:** `PriceRowSkeleton` is exported but unused elsewhere today.

---

### `category-icons.tsx`

| | |
|---|---|
| **Exports** | `getCategoryIcon(slug)` |
| **Type** | Client util · **Child / leaf** |
| **Used by** | Category strip, picker, grid, search empty state |

**What it does:** Maps aisle slugs to Reicon icons; unknown → `Package`.

---

### `category-strip.tsx`

| | |
|---|---|
| **Exports** | `CategoryStrip` |
| **Type** | Client · **Both** |
| **Used by** | Home page |

**What it does:** “Shop by aisle” — mobile glass horizontal pills with scroll chevron; desktop icon column + “All categories.”

**Logic:** Hardcoded featured slugs filtered from `CATEGORIES`. “All” / browse opens picker on **aisles** via `useCategoryPicker().openBrowse("aisles")`. Links go to `/category/[slug]`.

**Props:** `{ className?: string }`

---

### `category-picker.tsx`

| | |
|---|---|
| **Exports** | `CategoryPickerProvider`, `useCategoryPicker`, `BrowseTab`, `useBrowsePicker` (deprecated alias) |
| **Type** | Client · **Parent provider** (+ private sheet UI) |
| **Used by** | Provider in `AppShell`; hook in shell, home stores, category strip, list detail |

**What it does:** Global Stores / Aisles browse sheet with search, mounted once for the whole app.

**Logic:** Context exposes `open`, `tab`, `openBrowse`, `toggle`. Private `BrowsePickerSheet` filters `CATEGORIES` / `RETAILERS`; sheet `side` is left on desktop / right on mobile (`useMediaQuery`). Opening Explore defaults to stores; aisle strip opens aisles. Links close the sheet.

**Props (provider):** `{ children: React.ReactNode }`

**Interacts with:** `Sheet` / `Input`, `getCategoryIcon`, catalog + retailers data.

---

### `category-grid.tsx`

| | |
|---|---|
| **Exports** | `CategoryGrid` |
| **Type** | Client · **Currently unused parent** |

**What it does:** Responsive category link grid with rotating pastel accents. Optional `limit` slices `CATEGORIES`.

**Status:** No importers in the frontend today; strip + picker cover the live browse UX.

**Props:** `{ limit?: number; className?: string }`

---

## Auth (`components/auth/`)

### `auth-form.tsx`

| | |
|---|---|
| **Exports** | `AuthForm`, `AuthMode` |
| **Type** | Client |
| **Used by** | `app/signup/page.tsx`, `app/signin/page.tsx` |

**What it does:** Shared sign-up / sign-in. Bottom-left brand orb (via `AppShell`). Google first; short email form; WhatsApp only when `?intent=alert`. Neutral `zinc-100` inputs; brand-green primary CTA (native button — avoids `glass-dark`). Spec: [`ux-auth-forms.md`](../ux-auth-forms.md).

---

## Onboarding (`components/onboarding/`)

Conversion-first layers — see repo root `ux-onboarding-conversion.md`.

### `welcome-onboarding.tsx`

| | |
|---|---|
| **Exports** | `WelcomeOnboarding` |
| **Type** | Client · **Child** of `AppShell` |
| **Used by** | `app-shell.tsx` |

**What it does:** First-visit welcome (Search / Deals / Skip). Mobile bottom sheet; desktop dialog. Sets `onboardingSeen`.

### `compare-aha-tip.tsx`

| | |
|---|---|
| **Exports** | `CompareAhaTip` |
| **Type** | Client |
| **Used by** | `price-comparison-panel.tsx` |

**What it does:** One-time tip when a product has ≥2 available prices.

### `list-save-prompt.tsx`

| | |
|---|---|
| **Exports** | `ListSavePrompt`, `requestListSavePrompt` |
| **Type** | Client · mounted in `AppShell`; triggered from `ListSheet` after first add |
| **Used by** | `app-shell.tsx`, `list-sheet.tsx` |

**What it does:** After the first add-to-list, **guests only** get a soft Create account / Sign in dialog. Signed-in users skip (no name dialog).

### `price-alert-prompt.tsx`

| | |
|---|---|
| **Exports** | `PriceAlertPrompt` |
| **Type** | Client |
| **Used by** | `price-comparison-panel.tsx` |

**What it does:** “Alert me on WhatsApp” → WhatsApp number with country-code validation (E.164).

---

## Lists (`components/lists/`)

### `list-sheet.tsx`

| | |
|---|---|
| **Exports** | `ListSheet` |
| **Type** | Client · **Child** (domain sheet; parents open it) |
| **Used by** | `AddToListButton` (picker mode); `app/lists/page.tsx` (create-only) |

**What it does:** Dual-mode dialog — create a list, and optionally add/remove a product across lists.

**Logic:** `isPicker = !!productId`. Create UI shows when not picking, when creating, or when the user has no lists. Create → optional `addToList` → analytics → toast → `refresh()` → close. Toggle stays open on remove, closes on add. After a successful add, may request `ListSavePrompt`. Toasts can route to the list via `startPageTransition` + `router.push`.

**Props:** `{ open; onOpenChange; productId?; productName? }`

**Interacts with:** Demo user + `@/lib/lists`, Dialog / Input / Button, `track`, `requestListSavePrompt`, `startPageTransition`.

---

## Search (`components/search/`)

### `search-capsule.tsx`

| | |
|---|---|
| **Exports** | `SearchCapsule` |
| **Type** | Client · **Child** |
| **Used by** | `HomeHero` (`variant="hero"`), search page |

**What it does:** Primary search glass pill; submit goes to `/search?q=…`.

**Logic:** Synced local `query` from `initialQuery`. When empty and unfocused, rotates shuffled sample placeholders (~2.4s) with a flicker animation. Submit tracks `search`, starts page transition, then `router.push`. Barcode scan UI is present but **commented out**.

**Props:** `{ initialQuery?; autoFocus?; className?; variant?: "default" | "hero" }`

---

### `barcode-scanner.tsx`

| | |
|---|---|
| **Exports** | `BarcodeScanner` |
| **Type** | Client · **Built but not wired** (commented out of `SearchCapsule`) |

**What it does:** Photo / gallery barcode decode → confirm → product lookup.

**Logic:** Not a live camera stream — file inputs + `Html5Qrcode.scanFile` (EAN/UPC/Code128/39/ITF). Confirm hits `/api/search?q=…&barcode=1`; one hit → product page, else search results. Analytics + toasts on failure.

**Props:** `{ open; onOpenChange }`

---

### `search-empty-state.tsx`

| | |
|---|---|
| **Exports** | `SearchEmptyState`, `PopularSearchPills` |
| **Type** | Client · **Both** |
| **Used by** | Search page (`SearchEmptyState`); also `SearchNoMatches` (`PopularSearchPills`) |

**What it does:** Empty search landing — welcome copy, popular query pills, aisle shortcuts.

**Logic:** `useReturningVisitor()` swaps copy. Quick category pills filtered from `CATEGORIES` with `getCategoryIcon`.

---

### `search-no-matches.tsx`

| | |
|---|---|
| **Exports** | `SearchNoMatches` |
| **Type** | Client · **Both** |
| **Used by** | Search page when a query returns nothing |

**What it does:** “No matches” copy + `PopularSearchPills` as recovery paths.

---

### `browse-search-link.tsx`

| | |
|---|---|
| **Exports** | `BrowseSearchLink` |
| **Type** | Client · **Child** |
| **Used by** | Category and store pages (mobile: `md:hidden`) |

**What it does:** Compact glass pill linking to global `/search` so browse pages can pivot to search.

**Props:** `{ className?; hint? }` (default hint `"Search all stores"`)

---

## Profile (`components/profile/`)

### `profile-ui.tsx`

| | |
|---|---|
| **Exports** | `ProfileSectionHeader`, `ProfileNavLink`, `FieldError`, `getInitials` |
| **Type** | Client · **Child utilities** |
| **Used by** | Profile hub, edit, account, marketing pages |

**What it does:** Shared profile chrome — section header with green icon tile, nav row cards (optional danger tone), field error text, avatar initials helper.

**Logic:** Forms and account actions live in the pages; this file stays presentational / tiny helpers. Profile does **not** use `ui/avatar` — it draws initials in a custom circle via `getInitials`.

---

## UI primitives (`components/ui/`)

Shadcn-style public API, mostly wrapping **Base UI** (`@base-ui/react/*`) with Tailwind, branded radii (often `rounded-[32px]` family), and glass / pill variants. These are **leaves** relative to the domain tree (unless a composite like Dialog/Sheet parents header/footer slots).

| File | Exports (main) | Role | Live usage |
|------|----------------|------|------------|
| `button.tsx` | `Button`, `buttonVariants` | Primary control; polymorphic `render` | Everywhere interactive |
| `input.tsx` | `Input` | Textured text field | Search, picker, lists, feedback, profile |
| `badge.tsx` | `Badge`, `badgeVariants` | Small status chip | Deal / price UI |
| `card.tsx` | `Card` + slots | Section container | Price comparison panel |
| `dialog.tsx` | Dialog suite | Modal (bubble aesthetic) | Lists, feedback, barcode, account |
| `sheet.tsx` | Sheet suite | Slide-over drawer | Category picker |
| `label.tsx` | `Label` | Form label | Profile edit / marketing |
| `switch.tsx` | `Switch` | Toggle | Marketing preferences |
| `skeleton.tsx` | `Skeleton` | Pulse placeholder | Product skeletons |
| `sonner.tsx` | `Toaster` | Toast host (branded) | Root layout; callers use `toast` from `sonner` |
| `avatar.tsx` | Avatar suite | User image / fallback | **Unused** (profile uses custom initials) |
| `tabs.tsx` | Tabs suite | Tabbed panels | **Unused** |
| `separator.tsx` | `Separator` | Divider | **Unused** |
| `scroll-area.tsx` | `ScrollArea`, `ScrollBar` | Custom scroll | **Unused** |
| `dropdown-menu.tsx` | Full menu suite | Menus / submenus | **Unused** |

**Logic notes:**
- `Button` / `Badge` support polymorphic composition (`render` / `useRender`) so nav links and external Buy anchors stay semantic.
- Dialog and Sheet share Base UI Dialog under the hood; Sheet repositions with `side`.
- `Toaster` forces light theme and pill toast classNames; mounted once in `app/layout.tsx`.

---

## App-level companions (not under `components/`, but component-like)

These live next to routes and work with the component tree:

| File | Role |
|------|------|
| `app/layout.tsx` | Root layout: fonts, `AppShell`, `Toaster` |
| `app/**/page.tsx` | Route parents that compose section components |
| `app/search/search-tracker.tsx` | Leaf analytics: `track("search")`, renders `null` |
| `app/product/[id]/product-tracker.tsx` | Leaf: `track("view_product")` |
| `app/category/[slug]/category-tracker.tsx` | Leaf: `track("view_category")` |

Deals page tracks `view_deals` inline instead of a separate tracker file.

---

## Cross-cutting patterns

1. **Server vs client split** — Async data sections (`HomeDeals`, `HomeFeatured`, `SimilarProducts`) stay Server Components; interactivity is isolated in client islands.
2. **Catalog / money logic** — Lives in `@/lib/catalog` and friends; components display, they do not invent pricing rules.
3. **Demo lists & user** — List UX is client-side (`@/lib/lists` + `useDemoUser`), not a remote account API.
4. **Browse as ambient context** — One `CategoryPickerProvider` in the shell; Explore, home stores, and aisle strip all open the same sheet with different default tabs.
5. **Nav loading protocol** — Link click capture + `easishop:navigate-start` keep soft navigations visually consistent.
6. **Safe back** — Path stack in session storage so the mobile back button does not dump users off-site.
7. **Desktop crumbs / mobile back** — Breadcrumbs are `md+` only; phones lean on `BackButton` and the tab bar.
8. **Unused / dormant** — `CategoryGrid`, several `ui/*` primitives, `PriceRowSkeleton`, and `BarcodeScanner` (wired off) are still in tree for future use.

---

## Quick “who uses what” map

| Need | Start here |
|------|------------|
| Global chrome | `layout/app-shell.tsx` |
| Home sections | `home/*` + `product/category-strip.tsx` |
| Product tile | `product/product-card.tsx` |
| PDP prices / similar | `price-comparison-panel`, `similar-products` |
| Lists | `lists/list-sheet.tsx` + pages under `app/lists` |
| Search UI | `search/search-capsule.tsx` + empty / no-match |
| Browse stores/aisles | `product/category-picker.tsx` |
| Legal/static | `layout/legal-page.tsx` |
| Design tokens / controls | `components/ui/*` |
