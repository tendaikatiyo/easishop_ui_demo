import { slugify } from "@/lib/catalog";
import type { Product, RetailerName, RetailerPrice } from "@/types";
import type { RawApiProduct } from "@/lib/api/client";

const RETAILER_MAP = [
  { code: "chk", name: "Checkers" as RetailerName, imageBase: "https://www.checkers.co.za" },
  { code: "dsc", name: "Dischem" as RetailerName, imageBase: "https://www.dischem.co.za" },
  { code: "pnp", name: "Pick n Pay" as RetailerName, imageBase: "https://www.pnp.co.za" },
  { code: "srt", name: "Shoprite" as RetailerName, imageBase: "https://www.shoprite.co.za" },
  { code: "woo", name: "Woolworths" as RetailerName, imageBase: "https://www.woolworths.co.za" },
];

export function productIdFromName(name: string): string {
  return `p-${Buffer.from(name, "utf8").toString("base64url")}`;
}

export function productNameFromId(id: string): string | null {
  if (!id.startsWith("p-")) return null;
  try {
    return Buffer.from(id.slice(2), "base64url").toString("utf8");
  } catch {
    return null;
  }
}

function parsePrice(val: unknown): number | null {
  if (val == null || val === "N/A" || val === "") return null;
  const n = Number(String(val).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

function resolveImageUrl(
  image: string | null | undefined,
  base?: string
): string | null {
  if (!image || image === "N/A") return null;
  if (/^https?:\/\//i.test(image)) return image;
  if (image.startsWith("/") && base) return `${base}${image}`;
  return null;
}

export function normalizeApiProduct(
  raw: RawApiProduct,
  category = "General",
  categorySlug = "general"
): Product | null {
  const name = String(raw.name ?? "").trim();
  if (!name) return null;

  const prices: RetailerPrice[] = [];

  for (const r of RETAILER_MAP) {
    const price = parsePrice(raw[r.code]);
    if (price == null) continue;

    const imgRaw = raw[`${r.code}_image`];
    const urlRaw = raw[`${r.code}_url`];
    const prevRaw = raw[`${r.code}_prev`];

    prices.push({
      retailer: r.name,
      price,
      previousPrice: parsePrice(prevRaw),
      url: urlRaw && urlRaw !== "N/A" ? String(urlRaw) : null,
      image: resolveImageUrl(
        imgRaw != null ? String(imgRaw) : null,
        r.imageBase
      ),
      unitPrice: null,
      unitLabel: null,
    });
  }

  if (!prices.length) return null;

  const imageCandidates = prices
    .map((p) => p.image)
    .filter((img): img is string => !!img);
  const image = imageCandidates[0] ?? null;
  if (!image) return null;

  return {
    id: productIdFromName(name),
    name,
    category,
    categorySlug,
    image,
    barcode:
      raw.barcode && raw.barcode !== "N/A" ? String(raw.barcode) : null,
    prices,
  };
}

export function normalizeSearchResults(
  rawProducts: RawApiProduct[],
  category?: { name: string; slug: string }
): Product[] {
  const catName = category?.name ?? "General";
  const catSlug = category?.slug ?? "general";
  const byName = new Map<string, Product>();

  for (const raw of rawProducts) {
    const product = normalizeApiProduct(raw, catName, catSlug);
    if (product) byName.set(product.name, product);
  }

  return [...byName.values()];
}

export const CATEGORY_SEARCH_QUERIES: Record<string, string[]> = {
  toiletries: ["toothpaste", "deodorant"],
  household: ["detergent", "paper towels"],
  kids: ["cereal", "yoghurt"],
  "wine-bubbles": ["wine"],
  cleaning: ["cleaner", "detergent"],
  "fruits-vegetables": ["banana", "tomato", "apple"],
  "meat-poultry-fish": ["chicken", "mince"],
  bakery: ["bread"],
  "milk-dairy": ["milk", "eggs", "cheese"],
  pantry: ["rice", "pasta", "oil"],
  "beverages-juices": ["coffee", "juice"],
  deli: ["ham", "mayo"],
  frozen: ["frozen"],
  fragrance: ["perfume"],
  skincare: ["cream"],
  makeup: ["lipstick"],
  haircare: ["shampoo"],
  "mens-grooming": ["razor"],
  "bath-and-body": ["soap", "body wash"],
  "kids-baby": ["nappies", "wipes"],
  cellphones: ["cable"],
};

export function inferCategoryFromQuery(query: string): {
  name: string;
  slug: string;
} | null {
  const q = query.toLowerCase();
  for (const [slug, queries] of Object.entries(CATEGORY_SEARCH_QUERIES)) {
    if (queries.some((term) => q.includes(term))) {
      const name = slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      return { name, slug };
    }
  }
  return null;
}

export function slugifyCategory(name: string): string {
  return slugify(name);
}
