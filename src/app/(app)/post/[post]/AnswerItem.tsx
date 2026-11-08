"use client";

import { useRef } from "react";
import { useSession } from "next-auth/react";
import parse from "html-react-parser";
import { AiFillDelete, AiFillDislike, AiFillLike, AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import { useAppSelector } from "@/store";
import { notify } from "@/lib/toast";
import type { IAnswer } from "@/types";
import { displayName, isModerator } from "@/lib/user";

export default function AnswerItem({ data, mutate }: { data: IAnswer; mutate: () => void }) {
  const { status } = useSession();
  const user = useAppSelector((state) => state.user);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const upvotes = data.upvotes ?? [];
  const downvotes = data.downvotes ?? [];
  const upvoted = !!user.id && upvotes.includes(user.id);
  const downvoted = !!user.id && downvotes.includes(user.id);
  const score = upvotes.length - downvotes.length;

  const vote = async (like: boolean) => {
    const active = like ? upvoted : downvoted;
    const api = active ? "/api/answers/dislike" : "/api/answers/like";
    const res = await fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ like, answer_id: data._id }),
    });
    if ((await res.json()) === true) {
      mutate();
      notify({
        title: like ? (active ? "Like Removed" : "Answer Liked") : active ? "Dislike Removed" : "Answer Disliked",
        description: like
          ? active
            ? "Your like for this Answer was removed, thanks for your feedback"
            : "You liked the answer, thanks for your feedback"
          : active
            ? "Your dislike for this answer was removed, thanks for your feedback"
            : "You disliked the answer, thanks for your feedback",
        status: "success",
      });
    }
  };

  const signedOutNotice = (action: string) =>
    notify({ title: "You are not signed in", description: `You must be signed in to ${action}`, status: "info" });

  const deleteAnswer = async () => {
    const res = await fetch(`/api/answers/${data._id}`, { method: "DELETE" });
    const result = await res.json();
    if (result.success) {
      notify({ title: "Answer deleted", description: "The answer has been deleted.", status: "success", duration: 3000 });
    } else {
      notify({ title: "Error", description: "There was an error deleting the answer.", status: "error", duration: 3000 });
    }
    mutate();
    dialogRef.current?.close();
  };

  const authorName = data.author?.id ? displayName(data.author) : "Anonymous";
  const voteBtn = "rounded-md p-1 hover:bg-gray-200";

  return (
    <li id={`answer-${data._id}`} className="flex items-center justify-start gap-3 border-b border-gray-200 py-3">
      <div className="flex flex-col items-center" role="group" aria-label="Rate this answer">
        {status === "authenticated" ? (
          <>
            {!downvoted && (
              <button type="button" onClick={() => vote(true)} className={voteBtn} aria-pressed={upvoted} aria-label={upvoted ? "Remove like" : "Like answer"}>
                {upvoted ? <AiFillLike className="text-green-700" aria-hidden /> : <AiOutlineLike aria-hidden />}
              </button>
            )}
            <span aria-label={`Score ${score}`}>{score}</span>
            {!upvoted && (
              <button type="button" onClick={() => vote(false)} className={voteBtn} aria-pressed={downvoted} aria-label={downvoted ? "Remove dislike" : "Dislike answer"}>
                {downvoted ? <AiFillDislike className="text-red-600" aria-hidden /> : <AiOutlineDislike aria-hidden />}
              </button>
            )}
          </>
        ) : (
          <>
            <button type="button" className={voteBtn} onClick={() => signedOutNotice("like")} aria-label="Like answer">
              <AiOutlineLike aria-hidden />
            </button>
            <span aria-label={`Score ${score}`}>{score}</span>
            <button type="button" className={voteBtn} onClick={() => signedOutNotice("dislike")} aria-label="Dislike answer">
              <AiOutlineDislike aria-hidden />
            </button>
          </>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="prose-content">{parse(data.body ?? "")}</div>
        <div className="flex flex-wrap items-center gap-4 text-base">
          <span>{authorName}</span>
          <time>{data.time}</time>
          {isModerator(user) && (
            <button type="button" onClick={() => dialogRef.current?.showModal()} aria-label="Delete answer" className="rounded-md p-1 hover:bg-red-50">
              <AiFillDelete className="text-2xl text-red-600" aria-hidden />
            </button>
          )}
        </div>
      </div>

      {/* Native <dialog>: built-in focus trapping, Escape to close, and backdrop. */}
      <dialog
        ref={dialogRef}
        aria-labelledby={`delete-title-${data._id}`}
        className="m-auto rounded-sm bg-white p-4 shadow-lg backdrop:bg-black/50"
      >
        <h2 id={`delete-title-${data._id}`} className="mb-4 text-xl">
          Are you sure you want to delete this item?
        </h2>
        <div className="flex gap-2">
          <button type="button" onClick={deleteAnswer} className="rounded-sm bg-red-600 px-4 py-2 text-white hover:bg-red-700">
            Confirm
          </button>
          <button type="button" onClick={() => dialogRef.current?.close()} className="rounded-sm bg-gray-600 px-4 py-2 text-white hover:bg-gray-700" autoFocus>
            Cancel
          </button>
        </div>
      </dialog>
    </li>
  );
}
