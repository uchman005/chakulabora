import { NextResponse, type NextRequest } from "next/server";
import { dbCon } from "@/models";
import { readJson } from "@/lib/http";

export async function POST(req: NextRequest) {
  const { blob } = await readJson<{ blob?: string }>(req);
  const { Post } = await dbCon();
  let post;
  try {
    post = await Post.deleteOne({ blob });
  } catch {
    post = false;
  }
  return NextResponse.json(post);
}
