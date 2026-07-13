export type ProfileFields = {
  username: string;
  name: string;
  surname: string;
  phone: string;
  email: string;
};

export type ProfileFieldErrors = Partial<Record<keyof ProfileFields, string>>;

const NAME_RE = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{1,50}$/;
const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Accept SA numbers: 0821234567, +27821234567, 27821234567 */
function normalizePhoneDigits(phone: string): string {
  return phone.replace(/[\s()-]/g, "");
}

export function isValidSaPhone(phone: string): boolean {
  const cleaned = normalizePhoneDigits(phone);
  if (/^0\d{9}$/.test(cleaned)) return true;
  if (/^\+27\d{9}$/.test(cleaned)) return true;
  if (/^27\d{9}$/.test(cleaned)) return true;
  return false;
}

export function validateProfileFields(
  fields: ProfileFields
): ProfileFieldErrors {
  const errors: ProfileFieldErrors = {};
  const username = fields.username.trim();
  const name = fields.name.trim();
  const surname = fields.surname.trim();
  const phone = fields.phone.trim();
  const email = fields.email.trim();

  if (!email) {
    errors.email = "Email is required.";
  } else if (!EMAIL_RE.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (username && !USERNAME_RE.test(username)) {
    errors.username =
      "Use 3–20 characters: letters, numbers, or underscores.";
  }

  if (name && !NAME_RE.test(name)) {
    errors.name = "Enter a valid name (letters only).";
  }

  if (surname && !NAME_RE.test(surname)) {
    errors.surname = "Enter a valid surname (letters only).";
  }

  if (phone && !isValidSaPhone(phone)) {
    errors.phone = "Enter a valid South African number, e.g. 082 123 4567.";
  }

  return errors;
}

export function hasProfileErrors(errors: ProfileFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
