"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import { FiCalendar, FiChevronLeft, FiChevronRight, FiUser } from "react-icons/fi";
import { displayName } from "@/lib/user";
import type { IPost } from "@/types";

const postFetcher = (url: string) => fetch(url, { method: "POST" }).then((res) => res.json());

const PAGE_SIZE = 12;

/** Mongo ObjectIds embed their creation time; use it for a machine-readable date. */
function isoFromObjectId(id?: string): string | undefined {
  if (!id || !/^[0-9a-f]{24}$/i.test(id)) return undefined;
  return new Date(parseInt(id.slice(0, 8), 16) * 1000).toISOString();
}

interface PostCardsProps {
  /** API endpoint returning the posts (POST). */
  endpoint: string;
  /** Accessible name for the list, e.g. "Community questions". */
  label: string;
  initialData?: IPost[];
  emptyMessage?: string;
}

/** Responsive, accessible card grid of posts with pagination. */
export default function PostCards({ endpoint, label, initialData, emptyMessage = "There are no questions to display yet." }: PostCardsProps) {
  const { data, isLoading } = useSWR<IPost[]>(endpoint, postFetcher, { fallbackData: initialData });
  const [page, setPage] = useState(0);
  const regionRef = useRef<HTMLElement>(null);
  const headingId = `${label.replace(/\W+/g, "-").toLowerCase()}-heading`;

  if (isLoading && !data) {
    return (
      <div>
        <p role="status" className="sr-only">
          Loading {label.toLowerCase()}…
        </p>
        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
          {Array.from({ length: 6 }, (_, i) => (
            <li key={i} className="h-40 animate-pulse rounded-xl bg-white motion-reduce:animate-none" />
          ))}
        </ul>
      </div>
    );
  }

  const posts = Array.isArray(data) ? data : [];
  if (posts.length === 0) {
    return (
      <p role="status" className="rounded-xl bg-white p-8 text-center text-gray-700">
        {emptyMessage}
      </p>
    );
  }

  const pageCount = Math.ceil(posts.length / PAGE_SIZE);
  const current = Math.min(page, pageCount - 1);
  const start = current * PAGE_SIZE;
  const visible = posts.slice(start, start + PAGE_SIZE);

  const goTo = (next: number) => {
    setPage(next);
    // Move focus to the list so keyboard and screen-reader users land on the new page.
    requestAnimationFrame(() => {
      regionRef.current?.focus({ preventScroll: true });
      regionRef.current?.scrollIntoView({ block: "start" });
    });
  };

  return (
    <section ref={regionRef} tabIndex={-1} aria-labelledby={headingId} className="space-y-4 outline-none">
      <h2 id={headingId} className="sr-only">
        {label}
      </h2>
      <p className="m-0 text-base text-gray-700" aria-live="polite">
        {`Showing ${start + 1}–${start + visible.length} of ${posts.length} ${posts.length === 1 ? "post" : "posts"}`}
      </p>

      <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((post) => (
          <li key={post._id ?? post.blob}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>

      {pageCount > 1 && (
        <nav aria-label={`${label} pages`} className="flex items-center justify-center gap-4 pt-2 text-base">
          <button
            type="button"
            onClick={() => goTo(current - 1)}
            disabled={current === 0}
            className="inline-flex min-h-11 items-center gap-1 rounded-md bg-white px-4 py-2 shadow-sm ring-1 ring-black/10 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiChevronLeft aria-hidden /> Previous<span className="sr-only"> page</span>
          </button>
          <span>
            Page {current + 1} of {pageCount}
          </span>
          <button
            type="button"
            onClick={() => goTo(current + 1)}
            disabled={current >= pageCount - 1}
            className="inline-flex min-h-11 items-center gap-1 rounded-md bg-white px-4 py-2 shadow-sm ring-1 ring-black/10 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next<span className="sr-only"> page</span> <FiChevronRight aria-hidden />
          </button>
        </nav>
      )}
    </section>
  );
}

function PostCard({ post }: { post: IPost }) {
  const likes = post.upvotes?.length ?? 0;
  const dislikes = post.downvotes?.length ?? 0;
  const metaId = `post-meta-${post._id ?? post.blob}`;
  const iso = isoFromObjectId(post._id);

  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/10 transition hover:-translate-y-0.5 hover:shadow-md has-[a:focus-visible]:ring-4 has-[a:focus-visible]:ring-blue-600 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      {post.image && (
        // Decorative thumbnail: the title carries the meaning.
        <div className="relative aspect-[16/9] bg-gray-100">
          <Image src={post.image} alt="" fill sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw" className="object-cover" />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="m-0 text-lg leading-snug font-semibold text-gray-900">
          {/* One link per card; the ::after overlay makes the whole card the click target. */}
          <Link
            href={`/post/${post.blob}`}
            aria-describedby={metaId}
            className="after:absolute after:inset-0 after:content-[''] group-hover:text-blue-800 group-hover:underline focus-visible:outline-none"
          >
            {post.title}
          </Link>
        </h3>

        <dl id={metaId} className="m-0 mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-700">
          {post.category && (
            <div className="w-full">
              <dt className="sr-only">Category</dt>
              <dd className="m-0 inline-block rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-800 ring-1 ring-green-700/30">
                {post.category}
              </dd>
            </div>
          )}
          <div className="inline-flex items-center gap-1">
            <dt>
              <FiUser aria-hidden />
              <span className="sr-only">Asked by</span>
            </dt>
            <dd className="m-0">{displayName(post.author)}</dd>
          </div>
          {post.time && (
            <div className="inline-flex items-center gap-1">
              <dt>
                <FiCalendar aria-hidden />
                <span className="sr-only">Date</span>
              </dt>
              <dd className="m-0">
                <time dateTime={iso}>{post.time}</time>
              </dd>
            </div>
          )}
          <div className="ml-auto inline-flex items-center gap-1">
            <dt>
              <AiOutlineLike aria-hidden />
              <span className="sr-only">Likes</span>
            </dt>
            <dd className="m-0">{likes}</dd>
          </div>
          <div className="inline-flex items-center gap-1">
            <dt>
              <AiOutlineDislike aria-hidden />
              <span className="sr-only">Dislikes</span>
            </dt>
            <dd className="m-0">{dislikes}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
