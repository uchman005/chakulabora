import { parsePhoneNumberFromString } from "libphonenumber-js/min";

/**
 * Normalise an international phone number to E.164 (e.g. "+254712345678"), or null if
 * it isn't valid. The country code is required: members are in many countries, so a
 * local number like "0712 345 678" can't be interpreted safely.
 */
export function normalizePhone(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const parsed = parsePhoneNumberFromString(input.trim());
  return parsed?.isValid() ? parsed.number : null;
}
