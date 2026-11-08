import { NextResponse, type NextRequest } from "next/server";
import { genSalt, hash } from "bcrypt";
import { dbCon } from "@/models";
import { readJson } from "@/lib/http";

export async function POST(req: NextRequest) {
  const { token, password } = await readJson<{ token?: string; password?: string }>(req);
  const { User } = await dbCon();
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user || !password) {
      return NextResponse.json({ success: false, message: "User not found or token is invalid" });
    }
    const salt = await genSalt(10);
    user.password = await hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    return NextResponse.json({ success: true, message: "Password has been reset" });
  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
