/**
 * DEMO ONLY — precompute barcode → aisle using product knowledge classifier.
 *
 * From frontend/:
 *   npx tsx scripts/build-demo-categories.mjs
 *
 * Optional enrichment (slow):
 *   OPEN_FOOD_FACTS=1 OFF_BUDGET=200 npx tsx scripts/build-demo-categories.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { classifyProductToAisle } from "../src/lib/demo-product-knowledge.ts";
import { CATEGORIES } from "../src/lib/catalog.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const indexPath = path.join(root, "data", "barcodeIndex30-06-2026.json");
const outPath = path.join(root, "data", "demo-category-by-barcode.json");

/** Map Open Food Facts English category tags → our aisle slugs. */
function mapOffCategories(tags, categoriesText) {
  const blob = `${(tags || []).join(" ")} ${categoriesText || ""}`.toLowerCase();
  const rules = [
    ["wine-bubbles", ["wines", "beers", "ciders", "alcoholic beverages"]],
    ["milk-dairy", ["dairies", "milks", "yogurts", "cheeses", "butters", "cream"]],
    ["meat-poultry-fish", ["meats", "poultry", "fishes", "seafoods"]],
    ["frozen", ["frozen foods", "ice creams"]],
    ["bakery", ["breads", "biscuits", "pastries", "cakes"]],
    ["fruits-vegetables", ["fruits", "vegetables", "fresh plant"]],
    ["beverages-juices", ["beverages", "sodas", "juices", "waters", "teas", "coffees"]],
    ["cleaning", ["cleaning", "laundry", "dishwashing"]],
    ["household", ["household", "paper"]],
    ["toiletries", ["oral care", "toothpastes", "deodorants", "feminine"]],
    ["haircare", ["hair", "shampoos"]],
    ["skincare", ["skin care", "facial care", "body care"]],
    ["makeup", ["make-up", "makeup", "lipstick"]],
    ["fragrance", ["perfumes", "eau de"]],
    ["bath-and-body", ["soaps", "shower gels", "bath"]],
    ["kids-baby", ["baby foods", "baby milks", "nappies", "diapers"]],
    ["pantry", ["groceries", "pastas", "rices", "sauces", "breakfast cereals", "chocolates", "snacks", "sweets"]],
  ];
  for (const [slug, needles] of rules) {
    if (needles.some((n) => blob.includes(n))) return slug;
  }
  return null;
}

async function lookupOpenFoodFacts(barcode) {
  const url = `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(
    barcode
  )}?fields=product_name,categories_tags_en,categories`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "EasiShopUIDemo/1.0 (demo category builder; local use)",
    },
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (data.status !== 1 || !data.product) return null;
  const tags = data.product.categories_tags_en || [];
  const slug = mapOffCategories(tags, data.product.categories || "");
  if (!slug) return null;
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return null;
  return { slug: cat.slug, name: cat.name, source: "openfoodfacts" };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
const entries = Object.entries(index);
const byBarcode = {};
const counts = { knowledge: 0, openfoodfacts: 0, unknown: 0 };
const useOff = process.env.OPEN_FOOD_FACTS === "1";
const offBudget = Number(process.env.OFF_BUDGET || 250);

const unknowns = [];

for (const [barcode, row] of entries) {
  const local = classifyProductToAisle(row.name);
  if (local) {
    byBarcode[barcode] = { ...local, source: "knowledge" };
    counts.knowledge++;
  } else {
    unknowns.push({ barcode, name: row.name });
    counts.unknown++;
  }
}

if (useOff) {
  console.log(
    `Enriching up to ${offBudget} unknowns via Open Food Facts (${unknowns.length} unknown)…`
  );
  let offUsed = 0;
  for (const item of unknowns) {
    if (offUsed >= offBudget) break;
    if (!/^\d{8,14}$/.test(String(item.barcode))) continue;
    try {
      const hit = await lookupOpenFoodFacts(item.barcode);
      offUsed++;
      if (hit) {
        byBarcode[item.barcode] = hit;
        counts.openfoodfacts++;
        counts.unknown--;
      }
    } catch {
      // ignore
    }
    await sleep(120);
  }
}

const aisleCounts = {};
for (const v of Object.values(byBarcode)) {
  aisleCounts[v.slug] = (aisleCounts[v.slug] || 0) + 1;
}

const payload = {
  generatedAt: new Date().toISOString(),
  note: "DEMO ONLY — barcode→aisle from brand/product knowledge (+ optional Open Food Facts). Not shown as UI copy.",
  sourceIndex: "barcodeIndex30-06-2026.json",
  totalProducts: entries.length,
  classified: Object.keys(byBarcode).length,
  counts,
  aisleCounts,
  byBarcode,
};

fs.writeFileSync(outPath, JSON.stringify(payload));
console.log(
  `Wrote ${outPath} — classified ${payload.classified}/${payload.totalProducts}`,
  counts
);
console.log("Aisle counts:", aisleCounts);
