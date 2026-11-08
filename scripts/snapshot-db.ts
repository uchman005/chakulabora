/**
 * Read-only snapshot of a MongoDB database into local EJSON files (.data/snapshot, gitignored).
 *
 *   bun run db:snapshot              # redacted: drops password hashes + reset tokens (safe for sharing/tests)
 *   bun run db:snapshot --mirror     # exact copy incl. password hashes (for a local mirror you can log into)
 *
 * Source URL: SOURCE_MONGODB_URL, or else the mongodb URL found in `.env` (even if commented out),
 * so the credential never has to be copied into another file.
 *
 * - Only issues reads (listCollections / find / indexes). Never writes to the source.
 * - Exports each collection's indexes so the mirror enforces the same constraints.
 * - Prints counts only — never document contents or the URL.
 */
import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";

function sourceUrl(): string | undefined {
  if (process.env.SOURCE_MONGODB_URL) return process.env.SOURCE_MONGODB_URL;
  const envFile = path.resolve(".env");
  if (!fs.existsSync(envFile)) return undefined;
  return fs.readFileSync(envFile, "utf8").match(/mongodb(\+srv)?:\/\/[^\s"'#]+/)?.[0];
}

const url = sourceUrl();
if (!url) {
  console.error("No source database: set SOURCE_MONGODB_URL or put the URL in .env");
  process.exit(1);
}
const args = process.argv.slice(2);
const mirror = args.includes("--mirror");
const outDir = path.resolve(args.find((a) => !a.startsWith("--")) ?? ".data/snapshot");
const { EJSON } = mongoose.mongo.BSON;

const REDACT: Record<string, string[]> = mirror ? {} : { users: ["password", "resetPasswordToken", "resetPasswordExpires"] };

const conn = await mongoose
  .createConnection(url, { readPreference: "secondaryPreferred", serverSelectionTimeoutMS: 20000 })
  .asPromise();

try {
  const db = conn.db!;
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  const collections = (await db.listCollections({}, { nameOnly: true }).toArray())
    .map((c) => c.name)
    .filter((n) => !n.startsWith("system."))
    .sort();

  const manifest: Record<string, { docs: number; indexes: number }> = {};
  for (const name of collections) {
    const coll = db.collection(name);
    const [docs, indexes] = await Promise.all([coll.find({}).toArray(), coll.indexes()]);
    const fields = REDACT[name] ?? [];
    let redacted = 0;
    for (const doc of docs) {
      for (const f of fields) {
        if (f in doc) {
          delete (doc as Record<string, unknown>)[f];
          redacted++;
        }
      }
    }
    fs.writeFileSync(path.join(outDir, `${name}.json`), EJSON.stringify(docs, { relaxed: false }));
    fs.writeFileSync(path.join(outDir, `${name}.indexes.json`), EJSON.stringify(indexes, { relaxed: false }));
    manifest[name] = { docs: docs.length, indexes: indexes.length };
    console.log(
      `${name.padEnd(14)} ${String(docs.length).padStart(6)} docs  ${indexes.length} indexes${redacted ? `  (${redacted} secret fields redacted)` : ""}`
    );
  }
  fs.writeFileSync(
    path.join(outDir, "manifest.json"),
    JSON.stringify({ database: db.databaseName, takenAt: new Date().toISOString(), mirror, collections: manifest }, null, 2)
  );
  console.log(`\n${mirror ? "Exact mirror" : "Redacted snapshot"} of "${db.databaseName}" written to ${path.relative(process.cwd(), outDir)}`);
} finally {
  await conn.close();
}
