"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Chat", href: "/dashboard" },
  { label: "Under the Baobab Tree", href: "/under_the_baobab_tree" },
];

export default function Navbar() {
  const pathname = usePathname();
  // The menu is "open for" a path, so navigating elsewhere closes it automatically.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const isOpen = openFor === pathname;
  const setIsOpen = (next: boolean | ((open: boolean) => boolean)) =>
    setOpenFor((prev) => {
      const value = typeof next === "function" ? next(prev === pathname) : next;
      return value ? pathname : null;
    });
  const menuId = useId();

  // Close the mobile menu on Escape.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenFor(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 w-full">
      <div className="flex w-full items-center justify-center border border-gray-200 bg-white px-2 py-2 text-gray-600">
        <div className="mr-4 md:hidden">
          <button
            type="button"
            onClick={() => setIsOpen((o) => !o)}
            aria-expanded={isOpen}
            aria-controls={menuId}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            className="rounded-md p-2 text-gray-700 transition-colors hover:bg-gray-100"
          >
            {isOpen ? <FiX className="size-5" aria-hidden /> : <FiMenu className="size-5" aria-hidden />}
          </button>
        </div>

        <div className="flex flex-1 items-center justify-center md:justify-start">
          <Link
            href="/"
            className="text-center text-xl font-bold text-gray-800 md:text-left md:text-2xl"
          >
            Chakula Bora Network
          </Link>
          <nav aria-label="Main" className="hidden md:ml-10 md:flex">
            <ul className="m-0 flex h-[70px] list-none flex-row items-center p-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className="rounded-md p-2 text-lg text-gray-600 transition-colors hover:text-gray-900 aria-[current=page]:font-semibold aria-[current=page]:text-gray-900"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-1 justify-end gap-2 md:flex-none">
          <Link
            href="/auth/signin"
            className="text-md ml-1 inline-flex items-center justify-center rounded-sm bg-blue-600 px-2 py-2 font-bold text-white shadow-md shadow-black transition-shadow hover:bg-blue-700 hover:shadow-xs active:shadow-lg lg:ml-4 lg:px-4"
          >
            Sign in
          </Link>
        </div>
      </div>

      {/* Mobile menu: animated with a grid-rows collapse */}
      <div
        id={menuId}
        className={`grid bg-white transition-[grid-template-rows,opacity] duration-300 motion-reduce:transition-none md:hidden ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0"
        }`}
        inert={!isOpen}
      >
        <nav aria-label="Mobile" className="overflow-hidden">
          <ul className="m-0 list-none space-y-1 p-4 shadow-md">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="block rounded-md py-2 font-semibold text-gray-600 hover:text-gray-900 aria-[current=page]:text-gray-900"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
