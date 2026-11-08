import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getAnswersForPost, getPostByBlob, plainText, redactUnapproved } from "@/lib/posts";
import { pageMetadata } from "@/lib/metadata";
import { SITE_URL } from "@/lib/site";
import { displayName } from "@/lib/user";
import type { IAnswer, IPost } from "@/types";
import JsonLd from "@/components/JsonLd";
import PostView from "./PostView";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ post: string }> };

// Deduplicate the DB read between generateMetadata and the page render.
const loadPost = cache((blob: string) => getPostByBlob(blob));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { post: blob } = await params;
  const post = await loadPost(blob);
  if (!post) return { title: "Post not found", robots: { index: false } };
  if (!post.approved) return { title: "Awaiting approval", robots: { index: false, follow: false } };

  return pageMetadata({
    title: post.title ?? "Question",
    description: plainText(post.body) || `A question about ${post.category} on Chakula Bora`,
    path: `/post/${post.blob}`,
    image: post.image ? { url: post.image, alt: post.title } : undefined,
  });
}

function buildJsonLd(post: IPost, answers: IAnswer[]) {
  const url = `${SITE_URL}/post/${post.blob}`;
  const toAnswer = (a: IAnswer) => ({
    "@type": "Answer",
    text: plainText(a.body, 5000),
    upvoteCount: a.upvotes?.length ?? 0,
    url: `${url}#answer-${a._id}`,
    author: {
      "@type": "Person",
      name: a.author?.id ? displayName(a.author) : "Anonymous",
    },
  });
  const accepted = answers.find((a) => a.isSolution);
  return {
    "@context": "https://schema.org",
    "@type": "QAPage",
    url,
    mainEntity: {
      "@type": "Question",
      name: post.title,
      text: plainText(post.body, 5000),
      answerCount: answers.length,
      upvoteCount: post.upvotes?.length ?? 0,
      ...(post.image ? { image: post.image } : {}),
      author: { "@type": "Person", name: displayName(post.author) },
      ...(accepted ? { acceptedAnswer: toAnswer(accepted) } : {}),
      suggestedAnswer: answers.filter((a) => a !== accepted).map(toAnswer),
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { post: blob } = await params;
  const post = await loadPost(blob);
  if (!post) notFound();

  const answers = post.approved && post._id ? ((await getAnswersForPost(post._id)) ?? []) : [];
  // Never embed an unapproved post's content in the HTML/RSC payload; moderators
  // receive the full post when the client revalidates.
  const initialPost: IPost = post.approved ? post : redactUnapproved(post);

  return (
    <>
      {post.approved && <JsonLd data={buildJsonLd(post, answers)} />}
      <PostView blob={blob} initialPost={initialPost} initialAnswers={answers} />
    </>
  );
}
