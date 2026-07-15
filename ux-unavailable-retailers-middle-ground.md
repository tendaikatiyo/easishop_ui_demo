# UX: Unavailable retailers on price comparison (middle ground)

**Status:** Ready to implement  
**Scope:** Product detail price comparison — keep the list actionable, but prove we checked every partner store.  
**Primary surface:** `PriceComparisonPanel` on the product page (mobile + desktop).

---

## Problem

We tried two extremes on the PDP price list:

| Approach | What users see | Tradeoff |
|----------|----------------|----------|
| **Grey out** | Full retailer row, faded, “Not Available”, no Buy | Honest, but clutters mobile, isn’t actionable, weakens scannability |
| **Hide entirely** | Only stores with a live price | Clean and conversion-focused, but some users wonder whether their usual store was checked |

`context.md` currently says: if a product is not available at a retailer, don’t display that retailer. That remains the **list** rule. This doc extends it with a **lightweight transparency layer** so trust doesn’t drop when a familiar store (e.g. Dis-Chem) is missing.

---

## Decision

**Hide unavailable retailers from the main compare list** (current iteration), and add a **collapsed coverage note** under the list that users can expand if they care.

Do **not** bring back greyed-out full rows as the default.

### Mental model

| Layer | Job |
|-------|-----|
| **Price rows** | “Where can I buy this now, and who’s cheapest?” |
| **Coverage note** | “Did you check my store?” |

One job per layer. The Buy path stays uncluttered; coverage is opt-in detail.

---

## Chosen solution

1. **Default:** Render only available retailer rows (price > 0), sorted cheapest → most expensive — same as today via `getAvailablePrices`.
2. **When any partner retailer is missing a price:** Show a single muted line under the list, e.g.  
   `Checked 5 stores · 1 unavailable`  
   or name them when few:  
   `Dis-Chem unavailable`
3. **Optional expand:** Tapping the note reveals a compact list of unavailable partner stores (logo + name + “Unavailable”). No Buy button. No greyed “fake” price row in the primary list.
4. **When every partner has a price:** Omit the coverage note entirely.
5. **When no prices exist:** Keep the existing empty state (“No retailer prices available…”). Optionally append that all partner stores were checked (see copy below).

### Rejected alternatives

| Option | Why not |
|--------|---------|
| Always show greyed rows for missing stores | Reintroduces clutter; fails the mobile screenshot / one-job list goal |
| Hide forever with no coverage signal | Fine for power users; risks “does EasiShop even cover Dis-Chem?” support noise |
| Put unavailable rows above Buy CTAs by default | Competes with Lowest / Buy hierarchy |

---

## Design specs

### Available rows (unchanged)

Keep current `PriceComparisonPanel` row: logo · price · Lowest badge when unambiguous · Buy.

### Coverage note (new, collapsed default)

| Aspect | Spec |
|--------|------|
| Placement | Directly under the `<ul>` of price rows, above any following PDP sections (Add to list stays as today) |
| Visibility | Only when `unavailableRetailers.length > 0` and `availablePrices.length > 0` |
| Default state | Collapsed |
| Trigger | Text button / disclosure row, full-width tap target ≥ 44px height |
| Collapsed copy | Prefer short named form when 1–2 missing; count form when 3+ |
| Expanded content | Vertical list of unavailable partners only — logo (muted/low-contrast ok), display name, status text “Unavailable” |
| Visual weight | Muted (`text-muted-foreground`); no card chrome competing with available rows; no green Buy |
| Motion | Short expand/collapse (150–200ms); don’t animate the primary price list |
| Accessibility | Use a real `<button>` with `aria-expanded`; expanded region `id` + `aria-controls`; status text not only color |

### Copy

Keep layman, concise, friendly (per product voice).

| State | Copy |
|-------|------|
| 1 unavailable | `{Store} unavailable` — e.g. `Dis-Chem unavailable` |
| 2 unavailable | `{Store A} and {Store B} unavailable` |
| 3+ unavailable | `Checked {n} stores · {k} unavailable` |
| Expanded helper (optional one-liner) | `No live price from these stores right now.` |
| All partners priced | *(no note)* |
| Zero available prices | Existing empty card; optional second line: `We checked Checkers, Pick n Pay, Shoprite, Woolworths, and Dis-Chem.` |

Use **display** names from `RETAILERS` (`Dis-Chem`, not API `Dischem`).

### Layout constraints

- Mobile-first: collapsed note should be **one line** (truncate with ellipsis only if unavoidable; prefer count form on narrow widths).
- Do not place the note in the first viewport hero if it pushes Buy / Add to list awkwardly — it belongs with the compare block, not the product title.
- Desktop: same component; no separate pattern.

---

## Data & logic

### Definitions

Partner set = `RETAILERS` in `frontend/src/lib/retailers.ts` (five stores today).

