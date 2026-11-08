"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FaSpinner } from "react-icons/fa";
import { Image as IKImage, ImageKitAbortError, upload } from "@imagekit/next";
import RichTextEditor from "@/components/RichTextEditor";
import agricultureCategories from "@/utils/category";
import { useAppSelector } from "@/store";
import { notify } from "@/lib/toast";

const placeholder =
  "Please be as detailed as possible. You can Use Images(Size less than 10mb) to further describe your point.";

const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY ?? "";
const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT ?? "";
const authenticationEndpoint = process.env.NEXT_PUBLIC_AUTHENTICATION_ENDPOINT || "/api/posts/imagekit";

const emptyPost = { title: "", body: "", category: "", image: "" };

async function authenticator() {
  const response = await fetch(authenticationEndpoint);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Request failed with status ${response.status}: ${errorText}`);
  }
  const { signature, expire, token } = await response.json();
  return { signature, expire, token };
}

export default function AskQuestionForm() {
  const { status } = useSession();
  const user = useAppSelector((state) => state.user);
  const [postData, setPostData] = useState(emptyPost);
  const [busy, setBusy] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPostData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const controller = new AbortController();
    abortRef.current = controller;
    setIsUploading(true);
    setProgress(0);
    try {
      const { signature, expire, token } = await authenticator();
      const res = await upload({
        file,
        fileName: "chakulabora-post.png",
        publicKey,
        signature,
        expire,
        token,
        tags: ["Chakulabora", "Regenerative Agriculture"],
        customCoordinates: "10,10,10,10",
        isPrivateFile: false,
        useUniqueFileName: true,
        responseFields: ["tags"],
        folder: "/chakulabora/posts",
        abortSignal: controller.signal,
        onProgress: (e) => {
          if (e.lengthComputable) setProgress((e.loaded / e.total) * 100);
        },
      });
      if (res.url) setPostData((prev) => ({ ...prev, image: res.url as string }));
    } catch (error) {
      if (!(error instanceof ImageKitAbortError)) {
        notify({ title: "Image upload failed", description: (error as Error).message, status: "warning" });
      }
    } finally {
      setIsUploading(false);
      setProgress(null);
      abortRef.current = null;
    }
  };

  const cancelUpload = () => {
    abortRef.current?.abort();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    try {
      const response = await fetch("/api/posts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...postData, author: user }),
      });
      const { post, message } = await response.json();
      if (post === null) {
        notify({ title: "Post creation Failed", description: message, status: "warning" });
        return;
      }
      notify({ title: "Post created successfully", description: message, status: "success" });
      setPostData(emptyPost);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      notify({ title: "Post creation Failed", description: "Something went wrong, try again", status: "warning" });
    } finally {
      setBusy(false);
    }
  };

  if (status === "loading") return <p role="status">Loading...</p>;
  if (status === "unauthenticated") {
    return (
      <h1 className="text-2xl font-semibold">
        <Link href="/auth/signin" className="text-blue-700 underline">
          Login
        </Link>{" "}
        to ask questions
      </h1>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-md bg-white p-4 md:p-6">
      <h1 className="text-2xl">Ask a question</h1>
      <div>
        <label htmlFor="title" className="mb-2">
          Title
        </label>
        <input type="text" required name="title" id="title" value={postData.title} onChange={handleChange} className="form-field" />
      </div>
      <div>
        <label htmlFor="category" className="mb-2">
          Category
        </label>
        <input
          id="category"
          list="category-options"
          required
          placeholder="Select a category"
          className="form-field"
          name="category"
          value={postData.category}
          onChange={handleChange}
        />
        <datalist id="category-options">
          {agricultureCategories.map((item) => (
            <option value={item} key={item} />
          ))}
        </datalist>
      </div>

      <div>
        <label htmlFor="post-image" className="mr-4 mb-2">
          Image:
        </label>
        <input
          ref={fileInputRef}
          id="post-image"
          type="file"
          accept="image/*"
          onChange={handleFile}
          disabled={isUploading}
          className="block text-base file:mr-4 file:rounded-md file:border-0 file:bg-gray-200 file:px-3 file:py-1.5 hover:file:bg-gray-300"
        />
        <div aria-live="polite" className="mt-2 text-base">
          {isUploading && (
            <span>
              ...Uploading{progress !== null ? ` (${progress.toFixed(2)}%)` : ""}
            </span>
          )}
        </div>
        {isUploading && (
          <button type="button" className="btn btn-danger mt-2" onClick={cancelUpload}>
            Cancel
          </button>
        )}
        {postData.image && (
          <div className="relative mt-2">
            <IKImage urlEndpoint={urlEndpoint} src={postData.image} className="h-auto w-[40%]" alt="Preview of the uploaded image" width={400} height={400} />
          </div>
        )}
      </div>

      <div>
        <span className="mb-2 inline-block" aria-hidden="true">
          Post
        </span>
        <RichTextEditor
          label="Post body"
          value={postData.body}
          onChange={(body) => setPostData((prev) => ({ ...prev, body }))}
          placeholder={placeholder}
          className="mb-3"
        />
      </div>

      <button
        type="submit"
        disabled={busy || isUploading}
        aria-busy={busy}
        className="min-w-[100px] rounded-sm bg-blue-600 px-4 py-2 text-center font-bold text-white hover:bg-blue-800 disabled:opacity-65"
      >
        {busy ? (
          <>
            <FaSpinner className="mx-auto animate-spin text-3xl" aria-hidden />
            <span className="sr-only">Creating post…</span>
          </>
        ) : (
          "CREATE POST"
        )}
      </button>
    </form>
  );
}
