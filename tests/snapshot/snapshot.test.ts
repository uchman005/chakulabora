/**
 * Regression tests against a local copy of real data (.data/snapshot, created by
 * `bun run db:snapshot`). Skipped automatically when no snapshot exists.
 *
 * Restores the snapshot into the in-memory MongoDB, then checks Mongoose 9 schema
 * compatibility, the read helpers and APIs every page uses, the sanitizer's effect on
 * real content, and (if a production build exists) every real page over HTTP.
 */
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import type { Subprocess } from "bun";
import type mongoose from "mongoose";
import { ctx, json, jsonRequest } from "../helpers";
import { hasSnapshot, readCollection, readManifest, restoreSnapshot } from "./load";
import { dbCon } from "@/models";
import { getAnswersForPost, getApprovedPosts, getPostByBlob, plainText } from "@/lib/posts";
import { sanitizeRichText } from "@/lib/sanitize";
import { displayName } from "@/lib/user";
import sitemap from "@/app/sitemap";
import * as userGet from "@/app/api/[user]/user/route";
import * as userCount from "@/app/api/[user]/count/route";
import * as postsFind from "@/app/api/posts/find/route";
import * as postsCreate from "@/app/api/posts/create/route";

const enabled = hasSnapshot();
const suite = enabled ? describe : describe.skip;

type Doc = Record<string, unknown> & { _id: { toString(): string } };
const raw = enabled
  ? {
      users: readCollection("users") as Doc[],
      posts: readCollection("posts") as Doc[],
      answers: readCollection("answers") as Doc[],
      subscribers: readCollection("subscribers") as Doc[],
      contacts: readCollection("contacts") as Doc[],
    }
  : { users: [], posts: [], answers: [], subscribers: [], contacts: [] };

const EXECUTABLE = /<script|<iframe|<object|<embed|<form|<style|\son[a-z]+\s*=|javascript:|data:text\/html/i;

async function resetDb() {
  const { conn, ...models } = await dbCon();
  await conn.db!.dropDatabase();
  return { conn, models };
}

beforeAll(async () => {
  if (!enabled) return;
  const { conn } = await resetDb();
  await restoreSnapshot(conn.db!);
});

afterAll(async () => {
  if (!enabled) return;
  // Leave a clean database (with indexes) for any suite that runs afterwards.
  const { models } = await resetDb();
  await Promise.all(Object.values(models).map((m) => m.createIndexes()));
});

suite(`snapshot: data integrity (${raw.users.length} users, ${raw.posts.length} posts, ${raw.answers.length} answers)`, () => {
  test("snapshot restored completely", async () => {
    const { conn } = await dbCon();
    for (const [name, docs] of Object.entries(raw)) {
      expect(await conn.db!.collection(name).countDocuments()).toBe(docs.length);
    }
  });

  test("secrets: redacted in a plain snapshot, bcrypt hashes intact in a mirror", () => {
    const mirror = readManifest().mirror === true;
    for (const u of raw.users) {
      if (mirror) {
        if (u.password !== undefined) expect(String(u.password)).toMatch(/^\$2[aby]\$\d{2}\$.{53}$/);
      } else {
        expect(u.password).toBeUndefined();
        expect(u.resetPasswordToken).toBeUndefined();
      }
    }
  });

  test("every document validates and hydrates under the Mongoose 9 models", async () => {
    const { User, Post, Answer, Subscriber, Contact } = await dbCon();
    const pairs = [
      [User, "users"],
      [Post, "posts"],
      [Answer, "answers"],
      [Subscriber, "subscribers"],
      [Contact, "contacts"],
    ] as const;
    for (const [Model, name] of pairs) {
      const docs: mongoose.Document[] = await (Model as mongoose.Model<unknown>).find({});
      expect(docs.length).toBe(raw[name].length);
      const failures = docs.map((d) => d.validateSync()).filter(Boolean);
      expect(failures).toEqual([]);
    }
  });

  test("blobs (post URLs) are unique and URL-safe", () => {
    const blobs = raw.posts.map((p) => String(p.blob));
    expect(new Set(blobs).size).toBe(blobs.length);
    for (const b of blobs) expect(b).toMatch(/^[\w-]+$/);
  });

  test("every user has a display name for the UI", () => {
    for (const u of raw.users) expect(displayName(u as never, String(u.email)).length).toBeGreaterThan(0);
  });
});

