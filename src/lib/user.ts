import type { IUser } from "@/types";

type NameFields = Pick<IUser, "fname" | "lname"> & { email?: string };

/**
 * Human-readable name for a user. Names are optional at signup, so this falls back
 * to the given fallback (e.g. the user's email or "Anonymous").
 */
export function displayName(user: NameFields | null | undefined, fallback = "Anonymous"): string {
  const name = [user?.fname, user?.lname].filter(Boolean).join(" ").trim();
  return name || fallback;
}
