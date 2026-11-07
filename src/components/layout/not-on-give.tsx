"use client";

import { usePathname } from "next/navigation";
import { isGivePath } from "@/lib/give-csp";

/** Renders its children everywhere except /give and /give/*: no chat, feedback or analytics there. */
export function NotOnGive({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  return isGivePath(pathname) ? null : <>{children}</>;
}
