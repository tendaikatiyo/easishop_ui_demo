/**
 * Pull real products from EasiShop API into data/demo-products.json
 * Usage: node scripts/extract-demo-sample.mjs
 * Reads username/password from .env
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function loadEnv() {
  const raw = fs.readFileSync(path.join(root, ".env"), "utf8");
  const env = {};
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([a-zA-Z_][\w]*)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2].trim();
  }
  if (!env.username || !env.password) {
    throw new Error("Missing username/password in .env");
  }
  return env;
}

const categoryQueries = {
  "Milk & Dairy": ["milk", "yoghurt", "cheese", "eggs"],
  Bakery: ["bread", "rolls"],
  Pantry: ["rice", "oil", "sugar", "pasta"],
  "Beverages & Juices": ["coffee", "juice", "tea"],
  Toiletries: ["toothpaste", "deodorant"],
  Haircare: ["shampoo"],
  Cleaning: ["detergent", "cleaner"],
  "Meat, Poultry & Fish": ["chicken", "mince"],
  "Fruits & Vegetables": ["banana", "tomato", "apple"],
  Skincare: ["cream", "serum"],
  "Bath and Body": ["soap", "body wash"],
  Frozen: ["frozen"],
  "Kids & Baby": ["nappies", "wipes"],
  "Wine & Bubbles": ["wine"],
};

const retailerMap = [
  { code: "chk", name: "Checkers" },
  { code: "dsc", name: "Dischem" },
  { code: "pnp", name: "Pick n Pay" },
  { code: "srt", name: "Shoprite" },
  { code: "woo", name: "Woolworths" },
];

function slugify(name) {
  return String(name)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parsePrice(val) {
  if (val == null || val === "N/A" || val === "") return null;
  const n = Number(String(val).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

function resolveImage(raw, prices) {
  // Prefer absolute URLs from any retailer field
  const candidates = [];
  for (const r of retailerMap) {
    const img = raw[`${r.code}_image`];
    if (img && img !== "N/A") candidates.push(String(img));
  }
  for (const p of prices) {
    if (p.image) candidates.push(p.image);
  }

  return candidates.find((img) => /^https?:\/\//i.test(img)) ?? null;
}

async function search(auth, query) {
  const res = await fetch("https://www.easishop.co.za/api/v1/search", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) {
    console.warn(`  search "${query}" failed: HTTP ${res.status}`);
    return [];
  }
  const data = await res.json();
  return Array.isArray(data.products) ? data.products : [];
}

function normalize(raw, category) {
  const prices = [];
  for (const r of retailerMap) {
    const price = parsePrice(raw[r.code]);
    if (price == null) continue;
    const prev = parsePrice(raw[`${r.code}_prev`]);
    const url = raw[`${r.code}_url`];
    const image = raw[`${r.code}_image`];
    prices.push({
      retailer: r.name,
      price,
      previousPrice: prev,
      url: url && url !== "N/A" ? String(url) : null,
      image: image && image !== "N/A" ? String(image) : null,
      unitPrice: null,
      unitLabel: null,
    });
  }
  if (!prices.length) return null;

  const image = resolveImage(raw, prices);
  // Only keep products with a usable absolute image URL for the demo UI
  if (!image) return null;

  return {
    name: String(raw.name),
    category,
    categorySlug: slugify(category),
    image,
    barcode: null,
    prices,
  };
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function main() {
  const { username, password } = loadEnv();
  const auth = Buffer.from(`${username}:${password}`).toString("base64");

  const byName = new Map();

  for (const [category, queries] of Object.entries(categoryQueries)) {
    for (const q of queries) {
      process.stdout.write(`Searching [${category}]: ${q}\n`);
      const products = await search(auth, q);
      console.log(`  got ${products.length}`);
      for (const p of products) {
        const n = normalize(p, category);
        if (!n) continue;
        if (!byName.has(n.name)) byName.set(n.name, n);
      }
    }
  }

  const usable = [...byName.values()];
  console.log(`Unique usable products: ${usable.length}`);

  // Prefer coverage: take up to ~8 per category, then fill to 100
  const byCat = new Map();
  for (const p of usable) {
    if (!byCat.has(p.category)) byCat.set(p.category, []);
    byCat.get(p.category).push(p);
  }

  const sample = [];
  for (const [, list] of byCat) {
    sample.push(...shuffle(list).slice(0, 8));
  }
  if (sample.length < 100) {
    const have = new Set(sample.map((p) => p.name));
    for (const p of shuffle(usable)) {
      if (have.has(p.name)) continue;
      sample.push(p);
      have.add(p.name);
      if (sample.length >= 100) break;
    }
  }

  sample.sort((a, b) => a.name.localeCompare(b.name));
  const products = sample.map((p, i) => ({
    id: `prod-${String(i + 1).padStart(3, "0")}`,
    ...p,
  }));

  const out = {
    generatedAt: new Date().toISOString(),
    source: "https://www.easishop.co.za/api/v1",
    note: "Real product sample extracted from the live API for UI demo.",
    sampleSize: products.length,
    products,
  };

  const outPath = path.join(root, "data", "demo-products.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log(`Wrote ${outPath} (${products.length} products)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
