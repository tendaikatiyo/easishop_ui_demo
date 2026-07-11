---
version: alpha
name: Instacart
website: "https://www.instacart.com"
description: A grocery-delivery marketplace anchored on a saturated Instacart Green ("#108910") that lives almost entirely on borders and small-icon strokes — not on big background fills — paired with Instacart Sans across every weight (400 / 600 / 700), a 28px capsule radius reserved for the search bar and primary CTA, an 8px radius on every retailer card, and a structural grayscale ladder of six tokens (60, 50, 40, 30, 20, 10) that does the real surface work. The brand reserves Yellow ("#ffdc23") for Instacart+ membership ceremony and a deep secondary green ("#003d29") for promo bands; nothing else carries chromatic weight on the page.

seo:
  title: "Instacart Design System for React — Green (#108910), Instacart Sans, and 30+ components"
  metaDescription: "Instacart's design system as a DESIGN.md file. Green #108910, Instacart Sans, 18 colors, 32 components for React, Next.js, and AI coding tools."
  highlights:
    - "Green-as-stroke not green-as-fill — primary #108910 logs 14 border / 14 text / 2 background appearances out of 30, the inverse of how most marketplace brands deploy their voltage"
    - "Two-radius geometry — 28px capsule on the search field and primary CTA, 8px on every retailer card; nothing in between"
    - "Six-tier grayscale ladder — #242529 / #343538 / #56595e / #72767e / #8f939b / #c7c8cd / #e8e9eb carries text, hairlines, and chips while green stays scarce"
    - "Yellow #ffdc23 is locked to Instacart+ membership ceremony — appears 12 times, never as a generic accent"
    - "Instacart Sans at weight 600 carries every nav label, retailer card title, and section heading at 14 / 17 / 20 / 26px — weight 700 is reserved for the single h2 at 24px"
  tags:
    - "Food & Delivery"
  lastUpdated: "2026-05-13"
  author:
    name: "Dov Azencot"
    url: "https://x.com/dovazencot"
  opening: |
    Instacart's home page is the rare consumer marketplace where the brand voltage barely fills any pixels. The green that the logo screams — Instacart Green ("#108910") — appears 30 times across the captured surface, but 28 of those are borders or text strokes; only 2 are background fills. That inversion is the whole design move. Where DoorDash floods red across CTAs and Uber Eats stamps a black pill on every conversion target, Instacart treats green as a structural outline color — it draws the search-bar focus ring, the in-stock pill outline, the chevron link, the chevron icon — and leaves the page's actual surface work to a six-rung grayscale ladder and the warm beige tertiary "#f7f5f0".

    This DESIGN.md packages the system into one machine-readable file following the Google Labs spec. Inside: 18 color tokens grouped into brand, surface, ink, and membership roles; 11 typography tokens running on Instacart Sans at weights 400 / 600 / 700 with sizes spanning 10px micro-labels up to a 28px hero label; a radii scale of four values where the 28px capsule is reserved for the search bar and primary CTA; a 4 / 8 / 12 / 16 / 24 / 32 / 40 / 48px spacing scale; and 32 components covering the retailer grid card, the in-stock chip, the Instacart+ membership band, the search capsule, the FAQ accordion row, and the dense footer column.

    Feed the file to Claude, Cursor, or GitHub Copilot and the agent will reproduce Instacart's restraint — green as a hairline color rather than a fill, retailer cards as 8px rectangles, Instacart Sans at weight 600 rather than 700 across nav and titles, and Yellow locked to Instacart+ surfaces. Or reference the tokens directly: every hex, font, radius, and spacing value is a quoted string that drops into Tailwind config or CSS variables. The system is worth studying because it proves a delivery marketplace can scale to 1,500 retailers and 85,000 stores without ever raising its voice — the green is everywhere, almost none of it shouts.
  related:
    - href: "/design"
      title: "Browse all design systems"
      description: "The full directory of DESIGN.md files on shadcn.io, with live mockups for each."
    - href: "https://www.instacart.com"
      title: "Instacart — official site"
      description: "The live grocery-delivery marketplace whose tokens this DESIGN.md captures."
    - href: "https://github.com/google-labs-code/design.md"
      title: "The DESIGN.md specification"
      description: "Google Labs' open spec for machine-readable design system files."
  questions:
    - id: "primary-color"
      title: "What is Instacart's primary brand color?"
      answer: "Instacart Green ('#108910'). It appears 30 times across the captured home page surface, distributed as 14 border occurrences, 14 text-stroke occurrences, and just 2 background fills. The brand uses green as an outline color rather than a fill — search-bar focus ring, in-stock pill border, chevron icons, link text — and leaves background work to grayscale and beige. Two darker greens back it up: '#0d720d' for hover and '#003d29' as the secondary deep-green used on Instacart+ promo bands."
    - id: "typography"
      title: "What typography does Instacart use, and what should I substitute?"
      answer: "Instacart Sans, the brand's proprietary humanist sans, used at weights 400 / 600 / 700 across the entire surface — no italic, no extra weights. Body sits at 14px / weight 400 with 20px line-height (101 occurrences in the capture). Card titles and nav labels move to weight 600. The single h2 at 24px is the only weight 700 instance. Open-source substitutes: Inter or DM Sans at the same weights match Instacart Sans' geometric width and tall x-height closely; Plus Jakarta Sans is a softer alternative."
    - id: "green-as-stroke"
      title: "Why is the green almost never used as a background?"
      answer: "Out of 30 captured uses of Instacart Green '#108910', only 2 are backgrounds — and those 2 are micro-pills (e.g., the 'In your cart' chip). The remaining 28 are borders (14) and text strokes (14). The pattern repeats across the design system CSS variables — '--ids-color-brand-primary-regular' is mapped to icon and stroke contexts in the public token export. Where most delivery brands flood their primary color across CTAs, Instacart uses green as a structural outline and lets grayscale carry surface work."
    - id: "instacart-plus-yellow"
      title: "When should I use the yellow color?"
      answer: "Yellow ('#ffdc23') is locked to Instacart+ membership ceremony — the trial-promo band background, the membership badge, and the Instacart+ CTA. It appears 12 times in the capture, always as a background fill, never as text or border. Using yellow anywhere outside membership surfaces dilutes the signal. There is no secondary yellow tier — Instacart maintains exactly one membership voltage."
    - id: "buttons-and-radii"
      title: "Why are only the search bar and primary CTA capsule-shaped?"
      answer: "Instacart runs a two-radius geometry: 28px capsule reserved for the search bar (738px wide) and the primary CTA (56px tall), and 8px rectangle on every retailer card (52 occurrences in the capture — the dominant radius by a wide margin). Nothing rounds to 4px or 16px in between. Cards stay 8px to match the dense grocery-retailer grid; the capsule is reserved for the two surfaces that need to read as soft and tactile against that orthogonal grid."
    - id: "known-gaps"
      title: "What's missing from this DESIGN.md spec?"
      answer: "Several items, documented in Known Gaps: the post-login shopping app surfaces (cart, checkout, order tracking), dark-mode treatments, hover-state shadow values for retailer cards, the live map view used during delivery, and the per-retailer custom theming applied when a logged-in user browses a specific store catalog. The captured spec covers roughly the marketing home page and the retailer-grid landing — the authenticated shopping flow lives behind a sign-in wall."

