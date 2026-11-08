"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import AOS from "aos";
import "aos/dist/aos.css";
import { makeStore } from "@/store";

export default function Providers({ children }: { children: ReactNode }) {
  // One store per browser session (App Router pattern; never shared across requests).
  const [store] = useState(makeStore);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      disable: reduceMotion,
    });
  }, []);

  return (
    <SessionProvider>
      <Provider store={store}>
        {children}
        <Toaster position="top-center" richColors closeButton />
      </Provider>
    </SessionProvider>
  );
}
