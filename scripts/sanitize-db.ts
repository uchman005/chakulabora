/**
 * One-off migration: sanitize stored post and answer HTML in place.
 *
 *   MONGODB_URL_LOCAL=mongodb://127.0.0.1:27018/chakulaboraDB bun --preload ./scripts/preload-server-only.ts scripts/sanitize-db.ts          # dry run
 *   … scripts/sanitize-db.ts --apply                                                                                                      # write
 *
 * Refuses to touch a non-local database unless --allow-remote is passed explicitly.
 * Prints counts and document ids only, never content.
 */
import mongoose from "mongoose";
import { sanitizeRichText } from "@/lib/sanitize";

const url = process.env.MONGODB_URL_LOCAL;
const apply = process.argv.includes("--apply");
const allowRemote = process.argv.includes("--allow-remote");
if (!url) throw new Error("Set MONGODB_URL_LOCAL");

const host = new URL(url.replace(/^mongodb(\+srv)?:/, "http:")).hostname;
if (!["127.0.0.1", "localhost", "::1"].includes(host) && !allowRemote) {
  console.error(`Refusing to modify non-local database host "${host}". Pass --allow-remote to override.`);
  process.exit(1);
}

const conn = await mongoose.createConnection(url).asPromise();
try {
  for (const name of ["posts", "answers"]) {
    const coll = conn.db!.collection(name);
    const docs = await coll.find({}, { projection: { body: 1 } }).toArray();
    let changed = 0;
    for (const doc of docs) {
      const body = String(doc.body ?? "");
      const clean = sanitizeRichText(body);
      if (clean === body) continue;
      changed++;
      if (apply) await coll.updateOne({ _id: doc._id }, { $set: { body: clean } });
    }
    console.log(`${name}: ${changed}/${docs.length} ${apply ? "sanitized" : "would be sanitized (dry run)"}`);
  }
} finally {
  await conn.close();
}
