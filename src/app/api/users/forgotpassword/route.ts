import { NextResponse, type NextRequest } from "next/server";
import { randomBytes } from "crypto";
import { dbCon } from "@/models";
import SendMail from "@/lib/send-mail";
import { readJson } from "@/lib/http";

export async function POST(req: NextRequest) {
  const { email } = await readJson<{ email?: unknown }>(req);
  // Strings only, and never query with a missing value (it would match phone-only accounts).
  if (typeof email !== "string" || !email) {
    return NextResponse.json({ success: false, message: "User not found" });
  }
  const { User } = await dbCon();
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
    }
    const token = randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const subject = "Password Reset From Chakula bora Network";
    const message = `Please click the link below to reset your password \n\n <a href="https://chakulabora.net/reset-password/${token}">Reset Password</a> \n  If you did not request this, please ignore this email and your password will remain unchanged.`;
    const html = `<div>
      <h1>${subject}</h1>
      <p>${message}</p>
      <p>The Chakula bora support team</p>
      </div>`;
    SendMail(email, subject, message, html);
    return NextResponse.json({ success: true, message: "Password reset email sent" });
  } catch {
    return NextResponse.json({ success: false, message: "Error sending password reset email" });
  }
}