colors:
  primary: "#108910"
  primary-hover: "#0d720d"
  primary-press: "#0a610a"
  secondary-deep: "#003d29"
  tertiary-warm: "#f7f5f0"
  membership-yellow: "#ffdc23"
  ink: "#000000"
  ink-soft: "#242529"
  body: "#343538"
  body-muted: "#56595e"
  mute: "#72767e"
  mute-soft: "#8f939b"
  hairline: "#c7c8cd"
  hairline-soft: "#e8e9eb"
  canvas: "#ffffff"
  link: "#0000ee"
  danger: "#e12726"
  danger-deep: "#b92831"

typography:
  display-md:
    fontFamily: "Instacart Sans, Instacart Sans Fallback, Arial, sans-serif"
    fontSize: 26px
    fontWeight: 600
    lineHeight: 33px
  display-sm:
    fontFamily: "Instacart Sans, Instacart Sans Fallback, Arial, sans-serif"
    fontSize: 24px
    fontWeight: 700
    lineHeight: 28px
  hero-label:
    fontFamily: "Instacart Sans, Instacart Sans Fallback, Arial, sans-serif"
    fontSize: 28px
    fontWeight: 400
    lineHeight: 32px
  heading-lg:
    fontFamily: "Instacart Sans, Instacart Sans Fallback, Arial, sans-serif"
    fontSize: 20px
    fontWeight: 600
    lineHeight: 25px
  heading-md:
    fontFamily: "Instacart Sans, Instacart Sans Fallback, Arial, sans-serif"
    fontSize: 17px
    fontWeight: 600
    lineHeight: 20px
  body-lg:
    fontFamily: "Instacart Sans, Instacart Sans Fallback, Arial, sans-serif"
    fontSize: 23px
    fontWeight: 400
    lineHeight: 28px
  body-md:
    fontFamily: "Instacart Sans, Instacart Sans Fallback, Arial, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 18px
  body-default:
    fontFamily: "Instacart Sans, Instacart Sans Fallback, Arial, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
  body-strong:
    fontFamily: "Instacart Sans, Instacart Sans Fallback, Arial, sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 20px
  caption:
    fontFamily: "Instacart Sans, Instacart Sans Fallback, Arial, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
  micro:
    fontFamily: "Instacart Sans, Instacart Sans Fallback, Arial, sans-serif"
    fontSize: 10px
    fontWeight: 400
    lineHeight: 10px

