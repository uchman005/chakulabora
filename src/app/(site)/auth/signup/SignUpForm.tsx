"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FaSpinner } from "react-icons/fa";
import Required from "@/components/Required";
import PasswordToggle from "@/components/auth/PasswordToggle";
import { notify } from "@/lib/toast";

export default function SignUpForm() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [mismatch, setMismatch] = useState(false);
  const [formData, setFormData] = useState({ fname: "", lname: "", email: "", password: "", repassword: "" });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.repassword) {
      setMismatch(true);
      notify({
        title: "Password Error",
        description: "Passwords do not match, check your passwords and try again",
        status: "warning",
      });
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const user = await response.json();
      if (user === null) {
        notify({
          title: "Account creation failed.",
          description: "Account creation wasn't successful, if you've created an account before, login instead",
          status: "warning",
          duration: 7000,
        });
        return;
      }
      notify({ title: "Account created.", description: "We've created your account for you.", status: "success" });

      const res = await signIn("credentials", { email: user.email, password: formData.password, redirect: false });
      if (res?.ok) {
        notify({ title: "Sign in Success", description: "You have been signed in successfully", status: "success" });
        router.push("/dashboard");
      } else if (res) {
        notify({ title: "Sign in Error", description: res.error ?? "Sign in failed", status: "warning" });
      }
    } catch {
      notify({ title: "Account creation failed.", description: "Something went wrong, try again", status: "error" });
    } finally {
      setBusy(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    if (name === "password" || name === "repassword") setMismatch(false);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="px-4 py-12">
      <div className="mx-auto mt-16 mb-8 w-full max-w-3xl rounded-lg">
        <form onSubmit={handleSubmit} className="rounded-lg bg-white p-8 shadow-xl shadow-black lg:m-8">
          <h1 className="mb-6 text-center text-3xl">User Registration</h1>
          <div className="-mx-3 mb-2 flex flex-wrap">
            <div className="mb-6 w-full px-3 md:mb-0 md:w-1/2">
              <label className="form-label" htmlFor="first-name">
                First Name:
              </label>
              <input autoComplete="given-name" className="form-field-filled mb-3" id="first-name" type="text" name="fname" value={formData.fname} onChange={handleChange} />
            </div>
            <div className="w-full px-3 md:w-1/2">
              <label className="form-label" htmlFor="last-name">
                Last Name:
              </label>
              <input autoComplete="family-name" className="form-field-filled" id="last-name" type="text" name="lname" value={formData.lname} onChange={handleChange} />
            </div>
          </div>
          <div className="-mx-3 mb-2 flex flex-wrap">
            <div className="w-full px-3 md:w-1/2">
              <label className="form-label" htmlFor="email">
                Email: <Required />
              </label>
              <input required autoComplete="email" className="form-field-filled mb-3" id="email" type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
          </div>
          <div className="-mx-3 mt-2 mb-2 flex flex-wrap">
            <div className="mb-6 w-full px-3 md:mb-0 md:w-1/2">
              <label className="form-label" htmlFor="password">
                Password: <Required />
              </label>
              <input required autoComplete="new-password" className="form-field-filled" id="password" type={show ? "text" : "password"} placeholder="* * * * " name="password" value={formData.password} onChange={handleChange} />
            </div>
            <div className="mb-6 flex w-full items-end gap-3 px-3 md:mb-0 md:w-1/2">
              <div className="w-full">
                <label className="form-label" htmlFor="re-password">
                  Re-password: <Required />
                </label>
                <input
                  required
                  autoComplete="new-password"
                  className="form-field-filled"
                  id="re-password"
                  type={show ? "text" : "password"}
                  placeholder="* * * *"
                  value={formData.repassword}
                  name="repassword"
                  onChange={handleChange}
                  aria-invalid={mismatch}
                  aria-describedby={mismatch ? "password-mismatch" : undefined}
                />
              </div>
              <div className="pb-1.5">
                <PasswordToggle shown={show} onToggle={() => setShow((s) => !s)} controls="password re-password" />
              </div>
            </div>
            {mismatch && (
              <p id="password-mismatch" role="alert" className="mt-2 w-full px-3 text-base text-red-700">
                Passwords do not match.
              </p>
            )}
          </div>
          <div className="mt-3 flex items-center justify-center gap-4">
            <button
              type="submit"
              className="min-w-[100px] rounded-sm bg-blue-600 px-4 py-2 font-bold text-white shadow-md shadow-black hover:bg-blue-800 hover:shadow-xs active:shadow-lg disabled:opacity-65"
              disabled={busy}
              aria-busy={busy}
            >
              {busy ? (
                <>
                  <FaSpinner className="animate-spin text-2xl" aria-hidden />
                  <span className="sr-only">Creating account…</span>
                </>
              ) : (
                "Create Account"
              )}
            </button>
            <button
              className="flex h-11 items-center gap-2 rounded-sm border border-gray-300 bg-white px-2 py-2 text-blue-700 shadow-md shadow-black hover:bg-gray-100 hover:shadow-xs active:shadow-lg"
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            >
              <Image className="size-6 rounded-full" src="/google.jpg" width={24} height={24} alt="" />
              <span className="text-sm">
                <span className="sr-only">Sign up with </span>Google
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
