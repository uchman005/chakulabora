"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main" className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-xl text-gray-900">
      <h1 className="max-w-4xl text-center text-3xl">An error occurred, check your connection and try again</h1>
      <div className="flex gap-4">
        <button type="button" onClick={reset} className="btn btn-primary text-xl">
          Try again
        </button>
        <Link href="/" className="btn border-gray-300 text-xl text-blue-800">
          Go back to home
        </Link>
      </div>
    </main>
  );
}
