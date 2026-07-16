export type RetailerName =
  | "Checkers"
  | "Dischem"
  | "Pick n Pay"
  | "Shoprite"
  | "Woolworths";

export interface RetailerPrice {
  retailer: RetailerName;
  price: number;
  previousPrice: number | null;
  url: string | null;
  image: string | null;
  unitPrice?: number | null;
  unitLabel?: string | null;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  image: string;
  barcode?: string | null;
  prices: RetailerPrice[];
}

export interface Category {
  name: string;
  slug: string;
  emoji?: string;
}

export interface LoyaltyCard {
  id: string;
  retailer: string;
  cardNumber: string;
  label: string;
}

export interface PriceAlert {
  productId: string;
  enabled: boolean;
  targetPrice?: number | null;
}

export interface ListItem {
  productId: string;
  addedAt: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ListItem[];
  createdAt: string;
  updatedAt: string;
}

export interface MarketingPrefs {
  /** Consent to receive marketing emails */
  emailMarketing: boolean;
}

export interface DemoUser {
  username: string;
  name: string;
  surname: string;
  phone: string;
  email: string;
  marketingPrefs: MarketingPrefs;
  loyaltyCards: LoyaltyCard[];
  priceAlerts: PriceAlert[];
  lists: ShoppingList[];
  location?: {
    lat: number;
    lng: number;
    label?: string;
    updatedAt: string;
  } | null;
  onboardingSeen: boolean;
  /** Demo auth — no real backend. Guests can browse; account unlocks lists sync story. */
  signedIn: boolean;
}

export interface AnalyticsEvent {
  id: string;
  event: string;
  props?: Record<string, unknown>;
  at: string;
}
