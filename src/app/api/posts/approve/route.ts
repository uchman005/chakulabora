import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { dbCon } from "@/models";
import notifyAdmin from "@/utils/notifyAdmin";
import { escapeHtml } from "@/lib/sanitize";
import { readJson } from "@/lib/http";

export async function POST(req: NextRequest) {
  const { _id } = await readJson<{ _id?: string }>(req);
  const { Post } = await dbCon();
  let post;
  try {
    post = await Post.findOne({ _id });
    if (post !== null) {
      post.approved = true;
      await post.save();
      notifyAdmin("New Post Approved", `Post ${escapeHtml(post.title)} is approved`);
      revalidatePath(`/post/${post.blob}`);
    }
  } catch {
    post = null;
  }
  return NextResponse.json(post);
}
