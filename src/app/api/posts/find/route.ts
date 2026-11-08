import { NextResponse } from "next/server";
import { getApprovedPosts } from "@/lib/posts";

export async function POST() {
  return NextResponse.json(await getApprovedPosts());
}
