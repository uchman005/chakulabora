import { dbCon } from "@/models";
import { applyVote } from "@/lib/votes";

export const like_answer = async (like: boolean, answer_id: string, user_id: string) =>
  applyVote((await dbCon()).Answer, answer_id, user_id, { like, remove: false });

export const dislike_answer = async (like: boolean, answer_id: string, user_id: string) =>
  applyVote((await dbCon()).Answer, answer_id, user_id, { like, remove: true });
