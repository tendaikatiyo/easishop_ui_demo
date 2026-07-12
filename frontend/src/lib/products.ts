import "server-only";

import { cache } from "react";
import { CATEGORIES } from "@/lib/catalog";
import { apiPriceChangesLastWeek, apiSearch } from "@/lib/api/client";
import {
  CATEGORY_SEARCH_QUERIES,
  normalizeSearchResults,
  productIdFromName,
  productNameFromId,
} from "@/lib/api/normalize";
import type { Product } from "@/types";
import type { RawApiProduct } from "@/lib/api/client";
import {
  expandSearchQueries,
  productMatchesAllTokens,
  rankSearchResults,
} from "@/lib/search-query";

const FEATURED_QUERIES = ["milk", "bread", "chicken", "coffee"];

export const searchApi = cache(async (query: string): Promise<Product[]> => {
  const q = query.trim();
  if (!q) return [];
  try {
    const data = await apiSearch(q);
    return normalizeSearchResults(data.products ?? []);
  } catch {
    return [];
  }
});

async function searchCategory(slug: string): Promise<Product[]> {
  const queries = CATEGORY_SEARCH_QUERIES[slug] ?? [slug.replace(/-/g, " ")];
  const category = CATEGORIES.find((c) => c.slug === slug);
  const byName = new Map<string, Product>();

  for (const q of queries.slice(0, 3)) {
    const data = await apiSearch(q);
    const normalized = normalizeSearchResults(
      data.products ?? [],
      category ? { name: category.name, slug: category.slug } : undefined
    );
    for (const p of normalized) {
      if (!byName.has(p.name)) byName.set(p.name, p);
    }
  }

  return [...byName.values()].slice(0, 48);
}

function extractRawProducts(
  payload: RawApiProduct[] | { products?: RawApiProduct[] }
): RawApiProduct[] {
  if (Array.isArray(payload)) return payload;
  return payload.products ?? [];
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.trim();
  if (!q) return [];

  const variants = expandSearchQueries(q);
  const byName = new Map<string, Product>();

  await Promise.all(
    variants.map(async (variant) => {
      const results = await searchApi(variant);
      for (const product of results) {
        if (!byName.has(product.name)) byName.set(product.name, product);
      }
    })
  );

  let products = [...byName.values()];

  const words = q.split(/\s+/).filter((w) => w.length > 1);
  if (words.length > 1) {
    const strict = products.filter((p) => productMatchesAllTokens(p.name, q));
    if (strict.length) products = strict;
  }

  return rankSearchResults(products, q);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const name = productNameFromId(id);
  if (!name) return undefined;

  const results = await searchApi(name.split(" ")[0] ?? name);
  return (
    results.find((p) => p.id === id || p.name === name) ??
    results.find((p) => p.name.toLowerCase() === name.toLowerCase())
  );
}

export async function getProductsByIds(
  ids: string[]
): Promise<Record<string, Product>> {
  const map: Record<string, Product> = {};
  await Promise.all(
    ids.map(async (id) => {
      const product = await getProductById(id);
      if (product) map[id] = product;
    })
  );
  return map;
}

export async function getProductsByCategory(
  slug: string
): Promise<Product[]> {
  return searchCategory(slug);
}

export async function getProductsByBarcode(
  barcode: string
): Promise<Product[]> {
  const results = await searchApi(barcode);
  return results.filter((p) => p.barcode === barcode);
}

export async function getDeals(): Promise<Product[]> {
  try {
    const payload = await apiPriceChangesLastWeek();
    const raw = extractRawProducts(payload);
    const fromApi = normalizeSearchResults(raw).filter((p) =>
      p.prices.some(
        (price) =>
          price.previousPrice != null && price.previousPrice > price.price
      )
    );
    if (fromApi.length) return fromApi;
  } catch {
    // fall through to search-based deals
  }

  const terms = ["milk", "bread", "chicken", "shampoo", "wine"];
  const byName = new Map<string, Product>();

  for (const term of terms) {
    const results = await searchApi(term);
    for (const p of results) {
      const hasDeal = p.prices.some(
        (price) =>
          price.previousPrice != null && price.previousPrice > price.price
      );
      if (hasDeal && !byName.has(p.name)) byName.set(p.name, p);
    }
  }

  return [...byName.values()];
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const byName = new Map<string, Product>();

  for (const term of FEATURED_QUERIES) {
    const results = await searchApi(term);
    for (const p of results) {
      if (!byName.has(p.name)) byName.set(p.name, p);
      if (byName.size >= limit) break;
    }
    if (byName.size >= limit) break;
  }

  return [...byName.values()].slice(0, limit);
}

export function getCategoryBySlug(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

// Ensure list items saved with name-based lookup still resolve
export { productIdFromName };
