import { NextResponse, type NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { dbCon } from "@/models";
import { readJson } from "@/lib/http";

type Body = { id?: string; password?: string; data?: { id?: string; password?: string } };

export async function POST(req: NextRequest) {
  const body = await readJson<Body>(req);
  // The client sends { id, password }; the old handler read body.data (a bug) — accept both.
  const { id, password } = body.data ?? body;
  if (!id || !password) return NextResponse.json(false);

  const { User } = await dbCon();
  let updated = false;
  try {
    const user = await User.findOne({ _id: id });
    if (user !== null) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      updated = true;
    }
  } catch {
    updated = false;
  }
  return NextResponse.json(updated);
}
