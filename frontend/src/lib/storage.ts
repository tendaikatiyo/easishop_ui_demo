import type { DemoUser, AnalyticsEvent } from "@/types";

const USER_KEY = "easishop.demo.user";
const EVENTS_KEY = "easishop.demo.events";
const MAX_EVENTS = 200;

export const DEFAULT_USER: DemoUser = {
  name: "Tendai",
  email: "tendai@easishop.co.za",
  marketingPrefs: {
    emailDeals: true,
    pushAlerts: true,
    smsOffers: false,
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
};

function canUseStorage(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
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
    return { ...structuredClone(DEFAULT_USER), ...JSON.parse(raw) } as DemoUser;
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
  const next = { ...getUser(), ...patch };
  saveUser(next);
  return next;
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