rounded:
  none: "0px"
  sm: "4px"
  md: "8px"
  lg: "12px"
  capsule: "28px"
  full: "999px"

spacing:
  xxs: "2px"
  xs: "4px"
  sm: "8px"
  md: "12px"
  base: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "40px"
  3xl: "48px"

components:
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.body-strong}"
    padding: "{spacing.md} {spacing.lg}"
    borderBottom: "{colors.hairline-soft}"
  nav-link:
    textColor: "{colors.body}"
    typography: "{typography.body-strong}"
  search-bar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-md}"
    rounded: "{rounded.capsule}"
    padding: "0 48px 0 16px"
    height: "56px"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.canvas}"
    typography: "{typography.body-md}"
    rounded: "{rounded.capsule}"
    padding: "0 16px"
    height: "56px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.capsule}"
  button-primary-press:
    backgroundColor: "{colors.primary-press}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.capsule}"
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.primary}"
    borderColor: "{colors.primary}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.capsule}"
    padding: "0 16px"
    height: "44px"
  retailer-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    borderColor: "{colors.hairline-soft}"
    typography: "{typography.body-default}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  retailer-card-title:
    textColor: "{colors.ink-soft}"
    typography: "{typography.body-strong}"
  retailer-card-meta:
    textColor: "{colors.body-muted}"
    typography: "{typography.caption}"
  in-stock-pill:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.primary}"
    borderColor: "{colors.primary}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: "{spacing.xxs} {spacing.sm}"
  delivery-eta-chip:
    backgroundColor: "{colors.tertiary-warm}"
    textColor: "{colors.body}"
    typography: "{typography.caption}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xxs} {spacing.sm}"
  category-chip:
    backgroundColor: "{colors.hairline-soft}"
    textColor: "{colors.body}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.full}"
    padding: "{spacing.sm} {spacing.md}"
  membership-band:
    backgroundColor: "{colors.membership-yellow}"
    textColor: "{colors.ink}"
    typography: "{typography.heading-lg}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg} {spacing.xl}"
  membership-cta:
    backgroundColor: "{colors.ink-soft}"
    textColor: "{colors.canvas}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.capsule}"
    padding: "{spacing.sm} {spacing.base}"
    height: "44px"
  promo-band-dark:
    backgroundColor: "{colors.secondary-deep}"
    textColor: "{colors.canvas}"
    typography: "{typography.display-md}"
    rounded: "{rounded.none}"
    padding: "{spacing.xl} {spacing.lg}"
  section-heading:
    textColor: "{colors.ink}"
    typography: "{typography.display-sm}"
  stat-large:
    textColor: "{colors.ink}"
    typography: "{typography.display-md}"
  stat-caption:
    textColor: "{colors.body-muted}"
    typography: "{typography.body-default}"
  feature-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    borderColor: "{colors.hairline-soft}"
    typography: "{typography.body-default}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  feature-card-title:
    textColor: "{colors.ink-soft}"
    typography: "{typography.heading-md}"
  faq-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.heading-md}"
    padding: "{spacing.base} 0"
    borderBottom: "{colors.hairline-soft}"
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md} {spacing.base}"
    height: "48px"
  text-input-focus:
    backgroundColor: "{colors.canvas}"
    borderColor: "{colors.primary}"
    rounded: "{rounded.md}"
  link-default:
    textColor: "{colors.primary}"
    typography: "{typography.body-default}"
  link-legal:
    textColor: "{colors.link}"
    typography: "{typography.caption}"
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.caption}"
    padding: "{spacing.xl} {spacing.lg}"
    borderTop: "{colors.hairline-soft}"
  footer-column-title:
    textColor: "{colors.ink-soft}"
    typography: "{typography.body-strong}"
  footer-link:
    textColor: "{colors.body-muted}"
    typography: "{typography.caption}"
  app-download-pill:
    backgroundColor: "{colors.ink-soft}"
    textColor: "{colors.canvas}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.capsule}"
    padding: "{spacing.sm} {spacing.base}"
  icon-chevron:
    textColor: "{colors.primary}"
    typography: "{typography.body-default}"
  divider:
    backgroundColor: "{colors.hairline-soft}"
    height: "1px"

---


## Overview

Instacart's home page is the marketplace surface that proves a brand can ship green on every screen without ever flooding a button with it. The page is structurally a grayscale grid — retailer logos pinned inside `{rounded.md}` 8px white cards, body text in `{colors.body}` (`#343538`), hairlines in `{colors.hairline-soft}` (`#e8e9eb`) — punctuated by the capsule search bar and a single capsule CTA. The brand voltage, Instacart Green (`{colors.primary}` — `#108910`), runs as a stroke color: 14 border occurrences, 14 text occurrences, 2 background fills across 30 total captures. **Green-as-stroke** is the named principle — every chevron icon, in-stock pill outline, search-focus ring, and link text uses the green, but the green never fills a button background in the marketing surface.

