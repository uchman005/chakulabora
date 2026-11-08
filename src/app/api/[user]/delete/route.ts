import { NextResponse, type NextRequest } from "next/server";
import { dbCon } from "@/models";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ user: string }> }) {
  const { user: _id } = await params;
  const { User } = await dbCon();
  const deleted = await User.deleteOne({ _id });
  return NextResponse.json(deleted);
}
