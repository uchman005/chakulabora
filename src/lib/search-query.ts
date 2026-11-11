/** Shared (client + server) parsing of a post search. */

export const MAX_QUERY_LENGTH = 100;
export const MAX_TERMS = 8;

export interface PostSearch {
  /** The cleaned query as typed (trimmed, length-limited). */
  q: string;
  /** Exact topic (post category) to filter by, or "" for all. */
  topic: string;
  /** Lower-cased words; a post must contain every one. */
  terms: string[];
}

const first = (v: unknown) => (Array.isArray(v) ? v[0] : v);

/** Accepts raw URL/search-param or JSON values; anything that isn't a string is ignored. */
export function parseSearch(rawQ: unknown, rawTopic?: unknown): PostSearch {
  const qv = first(rawQ);
  const tv = first(rawTopic);
  const q = typeof qv === "string" ? qv.replace(/\s+/g, " ").trim().slice(0, MAX_QUERY_LENGTH) : "";
  const topic = typeof tv === "string" ? tv.trim().slice(0, MAX_QUERY_LENGTH) : "";
  const terms = [...new Set(q.toLowerCase().split(" ").filter(Boolean))].slice(0, MAX_TERMS);
  return { q, topic, terms };
}

export const isSearching = (s: PostSearch) => s.terms.length > 0 || s.topic !== "";

/** Escape user text for use inside a RegExp (prevents injection and ReDoS patterns). */
export const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
