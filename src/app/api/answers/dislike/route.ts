import { NextResponse, type NextRequest } from "next/server";
import { dislike_answer } from "@/lib/answers";
import { readJson } from "@/lib/http";
import { requireUser } from "@/lib/session";

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (user instanceof NextResponse) return user;
  const { like, answer_id } = await readJson<{ like: boolean; answer_id: string }>(req);
  return NextResponse.json(await dislike_answer(like === true, answer_id, user.id));
}
