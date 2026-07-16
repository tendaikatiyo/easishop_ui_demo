# EasiShop — design doodles brief

**Purpose:** Guide AI / illustrators when creating hand-drawn doodles for the EasiShop UI demo.  
**Audience:** South African grocery shoppers — the product is built in SA, for SA.  
**Related:** [`frontend/DESIGN.md`](./frontend/DESIGN.md) · [`context.md`](./context.md) · [`HANDOVER.md`](./HANDOVER.md)

Doodles should **support** the bubble/glass UI (rounded cards, soft glass, pill CTAs). They must not compete with product photos, retailer logos, or price-comparison rows.

---

## Representation (required)

EasiShop is a **South African** price-comparison app. When illustrations include **people**, they must read clearly as **people of African descent** — the primary audience should see themselves in the art.

### Do

- Draw shoppers, families, and characters with **African facial features and hair textures** (e.g. coily, curly, braided, faded, locs, natural afros, head wraps where appropriate).
- Use **warm brown skin tones** across a realistic range (not a single flat brown).
- Keep body language **everyday and dignified**: carrying a bag, checking a phone, pushing a trolley, waving hello.
- Show **age and gender diversity** across the set (young adults, parents, older shoppers) without stereotyping roles.
- Treat characters as **friendly neighbours**, not mascots or cartoons.

### Don’t

- Default to generic “global app” characters that read as European-only stick figures.
- Use caricature, exaggerated lips, or “tribal” costume unless a specific brief calls for cultural dress (default: modern casual SA street/supermarket wear).
- Put retailer logos, flag clichés, or wildlife (lion/leopard) in every scene — SA context comes through people and shopping moments, not tourism tropes.
- Make characters childish/chibi unless the screen is explicitly Kids & Baby.

### Prompt line (paste into every people doodle)

> *Character is a Black South African shopper, African facial features, natural African hair, warm brown skin tone, modern casual clothing, friendly and dignified, not caricatured.*

---

## Visual style

| Attribute | Direction |
|-----------|-----------|
| **Line** | Hand-drawn, **2–3px uneven ink** outline, slightly imperfect (human, not CAD) |
| **Fill** | Flat colour blocks — **no gradients**, minimal shading |
| **Depth** | No 3D, no heavy drop shadows, no photorealism |
| **Background** | **Transparent** (PNG/SVG) — UI provides the bubble surface |
| **Composition** | **One clear idea** per asset; subject ~60% of frame with padding |
| **Mood** | Warm, layman, human — matches EasiShop copy (“Search, compare, save”) |
| **Density** | Simple enough to read at **56–120px** on mobile |

**Vibe reference:** Modern fintech empty states (Monzo/Revolut clarity) + soft grocery warmth — **not** Duolingo mascots, **not** corporate stock clip art.

---

## Colour palette

Use the existing design tokens — doodles should feel native to the app, not a separate brand.

| Role | Token | Hex |
|------|--------|-----|
| Ink / outline | foreground | `#000000` |
| Brand | `--brand-green` | `#1b8056` |
| Soft highlight | `--brand-green-light` | `#e3f2eb` |
| Wash | `--brand-green-soft` | `#f0f8f4` |
| Accent lilac | `--block-lilac` | `#c5b0f4` |
| Accent lime | `--block-lime` | `#dceeb1` |
| Accent peach | `--block-coral` | `#f3c9b6` |
| Accent cream | `--block-cream` | `#f4ecd6` |
| Deal sparkle (sparingly) | `--accent-magenta` | `#ff3d8b` |

**Balance:** ~70% black ink + white/transparent, ~20% brand green, ~10% pastel accents. Never full rainbow in one asset.

**Hero / green gradient screens:** export a **white-outline** or **single-colour** variant for use on dark green backgrounds.

---

## Asset list (what to create)

### Tier 1 — ship first

| ID | Subject | UI placement |
|----|---------|----------------|
| `doodle-empty-search` | African shopper + magnifying glass / grocery bag | Search empty state |
| `doodle-no-results` | Same character, gentle “not found” (empty shelf or shrug) | Search no matches |
| `doodle-compare-aha` | Price tags in a row; lowest highlighted in green | Onboarding tip / compare hint |
| `doodle-list-saved` | Character + clipboard with checkmarks | After add-to-list (guest prompt area) |
| `doodle-price-alert` | Character glancing at phone + bell + down arrow on tag | Price alert CTA / empty alerts |
| `doodle-welcome` | Wave + bag; welcoming posture | Onboarding welcome sheet |

