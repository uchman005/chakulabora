import { NextResponse, type NextRequest } from "next/server";
import { like_post } from "@/lib";
import { readJson } from "@/lib/http";

export async function POST(req: NextRequest) {
  const { like, post_id, author_id, user_id } = await readJson<{
    like: boolean;
    post_id: string;
    author_id: string;
    user_id: string;
  }>(req);
  const liked = await like_post(like, post_id, author_id, user_id);
  return NextResponse.json(liked);
}
