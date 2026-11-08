/**
 * Verify the local database mirrors production exactly (read-only on both sides).
 *
 *   bun run db:verify
 *
 * Compares, per collection: document count, a SHA-256 of every document (canonical EJSON,
 * ordered by _id), and index definitions. Prints match/mismatch only — never data.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import mongoose from "mongoose";

const { EJSON } = mongoose.mongo.BSON;
const source = process.env.SOURCE_MONGODB_URL ?? fs.readFileSync(".env", "utf8").match(/mongodb(\+srv)?:\/\/[^\s"'#]+/)?.[0];
const local = process.env.MONGODB_URL_LOCAL;
if (!source || !local) throw new Error("Need the production URL (.env) and MONGODB_URL_LOCAL (.env.local)");

async function fingerprint(url: string) {
  const conn = await mongoose.createConnection(url, { serverSelectionTimeoutMS: 20000 }).asPromise();
  try {
    const db = conn.db!;
    const names = (await db.listCollections({}, { nameOnly: true }).toArray()).map((c) => c.name).filter((n) => !n.startsWith("system.")).sort();
    const out: Record<string, { count: number; docHashes: Map<string, string>; indexes: string }> = {};
    for (const name of names) {
      const coll = db.collection(name);
      const docs = await coll.find({}).sort({ _id: 1 }).toArray();
      const docHashes = new Map(docs.map((d) => [String(d._id), crypto.createHash("sha256").update(EJSON.stringify(d, { relaxed: false })).digest("hex")]));
      const indexes = (await coll.indexes())
        .map(({ key, unique, sparse, expireAfterSeconds }) => JSON.stringify({ key, unique: !!unique, sparse: !!sparse, expireAfterSeconds }))
        .sort()
        .join("|");
      out[name] = { count: docs.length, docHashes, indexes };
    }
    return out;
  } finally {
    await conn.close();
  }
}

const [prod, mine] = await Promise.all([fingerprint(source), fingerprint(local)]);
let ok = true;
for (const name of new Set([...Object.keys(prod), ...Object.keys(mine)])) {
  const a = prod[name];
  const b = mine[name];
  if (!a || !b) {
    ok = false;
    console.log(`${name.padEnd(12)} MISSING ${a ? "locally" : "in production"}`);
    continue;
  }
  let differing = 0;
  for (const [id, h] of a.docHashes) if (b.docHashes.get(id) !== h) differing++;
  const extra = [...b.docHashes.keys()].filter((id) => !a.docHashes.has(id)).length;
  const match = a.count === b.count && differing === 0 && extra === 0 && a.indexes === b.indexes;
  ok &&= match;
  console.log(
    `${name.padEnd(12)} ${match ? "IDENTICAL" : "DIFFERS  "}  docs ${a.count}/${b.count}  changed ${differing}  extra ${extra}  indexes ${a.indexes === b.indexes ? "same" : "different"}`
  );
}
console.log(ok ? "\nLocal database is an exact mirror of production." : "\nLocal database differs from production.");
process.exit(ok ? 0 : 1);
