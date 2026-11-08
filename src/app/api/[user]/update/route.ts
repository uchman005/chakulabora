import { NextResponse, type NextRequest } from "next/server";
import { dbCon } from "@/models";
import { readJson } from "@/lib/http";
import type { IUser } from "@/types";

export async function POST(req: NextRequest, { params }: { params: Promise<{ user: string }> }) {
  const { user: _id } = await params;
  const data = await readJson<Partial<IUser>>(req);
  const { User } = await dbCon();
  let user;
  try {
    user = await User.findOne({ _id }).select("-password -resetPasswordToken -resetPasswordExpires");
  } catch (err) {
    return NextResponse.json(
      { error: "Did not find user because: " + (err as Error).message },
      { status: 400 }
    );
  }
  if (user != null) {
    user.fname = data.fname as string;
    user.lname = data.lname as string;
    user.bio = data.bio;
    user.email = data.email as string;
    user.phone = data.phone;
    user.city = data.city;
    user.website = data.website;
    user.country = data.country;
    user.postal_code = data.postal_code;
    user.state = data.state;
    user.street_address = data.street_address;
    await user.save();
  }
  return NextResponse.json(user);
}
