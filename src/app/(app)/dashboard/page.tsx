import Link from "next/link";
import PostCards from "@/components/PostCards";
import { getApprovedPosts } from "@/lib/posts";
import { pageMetadata } from "@/lib/metadata";
import type { IPost } from "@/types";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "Questions",
  description:
    "Browse questions from the Chakula Bora community on organic farming, agroecology, soil, livestock and more.",
  path: "/dashboard",
});

export default async function DashboardPage() {
  // Server-render the list so it is crawlable; the client revalidates with SWR.
  let posts: IPost[] | undefined;
  try {
    posts = await getApprovedPosts();
  } catch {
    posts = undefined;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-2 md:p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="m-0 text-2xl font-semibold">Community questions</h1>
        <Link href="/dashboard/questions" className="btn btn-primary">
          Ask a question
        </Link>
      </div>
      <PostCards endpoint="/api/posts/find" label="Community questions" initialData={posts} />
    </div>
  );
}
