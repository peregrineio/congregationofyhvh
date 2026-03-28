import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Torah Portions | Congregation of YHVH",
  description:
    "The complete annual Torah portion reading schedule organized by the five books of Moses, with dates for the 2025-2026 cycle.",
};

export default function TorahPortionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
