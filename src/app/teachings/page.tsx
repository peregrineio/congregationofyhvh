import type { Metadata } from "next";
import { Suspense } from "react";
import { getTeachingsLibrary } from "@/lib/youtube-playlists";
import { TeachingsLibraryClient, TeachingsLibraryView } from "@/components/teachings/teachings-library";

export const metadata: Metadata = {
  title: "Teachings | Congregation of YHVH",
  description:
    "Video teachings from the Congregation of YHVH by series: weekly Torah portions, our teachers, and Spanish teachings, from our YouTube channel.",
  // ?series= ?q= ?view= are views of one page
  alternates: { canonical: "/teachings" },
};

// Same cadence as /events. searchParams are NOT read here (that would make the page
// dynamic and drop ISR): the client filters the server-rendered library instead.
export const revalidate = 900;

const DEFAULT_VIEW = {};

export default async function TeachingsPage() {
  const library = await getTeachingsLibrary();
  return (
    <div className="teachings-page bg-soft-cream pb-[calc(6.5rem+env(safe-area-inset-bottom))] sm:pb-20">
      <Suspense fallback={<TeachingsLibraryView library={library} params={DEFAULT_VIEW} />}>
        <TeachingsLibraryClient library={library} />
      </Suspense>
    </div>
  );
}
