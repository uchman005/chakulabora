/**
 * One-off index migration required for phone sign-up.
 *
 *   bun scripts/migrate-phone-login.ts            # dry run against MONGODB_URL_LOCAL
 *   bun scripts/migrate-phone-login.ts --apply    # make the change
 *
 * The existing unique `email_1` index treats a missing email as a value, so only one
 * phone-only account could ever exist. This replaces it with a partial unique index and
 * adds the same for `loginPhone`. No documents change; emails stay unique throughout,
 * except for the moment between the drop and the create.
 *
 * Refuses a non-local database unless --allow-remote is passed explicitly.
 */
import mongoose from "mongoose";

const url = process.env.MONGODB_URL_LOCAL;
if (!url) throw new Error("Set MONGODB_URL_LOCAL");
const apply = process.argv.includes("--apply");
const host = new URL(url.replace(/^mongodb(\+srv)?:/, "http:")).hostname;
if (!["127.0.0.1", "localhost", "::1"].includes(host) && !process.argv.includes("--allow-remote")) {
  console.error(`Refusing to modify non-local database host "${host}". Pass --allow-remote to override.`);
  process.exit(1);
}

const conn = await mongoose.createConnection(url).asPromise();
try {
  const users = conn.db!.collection("users");
  const indexes = await users.indexes();
  const email = indexes.find((i) => i.name === "email_1");
  const steps: [string, () => Promise<unknown>][] = [];

  if (email && !email.partialFilterExpression) {
    steps.push(["drop non-partial email_1", () => users.dropIndex("email_1")]);
  }
  if (!email || !email.partialFilterExpression) {
    steps.push([
      "create partial unique email_1",
      () => users.createIndex({ email: 1 }, { name: "email_1", unique: true, partialFilterExpression: { email: { $type: "string" } } }),
    ]);
  }
  if (!indexes.some((i) => i.name === "loginPhone_1")) {
    steps.push([
      "create partial unique loginPhone_1",
      () => users.createIndex({ loginPhone: 1 }, { name: "loginPhone_1", unique: true, partialFilterExpression: { loginPhone: { $type: "string" } } }),
    ]);
  }

  if (steps.length === 0) console.log("Nothing to do: indexes are already migrated.");
  for (const [label, run] of steps) {
    console.log(`${apply ? "Applying" : "Would apply"}: ${label}`);
    if (apply) await run();
  }
} finally {
  await conn.close();
}