Where most delivery marketplaces (DoorDash flooding red, Uber Eats stamping black) push a single conversion color across every CTA fill, Instacart inverts the move. The primary CTA on the hero is filled `{colors.primary}`, yes, but it's the only one — every other green appearance is a hairline. This is not a brand that lacks confidence in its voltage; it is a brand that has chosen scarcity over saturation.

Type carries the second story. Instacart Sans runs across every surface in three weights — 400 for body, 600 for nav and card titles, 700 for the single h2 at 24px. Sizes step deliberately: 10px micro labels, 12px caption, 14px body (the workhorse, 101 occurrences in the capture), 16-17px nav, 20-23-26-28px display. No italic, no extra weights, no tracking variation — the face is allowed to do the work.

**Key Characteristics:**
- Green-as-stroke discipline — `{colors.primary}` (`#108910`) appears 30 times: 14 borders, 14 text strokes, 2 background fills. The voltage is everywhere, almost none of it fills surfaces.
- Two-radius geometry — `{rounded.capsule}` 28px is reserved for the search bar and the primary CTA; `{rounded.md}` 8px is the retailer-card default (52 occurrences, the dominant radius by an order of magnitude); nothing rounds to 4px or 16px in between.
- A six-tier grayscale ladder (`#242529` / `#343538` / `#56595e` / `#72767e` / `#8f939b` / `#c7c8cd` / `#e8e9eb`) carries surface work — text colors, hairlines, chip fills — while green stays scarce.
- Yellow (`{colors.membership-yellow}` — `#ffdc23`) is locked to Instacart+ membership ceremony. Twelve appearances in the capture, every one a background fill on a membership surface; never a generic accent.
- Instacart Sans at weight 600 carries the system. Card titles, nav links, section headings sit at 14 / 17 / 20 / 26px in weight 600; weight 700 appears exactly once (the 24px h2 statement section).
- The retailer-grid is the page's structural unit — small 8px-radius white cards with logo, name, delivery ETA, and an outlined green in-stock pill, packed dense across the viewport.

## Colors

### Brand & Accent
- **Instacart Green** (`{colors.primary}` — `#108910`): frequency 30. Used as text (14), border (14), background (2). Mapped to `--ids-color-brand-primary-regular`. The system's voltage — every chevron, every in-stock outline, every link, the primary CTA fill. Stays scarce on backgrounds; the green-as-stroke discipline is the brand's whole color story.
- **Primary Hover** (`{colors.primary-hover}` — `#0d720d`): hover state for the primary CTA, mapped to `--ids-color-brand-primary-dark` and `--ids-color-system-feedback-success-dark`.
- **Primary Press** (`{colors.primary-press}` — `#0a610a`): pressed state, mapped to `--ids-color-brand-primary-extra-dark`. Both shades share success-semantic duty — Instacart's success palette is the brand green deepened.
- **Secondary Deep Green** (`{colors.secondary-deep}` — `#003d29`): frequency 1. Used as background fill on the secondary promo band ("The biggest online grocery marketplace in North America"). Mapped to `--ids-color-brand-secondary-regular`. Reserved for editorial dark-band moments.
- **Membership Yellow** (`{colors.membership-yellow}` — `#ffdc23`): frequency 12. Used as background (12), never as text or border. Mapped to `--ids-color-brand-max-light`. Locked to Instacart+ ceremony — the trial-promo band, membership badge, Instacart+ CTA fill.
- **Tertiary Warm** (`{colors.tertiary-warm}` — `#f7f5f0`): a warm-neutral beige tint mapped to `--ids-color-brand-tertiary-light` and other tertiary roles. Used as a soft fill on delivery-ETA chips and editorial card backgrounds — references paper-bag and shelf materials.

### Surface
- **Canvas** (`{colors.canvas}` — `#ffffff`): the default page background. Mapped to `--ids-color-system-grayscale-00`. Carries retailer cards, feature cards, the search bar, and the top nav.
- **Hairline Soft** (`{colors.hairline-soft}` — `#e8e9eb`): frequency 27. Used as background (13), border (14). Mapped to `--ids-color-system-grayscale-20`. The page's workhorse hairline — divides nav, footer, retailer-card edges; tints chip fills.

### Ink
- **Ink** (`{colors.ink}` — `#000000`): frequency 395. Used as text (185), border (206), shadow (3). The h2 statement color and the heaviest border tone. Stays restricted to display headings and structural hairlines.
- **Ink Soft** (`{colors.ink-soft}` — `#242529`): frequency 370. Used as text (195), border (174). Mapped to `--ids-color-system-grayscale-80` and `--ids-color-brand-max-dark`. Card titles, footer column titles, app-download pill fill — the "near-black that's still warm enough to sit on canvas without fighting it."
- **Body** (`{colors.body}` — `#343538`): frequency 595. The workhorse text color — text (300) and border (295). Mapped to `--ids-color-system-grayscale-70`. Carries every body paragraph, every retailer card name, every nav label that isn't a title.
- **Body Muted** (`{colors.body-muted}` — `#56595e`): mapped to `--ids-color-system-grayscale-60`. Secondary text — captions, delivery-ETA, retailer-card meta lines.
- **Mute** (`{colors.mute}` — `#72767e`): mapped to `--ids-color-system-grayscale-50`. Tertiary text — fine print, footer secondary lines.
- **Mute Soft** (`{colors.mute-soft}` — `#8f939b`): mapped to `--ids-color-system-grayscale-40`. Lowest-priority text — disabled states, placeholder copy.
- **Hairline** (`{colors.hairline}` — `#c7c8cd`): mapped to `--ids-color-system-grayscale-30`. The search-bar border and the text-input border on default state.

