"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import type { IconType } from "react-icons";
import { FiBell, FiChevronDown, FiCompass, FiEdit3, FiHome, FiMenu, FiSettings, FiStar, FiTrendingUp, FiX } from "react-icons/fi";
import { FaSignOutAlt } from "react-icons/fa";
import { useAppSelector } from "@/store";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { notify } from "@/lib/toast";
import type { IUser } from "@/types";
import { displayName } from "@/lib/user";

interface LinkItem {
  name: string;
  icon: IconType;
  link: string;
}

const PUBLIC_LINKS: LinkItem[] = [
  { name: "Home", icon: FiHome, link: "/" },
  { name: "Questions", icon: FiTrendingUp, link: "/dashboard" },
  { name: "Ask", icon: FiEdit3, link: "/dashboard/questions" },
];
const AUTH_LINKS: LinkItem[] = [...PUBLIC_LINKS, { name: "Settings", icon: FiSettings, link: "/dashboard/setting" }];
const MODERATOR_LINKS: LinkItem[] = [...AUTH_LINKS, { name: "Approve posts", icon: FiStar, link: "/dashboard/approve" }];

const isModerator = (user: IUser) => !!user.role && user.role !== "Community Member";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Sidebar({ children }: { children: ReactNode }) {
  useCurrentUser();
  const user = useAppSelector((state) => state.user);
  const { status } = useSession();
  const pathname = usePathname();
  // The drawer is "open for" a path, so navigating elsewhere closes it automatically.
  const [drawerOpenFor, setDrawerOpenFor] = useState<string | null>(null);
  const drawerOpen = drawerOpenFor === pathname;
  const openerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerId = useId();

  const closeDrawer = useCallback(() => {
    setDrawerOpenFor(null);
    openerRef.current?.focus();
  }, []);

  // Drawer: focus first item, trap Tab, close on Escape, lock page scroll.
  useEffect(() => {
    if (!drawerOpen) return;
    const panel = drawerRef.current;
    panel?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeDrawer();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [drawerOpen, closeDrawer]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-gray-200 bg-white md:block">
        <SidebarContent user={user} status={status} pathname={pathname} />
      </aside>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 bg-gray-800/75 transition-opacity duration-300 motion-reduce:transition-none md:hidden ${
          drawerOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeDrawer}
        aria-hidden="true"
      />
      <div
        ref={drawerRef}
        id={drawerId}
        role="dialog"
        aria-modal="true"
        aria-label="Dashboard navigation"
        inert={!drawerOpen}
        className={`fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-white shadow-xl transition-transform duration-300 motion-reduce:transition-none md:hidden ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent user={user} status={status} pathname={pathname} onClose={closeDrawer} />
      </div>

      <TopBar
        user={user}
        status={status}
        drawerId={drawerId}
        drawerOpen={drawerOpen}
        openerRef={openerRef}
        onOpen={() => setDrawerOpenFor(pathname)}
      />

      <main id="main" className="ml-0 px-2 py-4 md:ml-60">
        {children}
      </main>
    </div>
  );
}

interface SidebarContentProps {
  user: IUser;
  status: "authenticated" | "loading" | "unauthenticated";
  pathname: string;
  onClose?: () => void;
}

function SidebarContent({ user, status, pathname, onClose }: SidebarContentProps) {
  const links = status === "authenticated" ? (isModerator(user) ? MODERATOR_LINKS : AUTH_LINKS) : PUBLIC_LINKS;

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    notify({ title: "SignOut Success", description: "You have been signed out successfully", status: "success" });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mx-8 flex h-20 items-center justify-between">
        <Link href="/" className="flex font-mono text-2xl font-bold">
          Chakula Bora
        </Link>
        {onClose && (
          <button type="button" className="rounded-md p-1 hover:bg-gray-100" onClick={onClose} aria-label="Close navigation">
            <FiX className="size-6" aria-hidden />
          </button>
        )}
      </div>
      <nav aria-label="Dashboard">
        <ul className="m-0 list-none p-0">
          {status === "loading" ? (
            <li className="mx-4 flex items-center rounded-lg p-4" role="status">
              <FiCompass className="mr-4" aria-hidden /> Loading...
            </li>
          ) : (
            links.map((item) => {
              const current = pathname === item.link;
              return (
                <li key={item.name}>
                  <Link
                    href={item.link}
                    aria-current={current ? "page" : undefined}
                    className="group mx-4 flex items-center rounded-lg p-4 hover:bg-cyan-700 hover:text-white aria-[current=page]:bg-cyan-50 aria-[current=page]:font-semibold aria-[current=page]:hover:bg-cyan-700"
                  >
                    <item.icon className="mr-4 text-base" aria-hidden />
                    {item.name}
                  </Link>
                </li>
              );
            })
          )}
          {status === "authenticated" && (
            <li>
              <button
                type="button"
                onClick={handleSignOut}
                className="mx-4 flex w-[calc(100%-2rem)] items-center rounded-lg p-4 text-left hover:bg-cyan-700 hover:text-white"
              >
                <FaSignOutAlt className="mr-4 text-base" aria-hidden />
                Sign out
              </button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}

interface TopBarProps {
  user: IUser;
  status: "authenticated" | "loading" | "unauthenticated";
  drawerId: string;
  drawerOpen: boolean;
  openerRef: React.RefObject<HTMLButtonElement | null>;
  onOpen: () => void;
}

function TopBar({ user, status, drawerId, drawerOpen, openerRef, onOpen }: TopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  // Close the user menu on outside click or Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onPointer = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-1 py-3 md:ml-60 md:justify-end md:pr-4">
      <button
        ref={openerRef}
        type="button"
        className="mr-1 flex rounded-md p-2 hover:bg-gray-100 md:hidden"
        onClick={onOpen}
        aria-label="Open navigation"
        aria-controls={drawerId}
        aria-expanded={drawerOpen}
      >
        <FiMenu className="text-2xl" aria-hidden />
      </button>
      <Link href="/" className="flex py-1 font-mono text-2xl font-bold md:hidden">
        Chakula Bora
      </Link>

      {status === "authenticated" ? (
        <div className="relative flex items-center gap-1" ref={menuRef}>
          <button type="button" className="rounded-lg p-2 hover:bg-gray-200" aria-label="Notifications">
            <FiBell className="size-6" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-haspopup="true"
            className="flex items-center gap-2 rounded-lg p-1 hover:bg-gray-100"
          >
            <Image className="size-8 rounded-full object-cover" src="/placeholder.png" alt="" width={32} height={32} />
            <span className="hidden text-left md:flex md:flex-col">
              <span className="text-sm">
                {displayName(user, user.email)}
              </span>
              <span className="text-xs text-gray-600">{user.role}</span>
            </span>
            <span className="sr-only md:hidden">Account menu</span>
            <FiChevronDown aria-hidden className={`transition-transform ${menuOpen ? "rotate-180" : ""}`} />
          </button>
          {menuOpen && (
            <ul
              id={menuId}
              className="absolute top-full right-0 z-40 m-0 mt-2 min-w-40 list-none rounded-md border border-gray-200 bg-white p-1 shadow-lg"
            >
              <li>
                <Link
                  href="/dashboard/profile"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-sm px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
              </li>
            </ul>
          )}
        </div>
      ) : (
        <Link
          href="/auth/signin"
          className="btn btn-success px-3 py-1 text-sm"
        >
          Login
        </Link>
      )}
    </header>
  );
}
