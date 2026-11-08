import { NextResponse, type NextRequest } from "next/server";
import { getPostByBlob, redactUnapproved } from "@/lib/posts";
import { getCurrentUser } from "@/lib/session";
import { isModerator } from "@/lib/user";

/** Public for approved posts. Only moderators can read the content of pending ones. */
export async function POST(_req: NextRequest, { params }: { params: Promise<{ post: string }> }) {
  const { post: blob } = await params;
  const post = await getPostByBlob(blob);
  if (post && !post.approved) {
    const user = await getCurrentUser();
    if (!user || !isModerator(user)) return NextResponse.json(redactUnapproved(post));
  }
  return NextResponse.json(post);
}
