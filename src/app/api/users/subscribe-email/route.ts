import { NextResponse, type NextRequest } from "next/server";
import { dbCon } from "@/models";
import { readJson } from "@/lib/http";

export async function POST(req: NextRequest) {
  const { email } = await readJson<{ email?: string }>(req);
  const { Subscriber } = await dbCon();
  let user;
  try {
    user = new Subscriber({ email });
    await user.save();
  } catch {
    user = null;
  }
  return NextResponse.json(user);
}
