import { NextResponse } from "next/server";
import { dbCon } from "@/models";
import { requireModerator } from "@/lib/session";

export async function POST() {
  const auth = await requireModerator();
  if (auth instanceof NextResponse) return auth;
  const { Post } = await dbCon();
  const posts = await Post.find({ approved: false }, { body: 0 });
  return NextResponse.json(posts);
}
