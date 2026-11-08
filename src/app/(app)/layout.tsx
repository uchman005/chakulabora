import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";

/** Shared dashboard shell for /dashboard/* and /post/* — persists across navigation. */
export default function AppLayout({ children }: { children: ReactNode }) {
  return <Sidebar>{children}</Sidebar>;
}
