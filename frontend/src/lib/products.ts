import demoData from "../../data/demo-products.json";
import { CATEGORIES } from "@/lib/catalog";
import type { Product } from "@/types";

const products = demoData.products as Product[];

export function getAllProducts(): Product[] {
  return products;
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(slug: string): Product[] {
  return products.filter((p) => p.categorySlug === slug);
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return products;
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.barcode && p.barcode.includes(q))
  );
}

export function getDeals(): Product[] {
  return products.filter((p) =>
    p.prices.some(
      (price) =>
        price.previousPrice != null && price.previousPrice > price.price
    )
  );
}

export function getFeaturedProducts(limit = 8): Product[] {
  return products.slice(0, limit);
}

export function getCategoryBySlug(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getProductsByBarcode(barcode: string): Product[] {
  const code = barcode.trim();
  return products.filter((p) => p.barcode === code);
}
