import { NextResponse } from "next/server";
import { dbCon } from "@/models";

export async function POST() {
  const { Post } = await dbCon();
  const posts = await Post.find({ approved: false }, { body: 0 });
  return NextResponse.json(posts);
}
