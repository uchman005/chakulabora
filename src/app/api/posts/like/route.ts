import { NextResponse, type NextRequest } from "next/server";
import { like_post } from "@/lib";
import { readJson } from "@/lib/http";
import { requireUser } from "@/lib/session";

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (user instanceof NextResponse) return user;
  const { like, post_id } = await readJson<{ like: boolean; post_id: string }>(req);
  return NextResponse.json(await like_post(like === true, post_id, user.id));
}
