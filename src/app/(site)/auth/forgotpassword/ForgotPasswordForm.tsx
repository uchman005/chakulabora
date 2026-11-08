"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { notify } from "@/lib/toast";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const { status } = useSession();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") router.replace("/dashboard");
  }, [status, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/users/forgotpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      notify({
        title: data.success ? "Success" : "Error",
        description: data.message,
        status: data.success ? "success" : "warning",
      });
    } catch {
      notify({ title: "Error", description: "Something went wrong", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 pt-24">
      <h1 className="mb-3 text-center text-4xl md:text-5xl lg:text-6xl">Forgot your password?</h1>
      <form onSubmit={handleSubmit} className="w-full md:w-auto">
        <div className="rounded-lg bg-white p-8 shadow-lg md:min-w-[50vw]">
          <div className="mb-4">
            <label className="mb-2 block font-bold text-gray-700" htmlFor="email">
              Email address
            </label>
            <input
              className="form-field shadow-sm"
              id="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Enter Your email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="rounded-sm bg-blue-600 p-2 text-white hover:bg-blue-800 disabled:opacity-65"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? "Loading..." : "Reset"}
          </button>
          <div className="mt-2 flex justify-between text-base">
            <p className="m-0">Don&apos;t have an account</p>
            <Link className="text-blue-700 hover:underline" href="/auth/signup">
              Signup
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
