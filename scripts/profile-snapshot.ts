/**
 * Profile the local snapshot (aggregates only — never prints document contents).
 *   bun --preload ./tests/setup.ts scripts/profile-snapshot.ts
 */
import { readCollection } from "../tests/snapshot/load";
import { sanitizeRichText } from "@/lib/sanitize";
import { plainText } from "@/lib/posts";
import User from "@/models/User";
import Post from "@/models/Post";
import Answer from "@/models/Answer";
import Subscriber from "@/models/Subscribe";
import Contact from "@/models/Contact";

const models = { users: User, posts: Post, answers: Answer, subscribers: Subscriber, contacts: Contact };

for (const [name, Model] of Object.entries(models)) {
  const docs = readCollection(name);
  const fieldCounts: Record<string, number> = {};
  const invalid: Record<string, number> = {};
  for (const d of docs) {
    for (const k of Object.keys(d)) fieldCounts[k] = (fieldCounts[k] ?? 0) + 1;
    const err = new Model(d).validateSync();
    if (err) for (const p of Object.keys(err.errors)) invalid[`${p}:${err.errors[p].kind}`] = (invalid[`${p}:${err.errors[p].kind}`] ?? 0) + 1;
  }
  console.log(`\n## ${name} (${docs.length})`);
  console.log("fields:", Object.entries(fieldCounts).map(([k, v]) => `${k}=${v}`).join(" "));
  console.log("validation failures:", Object.keys(invalid).length ? invalid : "none");
}

// Rich text: what would sanitizing change?
for (const name of ["posts", "answers"]) {
  const docs = readCollection(name);
  let changed = 0;
  let textLoss = 0;
  const removedTags: Record<string, number> = {};
  for (const d of docs) {
    const body = String(d.body ?? "");
    const clean = sanitizeRichText(body);
    if (clean !== body) {
      changed++;
      for (const m of body.matchAll(/<([a-z0-9-]+)/gi)) {
        const tag = m[1].toLowerCase();
        if (!new RegExp(`<${tag}[\\s>/]`, "i").test(clean)) removedTags[tag] = (removedTags[tag] ?? 0) + 1;
      }
    }
    const before = plainText(body, 1e9).length;
    const after = plainText(clean, 1e9).length;
    textLoss = Math.max(textLoss, before ? (before - after) / before : 0);
  }
  console.log(`\n## sanitize ${name}: ${changed}/${docs.length} would change; max visible-text loss ${(textLoss * 100).toFixed(1)}%; tags removed:`, removedTags);
}

// Data quality checks relevant to the app.
const posts = readCollection("posts");
const blobs = posts.map((p) => p.blob);
console.log("\n## posts: approved", posts.filter((p) => p.approved).length, "| duplicate blobs", blobs.length - new Set(blobs).size, "| with image", posts.filter((p) => p.image).length);
const users = readCollection("users");
const emails = users.map((u) => String(u.email).toLowerCase());
console.log("## users: roles", users.reduce<Record<string, number>>((a, u) => ((a[String(u.role ?? "(none)")] = (a[String(u.role ?? "(none)")] ?? 0) + 1), a), {}), "| google", users.filter((u) => u.googleId).length, "| missing fname", users.filter((u) => !u.fname).length, "| case-duplicate emails", emails.length - new Set(emails).size);
const contacts = readCollection("contacts");
console.log("## contacts containing HTML:", contacts.filter((c) => /<[a-z]/i.test(String(c.message ?? "") + String(c.subject ?? ""))).length);
process.exit(0);
