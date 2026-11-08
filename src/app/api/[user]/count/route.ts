import { NextResponse, type NextRequest } from "next/server";
import { dbCon } from "@/models";
import { requireSelfOrModerator } from "@/lib/session";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ user: string }> }) {
  const { user: userId } = await params;
  const auth = await requireSelfOrModerator(userId);
  if (auth instanceof NextResponse) return auth;
  const { Post, Answer } = await dbCon();
  try {
    const [posts, answers] = await Promise.all([
      Post.countDocuments({ "author.id": userId }),
      Answer.countDocuments({ "author.id": userId }),
    ]);
    return NextResponse.json({ posts, answers });
  } catch (err) {
    return NextResponse.json(
      { error: "Did not find user because: " + (err as Error).message },
      { status: 400 }
    );
  }
}
