import { NextResponse, type NextRequest } from "next/server";
import { dbCon } from "@/models";
import { getAnswersForPost } from "@/lib/posts";

type Ctx = { params: Promise<{ id: string }> };

/** POST: list answers for a post id, most upvoted first. */
export async function POST(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  return NextResponse.json(await getAnswersForPost(id));
}

/** GET: deletes the answer (kept for compatibility with the existing client). */
export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const { Answer } = await dbCon();
  try {
    await Answer.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Answer deleted" });
  } catch {
    return NextResponse.json({ success: false, message: "Error deleting answer" }, { status: 400 });
  }
}
