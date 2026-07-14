# EasiShop user flows

Mental model: **Find** (Search) · **Browse** (Explore: Stores | Aisles) · **Save** (Lists).  
Home is the launchpad. Deals = price-drop Find. Profile = account & settings.

Chrome:

| Surface | Destinations |
|---------|----------------|
| Mobile bottom nav | Home · Search · Deals · Lists · Profile |
| Mobile header | Back (non-home) · logo · **Explore** (compass + label, soft gray pill) |
| Desktop header | Search capsule (off-home) · Home · Deals · Lists · **Explore** (text) · Profile |

---

## Find — search

home › hero search › search results › product › add to list **or** visit store website

search tab / page › type query › results › product › …

search › scan barcode (take / choose photo) › confirm code › product (single match) **or** search results › add to list  
*(barcode UI temporarily commented out — restore via `search-capsule.tsx`)*

store / category page › **Search all stores** (mobile) **or** header search capsule (desktop) › `/search` › …

empty search › popular / trending pills › `/search?q=…` *(capsule query stays in sync)*

---

## Browse — stores & aisles

header **Explore** › drawer (**Stores** tab default; mobile **right** side / desktop left) › pick store › store page › product › …

home › **Shop by store** (`#stores`) › pick store › …  
home › Shop by store › See all (desktop) › Explore drawer (Stores)

home › **Categories** › **All categories** › drawer (**Aisles**) › category page › product › …  
home › Categories › featured aisle pill › category page › …

store / category › mobile Back › home scrolled to `#stores` / `#categories`  
*(App Router soft-nav hash scroll is handled by `HashScroll`)*

---

## Find — deals

home › top deals › deals page › product › …

bottom / top nav Deals › deals page › (filters) › product › …

lists empty state › **View deals** › deals page › …

---

## Save — lists

lists › pick list › list detail › open product · remove (instant) · rename · refresh prices

lists › **[no lists]** › create list › list detail  
*(deleting the last list leaves empty state — no auto-reseed)*

product card / product page › **+** › list picker › add › promise toast (loading → success) **View list** › list detail

list detail › **Add more** › Search **or** Explore (Stores) › find / browse › add to list

list detail (empty) › Find products **or** Explore stores › …

---

## Profile & utilities

Profile › edit / marketing / account

mobile Profile › About · FAQ · Privacy · Terms · Send feedback · social links (with icons)

desktop footer › same legal / feedback links

---

## Wayfinding notes

1. **Explore** = discovery hub → always opens **Stores**. **All categories** → **Aisles**. Mobile drawer opens from the **right**.
2. Home order: Search (hero) → Stores → Categories → Deals → Featured.
3. Mobile Back: forced parents for list detail → `/lists`, profile subpages → `/profile`, store → `/#stores`, category → `/#categories`, legal → `/`. Soft history only when an in-app session path stack exists; else safe fallback (e.g. product → `/search`).
4. Slow navigations show `NavigationLoader` (delayed spinner + top bar).
5. Add-to-list **+** uses a solid zinc chip so it stays visible on white product photos.
6. Retailer logos in circles use `object-cover` (home stores, Explore drawer, product cards, store hero, price comparison).
7. On compare, every store tied for the lowest price gets the **Lowest** badge.
8. Barcode scan entry points are temporarily disabled in the search capsule.