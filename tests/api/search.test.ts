import { beforeAll, describe, expect, test } from "bun:test";
import { json, jsonRequest } from "../helpers";
import { dbCon } from "@/models";
import { getTopics, searchApprovedPosts } from "@/lib/search";
import { MAX_QUERY_LENGTH, MAX_TERMS, parseSearch } from "@/lib/search-query";
import * as postsFind from "@/app/api/posts/find/route";

const author = { id: "000000000000000000000abc", fname: "Search" };

const search = async (q: string, topic = "") => (await searchApprovedPosts(parseSearch(q, topic))).map((p) => p.blob);

beforeAll(async () => {
  const { Post } = await dbCon();
  const base = { author, upvotes: [], downvotes: [] };
  // Inserted oldest → newest (ObjectIds are time-ordered).
  await Post.create({ ...base, title: "Composting kitchen waste", category: "Composting", blob: "s-compost-waste", approved: true, body: "<p>How long does a <strong>heap</strong> take?</p>" });
  await Post.create({ ...base, title: "Improving clay soil", category: "Soil Science", blob: "s-clay-soil", approved: true, body: "<p>My field drains badly. Would compost or gypsum help with the clay?</p>" });
  await Post.create({ ...base, title: "Maize spacing", category: "Crop Production", blob: "s-maize", approved: true, body: "<p>What spacing works for maize on sandy soil near Nakuru?</p>" });
  await Post.create({ ...base, title: "Secret compost question", category: "Composting", blob: "s-pending", approved: false, body: "<p>compost</p>" });
  await Post.create({ ...base, title: "Regex (test) [x]", category: "Search Test", blob: "s-regex", approved: true, body: "<p>Price: 5.00 * 2 = 10? Use a+b</p>" });
});

describe("parseSearch", () => {
  test("trims, collapses spaces, lower-cases and de-duplicates terms", () => {
    expect(parseSearch("  Clay   SOIL clay ")).toEqual({ q: "Clay SOIL clay", topic: "", terms: ["clay", "soil"] });
  });
  test("limits length and number of terms, and ignores non-strings", () => {
    expect(parseSearch("x".repeat(500)).q.length).toBe(MAX_QUERY_LENGTH);
    expect(parseSearch("a b c d e f g h i j k").terms.length).toBe(MAX_TERMS);
    expect(parseSearch({ $ne: null }, ["Soil Science", "x"])).toEqual({ q: "", topic: "Soil Science", terms: [] });
  });
});

describe("searchApprovedPosts", () => {
  test("matches titles, case-insensitively and on partial words", async () => {
    expect(await search("MAIZE")).toEqual(["s-maize"]);
    expect(await search("compos")).toContain("s-compost-waste");
  });

  test("matches content (plain text) and returns an excerpt with the match", async () => {
    const [hit] = await searchApprovedPosts(parseSearch("gypsum"));
    expect(hit.blob).toBe("s-clay-soil");
    expect(hit.excerpt).toContain("gypsum");
    expect(hit.body).toBeUndefined();
  });

  test("matches the topic", async () => {
    expect(await search("production")).toEqual(["s-maize"]);
  });

  test("every word must match somewhere (title, topic or content in any mix)", async () => {
    expect(await search("clay gypsum")).toEqual(["s-clay-soil"]);
    expect(await search("maize nakuru")).toEqual(["s-maize"]);
    expect(await search("maize gypsum")).toEqual([]);
  });

  test("ranks title matches above content matches, then newest first", async () => {
    // "compost": title of s-compost-waste, content of s-clay-soil.
    expect(await search("compost")).toEqual(["s-compost-waste", "s-clay-soil"]);
    // "soil": title of s-clay-soil, topic of s-clay-soil, content of s-maize.
    expect((await search("soil"))[0]).toBe("s-clay-soil");
  });

  test("HTML tag names in the stored body never match", async () => {
    expect(await search("strong")).toEqual([]);
    expect(await search("<p>")).toEqual([]);
  });

  test("the topic filter is exact and case-insensitive, and combines with words", async () => {
    expect(await search("", "composting")).toEqual(["s-compost-waste"]);
    expect(await search("compost", "Soil Science")).toEqual(["s-clay-soil"]);
    expect(await search("", "Compost")).toEqual([]);
  });

  test("never returns unapproved posts", async () => {
    expect(await search("secret")).toEqual([]);
    expect(await search("", "Composting")).not.toContain("s-pending");
  });

  test("regex special characters are matched literally (no injection, no crash)", async () => {
    expect(await search("(test)")).toEqual(["s-regex"]);
    expect(await search("5.00 * 2")).toEqual(["s-regex"]);
    expect(await search("a+b")).toEqual(["s-regex"]);
    expect(await search("[x]")).toEqual(["s-regex"]); // a literal bracket, not a character class
    expect(await search(".*")).toEqual([]); // not "match everything"
    expect(await search("((")).toEqual([]); // an unbalanced group doesn't throw
    expect(await search("", ".*")).toEqual([]);
  });

  test("results never include author emails", async () => {
    const results = await searchApprovedPosts(parseSearch("soil"));
    for (const p of results) expect(Object.keys(p.author ?? {})).not.toContain("email");
  });

  test("topics list: approved categories only, de-duplicated, A–Z", async () => {
    const topics = await getTopics();
    expect(topics).toEqual([...topics].sort((a, b) => a.localeCompare(b)));
    expect(topics).toContain("Composting");
    expect(new Set(topics).size).toBe(topics.length);
  });
});

describe("POST /api/posts/find", () => {
  test("without a query returns every approved post (unchanged behaviour)", async () => {
    const all = await json(postsFind.POST(jsonRequest("/api/posts/find", {})));
    const searched = await json(postsFind.POST(jsonRequest("/api/posts/find", { q: "maize" })));
    expect(all.body.length).toBeGreaterThan(searched.body.length);
    expect(searched.body.map((p: { blob: string }) => p.blob)).toEqual(["s-maize"]);
  });

  test("accepts a topic, and ignores non-string input", async () => {
    const byTopic = await json(postsFind.POST(jsonRequest("/api/posts/find", { topic: "Crop Production" })));
    expect(byTopic.body.map((p: { blob: string }) => p.blob)).toEqual(["s-maize"]);
    const injected = await json(postsFind.POST(jsonRequest("/api/posts/find", { q: { $regex: ".*" }, topic: { $ne: null } })));
    expect(Array.isArray(injected.body)).toBe(true); // treated as "no search"
  });
});
