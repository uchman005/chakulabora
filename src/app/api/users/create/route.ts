import { NextResponse, type NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { dbCon } from "@/models";
import { readJson } from "@/lib/http";
import { normalizePhone } from "@/lib/phone";
import type { IUser } from "@/types";

export async function POST(req: NextRequest) {
  const data = await readJson<IUser & { password: string }>(req);
  const { User } = await dbCon();
  const { password, fname, lname, bio, postal_code, country, street_address, city, state, phone, website } = data;
  const email = typeof data.email === "string" ? data.email.trim() || undefined : undefined;

  // `loginPhone` is the sign-in number; `phone` stays a separate optional profile field.
  const rawLoginPhone = typeof data.loginPhone === "string" ? data.loginPhone.trim() : undefined;
  const loginPhone = rawLoginPhone ? normalizePhone(rawLoginPhone) : undefined;
  if (loginPhone === null) {
    return NextResponse.json(
      { error: "Enter a valid phone number including the country code, e.g. +254712345678" },
      { status: 400 }
    );
  }
  if (!email && !loginPhone) {
    return NextResponse.json({ error: "Enter an email address or a phone number" }, { status: 400 });
  }

  let user;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({
      email,
      loginPhone,
      password: hashedPassword,
      fname, lname, bio, postal_code, country, street_address, city, state, website,
      phone: phone || loginPhone,
      role: "Community Member",
    });
    await user.save();
  } catch {
    user = null;
  }
  // Only return non-sensitive fields; the client signs in with `email` or `loginPhone`.
  return NextResponse.json(
    user ? { _id: user._id, email: user.email, loginPhone: user.loginPhone, fname: user.fname, lname: user.lname } : null
  );
}
