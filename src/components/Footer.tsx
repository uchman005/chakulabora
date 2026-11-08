"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { BiMailSend } from "react-icons/bi";
import { notify } from "@/lib/toast";

const SocialButton = ({ children, label, href }: { children: ReactNode; label: string; href: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex size-8 items-center justify-center rounded-full bg-black/10 transition-colors hover:bg-black/20"
  >
    <span className="sr-only">{label} (opens in a new tab)</span>
    {children}
  </a>
);

const ListHeader = ({ children }: { children: ReactNode }) => (
  <h2 className="mb-2 text-lg font-medium">{children}</h2>
);

export default function Footer() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/users/subscribe-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data === null) {
        notify({
          title: "Subscription Failed",
          description: "Email subscription failed, you've subscribed before",
          status: "warning",
        });
      } else {
        notify({
          title: "Subscribed successfully",
          description: "Thanks for subscribing, we'll keep in touch",
          status: "success",
        });
      }
    } catch (error) {
      notify({
        title: "Subscription Failed",
        description: "Email subscription failed, check network connectivity " + (error as Error).message,
        status: "warning",
      });
    } finally {
      setEmail("");
      setBusy(false);
    }
  };

  return (
    <footer className="bg-gray-100 text-gray-700">
      <div className="flex px-10 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-6">
            <p className="mb-0 text-3xl">Chakula Bora Network</p>
            <p className="mb-0 text-sm">
              © 2021 - {new Date().getFullYear()} Chakula Bora. All rights reserved
            </p>
            <div className="flex gap-4">
              <SocialButton label="Facebook" href="https://web.facebook.com/groups/675166221332788">
                <FaFacebook aria-hidden />
              </SocialButton>
              <SocialButton label="LinkedIn" href="https://www.linkedin.com/company/passionofhopeinternational/">
                <FaLinkedin aria-hidden />
              </SocialButton>
            </div>
          </div>

          <nav aria-labelledby="footer-company" className="flex flex-col gap-2">
            <ListHeader>
              <span id="footer-company">Company</span>
            </ListHeader>
            <Link href="/about" className="hover:underline">About us</Link>
            <Link href="/contact" className="hover:underline">Contact us</Link>
            <a
              href="https://www.paypal.com/donate/?hosted_button_id=TRAK8ZMG52U6S"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Donate<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </nav>

          <nav aria-labelledby="footer-support" className="flex flex-col gap-2">
            <ListHeader>
              <span id="footer-support">Support</span>
            </ListHeader>
            <Link href="/contact" className="hover:underline">Help Center</Link>
            <Link href="/coc" className="hover:underline">Terms of Service</Link>
            <Link href="/legal" className="hover:underline">Legal</Link>
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          </nav>

          <div className="flex flex-col gap-2">
            <ListHeader>Stay up to date</ListHeader>
            <form className="flex flex-row" onSubmit={handleSubmit}>
              <label htmlFor="footer-subscribe-email" className="sr-only">
                Your email address
              </label>
              <input
                id="footer-subscribe-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="Your email address"
                className="form-field rounded-r-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                disabled={busy}
                className="rounded-r-md bg-blue-600 px-4 py-2 text-white shadow-xs shadow-black hover:bg-blue-700 active:shadow-lg disabled:opacity-65"
                aria-label="Subscribe to the newsletter"
              >
                <BiMailSend aria-hidden />
              </button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}