| Term | Rule |
|------|------|
| **Available** | Entry in `product.prices` with `typeof price === "number" && price > 0` (existing `getAvailablePrices`) |
| **Unavailable** | Partner whose `apiName` is not in the available set — includes missing row, null/zero/invalid price |
| **Out of catalog vs OOS** | Demo may not distinguish; treat both as unavailable for UI. If the API later adds explicit status, map into the same unavailable bucket unless product asks for separate copy |

### Suggested helpers (`frontend/src/lib/catalog.ts` or `retailers.ts`)

```ts
// Pseudocode — shape to implement
getUnavailableRetailers(product: Product): Retailer[]
// RETAILERS.filter(r => !availableApiNames.has(r.apiName))

getPriceCoverage(product: Product): {
  available: RetailerPrice[];
  unavailable: Retailer[];
  checkedCount: number; // RETAILERS.length
}
```

Panel should sort **available** by price; order **unavailable** in stable `RETAILERS` order (don’t invent alphabetical reorder that changes week to week).

### Update `context.md` when shipping

Replace the blunt “don’t display” line with:

- Don’t show unavailable retailers as primary compare rows.
- Show a collapsed coverage note when any partner is unavailable; expand for detail.

---

## Implementation touchpoints

| File | Change |
|------|--------|
| `frontend/src/lib/catalog.ts` (and/or `retailers.ts`) | Add helpers to derive unavailable partners vs `RETAILERS` |
| `frontend/src/components/product/price-comparison-panel.tsx` | Keep available-only list; add collapsed coverage disclosure when needed |
| `frontend/src/lib/analytics.ts` | Optional: `toggle_unavailable_retailers` (or extend `TrackEventName`) when user expands/collapses |
| `frontend/COMPONENTS.md` | Document the disclosure behavior on `PriceComparisonPanel` |
| `context.md` | Align product rule with middle ground |
| `user_flows.md` | One bullet under wayfinding / PDP: unavailable stores hidden in list; coverage note optional expand |

No change to product cards, store pages, or Explore — those are different jobs.

### Component sketch

```
Compare prices
[Best value badge…]

• Pick n Pay   R44.99   [Lowest] [Buy]
• Woolworths   R45.99          [Buy]
• Checkers     R49.99          [Buy]
• Shoprite     R49.99          [Buy]

▸ Dis-Chem unavailable          ← collapsed default
  (expand)
    ○ Dis-Chem    Unavailable   ← no Buy
```

---

## Analytics (optional but useful)

Track expand so we know whether the middle ground is earning trust or ignored.

| Event | When | Props |
|-------|------|-------|
| `toggle_unavailable_retailers` | Expand / collapse | `productId`, `expanded: boolean`, `unavailableCount`, `unavailableRetailers: string[]` |

If expand rate is near zero after launch, keep the **one-line note** and consider dropping the expand list. If support keeps asking “where is X?”, strengthen collapsed copy (always name the missing stores when ≤ 2).

---

## Acceptance criteria

- [ ] Available retailers still sort by price; Lowest / Buy / best-value behavior unchanged.
- [ ] Unavailable partners never appear as primary greyed price rows with Buy disabled.
- [ ] When 1+ partners lack a live price and ≥ 1 price exists, a coverage note appears under the list.
- [ ] Note is collapsed by default; expand shows only unavailable partners with “Unavailable” and no Buy.
- [ ] When all five partners have prices, no coverage note.
- [ ] Empty state still works when zero available prices.
- [ ] Display names use `RETAILERS` labels (`Dis-Chem`, etc.).
- [ ] Disclosure is keyboard-accessible (`aria-expanded`, focusable control).
- [ ] Works on ~320px width without overlapping price rows or CTAs.

---

## Edge cases

| Case | Behavior |
|------|----------|
| Product only sold at pharmacies (e.g. only Dis-Chem priced) | Show that one available row; note lists the other four as unavailable (count form) |
| New retailer added to `RETAILERS` | Automatically included in checked/unavailable math |
| Price exists but `url` is null | Still **available** in the list; Buy omitted (current behavior) — not “unavailable” |
| Duplicate retailer rows in `product.prices` | Dedupe by `apiName` when classifying; prefer the positive price entry |
| User expands, then navigates away | No need to persist expand state |

---

## Rollout

1. Ship helpers + coverage note behind normal PR (demo data already omits missing prices).
2. Verify on a product missing Dis-Chem (classic screenshot case) and one with full coverage.
3. Update `context.md` / `COMPONENTS.md` in the same PR as the UI so the rule doesn’t drift.
4. Watch expand analytics + qualitative feedback before considering any return of always-visible grey rows.

---

## Why this is the right middle ground

- Protects the compare list’s job: actionable prices and a clear Lowest.
- Answers “was my store checked?” without resurrecting dead Buy rows.
- Matches EasiShop voice: honest, light, not dashboard-y.
- Cheap to implement on existing `PriceComparisonPanel` + `RETAILERS`.
