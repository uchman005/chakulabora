import type { Metadata } from "next";
import Link from "next/link";
import PageBackground from "@/components/PageBackground";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main id="main" className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-xl text-gray-900">
      <PageBackground src="/background.jpg" />
      <h1 className="max-w-4xl text-center text-3xl">
        The resource you are looking for does not exist on this server
      </h1>
      <Link href="/" className="text-center text-3xl text-blue-800 underline">
        Go back to home
      </Link>
    </main>
  );
}
