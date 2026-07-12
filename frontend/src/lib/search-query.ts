import type { Product } from "@/types";

/** Lowercase, unify apostrophes, collapse whitespace for matching. */
export function normalizeSearchText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u2018\u2019`]/g, "'")
    .replace(/[^a-z0-9\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Lay's-style brands: Lays → Lay's (single trailing s, no existing apostrophe). */
function apostropheVariants(term: string): string[] {
  const variants = [term];
  if (
    !/['']/.test(term) &&
    /^[A-Za-z]{2,}s$/i.test(term) &&
    term.length <= 12
  ) {
    variants.push(term.replace(/s$/i, "'s"));
  }
  return variants;
}

/**
 * The live API matches literally on the query string — punctuation and
 * multi-word phrasing matter a lot. Generate sensible variants to try.
 */
export function expandSearchQueries(query: string): string[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const variants = new Set<string>([trimmed]);
  const words = trimmed.split(/\s+/).filter(Boolean);

  for (const v of apostropheVariants(trimmed)) variants.add(v);

  const stripped = trimmed.replace(/[''`\u2018\u2019]/g, "");
  if (stripped !== trimmed) variants.add(stripped);

  if (words.length > 1) {
    for (const fv of apostropheVariants(words[0])) {
      variants.add([fv, ...words.slice(1)].join(" "));
    }
    variants.add(words[0]);
    for (const fv of apostropheVariants(words[0])) variants.add(fv);
  }

  return [...variants];
}

function tokenMatchesInName(name: string, token: string): boolean {
  const bare = token.replace(/'/g, "");
  if (bare.length < 2) return false;

  const normalized = normalizeSearchText(name).replace(/'/g, "");
  const padded = ` ${normalized} `;

  return (
    padded.includes(` ${bare} `) ||
    normalized.startsWith(`${bare} `) ||
    normalized.endsWith(` ${bare}`) ||
    normalized === bare
  );
}

export function productMatchesAllTokens(name: string, query: string): boolean {
  const tokens = normalizeSearchText(query)
    .split(" ")
    .filter((t) => t.length > 1);

  if (!tokens.length) return true;

  return tokens.every((token) => tokenMatchesInName(name, token));
}

export function scoreProductRelevance(product: Product, query: string): number {
  const name = normalizeSearchText(product.name);
  const nameBare = name.replace(/'/g, "");
  const q = normalizeSearchText(query);
  const qBare = q.replace(/'/g, "");

  if (!q) return 0;
  if (name === q || nameBare === qBare) return 100;

  const tokens = q.split(" ").filter((t) => t.length > 1);
  if (!tokens.length) return 0;

  const matched = tokens.filter((token) =>
    tokenMatchesInName(product.name, token)
  ).length;

  if (matched === tokens.length) return 85;
  return Math.round((matched / tokens.length) * 70);
}

export function rankSearchResults(products: Product[], query: string): Product[] {
  const scored = products
    .map((product) => ({
      product,
      score: scoreProductRelevance(product, query),
    }))
    .sort((a, b) => b.score - a.score);

  const hasStrong = scored.some((row) => row.score >= 50);
  const filtered = hasStrong
    ? scored.filter((row) => row.score >= 25)
    : scored;

  return filtered.map((row) => row.product);
}