### Semantic
- **Link** (`{colors.link}` — `#0000ee`): frequency 222. Used as text (117), border (105). The browser-default link blue inside legal fine print and "skip to content" anchors. Stays out of the brand's primary link role — Instacart Green carries body-link styling instead.
- **Danger** (`{colors.danger}` — `#e12726`): frequency 3. Mapped to `--ids-color-system-feedback-detrimental-regular`. Reserved for inline validation errors and removal confirmations.
- **Danger Deep** (`{colors.danger-deep}` — `#b92831`): mapped to `--ids-color-system-feedback-detrimental-dark`. Hover / pressed state for danger surfaces.

## Typography

### Font Family
One typeface carries the entire surface: **Instacart Sans** (with an Instacart Sans Fallback and Arial as the final fallback). It's a proprietary humanist sans with a tall x-height and a slightly curved geometry — friendly enough for grocery copy, structured enough for retailer logos. Three weights only: 400 for body, 600 for emphasis and headings, 700 for a single 24px h2. No italic, no extra weights, no tracking flourish.

Open-source substitutes: **Inter** or **DM Sans** at weights 400 / 600 / 700 match Instacart Sans' geometric width and x-height closely. **Plus Jakarta Sans** is a softer alternative; **Manrope** at 500 / 700 is the closest fallback if the design needs a marginally more rounded feel.

### Hierarchy

| Token | Size | Weight | Line Height | Use |
|---|---|---|---|---|
| `{typography.hero-label}` | 28px | 400 | 32px | Button-context hero label ("Sign up to get $0 delivery fee*"). Single-occurrence display weight 400. |
| `{typography.display-md}` | 26px | 600 | 33px | h1 hero headlines and large promo-band titles. |
| `{typography.display-sm}` | 24px | 700 | 28px | The single weight-700 h2 statement ("Stores to help you save"). |
| `{typography.body-lg}` | 23px | 400 | 28px | Editorial card paragraphs ("available to shop across the catalog"). |
| `{typography.heading-lg}` | 20px | 600 | 25px | h2 secondary headings, stat-section labels. |
| `{typography.heading-md}` | 17px | 600 | 20px | h3 card titles, FAQ row questions. |
| `{typography.body-md}` | 16px | 400 | 18px | Input labels and CTA labels (search bar, primary button text). |
| `{typography.body-default}` | 14px | 400 | 20px | The workhorse body — 101 occurrences in the capture. Retailer card names, nav links, body paragraphs. |
| `{typography.body-strong}` | 14px | 600 | 20px | Bold body — 62 occurrences. Nav titles, card-title strong variant. |
| `{typography.caption}` | 12px | 400 | 16px | Delivery-ETA chips, footer links, fine print. |
| `{typography.micro}` | 10px | 400 | 10px | Legal disclaimer micro-labels, footer copyright fragments. |

### Principles
- **Sentence-case across the board.** No all-caps headlines, no display-tracking flourish.
- **Weight 600 is the default emphasis.** Weight 700 is reserved for the single h2 "Stores to help you save" statement section. Promoting nav labels to 700 breaks the system.
- **One face does the work.** Instacart Sans across every weight, every size — no second-typeface contrast pairing, no display-vs-text family split.
- **Numerals use the same face.** Stat values like "1 billion products" and "85,000 stores" sit in Instacart Sans weight 600, not a separate display numeral set.

## Layout

### Spacing System
- **Base unit**: 4px. The CSS variables `--ids-system-space-*` declare 4 / 8 / 12 / 16 / 24 / 32 / 40 / 48 explicitly.
- **Tokens**: `{spacing.xxs}` 2px · `{spacing.xs}` 4px · `{spacing.sm}` 8px · `{spacing.md}` 12px · `{spacing.base}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.2xl}` 40px · `{spacing.3xl}` 48px.
- **Section padding**: marketing bands sit at `{spacing.xl}` 32px top/bottom; promo bands inset at `{spacing.lg}` 24px horizontally.
- **Card interior padding**: retailer cards run `{spacing.md}` 12px; feature cards step up to `{spacing.lg}` 24px.
- **Inline gap**: retailer-grid columns use `{spacing.sm}` 8px between cards; nav rows use `{spacing.base}` 16px between siblings.

