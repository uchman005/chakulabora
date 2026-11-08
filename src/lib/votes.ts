import "server-only";
import type { Model } from "mongoose";
import { dbCon } from "@/models";

type Votable = { upvotes?: string[]; downvotes?: string[]; author?: { id?: string } | null };

/**
 * Add or remove one user's vote and adjust the author's points. Both updates are atomic,
 * and points only move when the vote really changed, so repeat requests can't farm them.
 * The author always comes from the stored document, never from the request.
 * Returns false when the document doesn't exist.
 */
export async function applyVote(
  model: unknown,
  docId: string,
  userId: string,
  { like, remove }: { like: boolean; remove: boolean }
): Promise<boolean> {
  const Doc = model as Model<Votable>;
  const field = like ? "upvotes" : "downvotes";
  try {
    const result = remove
      ? await Doc.updateOne({ _id: docId, [field]: userId }, { $pull: { [field]: userId } })
      : await Doc.updateOne({ _id: docId, upvotes: { $ne: userId }, downvotes: { $ne: userId } }, { $addToSet: { [field]: userId } });

    const doc = await Doc.findById(docId).select("author").lean<Votable>();
    if (!doc) return false;

    const authorId = doc.author?.id;
    if (result.modifiedCount > 0 && authorId) {
      const { User } = await dbCon();
      await User.updateOne({ _id: authorId }, { $inc: { pv: like === !remove ? 1 : -1 } }).catch(() => {});
    }
    return true;
  } catch {
    return false;
  }
}
