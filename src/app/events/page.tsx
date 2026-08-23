import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SITE_CONFIG } from "@/lib/constants";
import { FEAST_DAYS_2026 } from "@/lib/content";
import {
  TORAH_PORTIONS_WITH_DATES,
  parsePortionDate,
  toDateKey,
  getNextPortion,
} from "@/lib/torah-utils";
import {
  getChannelVideos,
  findPortionVideo,
  YOUTUBE_CHANNEL_URL,
  YOUTUBE_LIVE_URL,
} from "@/lib/youtube";
import {
  EventCalendar,
  type CalendarEntry,
} from "@/components/events/event-calendar";
import { GoldButton } from "@/components/ui/gold-button";
import {
  Clock,
  MapPin,
  ScrollText,
  BookOpen,
  Flame,
  Play,
  Users,
  Calendar,
  CalendarDays,
  Mail,
  ArrowRight,
} from "@/components/icons";

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
  const portionNames = TORAH_PORTIONS_WITH_DATES.map(
    (portion) => portion.hebrewName,
  );
  const videos = await getChannelVideos(portionNames);

  const entries: CalendarEntry[] = TORAH_PORTIONS_WITH_DATES.flatMap(
    (portion) => {
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
    },
  );

  const today = new Date();
  const next = getNextPortion(today);
  const matchedCount = entries.filter((entry) => entry.video).length;

  // The next few Shabbat gatherings, for the sidebar. Shabbat is the only
  // recurring gathering that exists today — when the fellowships and study
  // groups begin, they join this list rather than replacing it.
  const upcoming = TORAH_PORTIONS_WITH_DATES.map((portion) => ({
    portion,
    date: parsePortionDate(portion.date),
  }))
    .filter(
      (item): item is { portion: typeof item.portion; date: Date } =>
        item.date !== null && item.date >= today,
    )
    .slice(0, 5);

  // Appointed times still ahead of us this year.
  const upcomingFeasts = FEAST_DAYS_2026.filter(
    (feast) => new Date(`${feast.isoStart}T00:00:00`) >= today,
  ).slice(0, 3);

  const actions = [
    {
      title: "Weekly Shabbat",
      detail: "Plan your visit and know what to expect.",
      href: "/shabbat",
      icon: Calendar,
    },
    {
      title: "Watch Live",
      detail: "Join our Shabbat service online.",
      href: YOUTUBE_LIVE_URL,
      icon: Play,
      external: true,
    },
    {
      title: "Biblical Calendar",
      detail: "The appointed times of YHVH.",
      href: "/resources/calendar",
      icon: CalendarDays,
    },
    {
      title: "Get in Touch",
      detail: "Questions? We would love to hear from you.",
      href: "/contact",
      icon: Mail,
    },
  ];

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/gs/events-hero.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-right"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-[#fdfbf6] via-[#fdfbf6]/80 to-transparent"
          />
        </div>

        <span
          aria-hidden
          className="hebrew-ghost pointer-events-none absolute right-[4%] top-4 text-[7rem] md:text-[11rem]"
        >
          מועדים
        </span>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-xl">
            <p className="font-subheading text-xs uppercase tracking-[0.3em] text-yhvh-gold-dark">
              Congregation of YHVH
            </p>
            <h1 className="mt-3 font-heading text-4xl sm:text-5xl lg:text-6xl">
              <span className="gold-leaf-text">Upcoming Events</span>
            </h1>

            <div aria-hidden className="mt-5 flex items-center gap-3 max-w-xs">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-yhvh-gold/60" />
              <span className="size-1.5 rotate-45 bg-yhvh-gold/70" />
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-yhvh-gold/60" />
            </div>

            <p className="mt-6 font-body text-lg leading-relaxed text-muted-foreground">
              We gather every {SITE_CONFIG.serviceDay} to read the portion,
              worship, and study the Word together. Select any Shabbat below for
              its readings &mdash; and, once it has been taught, the recording.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20 space-y-16">
        {/* ── Next gathering ───────────────────────────────────── */}
        {next && (
          <section className="parchment-plate relative overflow-hidden rounded-xl p-7 md:p-10">
            <ScrollText
              aria-hidden
              className="pointer-events-none absolute -right-6 top-1/2 size-64 -translate-y-1/2 text-yhvh-gold-dark/[0.05]"
            />
            <div className="relative grid gap-8 lg:grid-cols-[auto_1fr_auto] lg:items-center">
              <div
                aria-hidden
                className="hidden size-24 shrink-0 items-center justify-center rounded-full border border-yhvh-gold/25 bg-yhvh-gold/[0.07] lg:flex"
              >
                <ScrollText className="size-10 text-yhvh-gold-dark" />
              </div>

              <div>
                <p className="font-subheading text-xs uppercase tracking-[0.25em] text-yhvh-gold-dark">
                  Next Gathering
                </p>
                <h2 className="gold-leaf-text mt-2 font-heading text-4xl md:text-5xl">
                  {next.hebrewName}
                </h2>
                <p className="mt-1 font-scripture text-lg italic text-muted-foreground">
                  &ldquo;{next.name}&rdquo;
                </p>
                <span
                  aria-hidden
                  className="mt-5 block h-px w-full max-w-md bg-yhvh-gold/30"
                />
                <div className="mt-4 flex flex-col gap-3 font-body text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-6">
                  <span className="flex items-center gap-2">
                    <Calendar
                      className="size-4 text-yhvh-gold-dark"
                      aria-hidden
                    />
                    {next.date} &middot; {SITE_CONFIG.serviceTime}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin
                      className="size-4 text-yhvh-gold-dark"
                      aria-hidden
                    />
                    {SITE_CONFIG.addressLine1} {SITE_CONFIG.addressLine2}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 lg:w-56">
                <Link href="/shabbat">
                  <GoldButton className="w-full justify-center">
                    Plan Your Visit
                  </GoldButton>
                </Link>
                <a
                  href={YOUTUBE_CHANNEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-yhvh-gold/40 px-5 py-2.5 font-subheading text-xs uppercase tracking-widest text-yhvh-gold-dark transition-colors hover:bg-yhvh-gold/10"
                >
                  <Play className="size-4 shrink-0" aria-hidden />
                  Watch on YouTube
                </a>
              </div>
            </div>
          </section>
        )}

        {/* ── Calendar + sidebar ───────────────────────────────── */}
        <section>
          <EventCalendar
            entries={entries}
            todayKey={toDateKey(today)}
            aside={
              <>
                <div className="parchment-plate rounded-xl p-6">
                  <h2 className="font-subheading text-xs uppercase tracking-[0.25em] text-yhvh-gold-dark">
                    Upcoming Gatherings
                  </h2>
                  <span
                    aria-hidden
                    className="mt-3 block h-px w-full bg-yhvh-gold/30"
                  />
                  <ul className="mt-4 space-y-4">
                    {upcoming.map(({ portion, date }) => (
                      <li
                        key={portion.hebrewName}
                        className="flex items-start gap-3"
                      >
                        <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-yhvh-gold/15 text-yhvh-gold-dark">
                          <Users className="size-4" aria-hidden />
                        </span>
                        <div className="min-w-0">
                          <p className="font-heading text-sm text-foreground">
                            Shabbat Service
                          </p>
                          <p className="font-body text-xs text-muted-foreground">
                            {date.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}{" "}
                            &middot; {SITE_CONFIG.serviceTime}
                          </p>
                          <p className="font-body text-xs italic text-yhvh-gold-dark/80">
                            {portion.hebrewName}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {next && (
                  <div className="parchment-plate scribe-lines rounded-xl p-6">
                    <h2 className="font-subheading text-xs uppercase tracking-[0.25em] text-yhvh-gold-dark">
                      Torah Portion This Week
                    </h2>
                    <span
                      aria-hidden
                      className="mt-3 block h-px w-full bg-yhvh-gold/30"
                    />
                    <p className="gold-leaf-text mt-4 font-heading text-2xl">
                      {next.hebrewName}
                    </p>
                    <p className="mt-1 font-body text-sm text-muted-foreground">
                      {next.torahReading}
                    </p>
                    <p className="mt-2 font-scripture text-sm italic text-muted-foreground">
                      &ldquo;{next.name}&rdquo;
                    </p>
                    <Link
                      href="/resources/torah-portions"
                      className="mt-4 inline-flex items-center gap-1.5 font-subheading text-xs uppercase tracking-widest text-yhvh-gold-dark underline-offset-4 hover:underline"
                    >
                      Read more
                      <ArrowRight className="size-3.5" aria-hidden />
                    </Link>
                  </div>
                )}
              </>
            }
          />

          {matchedCount === 0 && (
            <p className="mx-auto mt-6 max-w-xl text-center font-body text-xs text-muted-foreground">
              Recordings are matched automatically from our YouTube channel and
              will appear here as they are published.
            </p>
          )}
        </section>

        {/* ── This Shabbat detail ──────────────────────────────── */}
        {next && (
          <section className="parchment-plate overflow-hidden rounded-xl">
            <div className="border-b border-yhvh-gold/15 p-7 md:p-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-yhvh-gold px-4 py-1.5 font-subheading text-xs uppercase tracking-widest text-white">
                <Calendar className="size-3.5" aria-hidden />
                This Shabbat &middot; {next.date}
              </span>
              <h2 className="gold-leaf-text mt-4 font-heading text-4xl md:text-5xl">
                {next.hebrewName}
              </h2>
              <p className="mt-2 font-scripture text-lg italic text-muted-foreground">
                &ldquo;{next.name}&rdquo; &middot; Portion {next.number} of 54
              </p>
            </div>

            <div className="grid divide-y divide-yhvh-gold/15 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
              {[
                { label: "Torah", value: next.torahReading, icon: ScrollText },
                { label: "Haftarah", value: next.haftarah, icon: Flame },
                {
                  label: "Brit Chadashah",
                  value: next.britChadashah,
                  icon: BookOpen,
                },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="p-6 text-center">
                  <span className="inline-flex size-12 items-center justify-center rounded-full bg-yhvh-gold/15 text-yhvh-gold-dark">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-3 font-heading text-base text-foreground">
                    {label}
                  </h3>
                  <span
                    aria-hidden
                    className="mx-auto mt-2 block h-px w-8 bg-yhvh-gold/40"
                  />
                  <p className="mt-2 font-body text-sm text-muted-foreground">
                    {value}
                  </p>
                </div>
              ))}

              <div className="p-6 text-center">
                <span className="inline-flex size-12 items-center justify-center rounded-full bg-yhvh-gold/15 text-yhvh-gold-dark">
                  <Clock className="size-5" aria-hidden />
                </span>
                <h3 className="mt-3 font-heading text-base text-foreground">
                  Shabbat Gathering
                </h3>
                <span
                  aria-hidden
                  className="mx-auto mt-2 block h-px w-8 bg-yhvh-gold/40"
                />
                <p className="mt-2 font-body text-sm text-muted-foreground">
                  {SITE_CONFIG.serviceTime}
                  <br />
                  Join us in person or online.
                </p>
                <a
                  href={YOUTUBE_LIVE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-md bg-yhvh-gold px-5 py-2 font-subheading text-xs uppercase tracking-widest text-white transition-colors hover:bg-yhvh-gold-dark"
                >
                  Watch Live
                  <ArrowRight className="size-3.5" aria-hidden />
                </a>
              </div>
            </div>

            <div className="border-t border-yhvh-gold/15 p-7 text-center">
              <Link
                href="/resources/torah-portions"
                className="inline-flex items-center gap-2 rounded-md bg-[#131a2e] px-6 py-3 font-subheading text-sm uppercase tracking-widest text-white transition-colors hover:bg-[#1a2340]"
              >
                <BookOpen className="size-4" aria-hidden />
                Explore this week&apos;s portion
              </Link>
              <p className="mt-3 font-body text-sm text-muted-foreground">
                Readings, teaching, and resources for this week.
              </p>
            </div>
          </section>
        )}

        {/* ── YHVH's appointed times ───────────────────────────── */}
        {upcomingFeasts.length > 0 && (
          <section className="parchment-plate relative overflow-hidden rounded-xl">
            <Image
              src="/images/gs/appointed-times.webp"
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div aria-hidden className="absolute inset-0 bg-[#fdfbf6]/80" />

            <div className="relative p-7 md:p-10">
              <div className="text-center">
                <h2 className="font-heading text-3xl md:text-4xl text-foreground">
                  YHVH&apos;s Appointed Times
                </h2>
                <div
                  aria-hidden
                  className="mt-4 flex items-center justify-center gap-3"
                >
                  <span className="h-px w-16 bg-gradient-to-r from-transparent to-yhvh-gold/60" />
                  <span className="size-1.5 rotate-45 bg-yhvh-gold/70" />
                  <span className="h-px w-16 bg-gradient-to-l from-transparent to-yhvh-gold/60" />
                </div>
                <p className="mt-4 font-body text-base text-muted-foreground">
                  Remember and prepare for the Feasts of YHVH.
                </p>
              </div>

              <ul className="mt-10 grid gap-5 md:grid-cols-3">
                {upcomingFeasts.map((feast) => (
                  <li
                    key={feast.hebrewName}
                    className="overflow-hidden rounded-xl border border-yhvh-gold/20 bg-[#fdfbf6]/90"
                  >
                    <div className="relative h-36">
                      <Image
                        src={feast.image}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-5 text-center">
                      <h3 className="font-heading text-xl text-foreground">
                        {feast.name}
                      </h3>
                      <p className="font-scripture text-sm italic text-yhvh-gold-dark">
                        {feast.hebrewName}
                      </p>
                      <span
                        aria-hidden
                        className="mx-auto mt-3 block h-px w-10 bg-yhvh-gold/40"
                      />
                      <p className="mt-3 font-subheading text-xs uppercase tracking-widest text-yhvh-gold-dark">
                        {feast.dates}
                      </p>
                      <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">
                        {feast.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-10 text-center">
                <Link
                  href="/resources/calendar"
                  className="inline-flex items-center gap-2 rounded-md border border-yhvh-gold/40 bg-[#fdfbf6]/80 px-6 py-3 font-subheading text-sm uppercase tracking-widest text-yhvh-gold-dark transition-colors hover:bg-yhvh-gold/10"
                >
                  <CalendarDays className="size-4" aria-hidden />
                  View the Biblical Calendar
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── Scripture band ───────────────────────────────────── */}
        <section className="parchment-plate scribe-lines relative overflow-hidden rounded-xl px-7 py-10 md:px-12">
          <span
            aria-hidden
            className="hebrew-ghost pointer-events-none absolute -right-2 top-1/2 -translate-y-1/2 text-[6rem] md:text-[9rem]"
          >
            שרת
          </span>
          <figure className="relative max-w-2xl">
            <blockquote className="font-scripture text-xl italic leading-relaxed text-foreground md:text-2xl">
              &ldquo;Fear Elohim and keep His commandments, for this is the
              whole duty of man.&rdquo;
            </blockquote>
            <figcaption className="mt-4 font-subheading text-xs uppercase tracking-[0.25em] text-yhvh-gold-dark">
              Ecclesiastes 12:13
            </figcaption>
          </figure>
        </section>

        {/* ── Actions ──────────────────────────────────────────── */}
        <nav
          aria-label="More ways to connect"
          className="parchment-plate rounded-xl"
        >
          <ul className="grid divide-y divide-yhvh-gold/15 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
            {actions.map(({ title, detail, href, icon: Icon, external }) => {
              const inner = (
                <>
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-yhvh-gold/15 text-yhvh-gold-dark">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-subheading text-xs uppercase tracking-widest text-yhvh-gold-dark">
                      {title}
                    </span>
                    <span className="mt-1 block font-body text-sm leading-snug text-muted-foreground">
                      {detail}
                    </span>
                  </span>
                  <ArrowRight
                    aria-hidden
                    className="ml-auto size-4 shrink-0 self-center text-yhvh-gold/60 transition-transform duration-200 group-hover:translate-x-1"
                  />
                </>
              );

              return (
                <li key={title}>
                  {external ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-3 p-6 transition-colors hover:bg-yhvh-gold/[0.06]"
                    >
                      {inner}
                    </a>
                  ) : (
                    <Link
                      href={href}
                      className="group flex items-start gap-3 p-6 transition-colors hover:bg-yhvh-gold/[0.06]"
                    >
                      {inner}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}
