import PostCards from "@/components/PostCards";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Approve posts",
  path: "/dashboard/approve",
  noIndex: true,
});

export default function ApprovePage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-2 md:p-4">
      <h1 className="m-0 text-2xl font-semibold">Posts awaiting approval</h1>
      <PostCards endpoint="/api/posts/unapproved" label="Posts awaiting approval" emptyMessage="No posts are waiting for approval." />
    </div>
  );
}
