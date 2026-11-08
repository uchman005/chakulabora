import { NextResponse } from "next/server";
import ImageKit from "imagekit";

export const dynamic = "force-dynamic";

/** Returns short-lived upload credentials for client-side ImageKit uploads. */
export async function GET() {
  const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY as string,
    privateKey: process.env.PRIVATE_KEY as string,
    urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT as string,
  });
  return NextResponse.json(imagekit.getAuthenticationParameters());
}
