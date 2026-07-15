import "server-only";

import fs from "fs";
import path from "path";
import type { RawApiProduct } from "@/lib/api/client";
import {
  normalizeSearchResults,
  productNameFromId,
} from "@/lib/api/normalize";
import {
  expandSearchQueries,
  normalizeSearchText,
  productMatchesAllTokens,
  scoreProductRelevance,
} from "@/lib/search-query";
import type { Product } from "@/types";

const INDEX_FILENAME = "barcodeIndex30-06-2026.json";

type BarcodeIndexFile = Record<string, RawApiProduct>;

let productsCache: Product[] | null = null;
let byIdCache: Map<string, Product> | null = null;
let byBarcodeCache: Map<string, Product> | null = null;

function indexPath(): string {
  return path.join(process.cwd(), "data", INDEX_FILENAME);
}

function loadProducts(): Product[] {
  if (productsCache) return productsCache;

  const filePath = indexPath();
  if (!fs.existsSync(filePath)) {
    console.warn(`[local-catalog] missing ${INDEX_FILENAME} at ${filePath}`);
    productsCache = [];
    return productsCache;
  }

  const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as BarcodeIndexFile;
  const rows = Object.values(raw);
  productsCache = normalizeSearchResults(rows);
  byIdCache = new Map(productsCache.map((p) => [p.id, p]));
  byBarcodeCache = new Map();
  for (const p of productsCache) {
    if (p.barcode) byBarcodeCache.set(p.barcode, p);
  }

  console.info(
    `[local-catalog] loaded ${productsCache.length} products from ${INDEX_FILENAME} (${rows.length} raw rows)`
  );
  return productsCache;
}

export function isLocalCatalogForced(): boolean {
  const v = process.env.EASISHOP_USE_LOCAL_CATALOG?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

/** Exact product lookup by id or decoded name. */
export function findLocalProduct(
  id: string,
  name?: string | null
): Product | undefined {
  loadProducts();
  const hit = byIdCache?.get(id);
  if (hit) return hit;
  if (!name) {
    const decoded = productNameFromId(id);
    if (!decoded) return undefined;
    return loadProducts().find(
      (p) => p.name.toLowerCase() === decoded.toLowerCase()
    );
  }
  return loadProducts().find(
    (p) => p.name.toLowerCase() === name.toLowerCase()
  );
}

/**
 * Search the offline barcode index (name tokens + exact barcode).
 * Uses the same normalisation / apostrophe handling as `searchProducts`
 * (e.g. "lays" ↔ "Lay's").
 */
export function searchLocalCatalog(query: string, limit = 48): Product[] {
  const q = query.trim();
  if (!q) return [];

  const products = loadProducts();
  if (!products.length) return [];

  const byBarcode = byBarcodeCache?.get(q);
  if (byBarcode) return [byBarcode];

  const variants = expandSearchQueries(q);
  const scored: { product: Product; score: number }[] = [];

  for (const product of products) {
    let best = 0;
    for (const variant of variants) {
      const score = scoreProductRelevance(product, variant);
      if (score > best) best = score;
    }

    // Fallback: every token matches with apostrophe-insensitive compare
    if (best < 25 && productMatchesAllTokens(product.name, q)) {
      best = Math.max(best, 60);
    }

    if (best < 25) continue;

    // Prefer titles that start with the bare query (lays → Lay's …)
    const nameBare = normalizeSearchText(product.name).replace(/'/g, "");
    const qBare = normalizeSearchText(q).replace(/'/g, "");
    if (qBare && nameBare.startsWith(qBare)) best += 35;

    scored.push({ product, score: best });
  }

  scored.sort(
    (a, b) =>
      b.score - a.score || a.product.name.localeCompare(b.product.name)
  );
  return scored.slice(0, limit).map((s) => s.product);
}

/** All local products (for deals / sampling). Prefer filters on top. */
export function getLocalCatalogProducts(): Product[] {
  return loadProducts();
}

export type LocalSuggestHit = {
  id: string;
  name: string;
  image: string | null;
};

function barePrefixMatch(name: string, query: string): boolean {
  const nameBare = normalizeSearchText(name).replace(/'/g, "");
  const qBare = normalizeSearchText(query).replace(/'/g, "");
  return Boolean(qBare) && nameBare.startsWith(qBare);
}

/**
 * Lightweight typeahead hits for desktop search suggestions.
 * Same query normalisation as full search (Lay's / lays, etc.).
 */
export function suggestLocalCatalog(
  query: string,
  limit = 8
): LocalSuggestHit[] {
  const q = query.trim();
  if (q.length < 2) return [];

  if (!normalizeSearchText(q)) return [];

  const ranked = searchLocalCatalog(q, Math.max(limit * 4, 32));
  const prefix: LocalSuggestHit[] = [];
  const rest: LocalSuggestHit[] = [];

  for (const product of ranked) {
    const hit = {
      id: product.id,
      name: product.name,
      image: product.image,
    };
    if (barePrefixMatch(product.name, q)) {
      prefix.push(hit);
    } else {
      rest.push(hit);
    }
    if (prefix.length + rest.length >= limit * 2) break;
  }

  return [...prefix, ...rest].slice(0, limit);
}