### Grid & Container
- **Max width**: a ~1200px container centered with horizontal gutters of `{spacing.lg}` 24px on desktop, `{spacing.base}` 16px on mobile.
- **Column patterns**: the retailer grid runs 5-up at desktop, 3-up at tablet, 2-up at mobile-large, 1-up at mobile. Feature cards run 3-up at desktop, stacking 1-up on mobile. The membership band always full-width.

### Whitespace Philosophy
Card-to-card spacing is tight — Instacart's page treats the retailer grid like a real shelf, packing 12-15 retailer cards above the fold. Inside each card the headline / meta / chip stack sits at `{spacing.xs}` 4px between siblings. Bands separate at `{spacing.xl}` 32px to `{spacing.2xl}` 40px; nothing in between. The brand resists the urge to over-pad — grocery is a high-density catalog, and the layout matches.

### Responsive Strategy

#### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 600px | Nav collapses to logo + hamburger; retailer grid 1-up; search bar full-width. |
| Mobile-Large | 600–767px | Retailer grid 2-up; promo bands full-bleed. |
| Tablet | 768–1023px | Retailer grid 3-up; nav stays horizontal; feature cards 2-up. |
| Desktop | 1024–1199px | Retailer grid 5-up; full nav row visible. |
| Desktop-Large | ≥ 1200px | Container caps at ~1200px; bands stay edge-to-edge while content centers. |

#### Touch Targets
The primary CTA renders at 56px height; the search bar at 56px; the secondary CTA at 44px. All meet WCAG AAA minimums. Retailer cards inflate tap area through the full card body — the entire 8px-radius rectangle is hit-target, not just the title or logo.

#### Image Behavior
- **Retailer logos**: square or rectangle SVG, pinned inside the 8px card; consistent ~64px logo height.
- **Editorial illustrations**: the lifestyle photography (hands at grocery counter, kitchen surfaces) sits inside `{rounded.md}` 8px containers, never circular.
- **Stat-band background**: full-bleed editorial photography behind the "1 billion products" stat row; image runs edge-to-edge, no card frame.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Level 0 — Flat | No shadow, no border. | Default — most retailer cards lean on `{colors.hairline-soft}` border instead of shadow. |
| Level 1 — Hairline | 1px `{colors.hairline-soft}` border. | Retailer cards, feature cards, FAQ rows, top nav bottom edge. |
| Level 2 — Subtle Drop | `rgba(0, 0, 0, 0.08) 0px 2px 8px 0px` | Hovered retailer cards and the membership-band CTA. Mapped to `--ids-opacity-light` 0.08. |
| Level 3 — Card Drop | `rgba(0, 0, 0, 0.16) 0px 4px 16px 0px` | Modal surfaces and the search-suggestion dropdown. Mapped to `--ids-opacity-regular` 0.16. |

### Decorative Depth
- **Hairline over shadow**: the brand prefers a single-pixel hairline border over a soft drop shadow at the card level. The result is a dense, shelf-like read where every card edge is sharp.
- **Yellow band as polarity-flip depth**: the Instacart+ membership band uses `{colors.membership-yellow}` as a full-bleed fill against the white retailer grid — the polarity shift carries depth without shadow.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Promo bands, footer fill, full-bleed photography. |
| `{rounded.sm}` | 4px | Delivery-ETA chips, system-radius-4 token. |
| `{rounded.md}` | 8px | The canonical card radius — every retailer card (52 occurrences in the capture), feature card, text input. The dominant shape. |
| `{rounded.lg}` | 12px | The membership-band container — slightly softer than the retailer grid to distinguish editorial moments. |
| `{rounded.capsule}` | 28px | Reserved for the search bar (738px wide) and the primary CTA (56px tall). The signature soft-tactile surface. |
| `{rounded.full}` | 999px | In-stock pills, category chips, circular icon containers. |

### Photography Geometry
- **Retailer logos**: square or rectangle SVG vectors, sized consistently within `{rounded.md}` 8px containers.
- **Editorial photography**: rounded rectangle `{rounded.md}` 8px frames; never cropped to a circle.
- **Stat-band background imagery**: full-bleed, no card chrome, no radius.

## Components

### Buttons

**`button-primary`** — the green capsule CTA.
- Background `{colors.primary}` (`#108910`), text `{colors.canvas}` (`#ffffff`), label set in `{typography.body-md}`, padding `0 16px`, height 56px, shape `{rounded.capsule}` 28px. The only green fill on the marketing surface — every other green appearance is a stroke.

**`button-primary-hover`** — hover-state fill.
- Background `{colors.primary-hover}` (`#0d720d`), text `{colors.canvas}`, shape `{rounded.capsule}`. A slight darkening only — no shadow lift.

**`button-primary-press`** — pressed-state fill.
- Background `{colors.primary-press}` (`#0a610a`), text `{colors.canvas}`, shape `{rounded.capsule}`.

