import "server-only";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { isModerator } from "@/lib/user";
import { dbCon } from "@/models";

export interface SessionUser {
  id: string;
  role?: string;
  fname?: string;
  lname?: string;
  email?: string;
  phone?: string;
}

/**
 * The signed-in user, read from the signed session cookie and re-checked against the
 * database so deleted accounts and role changes take effect immediately.
 * This is the only source of identity: never trust ids or roles sent by the client.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);
  const id = session?.user?.email; // the session stores the Mongo id here (see lib/auth.ts)
  if (!id) return null;
  try {
    const { User } = await dbCon();
    const user = await User.findById(id).select("role fname lname email phone").lean<Omit<SessionUser, "id">>();
    return user ? { id, role: user.role, fname: user.fname, lname: user.lname, email: user.email, phone: user.phone } : null;
  } catch {
    return null;
  }
}

const unauthorized = () => NextResponse.json({ error: "You must be signed in" }, { status: 401 });
const forbidden = () => NextResponse.json({ error: "You are not allowed to do this" }, { status: 403 });

/*
 * Usage in a route handler:
 *   const user = await requireUser();
 *   if (user instanceof NextResponse) return user;
 */
export async function requireUser(): Promise<SessionUser | NextResponse> {
  return (await getCurrentUser()) ?? unauthorized();
}

export async function requireModerator(): Promise<SessionUser | NextResponse> {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  return isModerator(user) ? user : forbidden();
}

export async function requireSelf(userId: string): Promise<SessionUser | NextResponse> {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  return user.id === userId ? user : forbidden();
}

export async function requireSelfOrModerator(userId: string): Promise<SessionUser | NextResponse> {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  return user.id === userId || isModerator(user) ? user : forbidden();
}