suite("snapshot: sanitizer on real content", () => {
  const bodies = [...raw.posts, ...raw.answers].map((d) => ({ id: d._id.toString(), body: String(d.body ?? "") }));

  test("no visible text is lost when sanitizing", () => {
    for (const { id, body } of bodies) {
      expect({ id, text: plainText(sanitizeRichText(body), 1e9) }).toEqual({ id, text: plainText(body, 1e9) });
    }
  });

  test("result has no executable content and is idempotent", () => {
    for (const { body } of bodies) {
      const clean = sanitizeRichText(body);
      expect(clean).not.toMatch(EXECUTABLE);
      expect(sanitizeRichText(clean)).toBe(clean);
    }
  });

  test("only allowlisted inline styles survive; CSS-variable styles copied from the old UI are dropped", () => {
    for (const { body } of bodies) {
      const clean = sanitizeRichText(body);
      // Real posts contain styles like `color: var(--chakra-colors-…)` pasted from the
      // site itself; those reference nothing outside the old app and are removed.
      expect(clean).not.toContain("var(--");
      for (const m of clean.matchAll(/style="([^"]*)"/g)) {
        for (const decl of m[1].split(";").filter(Boolean)) {
          expect(["color", "background-color", "font-weight", "text-align"]).toContain(decl.split(":")[0].trim());
        }
      }
    }
  });
});

suite("snapshot: read paths and APIs", () => {
  test("dashboard list = all approved posts, newest first, without bodies", async () => {
    const approved = raw.posts.filter((p) => p.approved);
    const list = await getApprovedPosts();
    expect(list.map((p) => p._id)).toEqual(
      approved.map((p) => p._id.toString()).sort().reverse() // ObjectIds sort by creation time
    );
    expect(list.every((p) => p.body === undefined)).toBe(true);
    const viaApi = await json(postsFind.POST());
    expect(viaApi.body.length).toBe(approved.length);
  });

  test("every post loads by blob with a sanitized body; answers load and match", async () => {
    for (const p of raw.posts) {
      const post = await getPostByBlob(String(p.blob));
      expect(post?._id).toBe(p._id.toString());
      expect(post!.body).toBe(sanitizeRichText(String(p.body)));
      const answers = await getAnswersForPost(p._id.toString());
      const expected = raw.answers.filter((a) => a.post === p._id.toString()).length;
      expect(answers).toHaveLength(expected);
      for (const a of answers ?? []) expect(a.body).not.toMatch(EXECUTABLE);
    }
  });

  test("every user profile loads without secrets; counts match the data", async () => {
    for (const u of raw.users) {
      const id = u._id.toString();
      const { status, body } = await json(userGet.GET(jsonRequest(`/api/${id}/user`), ctx({ user: id })));
      expect(status).toBe(200);
      expect(body.email).toBe(u.email);
      expect(body.password).toBeUndefined();

      const counts = await json(userCount.GET(jsonRequest(`/api/${id}/count`), ctx({ user: id })));
      expect(counts.body).toEqual({
        posts: raw.posts.filter((p) => (p.author as { id?: string })?.id === id).length,
        answers: raw.answers.filter((a) => (a.author as { id?: string } | null)?.id === id).length,
      });
    }
  });

  test("sitemap lists every approved post", async () => {
    const urls = (await sitemap()).map((e) => e.url);
    for (const p of raw.posts.filter((x) => x.approved)) {
      expect(urls).toContain(`https://chakulabora.net/post/${encodeURIComponent(String(p.blob))}`);
    }
  });

  test("Mongoose 9 pre-save hook: re-using a real post title yields a new unique blob", async () => {
    const slug = (t: unknown) => String(t).toLowerCase().replaceAll(" ", "-").replace(/[^\w-]+/g, "").replace(/-$/, "");
    // Pick a real post whose stored blob is exactly its title's slug, so a collision is guaranteed.
    const existing = raw.posts.find((p) => slug(p.title) === p.blob);
    if (!existing) return;
    const author = raw.users[0];
    const { body } = await json(
      postsCreate.POST(
        jsonRequest("/api/posts/create", {
          title: existing.title,
          body: "<p>copy</p>",
          category: "Test",
          image: "",
          author: { id: author._id.toString(), email: author.email },
        })
      )
    );
    expect(body.post.blob).not.toBe(existing.blob);
    expect(body.post.blob.startsWith(String(existing.blob))).toBe(true);
    const { Post } = await dbCon();
    await Post.deleteOne({ _id: body.post._id });
  });
});

