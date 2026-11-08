import { NextResponse, type NextRequest } from "next/server";
import { dbCon } from "@/models";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const { User } = await dbCon();
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    }).select("email fname lname");
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Invalid or expired token. Please request a new password reset.",
      });
    }
    return NextResponse.json({ success: true, message: "Token is valid", user });
  } catch {
    return NextResponse.json({ success: false, message: "Error validating token" });
  }
}
