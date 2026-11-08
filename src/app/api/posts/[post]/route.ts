import { NextResponse, type NextRequest } from "next/server";
import { getPostByBlob } from "@/lib/posts";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ post: string }> }) {
  const { post } = await params;
  return NextResponse.json(await getPostByBlob(post));
}
