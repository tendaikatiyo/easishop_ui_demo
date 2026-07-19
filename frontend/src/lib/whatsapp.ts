/**
 * WhatsApp number helpers — international (E.164-style) validation.
 */

/** Strip spaces, dashes, parentheses; keep leading + / digits. */
export function normalizeWhatsAppInput(raw: string): string {
  const trimmed = raw.trim();
  const hasPlus = trimmed.startsWith("+");
  const has00 = /^00\d/.test(trimmed.replace(/[\s\-().]/g, ""));
  const digits = trimmed.replace(/\D/g, "");
  if (hasPlus || has00) {
    const national = has00 ? digits.replace(/^00/, "") : digits;
    return national ? `+${national}` : "";
  }
  return digits;
}

/**
 * Valid WhatsApp / E.164 mobile: + and 8–15 digits total, country code
 * does not start with 0.
 */
export function isValidWhatsAppNumber(raw: string): boolean {
  const normalized = normalizeWhatsAppInput(raw);
  return /^\+[1-9]\d{7,14}$/.test(normalized);
}

export function whatsAppValidationError(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return "Enter your WhatsApp number";

  const compact = trimmed.replace(/[\s\-().]/g, "");
  const looksLocal =
    !compact.startsWith("+") &&
    !compact.startsWith("00") &&
    /^\d+$/.test(compact);

  if (looksLocal) {
    return "Include a country code, e.g. +27 82 123 4567";
  }

  if (!isValidWhatsAppNumber(trimmed)) {
    return "Use international format, e.g. +27821234567";
  }

  return null;
}