// ---------------------------------------------------------------------------
const root = path.resolve(import.meta.dir, "../..");
const built = fs.existsSync(path.join(root, ".next", "BUILD_ID"));
const httpSuite = enabled && built ? describe : describe.skip;

httpSuite("snapshot: real pages over HTTP (next start)", () => {
  const PORT = 3192;
  const BASE = `http://localhost:${PORT}`;
  let server: Subprocess;

  beforeAll(async () => {
    server = Bun.spawn(["node", path.join(root, "node_modules/next/dist/bin/next"), "start", "-p", String(PORT)], {
      cwd: root,
      env: { ...process.env, NODE_ENV: "production", NEXTAUTH_URL: BASE, NEXTAUTH_SECRET: "snapshot-test" },
      stdout: "ignore",
      stderr: "ignore",
    });
    for (let i = 0; i < 120; i++) {
      try {
        if ((await fetch(`${BASE}/robots.txt`)).ok) return;
      } catch {
        /* starting */
      }
      await Bun.sleep(500);
    }
    throw new Error("next start did not come up");
  }, 90_000);

  afterAll(() => server?.kill());

  test("dashboard renders a card for every approved post", async () => {
    const htmlText = await (await fetch(`${BASE}/dashboard`)).text();
    for (const p of raw.posts.filter((x) => x.approved)) expect(htmlText).toContain(`href="/post/${p.blob}"`);
  });

  test("every real post page renders: 200, one h1, metadata, JSON-LD, nothing executable", async () => {
    for (const p of raw.posts) {
      const res = await fetch(`${BASE}/post/${p.blob}`);
      expect(res.status).toBe(200);
      const htmlText = await res.text();
      expect(htmlText.match(/<h1[\s>]/g)?.length).toBe(1);
      // Strip Next's own framework scripts, then look for injected executable markup.
      const withoutFramework = htmlText
        .replace(/<script src="\/_next\/[^"]+"[^>]*><\/script>/g, "")
        .replace(/<script>\(?self\.__next_f[\s\S]*?<\/script>/g, "")
        .replace(/<script id="_R_">[\s\S]*?<\/script>/g, "")
        .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, "")
        .replace(/<script src="\/_next\/[^"]+" noModule=""><\/script>/g, "");
      expect(withoutFramework).not.toMatch(/<script|<iframe|\son(error|load|click)=|href="javascript:/i);
      if (p.approved) {
        expect(htmlText).toContain(`<link rel="canonical" href="https://chakulabora.net/post/${p.blob}"`);
        const ld = htmlText.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
        expect(JSON.parse(ld!)["@type"]).toBe("QAPage");
      }
    }
  });

  test("sitemap.xml over HTTP includes every approved post", async () => {
    const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
    for (const p of raw.posts.filter((x) => x.approved)) expect(xml).toContain(`/post/${p.blob}`);
  });
});
