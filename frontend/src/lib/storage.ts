import type { DemoUser, AnalyticsEvent, MarketingPrefs } from "@/types";

const USER_KEY = "easishop.demo.user";
const EVENTS_KEY = "easishop.demo.events";
const VISITED_KEY = "easishop.demo.visited";
const MAX_EVENTS = 200;

export const DEFAULT_USER: DemoUser = {
  username: "tendai",
  name: "Tendai",
  surname: "Katiyo",
  phone: "",
  email: "tendai@easishop.co.za",
  marketingPrefs: {
    emailMarketing: true,
  },
  loyaltyCards: [],
  priceAlerts: [],
  lists: [
    {
      id: "list-weekly",
      name: "Weekly shop",
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  location: null,
  onboardingSeen: false,
  /** Seeded demo starts signed in (context: demo assumes an account). */
  signedIn: true,
};

function canUseStorage(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

function normalizeMarketingPrefs(raw: unknown): MarketingPrefs {
  if (!raw || typeof raw !== "object") {
    return { ...DEFAULT_USER.marketingPrefs };
  }
  const prefs = raw as Record<string, unknown>;
  if (typeof prefs.emailMarketing === "boolean") {
    return { emailMarketing: prefs.emailMarketing };
  }
  // Migrate older demo shape
  if (typeof prefs.emailDeals === "boolean") {
    return { emailMarketing: prefs.emailDeals };
  }
  return { ...DEFAULT_USER.marketingPrefs };
}

function normalizeUser(raw: Partial<DemoUser> & Record<string, unknown>): DemoUser {
  const base = structuredClone(DEFAULT_USER);
  const merged = { ...base, ...raw } as DemoUser & Record<string, unknown>;

  return {
    ...base,
    ...merged,
    username:
      typeof merged.username === "string" && merged.username.trim()
        ? merged.username
        : base.username,
    name: typeof merged.name === "string" ? merged.name : base.name,
    surname:
      typeof merged.surname === "string" ? merged.surname : base.surname,
    phone: typeof merged.phone === "string" ? merged.phone : base.phone,
    email: typeof merged.email === "string" ? merged.email : base.email,
    marketingPrefs: normalizeMarketingPrefs(merged.marketingPrefs),
    lists: Array.isArray(merged.lists) ? merged.lists : base.lists,
    loyaltyCards: Array.isArray(merged.loyaltyCards)
      ? merged.loyaltyCards
      : base.loyaltyCards,
    priceAlerts: Array.isArray(merged.priceAlerts)
      ? merged.priceAlerts
      : base.priceAlerts,
    onboardingSeen:
      typeof merged.onboardingSeen === "boolean"
        ? merged.onboardingSeen
        : base.onboardingSeen,
    signedIn:
      typeof merged.signedIn === "boolean" ? merged.signedIn : base.signedIn,
  };
}

export function getUser(): DemoUser {
  if (!canUseStorage()) return structuredClone(DEFAULT_USER);
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) {
    const seed = structuredClone(DEFAULT_USER);
    localStorage.setItem(USER_KEY, JSON.stringify(seed));
    return seed;
  }
  try {
    return normalizeUser(JSON.parse(raw));
  } catch {
    return structuredClone(DEFAULT_USER);
  }
}

export function saveUser(user: DemoUser): void {
  if (!canUseStorage()) return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new CustomEvent("easishop:user-updated"));
}

export function updateUser(patch: Partial<DemoUser>): DemoUser {
  const current = getUser();
  const next = normalizeUser({
    ...current,
    ...patch,
    marketingPrefs: patch.marketingPrefs
      ? { ...current.marketingPrefs, ...patch.marketingPrefs }
      : current.marketingPrefs,
  });
  saveUser(next);
  return next;
}

/** Wipe the demo account and reseed defaults (local-only). */
export function deleteAccount(): void {
  if (!canUseStorage()) return;
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(EVENTS_KEY);
  const seed = structuredClone(DEFAULT_USER);
  seed.signedIn = false;
  seed.onboardingSeen = false;
  localStorage.setItem(USER_KEY, JSON.stringify(seed));
  window.dispatchEvent(new CustomEvent("easishop:user-updated"));
}

export function getEvents(): AnalyticsEvent[] {
  if (!canUseStorage()) return [];
  try {
    return JSON.parse(localStorage.getItem(EVENTS_KEY) || "[]") as AnalyticsEvent[];
  } catch {
    return [];
  }
}

export function pushEvent(event: AnalyticsEvent): void {
  if (!canUseStorage()) return;
  const events = [event, ...getEvents()].slice(0, MAX_EVENTS);
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

export function isReturningVisitor(): boolean {
  if (!canUseStorage()) return false;
  return localStorage.getItem(VISITED_KEY) === "1";
}

export function markVisited(): void {
  if (!canUseStorage()) return;
  localStorage.setItem(VISITED_KEY, "1");
}
