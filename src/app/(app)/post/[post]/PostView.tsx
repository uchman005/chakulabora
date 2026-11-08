"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import parse from "html-react-parser";
import { AiFillDislike, AiFillLike, AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import RichTextEditor from "@/components/RichTextEditor";
import ShareButtons from "@/components/ShareButtons";
import { useAppSelector } from "@/store";
import { notify } from "@/lib/toast";
import { displayName, isModerator } from "@/lib/user";
import type { IAnswer, IPost } from "@/types";
import AnswerItem from "./AnswerItem";

const postJson = async <T,>(url: string, body?: unknown): Promise<T> => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return res.json();
};
const fetcher = <T,>(url: string) => postJson<T>(url);

interface PostViewProps {
  blob: string;
  initialPost: IPost;
  initialAnswers: IAnswer[];
}

export default function PostView({ blob, initialPost, initialAnswers }: PostViewProps) {
  const router = useRouter();
  const { status } = useSession();
  const user = useAppSelector((state) => state.user);
  const [value, setValue] = useState("");
  const [posting, setPosting] = useState(false);

  const { data, mutate } = useSWR<IPost | null>(`/api/posts/${blob}`, fetcher, { fallbackData: initialPost });
  const post = data ?? initialPost;
  const { data: answers, mutate: mutateAnswers } = useSWR<IAnswer[] | null>(
    post._id ? `/api/answers/${post._id}` : null,
    fetcher,
    { fallbackData: initialAnswers }
  );

  const signedIn = status === "authenticated";
  const upvoted = !!user.id && !!post.upvotes?.includes(user.id);
  const downvoted = !!user.id && !!post.downvotes?.includes(user.id);

  const vote = async (like: boolean) => {
    const active = like ? upvoted : downvoted;
    // Same endpoint semantics as before: "dislike" removes an existing vote, "like" adds one.
    const api = active ? "/api/posts/dislike" : "/api/posts/like";
    const ok = await postJson<unknown>(api, { like, post_id: post._id });
    if (ok === true) {
      mutate();
      notify({
        title: like ? (active ? "Like Removed" : "Post Liked") : active ? "Dislike Removed" : "Post Disliked",
        description: like
          ? active
            ? "Your like for this post was removed, thanks for your feedback"
            : "You liked the post, thanks for your feedback"
          : active
            ? "Your dislike for this post was removed, thanks for your feedback"
            : "You disliked the post, thanks for your feedback",
        status: "success",
      });
    }
  };

  const signedOutNotice = () =>
    notify({ title: "You're signed out", description: "You must be signed in to perform this action", status: "info" });

  const handleAccept = async () => {
    const res = await postJson<IPost | null>("/api/posts/approve", { _id: post._id });
    if (res?.approved === true) {
      notify({ title: "Approved successfully", description: "Post has been approved successfully", status: "success" });
      router.replace("/dashboard/approve");
      return;
    }
    notify({ title: "Approval Failed", description: "Post approval failed for some reason", status: "warning" });
  };

  const handleReject = async () => {
    const res = await postJson<{ acknowledged?: boolean }>("/api/posts/reject", { blob: post.blob });
    if (res?.acknowledged) {
      notify({ title: "Post rejected", description: "You have rejected this post, A mail will be sent to the user", status: "success", duration: 2000 });
    } else {
      notify({ title: "Post rejecting failed", description: "You have rejected this post, but the process failed unexpectedly", status: "warning", duration: 2000 });
    }
  };

  const submitAnswer = async () => {
    setPosting(true);
    try {
      const { answer, message } = await postJson<{ answer: IAnswer | null; message: string }>("/api/answers/create", {
        body: value,
        post: post._id,
        blob: post.blob,
      });
      if (answer !== null) {
        notify({ title: "Answer posted", description: message, status: "success" });
        setValue("");
        mutateAnswers();
      } else {
        notify({ title: "Answer posting failed", description: message, status: "warning" });
      }
    } finally {
      setPosting(false);
    }
  };

  if (data === null) return <h1>Post not found</h1>;

  // Unapproved post: moderators review it, everyone else sees a notice.
  if (post.approved === false) {
    if (!(signedIn && isModerator(user))) {
      return <h1 className="text-center text-3xl underline">This post is not yet approved</h1>;
    }
    return (
      <article className="px-3 text-gray-700">
        <h1 className="mb-4 text-2xl">Read the post below and approve</h1>
        <p>The question must pass these criteria</p>
        <ol className="list-decimal">
          <li>Must be in English</li>
          <li>Information on the body must match the title</li>
          <li>Must not contain adverts of any kind</li>
        </ol>
        <div>
          <p>Title: {post.title}</p>
          <p>Category: {post.category}</p>
          <p>Body: </p>
          <div className="prose-content text-center">{parse(post.body ?? "")}</div>
          {post.image && (
            <Image src={post.image} alt={post.title ?? ""} width={1000} height={1000} sizes="(min-width: 768px) 70vw, 100vw" className="mx-auto h-auto max-w-full" />
          )}
        </div>
        <div className="m-3 flex justify-between gap-4 p-4">
          <button type="button" className="btn btn-success w-full text-2xl" onClick={handleAccept}>
            Approve
          </button>
          <button type="button" className="btn btn-danger w-full text-2xl" onClick={handleReject}>
            Reject
          </button>
        </div>
      </article>
    );
  }

  const likes = post.upvotes?.length ?? 0;
  const dislikes = post.downvotes?.length ?? 0;
  const voteBtn = "flex items-center gap-1 rounded-md p-1 hover:bg-gray-300";

  return (
    <article className="px-3 text-gray-700">
      <header className="text-center">
        <h1 className="mb-4 text-gray-900">{post.title}</h1>
      </header>
      <div className="prose-content text-center">{parse(post.body ?? "")}</div>
      {post.image && (
        <Image
          src={post.image}
          alt={post.title ?? ""}
          width={1000}
          height={1000}
          sizes="(min-width: 768px) 70vw, 100vw"
          priority
          className="mx-auto h-auto max-w-full"
        />
      )}

      <dl className="flex justify-between gap-5 px-3">
        <div>
          <dt>Asked by</dt>
          <dd className="text-xl">{displayName(post.author)}</dd>
        </div>
        <div>
          <dt>Date</dt>
          <dd className="text-wrap">
            <time>{post.time}</time>
          </dd>
        </div>
        <div>
          <dt>Category</dt>
          <dd className="text-wrap">{post.category}</dd>
        </div>
      </dl>

      <div className="m-4 flex justify-evenly gap-5 px-3" role="group" aria-label="Rate this post">
        {signedIn ? (
          <>
            {!downvoted && (
              <button type="button" onClick={() => vote(true)} className={voteBtn} aria-pressed={upvoted} aria-label={`${upvoted ? "Remove like" : "Like"} (${likes} likes)`}>
                {upvoted ? <AiFillLike className="text-2xl text-green-700" aria-hidden /> : <AiOutlineLike className="text-2xl" aria-hidden />} {likes}
              </button>
            )}
            {!upvoted && (
              <button type="button" onClick={() => vote(false)} className={voteBtn} aria-pressed={downvoted} aria-label={`${downvoted ? "Remove dislike" : "Dislike"} (${dislikes} dislikes)`}>
                {downvoted ? <AiFillDislike className="text-2xl text-red-600" aria-hidden /> : <AiOutlineDislike className="text-2xl" aria-hidden />} {dislikes}
              </button>
            )}
          </>
        ) : (
          <>
            <button type="button" onClick={signedOutNotice} className={voteBtn}>
              Likes: {likes}
            </button>
            <button type="button" onClick={signedOutNotice} className={voteBtn}>
              Dislikes: {dislikes}
            </button>
          </>
        )}
      </div>

      {post.blob && <ShareButtons title={post.title ?? ""} blob={post.blob} />}

      <section aria-labelledby="answers-heading" className="m-2 p-1">
        <h2 id="answers-heading" className="text-xl">
          {!answers || answers.length === 0
            ? "No answers Yet"
            : `${answers.length} answer${answers.length === 1 ? "" : "s"} for this post`}
        </h2>
        {answers && answers.length > 0 && (
          <ol className="m-0 list-none p-0">
            {answers.map((item) => (
              <AnswerItem key={item._id} data={item} mutate={() => mutateAnswers()} />
            ))}
          </ol>
        )}
      </section>

      <section aria-labelledby="your-answer">
        <h2 id="your-answer" className="text-xl">
          {signedIn ? "Post your answer" : "Post your answer Anonymously"}
        </h2>
        <RichTextEditor
          label="Your answer"
          value={value}
          onChange={setValue}
          placeholder="Please be as detailed as possible."
          className="mb-3"
        />
        <button type="button" className="btn btn-outline-success" onClick={submitAnswer} disabled={posting} aria-busy={posting}>
          {posting ? "Posting…" : "Post"}
        </button>
      </section>
    </article>
  );
}
