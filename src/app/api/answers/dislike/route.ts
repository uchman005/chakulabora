import { NextResponse, type NextRequest } from "next/server";
import { dislike_answer } from "@/lib/answers";
import { readJson } from "@/lib/http";

export async function POST(req: NextRequest) {
  const { like, answer_id, author_id, user_id } = await readJson<{
    like: boolean;
    answer_id: string;
    author_id: string;
    user_id: string;
  }>(req);
  const liked = await dislike_answer(like, answer_id, author_id, user_id);
  return NextResponse.json(liked);
}
