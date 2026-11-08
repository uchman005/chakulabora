/**
 * Test preload (see bunfig.toml): starts an in-memory MongoDB and stubs side effects.
 * Runs once per `bun test` process, before any test file is loaded.
 */
import { afterAll, mock } from "bun:test";
import path from "node:path";
import { MongoMemoryServer } from "mongodb-memory-server";

export interface SentMail {
  to: string;
  subject: string;
  text: string;
}

declare global {
  var __sentMail: SentMail[];
  var __mongo: MongoMemoryServer;
}

globalThis.__sentMail = [];

// `server-only` throws outside React Server Components; route handlers import it.
mock.module("server-only", () => ({}));
// revalidatePath needs a Next.js request store; it is a no-op under test.
mock.module("next/cache", () => ({ revalidatePath: () => {}, revalidateTag: () => {} }));
// Never send real email: record calls instead.
mock.module(path.resolve(import.meta.dir, "../src/lib/send-mail.ts"), () => ({
  default: async (to: string, subject: string, text: string) => {
    globalThis.__sentMail.push({ to, subject, text });
  },
}));

globalThis.__mongo = await MongoMemoryServer.create();
process.env.MONGODB_URL_LOCAL = globalThis.__mongo.getUri("chakulabora-test");

const teardown = async () => {
  const mongoose = await import("mongoose");
  await mongoose.disconnect();
  await globalThis.__mongo.stop();
};
try {
  afterAll(teardown);
} catch {
  // Preloaded by a plain `bun` script (not the test runner): stop on exit instead.
  process.on("beforeExit", teardown);
}
