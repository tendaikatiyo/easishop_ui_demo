/**
 * DEMO ONLY — offline barcode-index helpers for category aisles and top deals.
 *
 * Classification uses brand/product knowledge (`demo-product-knowledge.ts`) and
 * an optional precomputed barcode map (`data/demo-category-by-barcode.json`),
 * NOT naïve name-substring guesses. Not production taxonomy.
 */
import "server-only";

import fs from "fs";
import path from "path";
import { CATEGORIES, getSavingsAmount } from "@/lib/catalog";
import { getLocalCatalogProducts } from "@/lib/local-catalog";
import {
  classifyProductToAisle,
  inferDemoCategory,
} from "@/lib/demo-product-knowledge";
import type { Product } from "@/types";

type BarcodeCategoryMapFile = {
  byBarcode?: Record<string, { slug: string; name: string; source?: string }>;
};

let barcodeMapCache: Map<string, { name: string; slug: string }> | null =
  null;

function loadBarcodeCategoryMap(): Map<string, { name: string; slug: string }> {
  if (barcodeMapCache) return barcodeMapCache;
  barcodeMapCache = new Map();
  const filePath = path.join(
    process.cwd(),
    "data",
    "demo-category-by-barcode.json"
  );
  if (!fs.existsSync(filePath)) return barcodeMapCache;
  try {
    const raw = JSON.parse(
      fs.readFileSync(filePath, "utf8")
    ) as BarcodeCategoryMapFile;
    for (const [barcode, meta] of Object.entries(raw.byBarcode ?? {})) {
      if (meta?.slug && meta?.name) {
        barcodeMapCache.set(barcode, { slug: meta.slug, name: meta.name });
      }
    }
  } catch (err) {
    console.warn("[demo-catalog] failed to load barcode category map", err);
  }
  return barcodeMapCache;
}

function categoryMeta(slug: string): { name: string; slug: string } | null {
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return null;
  return { name: cat.name, slug: cat.slug };
}

/** DEMO ONLY — resolve aisle from barcode map, else product knowledge. */
export function resolveDemoCategory(product: {
  name: string;
  barcode?: string | null;
}): { name: string; slug: string } | null {
  if (product.barcode) {
    const mapped = loadBarcodeCategoryMap().get(product.barcode);
    if (mapped) return mapped;
  }
  return classifyProductToAisle(product.name);
}

export { inferDemoCategory, classifyProductToAisle };

function withDemoCategory(product: Product): Product {
  const inferred = resolveDemoCategory(product);
  if (!inferred) return product;
  return {
    ...product,
    category: inferred.name,
    categorySlug: inferred.slug,
  };
}

function maxRandSaving(product: Product): number {
  return Math.max(0, ...product.prices.map((p) => getSavingsAmount(p) ?? 0));
}

function hasPriceDrop(product: Product): boolean {
  return product.prices.some(
    (p) => p.previousPrice != null && p.previousPrice > p.price
  );
}

/**
 * DEMO ONLY — products for an aisle from the offline index, classified by
 * product/brand knowledge (and barcode map when present).
 */
export function getDemoProductsByCategory(
  slug: string,
  limit = 48
): Product[] {
  const meta = categoryMeta(slug);
  if (!meta) return [];

  const matches: Product[] = [];
  for (const product of getLocalCatalogProducts()) {
    const resolved = resolveDemoCategory(product);
    if (!resolved || resolved.slug !== slug) continue;
    matches.push({
      ...product,
      category: meta.name,
      categorySlug: meta.slug,
    });
    if (matches.length >= limit) break;
  }

  return matches;
}

/**
 * DEMO ONLY — biggest Rand price drops from the offline index for Top deals.
 * Prefers grocery / beauty / home aisles.
 */
export function getDemoBiggestDeals(limit = 48): Product[] {
  const aisleSlugs = new Set([
    "milk-dairy",
    "bakery",
    "pantry",
    "beverages-juices",
    "fruits-vegetables",
    "meat-poultry-fish",
    "deli",
    "frozen",
    "wine-bubbles",
    "toiletries",
    "skincare",
    "makeup",
    "haircare",
    "fragrance",
    "bath-and-body",
    "mens-grooming",
    "kids-baby",
    "kids",
    "cleaning",
    "household",
  ]);

  const deals = getLocalCatalogProducts()
    .filter(hasPriceDrop)
    .map(withDemoCategory)
    .filter((product) => aisleSlugs.has(product.categorySlug))
    .map((product) => {
      const amount = maxRandSaving(product);
      const percent = Math.max(
        0,
        ...product.prices.map((p) => {
          if (!p.previousPrice || p.previousPrice <= p.price) return 0;
          return ((p.previousPrice - p.price) / p.previousPrice) * 100;
        })
      );
      return { product, amount, percent };
    })
    .filter((d) => d.amount >= 1)
    .sort(
      (a, b) =>
        b.amount - a.amount ||
        b.percent - a.percent ||
        a.product.name.localeCompare(b.product.name)
    );

  return deals.slice(0, limit).map((d) => d.product);
}

export const DEMO_CATALOG_NOTE =
  "Demo only — offline catalog classified by product/brand knowledge (and optional Open Food Facts). Do not surface this copy in the UI.";