**`button-secondary`** — the green-outlined capsule.
- Background `{colors.canvas}`, text `{colors.primary}`, border `{colors.primary}` 1px, label in `{typography.body-strong}`, padding `0 16px`, height 44px, shape `{rounded.capsule}`. Green-as-stroke in its purest expression — the outline IS the brand.

### Cards & Containers

**`retailer-card`** — the grocery-grid unit.
- Background `{colors.canvas}`, body text `{colors.body}`, border `{colors.hairline-soft}`, padding `{spacing.md}` 12px, shape `{rounded.md}` 8px. The dominant component — 12-15 visible above the fold at desktop.

**`feature-card`** — the editorial 3-up feature row card.
- Background `{colors.canvas}`, border `{colors.hairline-soft}`, padding `{spacing.lg}` 24px, shape `{rounded.md}` 8px. Hosts illustration + title + body.

**`promo-band-dark`** — the secondary green editorial band.
- Background `{colors.secondary-deep}` (`#003d29`), text `{colors.canvas}`, typography `{typography.display-md}`, padding `{spacing.xl} {spacing.lg}` 32 24, shape `{rounded.none}`. Used for the "biggest online grocery marketplace" statement section.

### Inputs & Forms

**`search-bar`** — the hero capsule search field.
- Background `{colors.canvas}`, text `{colors.body}`, border `{colors.hairline}`, typography `{typography.body-md}`, padding `0 48px 0 16px`, height 56px, shape `{rounded.capsule}` 28px. The signature input — wide (738px) and tactile against the orthogonal retailer grid.

**`text-input`** — the canonical rectangular input.
- Background `{colors.canvas}`, text `{colors.body}`, border `{colors.hairline}` `#c7c8cd`, typography `{typography.body-md}`, padding `{spacing.md} {spacing.base}`, height 48px, shape `{rounded.md}` 8px.

**`text-input-focus`** — focus state.
- Border switches to `{colors.primary}` `#108910` — the green-as-stroke focus ring.

### Navigation

**`top-nav`** — the sticky top navigation bar.
- Background `{colors.canvas}`, text `{colors.body}`, typography `{typography.body-strong}`, padding `{spacing.md} {spacing.lg}`, bottom border `{colors.hairline-soft}`. Logo at the left edge, links centered, sign-in pill at the right.

**`nav-link`** — the link row inside `top-nav`.
- Text `{colors.body}`, set in `{typography.body-strong}` 14 / 600.

**`footer`** — the dense column footer.
- Background `{colors.canvas}`, text `{colors.body}`, typography `{typography.caption}`, padding `{spacing.xl} {spacing.lg}`, top border `{colors.hairline-soft}`. Five-column link grid at desktop.

**`footer-column-title`** — column heading.
- Text `{colors.ink-soft}`, set in `{typography.body-strong}` 14 / 600.

**`footer-link`** — link inside footer column.
- Text `{colors.body-muted}` `#56595e`, set in `{typography.caption}` 12 / 400.

### Signature Components

**`in-stock-pill`** — the green-outlined availability pill on retailer cards.
- Background `{colors.canvas}`, text `{colors.primary}`, border `{colors.primary}`, typography `{typography.caption}`, padding `{spacing.xxs} {spacing.sm}`, shape `{rounded.full}`. Green-as-stroke at its smallest scale — the pill carries brand voltage without a single filled pixel.

**`delivery-eta-chip`** — the warm-neutral delivery-time chip.
- Background `{colors.tertiary-warm}` (`#f7f5f0`), text `{colors.body}`, typography `{typography.caption}`, padding `{spacing.xxs} {spacing.sm}`, shape `{rounded.sm}`. The chip carries the time estimate ("60 min", "Pickup ready in 2hr") on the retailer-card meta line.

**`category-chip`** — the horizontal-scroll category filter.
- Background `{colors.hairline-soft}`, text `{colors.body}`, typography `{typography.body-strong}`, padding `{spacing.sm} {spacing.md}`, shape `{rounded.full}`.

**`membership-band`** — the Instacart+ trial band.
- Background `{colors.membership-yellow}` (`#ffdc23`), text `{colors.ink}`, typography `{typography.heading-lg}`, padding `{spacing.lg} {spacing.xl}`, shape `{rounded.lg}`. The one place yellow lives.

**`membership-cta`** — the dark capsule paired with the yellow band.
- Background `{colors.ink-soft}` (`#242529`), text `{colors.canvas}`, typography `{typography.body-strong}`, padding `{spacing.sm} {spacing.base}`, height 44px, shape `{rounded.capsule}`. Membership conversion CTA — the only near-black capsule on the page.

**`section-heading`** — the page's display headline.
- Text `{colors.ink}`, set in `{typography.display-sm}` 24 / 700. The only weight-700 instance on the surface.

**`stat-large`** — the stat-row big number.
- Text `{colors.ink}`, set in `{typography.display-md}` 26 / 600. Used on the "1 billion products / 85,000 stores / 14,000 cities" stat band.

