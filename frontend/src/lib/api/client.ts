import "server-only";

const BASE_URL =
  process.env.EASISHOP_API_URL ?? "https://www.easishop.co.za/api/v1";

export function getApiAuthHeader(): string {
  const username =
    process.env.EASISHOP_API_USERNAME ?? process.env.username ?? "";
  const password =
    process.env.EASISHOP_API_PASSWORD ?? process.env.password ?? "";

  if (!username || !password) {
    throw new Error(
      "Missing API credentials. Set EASISHOP_API_USERNAME and EASISHOP_API_PASSWORD in .env"
    );
  }

  return `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        Authorization: getApiAuthHeader(),
        "Content-Type": "application/json",
        ...init?.headers,
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`EasiShop API ${path} failed: ${res.status} ${text}`);
    }

    return res.json() as Promise<T>;
  } finally {
    clearTimeout(timeout);
  }
}

export async function apiSearch(query: string) {
  return apiFetch<{ products: RawApiProduct[] }>("/search", {
    method: "POST",
    body: JSON.stringify({ query }),
  });
}

export async function apiPriceChangesLastWeek() {
  return apiFetch<RawApiProduct[] | { products?: RawApiProduct[] }>(
    "/analytics/price-changes/last-week"
  );
}

export type RawApiProduct = Record<string, string | boolean | null | undefined>;
