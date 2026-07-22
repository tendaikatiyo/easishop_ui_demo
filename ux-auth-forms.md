# Auth forms — high-impact UX

**Status:** Implemented in the demo (`/signup`, `/signin`)  
**Related:** [`ux-onboarding-conversion.md`](./ux-onboarding-conversion.md), [`user_flows.md`](./user_flows.md)

Goal: cut signup friction while keeping DB-ready fields for later (profile / real auth).

---

## What we changed (and why)

| Change | Why |
|--------|-----|
| **Google first** | Fastest path. Email form is secondary. |
| **Short email signup** | Name · Email · Password only. No first/last split, username, or confirm password. |
| **WhatsApp only on `intent=alert`** | Phone is for alerts, not account create. Validate with E.164 (`lib/whatsapp.ts`). |
| **Marketing off / out of signup** | No pre-checked promo. Marketing stays on Profile. |
| **Visible labels** | Placeholders alone disappear while typing. |
| **Brand green primary CTA** | One action colour (native button — `glass-dark` was painting CTAs black). Google stays Google-branded. |
| **Bottom-left orb only** | One glowing brand orb. No page wash, no doodles, no green-tinted inputs. |
| **Neutral inputs** | Fields use `bg-zinc-100`, not `--brand-green-soft`. |
| **Intent copy** | List / alert / profile / default each get a short blurb. |
| **Password show/hide** | No confirm field. Preview does not store the password. |
| **Forgot password link** | Present on sign-in; toast in preview until backend exists. |
| **Continue without an account** | Returns via `?next=` (or home). Auth is never a welcome gate. |

---

## Field map

| Field | Signup | Sign-in | Collect later |
|-------|--------|---------|---------------|
| Name | Yes | — | Split first/last on Profile if needed |
| Email | Yes | Yes | — |
| Password | Yes (UI only in demo) | Yes (UI only) | Real auth backend |
| WhatsApp | Only `?intent=alert` | — | Profile / alert dialog |
| Username | — | — | Derive from email; edit on Profile |
| Marketing email | — (defaults off) | — | Profile → Marketing |

---

## Intent behaviour

| `?intent=` | Signup shows | After success |
|------------|--------------|---------------|
| `list` | Name · Email · Password | `?next=` (usually `/lists`) |
| `alert` | + WhatsApp number (required, country code) | Product / alert flow |
| `profile` / none | Short form | `?next=` or `/` |
| Google | Same redirect; no form fields | Local preview sign-in |

---

## Key files

| File | Role |
|------|------|
| `frontend/src/components/auth/auth-form.tsx` | Shared sign-up / sign-in UI |
| `frontend/src/lib/auth.ts` | `signUp` · `signIn` · `continueWithGoogle` |
| `frontend/src/lib/whatsapp.ts` | WhatsApp normalize + validation |
| `frontend/src/components/layout/social-icons.tsx` | `GoogleIcon` · `WhatsAppIcon` |
| `frontend/src/components/layout/app-shell.tsx` | Auth layout + bottom-left orb |

---

## Visual treatment

| Element | Current |
|---------|---------|
| Page background | Normal `bg-background` |
| Atmosphere | One glowing brand orb, bottom left |
| Form card | White / light ring; soft shadow |
| Inputs | Neutral `bg-zinc-100` |
| Primary CTA | Brand green (native `<button>`, not `Button` default) |
| Chrome | Back · logo · Back to shop |

Do **not** use: soft green page wash, washed-green input fills, signup/signin doodles, or marketing feature cards on auth.

Signup/signin PNG doodles in `public/doodles/` stay as assets only — not wired here. See [`design-doodles.md`](./design-doodles.md).

---

## Production notes

- Wire real Google OAuth; keep the same button placement.
- Store password with the auth provider — never in localStorage.
- Username / last name / marketing can live in the DB without appearing on first signup.
- Prefer auth pages without marketing feature cards when the user arrived from list/alert intent.

---

## How to verify

1. Open `/signup` — Google · Name · Email · Password · **green** Create account. Neutral inputs. Bottom-left orb. No green wash.  
2. Open `/signup?intent=alert&next=/product/…` — WhatsApp field with country-code validation.  
3. Open `/signin` — Google · Email · Password · Forgot password.  
4. **Continue without an account** returns to `next` or home.
