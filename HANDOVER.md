# EasiShop UI Demo — Handover

Last updated: 15 July 2026

## What this repo is

A Next.js 16 (App Router) demo of the revamped EasiShop UI, living in `frontend/`.
It runs against the **live EasiShop API** (`https://www.easishop.co.za/api/v1`, HTTP Basic Auth).
Product requirements are in `context.md`; user journeys in `user_flows.md`.

Stack: Next.js 16 + TypeScript, Tailwind CSS v4, shadcn/ui (Base UI), **reicon-react**
(icons — mostly `"use client"`; never import into Server Components), with some **lucide-react**
on mobile nav / search chrome, `next/font` (Bricolage Grotesque headings, Inter body,
Geist Mono for prices/eyebrows).

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
# Optional: force offline barcode index even if API recovers
# EASISHOP_USE_LOCAL_CATALOG=true
```

Credentials are server-only — they never reach the browser. Client components go
through the Next API routes under `src/app/api/*`.

Rebuild demo aisle map (from `frontend/`):

```bash
npm run build:demo-categories
# Optional OFF enrichment (offline only; not for production):
# OPEN_FOOD_FACTS=1 OFF_BUDGET=200 npm run build:demo-categories
```

## Latest session (15 Jul 2026) — summary

Full write-up: [`HANDOVER-2026-07-15.md`](./HANDOVER-2026-07-15.md).  
Prior day: [`HANDOVER-2026-07-14.md`](./HANDOVER-2026-07-14.md).  
Unavailable retailers UX: [`ux-unavailable-retailers-middle-ground.md`](./ux-unavailable-retailers-middle-ground.md).

| Area | What changed |
|---|---|
| **API diagnosis** | Live `POST /search` returns **200 + empty `products`** while dashboard still reports ~99k products — **backend blocker**. Frontend auth/request shape are fine. Dev logging in `searchApi`. |
| **Offline catalog** | `barcodeIndex` + `EASISHOP_USE_LOCAL_CATALOG` power search/deals/aisles while live `/search` is empty. Aisles use **brand/product knowledge** (`demo-product-knowledge.ts` + `demo-category-by-barcode.json`), not naïve name substrings. Marked DEMO ONLY in code/docs — **no “demo” labels in the UI**. |
| **Open Food Facts** | Optional **offline** enrichment only in `build-demo-categories.mjs` — **not** runtime, **not** sustainable as production category source. Prefer DB category column + scrapers at ingest. |
| **Price sanity** | `plausiblePreviousPrice` drops bogus previous prices before savings/deals calc. |
| **Desktop typeahead** | Google-style suggestions (`/api/search/suggest`); layout `[image][product name]`; **desktop only** — skip mobile floating panel. |
| **Compare middle ground** | Available-only price rows + collapsed **coverage note** when partners are missing; expand for Unavailable (no Buy). Helpers in `catalog.ts`; `toggle_unavailable_retailers` analytics. |
| **List motion** | List-detail Remove **exit animation** (fade / slide / height collapse) + delayed refresh. |
| **Chrome polish** | Footer wordmark → `/`; `cursor-pointer` on search CTAs; hide header search capsule on `/search`. |
| **Agent skills** | Emil Kowalski pack under `frontend/.agents/skills/` (animation + Apple design + design-eng). |
| **Docs** | `context.md` / `COMPONENTS.md` / `user_flows.md` aligned with coverage rule; this handover + 15 Jul session file. |

## Architecture cheat-sheet

- `src/lib/api/client.ts` — server-only fetch wrapper: Basic Auth, 30s timeout,
  5-min revalidate (or `fresh: true` / `cache: "no-store"` for on-demand refresh).
- `src/lib/api/normalize.ts` — raw API rows → `Product`. Retailer columns are
  `chk/dsc/pnp/srt/woo` (+ `_image`, `_url`, `_prev`). Product IDs are
  `p-<base64url(name)>`. Images resolve to `https://www.easishop.co.za/images/...`.
  Previous prices pass through price-sanity.
- `src/lib/products.ts` — data layer. React `cache`d per request; falls back to
  local catalog when API search is empty/fails. Dev warns on empty/failed upstream.
- `src/lib/local-catalog.ts` / `demo-catalog.ts` / `demo-product-knowledge.ts` —
  offline index + DEMO aisle classification (precomputed map preferred).
- `src/lib/catalog.ts` — money helpers + **`getPriceCoverage` / unavailable partner math**
  vs `RETAILERS`.
- `src/lib/storage.ts` — localStorage user, lists, analytics events, visit flag.
- `src/lib/lists.ts` — CRUD; **deleteList may leave zero lists** (empty state is real).
- `src/lib/nav-parent.ts` — hierarchical Back parents; `HashScroll` + `NavigationHistory`
  in the shell for hash sections and safe soft-nav Back.
- `src/components/product/category-picker.tsx` — Explore drawer (Stores \| Aisles).
- `src/components/product/price-comparison-panel.tsx` — compare rows + coverage disclosure.
- `src/components/search/search-suggest-panel.tsx` — desktop typeahead listbox.
- `src/app/api/{search,search/suggest,deals,featured,products/[id],products/batch}` —
  client proxies. Batch: `GET ?ids=...&refresh=1`.

## Key routes

| Route | Purpose |
|---|---|
| `/` | Home — hero, **stores**, categories, deals, featured |
| `/search` | Search (barcode UI currently disabled; header capsule hidden here) |
| `/store/[slug]` | Products by retailer |
| `/category/[slug]` | Aisle (demo: offline classified map; prod: needs API category) |
| `/deals` | Price drops (demo: biggest Rand drops from offline index) |
| `/lists`, `/lists/[id]` | Lists + detail (rename, refresh, add more, **animated remove**) |
| `/profile` (+ edit / marketing / account) | Settings hub |
| `/about`, `/faq`, `/privacy`, `/terms` | Legal / info |
| Custom `not-found` / `error` / `global-error` | Recovery-focused error pages |

## Dialog / sheet conventions

See `.cursor/rules/dialogs.mdc`. Bubble feel: `rounded-[32px]`, white surface,
soft shadow, pill inputs/buttons. List picker: `ListSheet`. Explore: category picker sheet.
Toasts (Sonner) match the same bubble look; list mutations use promise-style toasts.

## Known issues / next steps

- **Critical — empty search API** — `POST /api/v1/search` returns `[]` while catalog
  still has data. Offline index unblocks the UI demo until backend fixes it.
- **Categories (production)** — frontend/demo map is a bridge. Prefer **DB category
  column + scrapers label on commit**, then API `category` / `category_slug`.
  Open Food Facts is **not** a sustainable live classifier (see 15 Jul handover).
- **Barcode** — UI is commented out in `search-capsule.tsx`; re-enable by restoring the
  scan button + `BarcodeScanner` mount. Scanner file and `/api/search?barcode=1` remain.
- **Search** — frontend shim is a workaround; fuzzy search belongs on the backend.
- **Dischem / Shoprite** — API field gaps (`dsc` often empty); coverage note makes this
  transparent on the PDP without greying Buy rows.
- **Deals** — fall back to search-derived / offline drops if analytics endpoint fails.
- Price history, location pricing, real auth — stubs / localStorage-only by design.
- Keep `frontend/.next/` gitignored locally.
- Optional motion follow-ups: delete-list hold-to-confirm; `+`/`✓` morph; list-sheet
  create↔picker crossfade (see 15 Jul handover).
- Mobile search suggestions: skipped; use inline or full-screen search if revisited.

## Who did what

| Phase | Work |
|---|---|
| Scaffold + live API + early design | Earlier sessions (git history) |
| Image fix, add-to-list, similar products | Fable 5 (11 Jul) |
| Profile, lists, search polish, stores, glass UI | Cursor (13 Jul) |
| Explore/nav P0–P5, footer/legal, reicon, bugfix | Cursor (14 Jul) — see `HANDOVER-2026-07-14.md` |
| API diagnose, offline catalog/aisles, typeahead, coverage UI, list exit, skills | Cursor (15 Jul) — see `HANDOVER-2026-07-15.md` |
