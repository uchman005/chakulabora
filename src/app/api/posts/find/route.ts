import { NextResponse, type NextRequest } from "next/server";
import { getApprovedPosts } from "@/lib/posts";
import { readJson } from "@/lib/http";
import { searchApprovedPosts } from "@/lib/search";
import { isSearching, parseSearch } from "@/lib/search-query";

/** Approved posts, newest first; optional { q, topic } searches title, topic and content. */
export async function POST(req: NextRequest) {
  const { q, topic } = await readJson<{ q?: unknown; topic?: unknown }>(req);
  const search = parseSearch(q, topic);
  return NextResponse.json(isSearching(search) ? await searchApprovedPosts(search) : await getApprovedPosts());
}
