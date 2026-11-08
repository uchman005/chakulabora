/**
 * End-to-end regression suite: runs the production build (`next start`) against the
 * in-memory MongoDB from tests/setup.ts and checks real HTTP behaviour — sign-in via
 * NextAuth, server-rendered pages, SEO output and accessibility landmarks.
 *
 * Requires a fresh build first:  bun run test:e2e
 */
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import path from "node:path";
import type { Subprocess } from "bun";
import { dbCon } from "@/models";

const PORT = 3191;
const BASE = `http://localhost:${PORT}`;
let server: Subprocess;

const ids: { user?: string; post?: string } = {};
const BLOB = "best-cover-crops-for-maize";
const PENDING_BLOB = "pending-review-question";
const HOSTILE_BLOB = "hostile-post";

async function waitForServer(timeoutMs = 60_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${BASE}/robots.txt`);
      if (res.ok) return;
    } catch {
      /* not up yet */
    }
    await Bun.sleep(500);
  }
  throw new Error("next start did not come up");
}

const html = async (p: string) => {
  const res = await fetch(BASE + p, { redirect: "manual" });
  return { status: res.status, text: await res.text() };
};

beforeAll(async () => {
  const root = path.resolve(import.meta.dir, "../..");
  server = Bun.spawn(["node", path.join(root, "node_modules/next/dist/bin/next"), "start", "-p", String(PORT)], {
    cwd: root,
    env: {
      ...process.env,
      NODE_ENV: "production",
      MONGODB_URL_LOCAL: process.env.MONGODB_URL_LOCAL!,
      NEXTAUTH_URL: BASE,
      NEXTAUTH_SECRET: "e2e-test-secret",
      GOOGLE_CLIENT_ID: "test",
      GOOGLE_CLIENT_SECRET: "test",
    },
    stdout: "ignore",
    stderr: "pipe",
  });
  await waitForServer();

  // Seed: a user (through the real HTTP API), an approved post with an answer, a pending post.
  const created = await fetch(`${BASE}/api/users/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "e2e@example.com", password: "e2e-pass" }),
  }).then((r) => r.json());
  ids.user = created._id;

  const { Post, Answer } = await dbCon();
  const post = await Post.create({
    title: "Best cover crops for maize?",
    body: "<p>Which <strong>cover crops</strong> work best between maize seasons?</p>",
    author: { id: ids.user, email: "e2e@example.com" },
    category: "Crop Production",
    blob: BLOB,
    approved: true,
    upvotes: [],
    downvotes: [],
  });
  ids.post = String(post._id);
  await Answer.create({ body: "<p>Try mucuna and lablab.</p>", author: null, post: ids.post, upvotes: [], downvotes: [] });
  // Hostile content inserted directly (bypassing the API's write-time sanitizer).
  await Post.collection.insertOne({
    title: 'Hostile </script><script>alert("title")</script> title',
    body: '<p>visible</p><script>alert("body")</script><img src=x onerror="alert(1)"><a href="javascript:alert(2)">link</a><iframe src="https://evil.example"></iframe>',
    author: { id: ids.user, fname: '<img src=x onerror="alert(3)">' },
    category: "Soil Science",
    blob: HOSTILE_BLOB,
    approved: true,
    upvotes: [],
    downvotes: [],
  });
  await Post.create({
    title: "Pending review question",
    body: "<p>Not yet visible</p>",
    author: { id: ids.user },
    blob: PENDING_BLOB,
    approved: false,
  });
}, 120_000);

afterAll(() => {
  server?.kill();
});

// ---------------------------------------------------------------------------
describe("public pages", () => {
  const pages = ["/", "/about", "/contact", "/coc", "/legal", "/privacy", "/thankyou", "/lostdonor", "/under_the_baobab_tree", "/auth/signin", "/auth/signup", "/auth/forgotpassword", "/dashboard"];

  for (const p of pages) {
    test(`${p} renders with one <h1>, landmarks and a skip link`, async () => {
      const { status, text } = await html(p);
      expect(status).toBe(200);
      expect(text).toContain('<html lang="en"');
      expect(text).toContain('href="#main"');
      expect(text).toContain('id="main"');
      expect(text.match(/<h1[\s>]/g)?.length).toBe(1);
      expect(text).toMatch(/<link rel="canonical"|noindex|<title>Chakula Bora \| Connecting/);
    });
  }

  test("dashboard pages for signed-in tools are not indexable", async () => {
    for (const p of ["/dashboard/questions", "/dashboard/setting", "/dashboard/profile", "/dashboard/approve", "/auth/signin"]) {
      const { text } = await html(p);
      expect(text).toContain('name="robots" content="noindex');
    }
  });

  test("unknown route returns a real 404", async () => {
    expect((await html("/definitely-not-here")).status).toBe(404);
  });

  test("home page has Organization/WebSite JSON-LD and a correct share image", async () => {
    const { text } = await html("/");
    expect(text).toContain('"@type":"Organization"');
    expect(text).toContain('property="og:image" content="https://chakulabora.net/hero.jpg"');
    expect(text).not.toContain("hero.png");
  });
});

