export type RetailerName =
  | "Checkers"
  | "Dischem"
  | "Pick n Pay"
  | "Shoprite"
  | "Woolworths";

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
