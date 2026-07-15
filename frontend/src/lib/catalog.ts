import type { Category, Product, RetailerName, RetailerPrice } from "@/types";
import { RETAILERS, type Retailer } from "@/lib/retailers";
import { plausiblePreviousPrice } from "@/lib/price-sanity";

export const CATEGORIES: Category[] = [
  { name: "Toiletries", slug: "toiletries" },
  { name: "Household", slug: "household" },
  { name: "Kids", slug: "kids" },
  { name: "Wine & Bubbles", slug: "wine-bubbles" },
  { name: "Cleaning", slug: "cleaning" },
  { name: "Fruits & Vegetables", slug: "fruits-vegetables" },
  { name: "Meat, Poultry & Fish", slug: "meat-poultry-fish" },
  { name: "Bakery", slug: "bakery" },
  { name: "Milk & Dairy", slug: "milk-dairy" },
  { name: "Pantry", slug: "pantry" },
  { name: "Beverages & Juices", slug: "beverages-juices" },
  { name: "Deli", slug: "deli" },
  { name: "Frozen", slug: "frozen" },
  { name: "Fragrance", slug: "fragrance" },
  { name: "Skincare", slug: "skincare" },
  { name: "Makeup", slug: "makeup" },
  { name: "Haircare", slug: "haircare" },
  { name: "Mens Grooming", slug: "mens-grooming" },
  { name: "Bath and Body", slug: "bath-and-body" },
  { name: "Kids & Baby", slug: "kids-baby" },
  { name: "Cellphones", slug: "cellphones" },
];

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function formatRand(amount: number): string {
  return `R${amount.toFixed(2)}`;
}

export function getAvailablePrices(product: Product): RetailerPrice[] {
  return product.prices.filter((p) => typeof p.price === "number" && p.price > 0);
}

/** Dedupe positive prices by retailer (keep cheapest), sort ascending. */
export function getDedupedAvailablePrices(product: Product): RetailerPrice[] {
  const byRetailer = new Map<RetailerName, RetailerPrice>();
  for (const price of getAvailablePrices(product)) {
    const existing = byRetailer.get(price.retailer);
    if (!existing || price.price < existing.price) {
      byRetailer.set(price.retailer, price);
    }
  }
  return [...byRetailer.values()].sort((a, b) => a.price - b.price);
}

/** Partner retailers with no live price, in stable RETAILERS order. */
export function getUnavailableRetailers(product: Product): Retailer[] {
  const available = new Set(
    getDedupedAvailablePrices(product).map((p) => p.retailer)
  );
  return RETAILERS.filter((r) => !available.has(r.apiName));
}

export function getPriceCoverage(product: Product): {
  available: RetailerPrice[];
  unavailable: Retailer[];
  checkedCount: number;
} {
  const available = getDedupedAvailablePrices(product);
  const unavailable = getUnavailableRetailers(product);
  return {
    available,
    unavailable,
    checkedCount: RETAILERS.length,
  };
}

export function coverageNoteLabel(
  unavailable: Retailer[],
  checkedCount: number
): string {
  if (unavailable.length === 1) {
    return `${unavailable[0].name} unavailable`;
  }
  if (unavailable.length === 2) {
    return `${unavailable[0].name} and ${unavailable[1].name} unavailable`;
  }
  return `Checked ${checkedCount} stores · ${unavailable.length} unavailable`;
}

export function checkedPartnersSentence(): string {
  const names = RETAILERS.map((r) => r.name);
  if (names.length <= 1) return `We checked ${names[0] ?? "our partner stores"}.`;
  const head = names.slice(0, -1).join(", ");
  const last = names[names.length - 1];
  return `We checked ${head}, and ${last}.`;
}

export function getLowestPrice(product: Product): RetailerPrice | null {
  const prices = getAvailablePrices(product);
  if (!prices.length) return null;
  return prices.reduce((best, current) =>
    current.price < best.price ? current : best
  );
}

export function getBestValue(product: Product): RetailerPrice | null {
  const withUnit = getAvailablePrices(product).filter(
    (p) => typeof p.unitPrice === "number" && (p.unitPrice as number) > 0
  );
  if (!withUnit.length) return null;
  return withUnit.reduce((best, current) =>
    (current.unitPrice as number) < (best.unitPrice as number) ? current : best
  );
}

export function getSavingsPercent(price: RetailerPrice): number | null {
  const prev = plausiblePreviousPrice(price.price, price.previousPrice);
  if (prev == null) return null;
  return Math.round(((prev - price.price) / prev) * 100);
}

export function getSavingsAmount(price: RetailerPrice): number | null {
  const prev = plausiblePreviousPrice(price.price, price.previousPrice);
  if (prev == null) return null;
  return prev - price.price;
}