**`stat-caption`** — the stat-row caption.
- Text `{colors.body-muted}` `#56595e`, set in `{typography.body-default}`.

**`faq-row`** — the FAQ accordion item.
- Background `{colors.canvas}`, text `{colors.body}`, question in `{typography.heading-md}`, padding `{spacing.base} 0`, bottom border `{colors.hairline-soft}`. No card chrome — hairlines separate the rows.

**`app-download-pill`** — the iOS / Android download pill in the footer.
- Background `{colors.ink-soft}`, text `{colors.canvas}`, typography `{typography.body-strong}`, padding `{spacing.sm} {spacing.base}`, shape `{rounded.capsule}`.

### Links

**`link-default`** — the brand-green inline link.
- Text `{colors.primary}` `#108910`, body in `{typography.body-default}`. Used for "Learn more" and category-jump anchors. Green-as-stroke — the link is the green text itself.

**`link-legal`** — the browser-default link inside legal fine print.
- Text `{colors.link}` `#0000ee`, body in `{typography.caption}`. The system's only chromatic non-green link.

**`icon-chevron`** — the green chevron on link rows.
- Text `{colors.primary}`, scaled to `{typography.body-default}` 14px. Indicates "view more" on retailer-card titles and category headings.

**`divider`** — the horizontal hairline.
- Background `{colors.hairline-soft}`, height 1px. Used between FAQ rows, footer column groups, and the top-nav bottom edge.

## Do's and Don'ts

### Do
- Reserve `{colors.primary}` (`#108910`) for stroke contexts — chevrons, in-stock pill outlines, search-bar focus rings, link text. Use it as a background fill only on the single primary CTA.
- Use `{rounded.capsule}` 28px exclusively on the search bar and primary CTA; default every other surface (retailer cards, feature cards, text inputs) to `{rounded.md}` 8px.
- Anchor body text on `{colors.body}` (`#343538`) rather than pure black. The page's 595 occurrences of `#343538` carry the workhorse text role — pure `#000000` is reserved for the single weight-700 h2.
- Use `{colors.tertiary-warm}` (`#f7f5f0`) as the soft chip fill for delivery-ETA labels. The warm beige reads as "paper bag" against the cooler grayscale grid.
- Lock `{colors.membership-yellow}` (`#ffdc23`) to Instacart+ surfaces only. The yellow signals membership, not generic emphasis.
- Set Instacart Sans at weight 600 for every card title and nav label. Weight 700 stays scoped to the single 24px h2 statement.

### Don't
- Don't render the primary CTA at `{rounded.md}` 8px or `{rounded.full}` 999px. The 28px capsule is a two-surface signature (search + primary CTA); break it and the page loses its tactile-vs-grid contrast.
- Don't fill retailer cards or feature cards with `{colors.primary}` as a background. Green-as-fill is a one-CTA privilege; every other green appearance must be a border or a text stroke.
- Don't use `{colors.link}` (`#0000ee`) as a primary text-link color. The browser-default blue is reserved for legal fine print; brand links use `{colors.primary}` green.
- Don't promote `{typography.body-strong}` 14 / 600 to 14 / 700 across nav and card titles. Weight 700 is reserved for one element — the 24px h2.
- Don't apply a drop shadow to the default retailer card. The 1px `{colors.hairline-soft}` border IS the card's edge; adding shadow flattens the dense shelf-like read.
- Don't introduce a second accent voltage (orange, blue, magenta) outside the existing Instacart+ yellow and detrimental red. The green / grayscale / beige / yellow palette is the system's whole chromatic surface.
- Don't use the deep secondary green `{colors.secondary-deep}` (`#003d29`) as a text color or a button fill. The token is scoped to full-bleed editorial promo bands only — using it elsewhere reads as a second brand voltage and breaks the green-as-stroke discipline.

## Known Gaps

- **Authenticated shopping flow**: cart, checkout, order-tracking, and per-retailer storefronts live behind a sign-in wall and are not captured in this spec.
- **Dark mode**: the brand's CSS variables include grayscale-90 / 99 tokens (mapped to `--ids-color-system-grayscale-90` / `--ids-color-system-grayscale-99`) suggesting a dark mode exists for the iOS / Android apps, but the public marketing surface is light-only.
- **Hover & focus states**: hover treatments for retailer cards (subtle shadow lift) are partially captured via Level 2 elevation; full focus-ring color combinations and keyboard-focus outlines are not.
- **Live map view**: the in-delivery map tile style — used during active orders — lives on the authenticated app surface and isn't represented.
- **Per-retailer custom theming**: logged-in users browsing a specific store catalog (Costco, Wegmans, Aldi) see retailer-themed accents; that overlay system is out of scope.
- **Loading skeletons**: skeleton screen color and animation values for the retailer-grid load state were not visible in the captured marketing surfaces.
