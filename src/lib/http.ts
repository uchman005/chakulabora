import "server-only";
import type { NextRequest } from "next/server";

/** Parse a JSON body, tolerating empty bodies and missing Content-Type headers. */
export async function readJson<T = Record<string, unknown>>(req: NextRequest): Promise<T> {
  try {
    const text = await req.text();
    return (text ? JSON.parse(text) : {}) as T;
  } catch {
    return {} as T;
  }
}
