import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Congregation of YHVH",
  description:
    "Learn about the Congregation of YHVH -- our vision, mission, statement of faith, beliefs, core values, and leadership team.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
