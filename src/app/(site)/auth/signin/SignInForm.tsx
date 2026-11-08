"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import Required from "@/components/Required";
import PasswordToggle from "@/components/auth/PasswordToggle";
import { notify } from "@/lib/toast";

export default function SignInForm() {
  const router = useRouter();
  const { status } = useSession();
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (status === "authenticated") router.replace("/dashboard");
  }, [status, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        identifier: formData.identifier,
        password: formData.password,
        redirect: false,
      });
      if (res?.ok) {
        notify({ title: "Sign in Success", description: "You have been signed in successfully", status: "success" });
        router.push("/dashboard");
      } else if (res) {
        notify({ title: "Sign in Error", description: res.error ?? "Sign in failed", status: "warning" });
      }
    } catch {
      notify({ title: "Sign in Error", description: "Something went wrong", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-24 pb-6">
      <h1 className="mt-6 mb-3 text-center text-4xl md:text-5xl lg:text-6xl">Welcome back</h1>
      <form
        onSubmit={handleSubmit}
        aria-labelledby="signin-heading"
        className="w-full max-w-xl rounded-lg bg-white p-8 shadow-xl shadow-black lg:m-8"
      >
        <h2 id="signin-heading" className="mb-6 text-center text-3xl">
          User Login
        </h2>
        <div className="mb-4">
          <label className="form-label" htmlFor="identifier">
            Email or phone number: <Required />
          </label>
          <input
            className="form-field-filled"
            id="identifier"
            type="text"
            name="identifier"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            required
            placeholder="you@example.com or +254712345678"
            aria-describedby="identifier-help"
            value={formData.identifier}
            onChange={handleChange}
          />
          <p id="identifier-help" className="mt-1 mb-3 text-sm text-gray-700">
            Phone numbers need the country code, starting with +
          </p>
        </div>
        <div className="mb-4">
          <label className="form-label" htmlFor="password">
            Password: <Required />
          </label>
          <div className="flex items-center gap-3">
            <input
              className="form-field-filled"
              id="password"
              type={show ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              required
              placeholder="* * * * *"
              value={formData.password}
              onChange={handleChange}
            />
            <PasswordToggle shown={show} onToggle={() => setShow((s) => !s)} controls="password" />
          </div>
        </div>
        <div className="mb-4 flex flex-col items-start justify-between gap-2 text-base sm:flex-row">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="rememberMe" name="rememberMe" className="size-4" />
            <label className="text-sm" htmlFor="rememberMe">
              Remember me
            </label>
          </div>
          <Link className="text-blue-700 underline-offset-2 hover:underline" href="/auth/forgotpassword">
            Forgot password?
          </Link>
        </div>
        <div className="mt-3 flex items-center justify-center gap-4">
          <button
            className="min-w-[100px] rounded-sm bg-blue-600 px-4 py-2 font-bold text-white shadow-md shadow-black hover:bg-blue-800 hover:shadow-xs active:shadow-lg disabled:opacity-65"
            type="submit"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
          <button
            className="flex h-11 items-center gap-2 rounded-sm border border-gray-300 bg-white px-2 py-2 text-blue-700 shadow-md shadow-black hover:bg-gray-100 hover:shadow-xs active:shadow-lg"
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            <FaGoogle className="text-red-600" aria-hidden />
            <span className="text-sm">
              <span className="sr-only">Sign in with </span>Google
            </span>
          </button>
        </div>
        <div className="mt-4 flex justify-between text-base">
          <p className="m-0">Don&apos;t have an account?</p>
          <Link className="text-blue-700 underline-offset-2 hover:underline" href="/auth/signup">
            Signup
          </Link>
        </div>
      </form>
    </div>
  );
}
