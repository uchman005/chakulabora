import { NextResponse, type NextRequest } from "next/server";
import { dbCon } from "@/models";
import SendMail from "@/lib/send-mail";
import { escapeHtml } from "@/lib/sanitize";
import { readJson } from "@/lib/http";

export async function POST(req: NextRequest) {
  const data = await readJson<{ email: string; name: string; message: string; subject: string }>(req);
  const { Contact } = await dbCon();
  let { message, subject } = data;
  const { email, name } = data;
  try {
    const contact = new Contact({ email, name, message, subject });
    subject += " From Chakulabora Network";
    message += "\n from " + email;
    const html = `<div>
      <h1>${escapeHtml(subject)}</h1>
      <p>${escapeHtml(message)}</p>
      </div>`;
    await contact.save();
    SendMail("uchenna@passionofhope.org", subject, message, html);
    SendMail("admin@passionofhope.org", subject, message, html);
    return NextResponse.json({ message: "Successfully Sent" });
  } catch {
    return NextResponse.json(null);
  }
}
