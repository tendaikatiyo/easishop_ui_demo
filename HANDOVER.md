# EasiShop UI Demo — Handover

Last updated: 11 July 2026

## What this repo is

A Next.js 16 (App Router) demo of the revamped EasiShop UI, living in `frontend/`.
It started as a static scaffold with sample JSON products and now runs against the
**live EasiShop API** (`https://www.easishop.co.za/api/v1`, HTTP Basic Auth).
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

## Who (which model) did what

All work happened in one Cursor chat. The transcript does not record the model per
message, so only the most recent session can be attributed with certainty:

| Phase | Work | Model |
|---|---|---|
| 1. Scaffold | Next.js app, shells, home/search/category/product/deals/lists/profile pages, localStorage lists, barcode scan stub, onboarding, analytics scaffolding — originally on sample JSON data | Earlier session in this chat — model not recorded (fill in if you recall switching models) |
| 2. Live API integration | `lib/api/client.ts` (auth + timeout), `lib/api/normalize.ts` (raw → `Product`, stable base64url IDs from names), async `lib/products.ts`, API proxy routes, skeletons, graceful fallbacks | Same chat, pre-summary — model not recorded |
| 3. Design iterations | Clay then Figma design language, Geist Mono accent, Bricolage headings, green wordmark, Categories nav button + shared drawer context, off-white background, hero with green feathered gradient, new product card (price pill, deal badge in Rand, plus button) | Same chat, pre-summary — model not recorded |
| 4. Image fix + UI/UX fix batch + this doc | Everything under "Latest session" below | **Claude Fable 5** (verified — current session) |

## Latest session (Fable 5) — details

1. **Root-caused broken product images.** The API returns relative paths like
   `/images/61871.jpeg`; the normalizer was resolving them against retailer domains
   (403s). They are actually served from EasiShop's own `public/images`. Fixed in
   `normalize.ts` with a single `IMAGE_BASE = "https://www.easishop.co.za"`.
2. **Image fallback** — new `components/product/product-image.tsx`; renders a gray
   package icon on load error instead of alt text. Used on cards and detail page.
3. **Price pill truncation** — card is a CSS container; the struck-through was-price
   only shows when the card is ≥ 11rem wide (`@[11rem]:inline`).
4. **Unified add-to-list metaphor** — plus/check `AddToListButton` everywhere
   (detail page included), nav Lists icon is now `ListChecks`, copy says
   "Tap + to add to your list". `heart-button.tsx` deleted.
5. **Rationed the green** — home deals band background lime → cream, so green
   consistently means price/value (pill + deal badge).
6. **Tighter mobile hero** — second headline line hidden on mobile, min-height
   360→280px, eyebrow at full white, darker gradient left stop with faster falloff.
7. **Small fixes** — "General" breadcrumb/category label hidden when category is
   unknown; Bakery icon is now a croissant (no longer duplicates Deli); floating
   list pill clears the bottom nav incl. safe-area inset.
8. **Similar products** — `components/product/similar-products.tsx` below the price
   comparison, reusing the page's already-cached search (no extra API call).

## Architecture cheat-sheet

- `src/lib/api/client.ts` — server-only fetch wrapper: Basic Auth, 30s timeout,
  5-min revalidate. `apiSearch` (POST /search), `apiPriceChangesLastWeek`.
- `src/lib/api/normalize.ts` — raw API rows → `Product`. Retailer columns are
  `chk/dsc/pnp/srt/woo` (+ `_image`, `_url`, `_prev`). Product IDs are
  `p-<base64url(name)>` so they survive re-fetches. Category search-term map lives
  here (`CATEGORY_SEARCH_QUERIES`).
- `src/lib/products.ts` — the data layer pages call. React `cache`d per request;
  every function catches API errors and returns empty results rather than throwing.
- `src/app/api/{search,deals,featured,products/[id],products/batch}` — proxies for
  client components (deals page, lists, profile).
- Server components fetch directly (home, search, category, product detail);
  client pages fetch via the proxy routes.
- Lists/profile state is localStorage (demo assumption: user has an account).

## Known issues / next steps

- **Base UI console warning** (pre-existing): `Button` with `render={<Link/>}`
  should pass `nativeButton={false}`. Cosmetic, appears throughout dev console.
- Category browsing is approximated by search terms — replace with a real category
  endpoint when the backend has one.
- Deals fall back to search-derived price drops if
  `/analytics/price-changes/last-week` fails or is empty.
- Price history chart, location-based pricing, and real auth are stubs/absent by
  design (demo scope).
- `frontend/.next/` build artifacts are untracked noise in `git status` — consider
  adding `.next/` to `.gitignore` if it isn't already effective.
