import { NextResponse, type NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { dbCon } from "@/models";
import { readJson } from "@/lib/http";
import type { IUser } from "@/types";

export async function POST(req: NextRequest) {
  const data = await readJson<IUser & { password: string }>(req);
  const { User } = await dbCon();
  const {
    email, password, fname, lname, bio, postal_code, country,
    street_address, city, state, phone, website,
  } = data;
  let user;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({
      email,
      password: hashedPassword,
      fname, lname, bio, postal_code, country, street_address, city, state, phone, website,
      role: "Community Member",
    });
    await user.save();
  } catch {
    user = null;
  }
  // Only return non-sensitive fields; the client uses `email` to sign in.
  return NextResponse.json(
    user ? { _id: user._id, email: user.email, fname: user.fname, lname: user.lname } : null
  );
}
