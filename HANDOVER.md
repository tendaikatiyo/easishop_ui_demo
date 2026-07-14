# EasiShop UI Demo — Handover

Last updated: 14 July 2026

## What this repo is

A Next.js 16 (App Router) demo of the revamped EasiShop UI, living in `frontend/`.
It runs against the **live EasiShop API** (`https://www.easishop.co.za/api/v1`, HTTP Basic Auth).
Product requirements are in `context.md`; user journeys in `user_flows.md`.

Stack: Next.js 16 + TypeScript, Tailwind CSS v4, shadcn/ui (Base UI), **reicon-react**
(icons — all `"use client"`; never import into Server Components), `next/font`
(Bricolage Grotesque headings, Inter body, Geist Mono for prices/eyebrows).

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

## Latest session (14 Jul 2026) — summary

Full write-up: [`HANDOVER-2026-07-14.md`](./HANDOVER-2026-07-14.md).  
Nav UX plan (implemented): [`ux-nav-explore-header.md`](./ux-nav-explore-header.md).

| Area | What changed |
|---|---|
| **Nav / Explore** | Explore renamed from Browse; mobile header **compass + “Explore”** (soft gray pill on **mobile only**); drawer defaults to **Stores**; mobile drawer is **right-side** (keyboard-safe); **All categories** opens **Aisles**; home order Search → Stores → Categories → Deals → Featured. |
| **P0–P5 wayfinding** | Labeled Explore; Explore rules; home ladder; browse→search link; add-to-list promise toast + **View list** + list **Add more**; hierarchical Back + hash scroll + in-app path stack; **NavigationLoader** for slow page transitions. |
| **Footer / legal** | Desktop footer; `/about`, `/faq`, `/privacy`, `/terms`; mobile Profile utility links + feedback; social pills with brand SVGs. |
| **Visual polish** | Softened nav frost; store/product/comparison logos `object-cover` in circles; add-to-list `+` solid zinc (readable on white product images). |
| **Icons** | Migrated off lucide → **reicon-react**; category icons in client-only `category-icons.tsx`. |
| **Compare / search** | Tied retailers all show Lowest badge; removed “Lay’s chips” from sample search placeholders; **barcode UI temporarily commented out** (scanner + API remain). |
| **Toasts** | Sonner styled like bubble dialogs; list add/create/remove use `toast.promise`. |
| **Bugfix pass** | Hash scroll, search capsule `q` sync, safe Back, list remove race, empty lists (no reseed), media-query flicker, barcode abort/`res.ok`, toaster without ThemeProvider. |

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
- `src/lib/lists.ts` — CRUD; **deleteList may leave zero lists** (empty state is real).
- `src/lib/nav-parent.ts` — hierarchical Back parents; `HashScroll` + `NavigationHistory`
  in the shell for hash sections and safe soft-nav Back.
- `src/components/product/category-picker.tsx` — Explore drawer (Stores \| Aisles).
- `src/app/api/{search,deals,featured,products/[id],products/batch}` — client proxies.
  Batch: `GET ?ids=...&refresh=1`.

## Key routes

| Route | Purpose |
|---|---|
| `/` | Home — hero, **stores**, categories, deals, featured |
| `/search` | Search (barcode UI currently disabled) |
| `/store/[slug]` | Products by retailer |
| `/category/[slug]` | Aisle (search-term approximated) |
| `/deals` | Price drops |
| `/lists`, `/lists/[id]` | Lists + detail (rename, refresh, add more) |
| `/profile` (+ edit / marketing / account) | Settings hub |
| `/about`, `/faq`, `/privacy`, `/terms` | Legal / info |

## Dialog / sheet conventions

See `.cursor/rules/dialogs.mdc`. Bubble feel: `rounded-[32px]`, white surface,
soft shadow, pill inputs/buttons. List picker: `ListSheet`. Explore: category picker sheet.
Toasts (Sonner) match the same bubble look; list mutations use promise-style toasts.

## Known issues / next steps

- **Barcode** — UI is commented out in `search-capsule.tsx`; re-enable by restoring the scan button + `BarcodeScanner` mount. Scanner file and `/api/search?barcode=1` remain.
- **Search** — frontend shim is a workaround; fuzzy search belongs on the backend.
- **Dischem / Shoprite** — API field gaps (`dsc` often empty); not a frontend bug.
- **Categories** — still search-term approximated; need a real category endpoint.
- **Deals** — fall back to search-derived drops if analytics endpoint fails.
- Price history, location pricing, real auth — stubs / localStorage-only by design.
- Keep `frontend/.next/` gitignored locally.

## Who did what

| Phase | Work |
|---|---|
| Scaffold + live API + early design | Earlier sessions (git history) |
| Image fix, add-to-list, similar products | Fable 5 (11 Jul) |
| Profile, lists, search polish, stores, glass UI | Cursor (13 Jul) |
| Explore/nav P0–P5, footer/legal, reicon, bugfix | Cursor (14 Jul) — see `HANDOVER-2026-07-14.md` |
