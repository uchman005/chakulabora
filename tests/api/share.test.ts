import { describe, expect, test } from "bun:test";
import { postUrl, shareLinks } from "@/lib/share";

const BLOB = "best-cover-crops";
const URL_ = "https://chakulabora.net/post/best-cover-crops";

describe("shareLinks", () => {
  test("WhatsApp gets the title and the link", () => {
    const u = new URL(shareLinks("Best cover crops?", BLOB).whatsapp);
    expect(u.origin + u.pathname).toBe("https://wa.me/");
    expect(u.searchParams.get("text")).toBe(`Best cover crops?\n${URL_}`);
  });

  test("Facebook gets the link", () => {
    const u = new URL(shareLinks("Best cover crops?", BLOB).facebook);
    expect(u.origin + u.pathname).toBe("https://www.facebook.com/sharer/sharer.php");
    expect(u.searchParams.get("u")).toBe(URL_);
  });

  test("X gets the title and the link separately", () => {
    const u = new URL(shareLinks("Best cover crops?", BLOB).x);
    expect(u.origin + u.pathname).toBe("https://x.com/intent/post");
    expect(u.searchParams.get("text")).toBe("Best cover crops?");
    expect(u.searchParams.get("url")).toBe(URL_);
  });

  test("special characters in titles survive encoding and cannot add parameters", () => {
    const title = 'Soil & water? #1 100% "organic"&url=https://evil.example';
    const links = shareLinks(title, BLOB);
    const x = new URL(links.x);
    expect(x.searchParams.get("text")).toBe(title);
    expect(x.searchParams.get("url")).toBe(URL_);
    expect(new URL(links.whatsapp).searchParams.get("text")).toBe(`${title}\n${URL_}`);
  });

  test("a long title is shortened for X but kept whole for WhatsApp", () => {
    const title = "a".repeat(400);
    const links = shareLinks(title, BLOB);
    expect(new URL(links.x).searchParams.get("text")!.length).toBeLessThanOrEqual(250);
    expect(new URL(links.whatsapp).searchParams.get("text")).toContain(title);
  });

  test("an empty title still shares the link", () => {
    expect(new URL(shareLinks("", BLOB).whatsapp).searchParams.get("text")).toBe(URL_);
  });

  test("the slug is encoded in the post URL", () => {
    expect(postUrl("a b/c")).toBe("https://chakulabora.net/post/a%20b%2Fc");
  });
});
