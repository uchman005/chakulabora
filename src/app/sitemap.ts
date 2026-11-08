import type { MetadataRoute } from "next";
import { getApprovedPostSlugs } from "@/lib/posts";
import { SITE_URL } from "@/lib/site";

// Rendered per request so newly approved posts appear immediately (and builds never need the DB).
export const dynamic = "force-dynamic";

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/dashboard", priority: 0.9, changeFrequency: "daily" },
  { path: "/under_the_baobab_tree", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
  { path: "/auth/signup", priority: 0.6, changeFrequency: "yearly" },
  { path: "/coc", priority: 0.3, changeFrequency: "yearly" },
  { path: "/legal", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path === "/" ? "" : r.path}`,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  let posts: MetadataRoute.Sitemap = [];
  try {
    posts = (await getApprovedPostSlugs()).map((p) => ({
      url: `${SITE_URL}/post/${encodeURIComponent(p.blob)}`,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch (err) {
    // Database unavailable (e.g. during a build without env vars) — ship static routes only.
    console.error("sitemap: could not load posts", err);
  }

  return [...pages, ...posts];
}
