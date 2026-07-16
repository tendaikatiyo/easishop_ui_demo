# EasiShop UI Demo — Handover

Last updated: 16 July 2026

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

## Latest session (16 Jul 2026) — summary

Full write-up: [`HANDOVER-2026-07-16.md`](./HANDOVER-2026-07-16.md).  
Prior: [`HANDOVER-2026-07-15.md`](./HANDOVER-2026-07-15.md) · [`HANDOVER-2026-07-14.md`](./HANDOVER-2026-07-14.md).  
Onboarding: [`ux-onboarding-conversion.md`](./ux-onboarding-conversion.md).  
Doodles: [`design-doodles.md`](./design-doodles.md).  
Unavailable retailers: [`ux-unavailable-retailers-middle-ground.md`](./ux-unavailable-retailers-middle-ground.md).

| Area | What changed |
|---|---|
| **Aisle fix** | Purity Meati / “from N months” baby food → **Kids & Baby** (was meat via “beef”/“chicken”). Classifier + rebuilt barcode map. |
| **Onboarding** | Conversion-first: welcome → PDP aha → guest list/alert auth prompts. No signed-in “name on device” dialog. Spec: `ux-onboarding-conversion.md`. |
| **Auth (demo)** | `/signup` · `/signin` — local `signedIn` only. **Not** a welcome gate; soft prompts at list/alert. Auth pages: no search/footer/tabs; Back + logo + **Back to shop**. |
| **Subcategories** | Checkers-depth trees **deferred** — keep flat aisles until DB category + scrapers. |
| **Doodles** | Brief + PNG set in `frontend/public/doodles/`. Spec: [`design-doodles.md`](./design-doodles.md) (African-descent characters required). **Not wired into UI** — assets only for later. |

### Still true from 15 Jul

| Area | Notes |
|---|---|
| **API** | Live `POST /search` often returns empty `products` — offline catalog fallback. |
| **Offline aisles / deals** | Brand/product knowledge + `demo-category-by-barcode.json`; no UI “demo” labels. |
| **OFF** | Optional offline enrichment only — not production taxonomy. |
| **Typeahead** | Desktop only. |
| **Compare coverage** | Available-only rows + coverage note. |
| **List remove** | Exit animation + delayed refresh. |

## Architecture cheat-sheet

- `src/lib/api/client.ts` — server-only fetch wrapper: Basic Auth, 30s timeout,
  5-min revalidate (or `fresh: true` / `cache: "no-store"` for on-demand refresh).
- `src/lib/api/normalize.ts` — raw API rows → `Product`. Previous prices pass through price-sanity.
- `src/lib/products.ts` — data layer; falls back to local catalog when API search empty/fails.
- `src/lib/local-catalog.ts` / `demo-catalog.ts` / `demo-product-knowledge.ts` —
  offline index + DEMO aisle classification.
- `src/lib/onboarding.ts` / `src/lib/auth.ts` — conversion flags + demo sign up/in/out.
- `src/lib/catalog.ts` — money helpers + price coverage / unavailable partners.
- `src/lib/storage.ts` — localStorage user (`signedIn`, `onboardingSeen`), lists, events, visited.
- `src/components/onboarding/*` — welcome, aha tip, list prompt, price-alert prompt.
- `src/components/auth/auth-form.tsx` — shared signup/signin form.
- `src/components/layout/app-shell.tsx` — full chrome vs **auth minimal chrome**.
- `src/app/api/{search,search/suggest,deals,featured,products/[id],products/batch}` —
  client proxies.

## Key routes

| Route | Purpose |
|---|---|
| `/` | Home — hero, stores, categories, deals, featured |
| `/search` | Search (barcode UI disabled; header capsule hidden here) |
| `/signin`, `/signup` | Auth — minimal chrome; `?next=` · `?intent=` |
| `/store/[slug]` | Products by retailer |
| `/category/[slug]` | Aisle (demo offline map; prod needs API category) |
| `/deals` | Price drops |
| `/lists`, `/lists/[id]` | Lists + detail |
| `/profile` (+ edit / marketing / account) | Settings; guest sees signup/signin |
| `/about`, `/faq`, `/privacy`, `/terms` | Legal / info |

## Dialog / sheet conventions

See `.cursor/rules/dialogs.mdc`. Bubble feel: `rounded-[32px]`, white surface,
soft shadow, pill inputs/buttons. List picker: `ListSheet`. Explore: category picker sheet.

## Known issues / next steps

- **Critical — empty search API** — offline index unblocks the UI until backend fixes it.
- **Categories (production)** — DB column + scrapers at ingest; retire demo map when live.
- **Auth (production)** — replace localStorage `signedIn` with real sessions; keep auth-at-intent UX.
- **Barcode** — UI commented out in `search-capsule.tsx`.
- Mobile typeahead skipped; subcategories deferred.
- Do not commit `.env` or the infrastructure PDF unless intentional.

## Who did what

| Phase | Work |
|---|---|
| Scaffold + live API + early design | Earlier sessions |
| Image fix, add-to-list, similar products | Fable 5 (11 Jul) |
| Profile, lists, search polish, stores, glass UI | Cursor (13 Jul) |
| Explore/nav, footer/legal, reicon | Cursor (14 Jul) — `HANDOVER-2026-07-14.md` |
| Offline catalog, typeahead, coverage, list exit | Cursor (15 Jul) — `HANDOVER-2026-07-15.md` |
| Onboarding, demo auth, aisle fix, auth chrome | Cursor (16 Jul) — `HANDOVER-2026-07-16.md` |
