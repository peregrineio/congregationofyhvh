import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";
import {
  TORAH_PORTIONS_WITH_DATES,
  parsePortionDate,
  toDateKey,
  getNextPortion,
} from "@/lib/torah-utils";
import { getLatestVideos, findPortionVideo, YOUTUBE_CHANNEL_URL } from "@/lib/youtube";
import {
  EventCalendar,
  type CalendarEntry,
} from "@/components/events/event-calendar";
import { GoldButton } from "@/components/ui/gold-button";
import { Clock, MapPin } from "@/components/icons";

export const metadata: Metadata = {
  title: "Upcoming Events | Congregation of YHVH",
  description:
    "Shabbat services, Torah portions and appointed times at the Congregation of YHVH in Houston, Texas. Every Saturday at 3:00 PM.",
};

// The page reads the YouTube feed, which revalidates on its own 15-minute
// cycle; this keeps the surrounding page in step rather than pinning it
// static at build time with a "today" that ages.
export const revalidate = 900;

export default async function EventsPage() {
  const portionNames = TORAH_PORTIONS_WITH_DATES.map(portion => portion.hebrewName);
  const videos = await getLatestVideos(portionNames);

  const entries: CalendarEntry[] = TORAH_PORTIONS_WITH_DATES.flatMap(portion => {
    const date = parsePortionDate(portion.date);
    if (!date) return [];

    const video = findPortionVideo(videos, portion.hebrewName);

    return [
      {
        dateKey: toDateKey(date),
        portion,
        video: video
          ? {
              id: video.id,
              title: video.title,
              url: video.url,
              thumbnail: video.thumbnail,
            }
          : undefined,
      },
    ];
  });

  const today = new Date();
  const next = getNextPortion(today);
  const matchedCount = entries.filter(entry => entry.video).length;

  return (
    <>
      {/* ---- Header ---- */}
      <section className="relative overflow-hidden px-4 py-20 text-center">
        <span aria-hidden className="hebrew-ghost pointer-events-none">
          מועדים
        </span>

        <div className="relative mx-auto max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-[#8a7a5c]">
            Congregation of YHVH
          </p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl">
            <span className="gold-leaf-text">Upcoming Events</span>
          </h1>

          <div aria-hidden className="mx-auto my-6 h-px w-24 bg-[#b8974a]" />

          <p className="mx-auto max-w-xl font-body text-lg leading-relaxed text-[#4a3f2a]">
            We gather every {SITE_CONFIG.serviceDay} to read the portion, worship,
            and study the Word together. Select any Shabbat below for its
            readings &mdash; and, once it has been taught, the recording.
          </p>
        </div>
      </section>

      {/* ---- Next gathering ---- */}
      {next && (
        <section className="px-4 pb-14">
          <div className="mx-auto max-w-3xl">
            <div className="arch-frame parchment-plate rounded-lg p-7 text-center sm:p-9">
              <p className="text-xs uppercase tracking-[0.25em] text-[#8a7a5c]">
                Next Gathering
              </p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl">
                <span className="gold-leaf-text">{next.hebrewName}</span>
              </h2>
              <p className="mt-1 font-display text-lg text-[#6b5a3e]">
                &ldquo;{next.name}&rdquo;
              </p>

              <div className="mt-6 flex flex-col items-center justify-center gap-3 text-sm text-[#4a3f2a] sm:flex-row sm:gap-8">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#b8974a]" />
                  {next.date} &middot; {SITE_CONFIG.serviceTime}
                </span>
                <span className="flex items-center gap-2 text-center">
                  <MapPin className="h-4 w-4 text-[#b8974a]" />
                  {SITE_CONFIG.addressLine1} {SITE_CONFIG.addressLine2}
                </span>
              </div>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Link href="/shabbat">
                  <GoldButton>Plan Your Visit</GoldButton>
                </Link>
                <a
                  href={YOUTUBE_CHANNEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[#b8974a] px-6 py-2.5 text-sm tracking-wide text-[#6b5a3e] transition hover:bg-[#f5efe2]"
                >
                  Watch on YouTube
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ---- Calendar ---- */}
      <section className="px-4 pb-24">
        <EventCalendar entries={entries} todayKey={toDateKey(today)} />

        {matchedCount === 0 && (
          <p className="mx-auto mt-6 max-w-xl text-center text-xs text-[#8a7a5c]">
            Recordings are matched automatically from our YouTube channel and
            will appear here as they are published.
          </p>
        )}
      </section>

      {/* ---- Appointed times cross-link ---- */}
      <section className="border-t border-[#e3d8c0] px-4 py-16 text-center">
        <h2 className="font-display text-2xl text-[#4a3f2a]">
          Looking for the feast days?
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#6b5a3e]">
          The appointed times of YHVH &mdash; Passover, Unleavened Bread,
          Shavuot, Yom Teruah, Yom Kippur and Sukkot &mdash; are listed on the
          Biblical Calendar.
        </p>
        <Link
          href="/resources/calendar"
          className="mt-5 inline-block text-sm uppercase tracking-[0.2em] text-[#b8974a] underline-offset-4 hover:underline"
        >
          View the Biblical Calendar
        </Link>
      </section>
    </>
  );
}