### Tier 2 — empty states & auth

| ID | Subject | UI placement |
|----|---------|----------------|
| `doodle-empty-lists` | Character with empty trolley or blank list | Lists empty state |
| `doodle-404` | Character at a friendly signpost | `not-found` |
| `doodle-error` | Character + simple cloud/plug (mild concern) | Error pages |
| `doodle-signup` | Character + envelope or tick | `/signup` header |
| `doodle-signin` | Character returning, relaxed wave | `/signin` header |

### Tier 3 — category micro-icons (optional)

Simple **objects only** (no people), same stroke weight: milk, bread, apple, soap, nappy, wine bottle, etc.  
Use at **icon scale** (64–96px) — not full illustrations.

### Defer

- Brand mascot character
- Full supermarket panoramas
- Retailer-specific art
- Deep subcategory illustration trees

---

## File deliverables

| Spec | Value |
|------|--------|
| **Preferred format** | SVG (outline + fills as paths) |
| **Fallback** | PNG @2x, transparent |
| **Canvas** | 512×512 or 1024×1024 square |
| **Variants** | Full colour + monochrome (green `#1b8056` ink only) |
| **Naming** | `doodle-<id>.svg` under `frontend/public/doodles/` |
| **Alt text** | Describe action, not skin colour (“Shopper searching for groceries”) |

---

## Example AI prompts

### Empty search (with character)

```
Hand-drawn doodle illustration, single Black South African shopper character,
African facial features, natural curly hair, warm brown skin, modern casual clothes,
holding a grocery bag and magnifying glass, simple price tag nearby,
2–3px black ink outline, flat fills in #1b8056 and #e3f2eb,
accent touches #c5b0f4, transparent background, centred with padding,
friendly dignified pose, not caricature, not childish, no text, no logos,
modern grocery app empty state
```

### Welcome / onboarding

```
Hand-drawn doodle, young Black South African woman waving hello,
shopping tote in other hand, African features, braided hair,
flat colour style, black outline, green #1b8056 and mint #e3f2eb fills,
transparent background, minimal, warm, South African grocery app onboarding
```

### Price compare (object-led — no character)

```
Hand-drawn doodle, three rounded price tags in a row,
lowest tag highlighted in #1b8056 with small checkmark,
black ink outline, pastel lilac and peach accents,
transparent background, fintech grocery comparison, no people, no text
```

### Empty list (character)

```
Hand-drawn doodle, Black South African man with short fade haircut,
looking at empty shopping list on clipboard, friendly expression,
modern casual shirt, flat colours, transparent background,
dignified not sad, grocery list app empty state
```

---

## Where doodles belong in the UI

| Screen | Use doodle? | Notes |
|--------|-------------|--------|
| Search / lists empty | **Yes** | ~56–80px inside mint circle (`--brand-green-light`) |
| Onboarding sheet | **Yes** | Max ~120px; one illustration only |
| Sign up / sign in | **Yes** | One calm header illustration; form stays focal |
| Product / compare PDP | **No** | Price rows are the hero — no competing art |
| Product cards / grids | **No** | Real product images only |
| Category browse | **Icons only** | Tier 3 object doodles if consistent set exists |

---

## Quality checklist

Before merging assets:

- [ ] People read as **African descent**; varied hair and skin tones across the set
- [ ] No caricature, costume defaults, or tourism clichés
- [ ] Readable at **56px** height on mobile
- [ ] Transparent background; no baked-in shadows or grey boxes
- [ ] Palette matches tokens above
- [ ] No retailer logos or trademarked packaging
- [ ] SVG optimised; strokes expanded if needed for crisp export

---

## Implementation note (for dev)

When assets exist, wire them in empty-state components (e.g. `search-empty-state.tsx`, lists empty, `error-page-view.tsx`, onboarding sheets) via `next/image` or inline SVG. Keep `alt` text action-focused for accessibility.
