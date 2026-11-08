import { NextResponse, type NextRequest } from "next/server";
import { dbCon } from "@/models";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ user: string }> }) {
  const { user: _id } = await params;
  const { User } = await dbCon();
  try {
    // Never send the password hash or reset token to the client.
    const user = await User.findOne({ _id }).select(
      "-password -resetPasswordToken -resetPasswordExpires"
    );
    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json(
      { error: "Did not find user because: " + (err as Error).message },
      { status: 400 }
    );
  }
}