// ---------------------------------------------------------------------------
describe("server-rendered content (SEO)", () => {
  test("/dashboard lists approved questions in the initial HTML", async () => {
    const { text } = await html("/dashboard");
    expect(text).toContain("Best cover crops for maize?");
    expect(text).toContain(`href="/post/${BLOB}"`);
    expect(text).not.toContain("Pending review question");
    // Rendered as accessible cards (not a table).
    expect(text).not.toContain("<table");
    expect(text).toContain("<article");
    expect(text).toContain("Crop Production");
    expect(text).toMatch(/<h3[^>]*><a[^>]*aria-describedby="post-meta-/); // one described link per card
    expect(text).toMatch(/<time dateTime="\d{4}-\d{2}-\d{2}T/); // machine-readable date
    expect(text).toContain('<span class="sr-only">Likes</span>'); // counts have text labels
    expect(text).toMatch(/Showing 1–\d+ of \d+ posts/);
    expect(text).not.toMatch(/<span[^>]*aria-label=/); // no ignored aria-label on plain spans
  });

  test("/post/[blob] renders the question, answers, metadata and QAPage JSON-LD", async () => {
    const { status, text } = await html(`/post/${BLOB}`);
    expect(status).toBe(200);
    expect(text).toContain("<title>Best cover crops for maize? | Chakula Bora</title>");
    expect(text).toContain('property="og:title" content="Best cover crops for maize? | Chakula Bora"');
    expect(text).toContain(`<link rel="canonical" href="https://chakulabora.net/post/${BLOB}"`);
    expect(text).toContain('name="description" content="Which cover crops work best between maize seasons?"');
    expect(text).toContain("<strong>cover crops</strong>");
    expect(text).toContain("Try mucuna and lablab.");
    expect(text).toContain('"@type":"QAPage"');
    expect(text).toContain('"answerCount":1');
    expect(text).toContain("1 answer for this post");
  });

  test("hostile stored content cannot inject markup or scripts", async () => {
    const { status, text } = await html(`/post/${HOSTILE_BLOB}`);
    expect(status).toBe(200);
    expect(text).toContain("<p>visible</p>");
    // Nothing executable survives in the HTML or the RSC payload.
    expect(text).not.toContain('<script>alert("title")');
    expect(text).not.toContain('<script>alert(\\"body\\")');
    expect(text).not.toContain('<script>alert("body")');
    expect(text).not.toMatch(/<img[^>]*onerror/);
    expect(text).not.toContain('href="javascript:');
    expect(text).not.toContain("evil.example");
    // The title is shown as text, and inside JSON-LD it is escaped so it can't close the <script>.
    expect(text).toContain("Hostile &lt;/script&gt;&lt;script&gt;");
    const ld = text.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] ?? "";
    expect(ld).toContain("\\u003c/script\\u003e");
    expect(JSON.parse(ld).mainEntity.name).toBe('Hostile </script><script>alert("title")</script> title');
    // A hostile author name renders as escaped text on the dashboard card.
    const dash = (await html("/dashboard")).text;
    expect(dash).not.toMatch(/<img[^>]*onerror="alert\(3\)"/);
  });

  test("unapproved post is hidden and noindexed", async () => {
    const { text } = await html(`/post/${PENDING_BLOB}`);
    expect(text).toContain("This post is not yet approved");
    expect(text).toContain('name="robots" content="noindex, nofollow"');
    expect(text).not.toContain("Not yet visible");
  });

  test("unknown post returns 404", async () => {
    expect((await html("/post/no-such-post")).status).toBe(404);
  });

  test("sitemap includes approved posts only; robots and manifest are served", async () => {
    const sitemap = (await html("/sitemap.xml")).text;
    expect(sitemap).toContain(`https://chakulabora.net/post/${BLOB}`);
    expect(sitemap).not.toContain(PENDING_BLOB);
    expect(sitemap).toContain("<loc>https://chakulabora.net/about</loc>");

    const robots = (await html("/robots.txt")).text;
    expect(robots).toContain("Disallow: /api/");
    expect(robots).toContain("Sitemap: https://chakulabora.net/sitemap.xml");

    const manifest = JSON.parse((await html("/manifest.webmanifest")).text);
    expect(manifest.icons).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
describe("authentication over HTTP (NextAuth credentials)", () => {
  async function signIn(email: string, password: string) {
    const csrfRes = await fetch(`${BASE}/api/auth/csrf`);
    const { csrfToken } = await csrfRes.json();
    const cookies = csrfRes.headers.getSetCookie().map((c) => c.split(";")[0]);

    const res = await fetch(`${BASE}/api/auth/callback/credentials`, {
      method: "POST",
      redirect: "manual",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Cookie: cookies.join("; ") },
      body: new URLSearchParams({ csrfToken, email, password, json: "true", callbackUrl: `${BASE}/dashboard` }),
    });
    const all = [...cookies, ...res.headers.getSetCookie().map((c) => c.split(";")[0])];
    const body = await res.json().catch(() => ({}));
    const session = await fetch(`${BASE}/api/auth/session`, { headers: { Cookie: all.join("; ") } }).then((r) => r.json());
    return { body, session, cookies: all };
  }

  test("valid credentials create a session whose user.email is the Mongo id", async () => {
    const { session } = await signIn("e2e@example.com", "e2e-pass");
    expect(session?.user?.email).toBe(ids.user);
  });

  test("wrong password does not create a session and reports the error", async () => {
    const { body, session } = await signIn("e2e@example.com", "wrong");
    expect(String(body.url)).toContain("error=");
    expect(session?.user).toBeUndefined();
  });

  test("signed-in user can load their own profile via the API", async () => {
    const res = await fetch(`${BASE}/api/${ids.user}/user`);
    const user = await res.json();
    expect(user.email).toBe("e2e@example.com");
    expect(user.password).toBeUndefined();
  });
});
