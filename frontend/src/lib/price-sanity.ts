/**
 * Shared price sanity checks for scraped / barcode-index values.
 * Kept free of other lib imports to avoid circular deps.
 */

/** Reject scrape/index anomalies (e.g. Sparletta 2L Shoprite prev R209.99 vs ~R18). */
export function plausiblePreviousPrice(
  price: number,
  previousPrice: number | null
): number | null {
  if (previousPrice == null || previousPrice <= price) return null;
  const save = previousPrice - price;
  const ratio = previousPrice / price;

  if (ratio > 2.5) return null;
  if (price < 80 && save > 50) return null;
  if (price < 150 && save > 120) return null;
  if (ratio > 3) return null;

  return previousPrice;
}
