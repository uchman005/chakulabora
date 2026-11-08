import "server-only";
import { dbCon } from "@/models";
import { sanitizeRichText } from "@/lib/sanitize";
import { publicAuthor } from "@/lib/user";
import type { IAnswer, IPost } from "@/types";

/** Convert Mongoose docs (ObjectIds, Dates) into plain JSON-safe objects. */
const toPlain = <T>(value: unknown): T => JSON.parse(JSON.stringify(value)) as T;

/*
 * Rich text is sanitized on write (create routes) AND here on read, so content
 * stored before sanitization existed is also safe. Every path that sends post or
 * answer HTML to the browser (server render + API) goes through these helpers.
 */

export async function getPostByBlob(blob: string): Promise<IPost | null> {
  try {
    const { Post } = await dbCon();
    const post = await Post.findOne({ blob }).lean();
    if (!post) return null;
    const plain = toPlain<IPost>(post);
    return { ...plain, author: publicAuthor(plain.author) as IPost["author"], body: sanitizeRichText(plain.body) };
  } catch {
    return null;
  }
}

/** What anyone but a moderator may see of a post that is awaiting approval. */
export function redactUnapproved(post: IPost): IPost {
  return { ...post, body: "", image: "" };
}

/** Approved posts without bodies, newest first (used by the dashboard list). */
export async function getApprovedPosts(): Promise<IPost[]> {
  const { Post } = await dbCon();
  const posts = await Post.find({ approved: true }, { body: 0 }).sort({ _id: -1 }).lean();
  return toPlain<IPost[]>(posts).map((p) => ({ ...p, author: publicAuthor(p.author) as IPost["author"] }));
}

/** Answers for a post, most upvoted first. */
export async function getAnswersForPost(postId: string): Promise<IAnswer[] | null> {
  try {
    const { Answer } = await dbCon();
    const answers = await Answer.aggregate([
      { $match: { post: postId } },
      { $addFields: { upvotesCount: { $size: { $ifNull: ["$upvotes", []] } } } },
      { $sort: { upvotesCount: -1 } },
    ]);
    return toPlain<IAnswer[]>(answers).map((a) => ({
      ...a,
      body: sanitizeRichText(a.body),
      // Older answers stored the author's whole profile; only expose the public fields.
      author: publicAuthor(a.author) as IAnswer["author"],
    }));
  } catch (err) {
    console.error(err);
    return null;
  }
}

/** Minimal data for the sitemap. */
export async function getApprovedPostSlugs(): Promise<{ blob: string }[]> {
  const { Post } = await dbCon();
  const posts = await Post.find({ approved: true }, { blob: 1 }).lean();
  return toPlain<{ blob: string }[]>(posts);
}

/** Strip HTML tags and collapse whitespace, for meta descriptions. */
export function plainText(html: string | undefined, max = 160): string {
  const text = (html ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}
