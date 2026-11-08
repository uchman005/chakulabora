import { NextResponse, type NextRequest } from "next/server";
import { dbCon } from "@/models";
import { getAnswersForPost } from "@/lib/posts";
import { requireModerator } from "@/lib/session";

type Ctx = { params: Promise<{ id: string }> };

/** POST: list answers for a post id, most upvoted first. Public. */
export async function POST(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  return NextResponse.json(await getAnswersForPost(id));
}

/** DELETE: remove an answer. Moderators only. (Was a GET, which a mere link could trigger.) */
export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const auth = await requireModerator();
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;
  const { Answer } = await dbCon();
  try {
    await Answer.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Answer deleted" });
  } catch {
    return NextResponse.json({ success: false, message: "Error deleting answer" }, { status: 400 });
  }
}
