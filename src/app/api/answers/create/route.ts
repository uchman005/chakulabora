import { NextResponse, type NextRequest } from "next/server";
import { dbCon } from "@/models";
import notifyAdmin from "@/utils/notifyAdmin";
import { readJson } from "@/lib/http";
import { escapeHtml, sanitizeRichText } from "@/lib/sanitize";
import { getCurrentUser } from "@/lib/session";
import { publicAuthor } from "@/lib/user";

/** Public: signed-out visitors answer anonymously. The author always comes from the session. */
export async function POST(req: NextRequest) {
  const { body: rawBody, post, blob } = await readJson<{ body?: unknown; post?: string; blob?: string }>(req);
  const author = await getCurrentUser();
  // Sanitize before the emptiness check so e.g. "<script>…</script>" counts as empty.
  const body = sanitizeRichText(typeof rawBody === "string" ? rawBody : "");
  let answer = null;
  let message: string;
  const isEmpty = body.replace(/<\/?[^>]+(>|$)/g, "").trim() === "";

  if (body.trim() !== "" && !isEmpty) {
    const { Answer } = await dbCon();
    try {
      answer = new Answer({ body, author: publicAuthor(author), post, upvotes: [], downvotes: [] });
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
