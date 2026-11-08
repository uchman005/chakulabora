"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { notify } from "@/lib/toast";
import type { IUser } from "@/types";

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [tokenValid, setTokenValid] = useState(false);
  const [message, setMessage] = useState("Loading...");
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/users/validate-reset-token?token=${encodeURIComponent(token)}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
        if (data.success) {
          setTokenValid(true);
          setUser(data.user);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setMessage("Error validating token");
      });
    return () => controller.abort();
  }, [token]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { password, confirmPassword } = formData;
    if (password !== confirmPassword) {
      notify({ title: "Error", description: "Passwords do not match", status: "error" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!data.success) {
        notify({ title: "Error", description: "Password reset failed", status: "warning" });
        return;
      }
      notify({ title: "Success", description: "Password reset successful", status: "success" });
      if (user) {
        const resIn = await signIn("credentials", { email: user.email, password, redirect: false });
        if (resIn?.ok) {
          notify({ title: "Sign in Success", description: "You have been signed in successfully", status: "success" });
          setTimeout(() => router.push("/dashboard"), 1500);
        } else if (resIn) {
          notify({ title: "Sign in Error", description: resIn.error ?? "Sign in failed", status: "warning" });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!tokenValid) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 pt-24">
        <h1 className="text-center text-2xl" role="status">
          {message}
        </h1>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 pt-24">
      <h1 className="mb-3 text-center text-4xl md:text-5xl lg:text-6xl">Reset password</h1>
      <form onSubmit={handleSubmit} className="w-full md:w-auto">
        <div className="rounded-lg bg-white p-8 shadow-lg md:min-w-[50vw]">
          <div className="mb-4">
            <label className="mb-2 block font-bold text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              className="form-field shadow-sm"
              id="password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Enter Your New password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block font-bold text-gray-700" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              className="form-field shadow-sm"
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Confirm Your New Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="rounded-sm bg-blue-600 p-2 text-white hover:bg-blue-800 disabled:opacity-65"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? "Saving..." : "Save And Signin"}
          </button>
          <div className="mt-2 flex justify-between text-base">
            <p className="m-0">Don&apos;t have an account</p>
            <Link className="text-blue-700 hover:underline" href="/auth/signup">
              Sign up
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
