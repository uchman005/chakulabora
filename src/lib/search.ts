import "server-only";
import { dbCon } from "@/models";
import { plainText } from "@/lib/posts";
import { sanitizeRichText } from "@/lib/sanitize";
import { escapeRegExp, type PostSearch } from "@/lib/search-query";
import { publicAuthor } from "@/lib/user";
import type { IPost } from "@/types";

const MAX_RESULTS = 200;
const EXCERPT_LENGTH = 160;

/** Topics (post categories) that have at least one approved post, A–Z. */
export async function getTopics(): Promise<string[]> {
  const { Post } = await dbCon();
  const topics = (await Post.distinct("category", { approved: true })) as unknown[];
  return topics
    .filter((t): t is string => typeof t === "string" && t.trim() !== "")
    .map((t) => t.trim())
    .filter((t, i, all) => all.indexOf(t) === i)
    .sort((a, b) => a.localeCompare(b));
}

/** A ~160 character window of plain text around the first matching term. */
function excerptAround(text: string, terms: string[]): string | undefined {
  const lower = text.toLowerCase();
  const hit = terms.map((t) => lower.indexOf(t)).filter((i) => i >= 0).sort((a, b) => a - b)[0];
  if (hit === undefined) return undefined;
  const start = Math.max(0, hit - 60);
  const end = Math.min(text.length, start + EXCERPT_LENGTH);
  return `${start > 0 ? "…" : ""}${text.slice(start, end).trim()}${end < text.length ? "…" : ""}`;
}

/**
 * Search approved posts by title, topic and content.
 *
 * - Every word must appear in the title, topic or body (any mix), case-insensitively;
 *   partial words match ("compost" finds "composting").
 * - The topic filter is an exact, case-insensitive category match.
 * - Body matching runs on the plain text, so HTML tag names ("strong", "span") never match.
 * - Ranked by where words match (title > topic > body), then newest first.
 * - Results carry no body; posts matched by content get a short plain-text `excerpt`.
 */
export async function searchApprovedPosts({ terms, topic }: PostSearch): Promise<IPost[]> {
  const { Post } = await dbCon();
  const contains = (t: string) => new RegExp(escapeRegExp(t), "i");
  const filter: Record<string, unknown> = { approved: true };
  if (topic) filter.category = new RegExp(`^${escapeRegExp(topic)}$`, "i");
  // A coarse database pre-filter; the exact check on plain text happens below.
  if (terms.length) {
    filter.$and = terms.map((t) => ({ $or: [{ title: contains(t) }, { category: contains(t) }, { body: contains(t) }] }));
  }

  const docs = JSON.parse(JSON.stringify(await Post.find(filter).sort({ _id: -1 }).limit(MAX_RESULTS * 2).lean())) as IPost[];

  const ranked: { post: IPost; score: number }[] = [];
  for (const { body: html, ...doc } of docs) {
    const title = (doc.title ?? "").toLowerCase();
    const category = (doc.category ?? "").toLowerCase();
    const text = plainText(sanitizeRichText(html), Number.MAX_SAFE_INTEGER);
    const body = text.toLowerCase();

    // Each word scores by the best place it matches; a word found nowhere excludes the post.
    const scores: number[] = terms.map((t) => (title.includes(t) ? 3 : category.includes(t) ? 2 : body.includes(t) ? 1 : 0));
    if (scores.includes(0)) continue;
    const matchedInContent = scores.includes(1);

    ranked.push({
      score: scores.reduce((a, b) => a + b, 0),
      post: {
        ...doc,
        author: publicAuthor(doc.author) as IPost["author"],
        ...(matchedInContent ? { excerpt: excerptAround(text, terms) } : {}),
      } as IPost,
    });
  }

  // Array.prototype.sort is stable, so equal scores keep the newest-first order.
  return ranked
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_RESULTS)
    .map((r) => r.post);
}
