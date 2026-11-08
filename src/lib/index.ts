import { dbCon } from "@/models";
import { applyVote } from "@/lib/votes";

export const like_post = async (like: boolean, post_id: string, user_id: string) =>
  applyVote((await dbCon()).Post, post_id, user_id, { like, remove: false });

export const dislike_post = async (like: boolean, post_id: string, user_id: string) =>
  applyVote((await dbCon()).Post, post_id, user_id, { like, remove: true });
