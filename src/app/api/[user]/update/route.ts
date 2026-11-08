import { NextResponse, type NextRequest } from "next/server";
import { dbCon } from "@/models";
import { readJson } from "@/lib/http";
import { requireSelf } from "@/lib/session";
import type { IUser } from "@/types";

export async function POST(req: NextRequest, { params }: { params: Promise<{ user: string }> }) {
  const { user: _id } = await params;
  const auth = await requireSelf(_id);
  if (auth instanceof NextResponse) return auth;
  const data = await readJson<Partial<IUser>>(req);
  const { User } = await dbCon();
  let user;
  try {
    // loginPhone must be loaded: validation needs it to accept an account with no email.
    user = await User.findOne({ _id }).select("-password -resetPasswordToken -resetPasswordExpires");
  } catch (err) {
    return NextResponse.json(
      { error: "Did not find user because: " + (err as Error).message },
      { status: 400 }
    );
  }
  if (!user) return NextResponse.json(null);
  // Only profile fields. Email (read-only in Settings), role and points can't be changed here.
  user.fname = data.fname;
  user.lname = data.lname;
  user.bio = data.bio;
  user.phone = data.phone;
  user.city = data.city;
  user.website = data.website;
  user.country = data.country;
  user.postal_code = data.postal_code;
  user.state = data.state;
  user.street_address = data.street_address;
  await user.save();
  const body = user.toObject() as Partial<IUser>;
  delete body.loginPhone;
  return NextResponse.json(body);
}
