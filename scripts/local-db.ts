/**
 * Run a persistent local MongoDB that mirrors the snapshot in .data/snapshot.
 *
 *   bun run db:local            # start (restores the snapshot on first run)
 *   bun run db:local --reset    # wipe and restore the snapshot again
 *   bun run db:mirror           # refresh the snapshot from production, then start fresh
 *
 * The app reads MONGODB_URL_LOCAL from .env.local, which points here.
 * Uses the mongod binary that mongodb-memory-server already downloaded.
 */
import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { hasSnapshot, readManifest, restoreSnapshot } from "../tests/snapshot/load";

const PORT = Number(process.env.LOCAL_DB_PORT ?? 27018);
const DB_NAME = "chakulaboraDB";
const dbPath = path.resolve(".data/db");
const reset = process.argv.includes("--reset");

if (reset) fs.rmSync(dbPath, { recursive: true, force: true });
fs.mkdirSync(dbPath, { recursive: true });

const server = await MongoMemoryServer.create({
  instance: { port: PORT, dbPath, storageEngine: "wiredTiger", ip: "127.0.0.1" },
});
const url = `mongodb://127.0.0.1:${PORT}/${DB_NAME}`;

const stop = async (code = 0) => {
  await server.stop({ doCleanup: false });
  process.exit(code);
};
process.on("SIGINT", () => stop());
process.on("SIGTERM", () => stop());

try {
  const conn = await mongoose.createConnection(url).asPromise();
  const db = conn.db!;
  if ((await db.listCollections().toArray()).length === 0) {
    if (!hasSnapshot()) {
      console.error("No snapshot found. Run: bun run db:snapshot --mirror");
    } else {
      const counts = await restoreSnapshot(db);
      const m = readManifest();
      console.log(`Restored ${m.mirror ? "exact mirror" : "redacted snapshot"} of "${m.database}" taken ${m.takenAt}:`, counts);
    }
  } else {
    console.log(`Using existing data in ${path.relative(process.cwd(), dbPath)} (pass --reset to restore the snapshot again)`);
  }
  await conn.close();
} catch (err) {
  console.error(err);
  await stop(1);
}

console.log(`\nLocal MongoDB running.\n  MONGODB_URL_LOCAL=${url}\nPress Ctrl+C to stop.`);
await new Promise(() => {});
