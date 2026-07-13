export type RetailerName =
  | "Checkers"
  | "Dischem"
  | "Pick n Pay"
  | "Shoprite"
  | "Woolworths";

export type Retailer = {
  slug: string;
  /** Display label in UI */
  name: string;
  /** Name as returned by the API / normalizer */
  apiName: RetailerName;
  logo: string;
  blurb: string;
};

export const RETAILERS: Retailer[] = [
  {
    slug: "checkers",
    name: "Checkers",
    apiName: "Checkers",
    logo: "/retailers/checkers.webp",
    blurb: "Groceries & household",
  },
  {
    slug: "pick-n-pay",
    name: "Pick n Pay",
    apiName: "Pick n Pay",
    logo: "/retailers/pnp.webp",
    blurb: "Everyday essentials",
  },
  {
    slug: "shoprite",
    name: "Shoprite",
    apiName: "Shoprite",
    logo: "/retailers/shoprite.webp",
    blurb: "Value shopping",
  },
  {
    slug: "woolworths",
    name: "Woolworths",
    apiName: "Woolworths",
    logo: "/retailers/woolworths.webp",
    blurb: "Food & fashion",
  },
  {
    slug: "dischem",
    name: "Dis-Chem",
    apiName: "Dischem",
    logo: "/retailers/dischem.webp",
    blurb: "Pharmacy & beauty",
  },
];

export const RETAILER_LOGOS: Record<RetailerName, string> = {
  Checkers: "/retailers/checkers.webp",
  Dischem: "/retailers/dischem.webp",
  "Pick n Pay": "/retailers/pnp.webp",
  Shoprite: "/retailers/shoprite.webp",
  Woolworths: "/retailers/woolworths.webp",
};

export function getRetailerLogo(retailer: string): string | null {
  return RETAILER_LOGOS[retailer as RetailerName] ?? null;
}

export function getRetailerBySlug(slug: string): Retailer | undefined {
  return RETAILERS.find((r) => r.slug === slug);
}
