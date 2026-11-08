import { NextRequest } from "next/server";

/** Build a NextRequest like the browser client sends (JSON body). */
export function jsonRequest(url: string, body?: unknown, init: { method?: string; contentType?: string | null } = {}) {
  const headers = new Headers();
  if (init.contentType !== null) headers.set("content-type", init.contentType ?? "application/json");
  return new NextRequest(new URL(url, "http://localhost"), {
    method: init.method ?? (body === undefined ? "GET" : "POST"),
    headers,
    body: body === undefined ? undefined : typeof body === "string" ? body : JSON.stringify(body),
  });
}

/** Route-handler context with Next 15+ async params. */
export const ctx = <T extends Record<string, string>>(params: T) => ({ params: Promise.resolve(params) });

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- test assertions inspect arbitrary JSON
export async function json<T = any>(res: Response | Promise<Response>): Promise<{ status: number; body: T }> {
  const r = await res;
  return { status: r.status, body: (await r.json()) as T };
}

export function clearMail() {
  globalThis.__sentMail.length = 0;
}

export const sentMail = () => globalThis.__sentMail;
