import { NextResponse, type NextRequest } from "next/server";
import { dbCon } from "@/models";
import notifyAdmin from "@/utils/notifyAdmin";
import { readJson } from "@/lib/http";
import { escapeHtml, sanitizeRichText } from "@/lib/sanitize";
import type { IUser } from "@/types";

export async function POST(req: NextRequest) {
  const { author, body: rawBody = "", post, blob } = await readJson<{
    author?: IUser;
    body?: string;
    post?: string;
    blob?: string;
  }>(req);
  // Sanitize before the emptiness check so e.g. "<script>…</script>" counts as empty.
  const body = sanitizeRichText(rawBody);
  let answer = null;
  let message: string;
  const isEmpty = body.replace(/<\/?[^>]+(>|$)/g, "").trim() === "";

  if (body.trim() !== "" && !isEmpty) {
    const { Answer } = await dbCon();
    try {
      answer = new Answer({ body, author, post, upvotes: [], downvotes: [] });
      await answer.save();
      notifyAdmin(
        "New answer",
        `By ${escapeHtml(author?.fname ? author.fname : "Anonymous")} \n
          ${body} \n
          https://chakulabora.net/post/${encodeURIComponent(blob ?? "")}`
      );
      message = "Post success";
    } catch {
      answer = null;
      message = "Error occured";
    }
  } else {
    message = "The post cannot be empty";
  }
  return NextResponse.json({ answer, message });
}
