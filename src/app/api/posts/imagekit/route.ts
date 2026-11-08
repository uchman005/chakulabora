import { NextResponse } from "next/server";
import ImageKit from "imagekit";
import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

/** Short-lived upload credentials, for signed-in users only. */
export async function GET() {
  const auth = await requireUser();
  if (auth instanceof NextResponse) return auth;
  const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY as string,
    privateKey: process.env.PRIVATE_KEY as string,
    urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT as string,
  });
  return NextResponse.json(imagekit.getAuthenticationParameters());
}
