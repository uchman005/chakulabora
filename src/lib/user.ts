import type { IUser } from "@/types";

type NameFields = Pick<IUser, "fname" | "lname"> & { email?: string };

/**
 * The only author fields that may be stored on or returned with public content.
 * Older documents hold more (answers saved the whole profile); never expose it.
 */
export function publicAuthor(author: Partial<IUser> | null | undefined) {
  if (!author) return null;
  const { id, fname, lname } = author;
  return { id, fname, lname };
}

/** Anyone with a role above ordinary member. */
export function isModerator(user: Pick<IUser, "role"> | null | undefined): boolean {
  return !!user?.role && user.role !== "Community Member";
}

/**
 * Human-readable name for a user. Names are optional at signup, so this falls back
 * to the given fallback (e.g. the user's email or "Anonymous").
 */
export function displayName(user: NameFields | null | undefined, fallback = "Anonymous"): string {
  const name = [user?.fname, user?.lname].filter(Boolean).join(" ").trim();
  return name || fallback;
}
