# EasiShop UI Demo — Session Handover

**Date:** 11 July 2026  
**Repo:** `easishop_ui_demo`  
**App path:** `frontend/` (Next.js 16 App Router)

---

## What this session delivered

### 1. Live API integration (replaced static sample JSON)

The UI no longer reads `demo-products.json` at runtime. All product data comes from the EasiShop API.

| Layer | Path | Role |
|---|---|---|
| API client | `frontend/src/lib/api/client.ts` | Basic auth fetch to `https://www.easishop.co.za/api/v1` |
| Normalizer | `frontend/src/lib/api/normalize.ts` | Maps `chk`/`pnp`/`srt`/`woo`/`dsc` fields → `Product` type; stable IDs via `p-<base64url(name)>` |
| Product service | `frontend/src/lib/products.ts` | Server-only async functions with 5-min cache + graceful empty fallbacks |
| API routes | `frontend/src/app/api/*` | Proxy for client components (deals, search, batch lookup, featured) |

**Env vars** (`frontend/.env`):

```
EASISHOP_API_USERNAME=...
EASISHOP_API_PASSWORD=...
```

Copy from `frontend/.env.example`. Restart dev server after changes.

**Product IDs:** Lists and price alerts store `productId` as `p-<base64url(productName)>`. Old sample IDs (`prod-001`, etc.) will not resolve — users must re-add items.

**Category browsing:** No static catalogue. Categories use mapped search terms (`CATEGORY_SEARCH_QUERIES` in `normalize.ts`). Search with no query shows an empty prompt, not all products.

**Deals:** Tries `GET /analytics/price-changes/last-week` first; falls back to search terms + `previousPrice` filter.

---

### 2. Design system (Figma reference + EasiShop brand)

Active design reference: **`frontend/DESIGN.md`** (Figma). Clay reference kept at `frontend/figma/DESIGN.md` was overwritten at root when Figma was activated.

| Token | Value | Use |
|---|---|---|
| Page background | `#f8f7f4` | Warm off-white canvas |
| Card / popover | `#ffffff` | White cards on off-white page |
| Surface soft | `#f0efeb` | Tiles, image wells, muted areas |
| Brand green | `#1b8056` | Wordmark, icons (`brand-green` utility) |
| Pastel blocks | lime, lilac, cream, etc. | Section bands (deals = lime) |

**Fonts** (`frontend/src/app/layout.tsx`):

- **Bricolage Grotesque** — headings (`font-heading`)
- **Inter** — body (`font-sans`)
- **Geist Mono** — accents: prices, eyebrows, deal badge amounts (`font-accent`)

**Utilities** in `globals.css`: `.figma-block`, `.figma-eyebrow`, `.brand-green`

---

### 3. UI / UX changes

#### Home hero
- Unsplash grocery photo (`photo-1542838132-92c53300491e`)
- Left-aligned copy + search (PriceRunner-style)
- Feather gradient overlay from the left (`from-[#14120f]/92` → transparent)
- `SearchCapsule` `variant="hero"`: white pill, circular arrow submit

#### Product cards (`product-card.tsx`)
- No category label, no “from [retailer]” copy
- Price in dark gray, **Geist Mono**
- **Deal badge** (`deal-badge.tsx`): green pill, down arrow + **Rand amount** (not %)
- Card outline via default shadcn `ring-1 ring-foreground/10`
- *Note:* A later experiment (80px radius, white-on-white border) was **reverted** per user request

#### List heart (`heart-button.tsx`)
- Red outline always; **red-700** fill when saved

#### Navigation (`app-shell.tsx`)
- Wordmark: solid **EasiShop** in brand green, **font-bold**
- **Categories** button in desktop nav (before **You**), toggles shared category drawer
- Mobile: grid icon in header also opens drawer
- Category picker extracted to `category-picker.tsx` with `CategoryPickerProvider` context

#### Category strip
- Still on home page; “Choose category” / “All categories” use same drawer as navbar

---

## Routes

| Route | Data source | Rendering |
|---|---|---|
| `/` | `getDeals`, `getFeaturedProducts` | Server (Suspense) |
| `/search?q=` | `searchProducts` | Server |
| `/category/[slug]` | `getProductsByCategory` | Server |
| `/product/[id]` | `getProductById` | Server |
| `/deals` | `GET /api/deals` | Client fetch |
| `/lists/[id]` | `GET /api/products/batch` | Client fetch |
| `/profile` | `GET /api/featured` for alert toggles | Client fetch |
| Barcode scan | `GET /api/search?q=&barcode=1` | Client fetch |

---

## Known issues / watch-outs

1. **Checkers / Shoprite images** — Next.js image optimizer may return **403** for some retailer URLs (`www.checkers.co.za/images/...`). Normalizer resolves relative paths to absolute; hotlink blocking is upstream.

2. **API latency** — Search can be slow; client has **30s** abort timeout. Empty states shown on failure, not crashes.

3. **Price-changes endpoint** — Historically flaky (502/timeout). Deals fall back to search-based detection.

4. **localStorage state** — Lists, profile, alerts, analytics are still demo/local only. Product IDs from old JSON sample won’t match live API IDs.

5. **Base UI Button warnings** — Console warns when `Button` uses `render={<Link />}` instead of native `<button>` (nav, category links). Cosmetic/a11y, not blocking.

6. **Dev server** — Only one `next dev` instance; port 3000 may already be in use.

---

## How to run

```bash
cd frontend
npm install
# set .env credentials
npm run dev    # http://localhost:3000
npm run build  # verify production build
```

`server-only` package is installed for the API product layer.

---

## Key files (quick index)

```
frontend/
├── DESIGN.md                          # Active Figma design reference
├── figma/DESIGN.md                    # Figma source (same content)
├── .env / .env.example
├── src/
│   ├── app/
│   │   ├── page.tsx                   # Hero + home sections
│   │   ├── globals.css                # Theme tokens
│   │   ├── layout.tsx                 # Fonts
│   │   └── api/                       # Client-facing proxies
│   ├── components/
│   │   ├── layout/app-shell.tsx       # Nav, wordmark, category toggle
│   │   ├── product/
│   │   │   ├── product-card.tsx
│   │   │   ├── deal-badge.tsx
│   │   │   ├── category-picker.tsx    # Shared drawer + context
│   │   │   └── category-strip.tsx
│   │   ├── search/search-capsule.tsx  # default + hero variants
│   │   └── home/home-deals.tsx
│   └── lib/
│       ├── api/client.ts
│       ├── api/normalize.ts
│       ├── products.ts
│       └── catalog.ts                 # formatRand, getSavingsAmount, categories
```

---

## Suggested next steps (not done this session)

- Fix retailer image 403s (proxy route, allowlist, or CDN fallback image)
- Persist product name alongside `productId` in lists for more reliable re-fetch
- Apply Figma pill buttons consistently on primary CTAs (currently black shadcn primary)
- Resolve Base UI `nativeButton` warnings in nav
- Product card treatment for white-background pack shots (user explored then reverted — may want a lighter-touch solution)
- Remove or archive `frontend/data/demo-products.json` and extract scripts if no longer needed offline

---

## Commit note

No git commits were made during this session unless the user committed separately afterward.
