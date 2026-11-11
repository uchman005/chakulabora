import type { Metadata } from "next";
import Link from "next/link";
import PostCards from "@/components/PostCards";
import PostSearchForm from "@/components/PostSearchForm";
import { getApprovedPosts } from "@/lib/posts";
import { pageMetadata } from "@/lib/metadata";
import { getTopics, searchApprovedPosts } from "@/lib/search";
import { isSearching, parseSearch } from "@/lib/search-query";
import type { IPost } from "@/types";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const BASE = {
  title: "Questions",
  description:
    "Browse questions from the Chakula Bora community on organic farming, agroecology, soil, livestock and more.",
  path: "/dashboard",
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const search = parseSearch((await searchParams).q, (await searchParams).topic);
  if (!isSearching(search)) return pageMetadata(BASE);
  // Result pages keep the list's canonical URL and stay out of search engines.
  const label = [search.q && `“${search.q}”`, search.topic].filter(Boolean).join(" in ");
  return pageMetadata({ ...BASE, title: `Search: ${label}`, noIndex: true });
}

export default async function DashboardPage({ searchParams }: Props) {
  const params = await searchParams;
  const search = parseSearch(params.q, params.topic);
  const searching = isSearching(search);

  // Server-render the list so it is crawlable; the client revalidates with SWR.
  let posts: IPost[] | undefined;
  let topics: string[] = [];
  try {
    [posts, topics] = await Promise.all([searching ? searchApprovedPosts(search) : getApprovedPosts(), getTopics()]);
  } catch {
    posts = undefined;
  }

  const label = searching ? "Search results" : "Community questions";
  const emptyMessage = searching
    ? "No questions match your search. Try fewer or different words, or another topic."
    : "There are no questions to display yet.";

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-2 md:p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="m-0 text-2xl font-semibold">Community questions</h1>
        <Link href="/dashboard/questions" className="btn btn-primary">
          Ask a question
        </Link>
      </div>
      <PostSearchForm q={search.q} topic={search.topic} topics={topics} />
      <PostCards
        // Start again from page 1 whenever the search changes.
        key={`${search.q}|${search.topic}`}
        endpoint="/api/posts/find"
        label={label}
        search={searching ? { q: search.q, topic: search.topic } : undefined}
        initialData={posts}
        emptyMessage={emptyMessage}
      />
    </div>
  );
}
