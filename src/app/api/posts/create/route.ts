import { NextResponse, type NextRequest } from "next/server";
import { dbCon } from "@/models";
import SendMail from "@/lib/send-mail";
import { sanitizeRichText } from "@/lib/sanitize";
import { readJson } from "@/lib/http";
import { getCurrentUser } from "@/lib/session";
import { displayName, publicAuthor } from "@/lib/user";

export async function POST(req: NextRequest) {
  const author = await getCurrentUser();
  if (!author) {
    return NextResponse.json({ post: null, message: "You must be signed in to ask a question" }, { status: 401 });
  }
  const data = await readJson<{ title: string; body: string; category: string; image: string }>(req);
  const blob: string = String(data.title ?? "")
    .toLowerCase()
    .replaceAll(" ", "-")
    .replace(/[^\w-]+/g, "")
    .replace(/-$/, "");
  const { Post } = await dbCon();
  let post;
  let message: string;
  try {
    post = new Post({
      title: data.title,
      body: sanitizeRichText(data.body),
      author: publicAuthor(author), // from the session, never from the request
      approved: true, // change this to false after testing
      category: data.category,
      image: data.image,
      upvotes: [],
      downvotes: [],
      blob,
    });

    await post.save();
    message = "Post created successfully";
    const mailMessage =
      "A new post has been created on the platform by " +
      displayName(author, author.email || author.phone) +
      ". Please, review the post and approve it.";
    await SendMail("uchenna@passionofhope.org", "New Post Created", mailMessage, mailMessage);
  } catch (err) {
    post = null;
    const e = err as { name?: string; code?: number; message: string };
    if (e.name === "MongoError" && e.code === 11000) {
      message =
        "You are trying to create a post that already exists. Please, search posts for similar post or change your title.";
    } else message = e.message;
  }
  return NextResponse.json({ post, message });
}
