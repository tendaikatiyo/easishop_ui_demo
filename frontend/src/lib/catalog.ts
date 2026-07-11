import type { LucideIcon } from "lucide-react";
import {
  Apple,
  Baby,
  Bath,
  Beef,
  Cookie,
  Croissant,
  Droplets,
  Flower2,
  Grape,
  HeartPulse,
  Home,
  Milk,
  Package,
  Phone,
  Sandwich,
  Shirt,
  ShowerHead,
  Snowflake,
  Sparkles,
  SprayCan,
  Wine,
} from "lucide-react";
import type { Category, Product, RetailerPrice } from "@/types";

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

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  toiletries: Droplets,
  household: Home,
  kids: Cookie,
  "wine-bubbles": Wine,
  cleaning: Sparkles,
  "fruits-vegetables": Apple,
  "meat-poultry-fish": Beef,
  bakery: Croissant,
  "milk-dairy": Milk,
  pantry: Package,
  "beverages-juices": Grape,
  deli: Sandwich,
  frozen: Snowflake,
  fragrance: Flower2,
  skincare: HeartPulse,
  makeup: SprayCan,
  haircare: ShowerHead,
  "mens-grooming": Shirt,
  "bath-and-body": Bath,
  "kids-baby": Baby,
  cellphones: Phone,
};

export const DEFAULT_CATEGORY_ICON: LucideIcon = Package;

export function getCategoryIcon(slug: string): LucideIcon {
  return CATEGORY_ICONS[slug] ?? DEFAULT_CATEGORY_ICON;
}

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
  if (!price.previousPrice || price.previousPrice <= price.price) return null;
  return Math.round(
    ((price.previousPrice - price.price) / price.previousPrice) * 100
  );
}

export function getSavingsAmount(price: RetailerPrice): number | null {
  if (!price.previousPrice || price.previousPrice <= price.price) return null;
  return price.previousPrice - price.price;
}
