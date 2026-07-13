# EasiShop UI Demo — Handover

Last updated: 13 July 2026

## What this repo is

A Next.js 16 (App Router) demo of the revamped EasiShop UI, living in `frontend/`.
It runs against the **live EasiShop API** (`https://www.easishop.co.za/api/v1`, HTTP Basic Auth).
Product requirements are in `context.md`; user journeys in `user_flows.md`.

Stack: Next.js 16 + TypeScript, Tailwind CSS v4, shadcn/ui (Base UI), lucide-react,
`next/font` (Bricolage Grotesque headings, Inter body, Geist Mono for prices/eyebrows).

## Running it

```bash
cd frontend
npm install
npm run dev   # http://localhost:3000
```

Create `frontend/.env` from `frontend/.env.example`:

```
EASISHOP_API_USERNAME=...
EASISHOP_API_PASSWORD=...
```

Credentials are server-only — they never reach the browser. Client components go
through the Next API routes under `src/app/api/*`.

## Latest session — summary

This session expanded profile/settings, lists UX, search polish, store browsing, and
visual refinements. Key themes:

| Area | What changed |
|---|---|
| **Profile** | Nav label **You → Profile**. Hub at `/profile` with links to **Edit profile**, **Marketing preferences**, and **Account settings** (delete). Extended user model: `username`, `name`, `surname`, `phone`, `email`, `marketingPrefs.emailMarketing`. Validation in `lib/profile-validation.ts` — **email is the only required field**. Removed user-facing “demo account” copy. |
| **Lists** | Shared bubble `ListSheet` for add-to-list and create-list flows. Floating “Your list” pill removed. Lists index toned down (neutral icons, muted “Open” — green reserved for CTAs). List detail: row skeletons while loading, cheapest retailer logo + price per item, **rename list** (dialog), **refresh prices** (bypasses 5‑min API cache via `?refresh=1`). |
| **Search** | Frontend search shim in `lib/search-query.ts` (query variants, token matching, ranking) because the live API is literal — `Lay's` works, `Lays` often does not. Rolling placeholder in search capsule, stronger frost, improved barcode scanner (EAN/UPC, wide qrbox, camera fallback). |
| **Home / stores** | **Explore by store** section (`HomeStores`) before trending staples; `/store/[slug]` pages via `lib/retailers.ts` + `getProductsByRetailer()`. Returning-visitor hero subtext updated. |
| **Visual / glass** | Liquid-glass utilities in `globals.css` (`glass`, `glass-nav`, etc.). SVG displacement filters removed (caused dark blobs / dialog smear). Dialogs/sheets are solid white bubbles again; dialog preference rule in `.cursor/rules/dialogs.mdc`. Bottom nav uses `glass-nav`; active tab is solid white pill. |
| **Fixes** | `Button` wrapper sets `nativeButton={false}` when `render` is used (fixes Base UI warning for `render={<Link/>}`). Batch products API supports `?refresh=1` for fresh price fetches. |

## Architecture cheat-sheet

- `src/lib/api/client.ts` — server-only fetch wrapper: Basic Auth, 30s timeout,
  5-min revalidate (or `fresh: true` / `cache: "no-store"` for on-demand refresh).
- `src/lib/api/normalize.ts` — raw API rows → `Product`. Retailer columns are
  `chk/dsc/pnp/srt/woo` (+ `_image`, `_url`, `_prev`). Product IDs are
  `p-<base64url(name)>`. Images resolve to `https://www.easishop.co.za/images/...`.
- `src/lib/products.ts` — data layer. React `cache`d per request; `searchProducts()`
  uses query expansion from `search-query.ts`. `getProductsByIds(ids, { fresh })` for
  list price refresh.
- `src/lib/storage.ts` — localStorage user, lists, analytics events, visit flag.
  `updateUser`, `deleteAccount`, marketing prefs migration from old `emailDeals`.
- `src/lib/lists.ts` — CRUD for shopping lists (`createList`, `renameList`,
  `addToList`, `removeFromList`, etc.).
- `src/app/api/{search,deals,featured,products/[id],products/batch}` — proxies for
  client components. Batch route: `GET ?ids=...&refresh=1` for fresh prices.
- Server components fetch directly; client pages (lists, profile) fetch via proxies.

## Key routes

| Route | Purpose |
|---|---|
| `/` | Home — hero, stores, categories, deals, featured |
| `/search` | Search + barcode |
| `/store/[slug]` | Products filtered by retailer |
| `/lists` | All lists |
| `/lists/[id]` | List detail — rename, refresh prices, remove items |
| `/profile` | Settings hub |
| `/profile/edit` | Edit profile (email required) |
| `/profile/marketing` | Email marketing consent |
| `/profile/account` | Delete account |

## Dialog / sheet conventions

See `.cursor/rules/dialogs.mdc`. Bubble feel: `rounded-[32px]`, white surface,
soft shadow, pill inputs/buttons, no hairline footer borders. List picker uses
`ListSheet` (`components/lists/list-sheet.tsx`).

## Known issues / next steps

- **Search** — frontend shim is a workaround; proper fuzzy search belongs on the backend.
- **Dischem** — API `dsc` fields are often empty in search payloads; not a frontend bug.
  Shoprite (`srt`) is sometimes present.
- Category browsing is approximated by search terms — replace with a real category
  endpoint when the backend has one.
- Deals fall back to search-derived price drops if
  `/analytics/price-changes/last-week` fails or is empty.
- Price history chart, location-based pricing, and real auth are stubs/absent by
  design (localStorage-only user for now).
- `frontend/.next/` build artifacts may appear in `git status` — ensure `.gitignore`
  covers them locally.

## Who did what

| Phase | Work |
|---|---|
| Scaffold + live API + early design | Earlier sessions (see git history) |
| Image fix, add-to-list, similar products | Fable 5 session (11 Jul) — prior handover |
| Profile, lists, search polish, stores, glass UI | Cursor session (13 Jul) — this handover |
