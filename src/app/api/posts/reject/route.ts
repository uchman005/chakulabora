import { NextResponse, type NextRequest } from "next/server";
import { dbCon } from "@/models";
import { readJson } from "@/lib/http";
import { requireModerator } from "@/lib/session";

export async function POST(req: NextRequest) {
  const auth = await requireModerator();
  if (auth instanceof NextResponse) return auth;
  const { blob } = await readJson<{ blob?: unknown }>(req);
  if (typeof blob !== "string") return NextResponse.json(false);
  const { Post } = await dbCon();
  let post;
  try {
    post = await Post.deleteOne({ blob });
  } catch {
    post = false;
  }
  return NextResponse.json(post);
}
