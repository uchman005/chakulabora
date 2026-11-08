import { NextResponse, type NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { dbCon } from "@/models";
import { readJson } from "@/lib/http";
import { requireUser } from "@/lib/session";

/** Changes the signed-in user's own password; any id in the request is ignored. */
export async function POST(req: NextRequest) {
  const auth = await requireUser();
  if (auth instanceof NextResponse) return auth;
  const { password } = await readJson<{ password?: unknown }>(req);
  if (typeof password !== "string" || !password) return NextResponse.json(false);

  const { User } = await dbCon();
  let updated = false;
  try {
    const user = await User.findById(auth.id);
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
