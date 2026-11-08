import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";

export const SNAPSHOT_DIR = path.resolve(import.meta.dir, "../../.data/snapshot");
export const hasSnapshot = () => fs.existsSync(path.join(SNAPSHOT_DIR, "manifest.json"));

export interface Manifest {
  database: string;
  takenAt: string;
  /** true = exact copy including password hashes; false = secrets redacted. */
  mirror?: boolean;
  collections: Record<string, { docs: number; indexes: number } | number>;
}

export const readManifest = (): Manifest => JSON.parse(fs.readFileSync(path.join(SNAPSHOT_DIR, "manifest.json"), "utf8"));

const { EJSON } = mongoose.mongo.BSON;

/** Read one collection from the local snapshot as BSON-typed documents. */
export function readCollection(name: string): Record<string, unknown>[] {
  const file = path.join(SNAPSHOT_DIR, `${name}.json`);
  if (!fs.existsSync(file)) return [];
  return EJSON.parse(fs.readFileSync(file, "utf8"), { relaxed: false }) as Record<string, unknown>[];
}

function readIndexes(name: string): Record<string, unknown>[] {
  const file = path.join(SNAPSHOT_DIR, `${name}.indexes.json`);
  if (!fs.existsSync(file)) return [];
  return EJSON.parse(fs.readFileSync(file, "utf8"), { relaxed: false }) as Record<string, unknown>[];
}

/**
 * Restore the snapshot into `db`: replaces each collection's documents (raw inserts,
 * no model logic) and recreates its indexes exactly as exported.
 */
export async function restoreSnapshot(db: mongoose.mongo.Db) {
  const manifest = readManifest();
  const counts: Record<string, number> = {};
  for (const name of Object.keys(manifest.collections)) {
    const docs = readCollection(name);
    await db.collection(name).drop().catch(() => {});
    await db.createCollection(name);
    for (const spec of readIndexes(name)) {
      const { key, name: indexName, ...options } = spec;
      delete options.v; // server-managed fields, not createIndex options
      delete options.ns;
      if (indexName === "_id_") continue;
      await db.collection(name).createIndex(key as mongoose.mongo.IndexSpecification, { ...options, name: indexName as string });
    }
    if (docs.length) await db.collection(name).insertMany(docs, { ordered: true });
    counts[name] = docs.length;
  }
  return counts;
}
