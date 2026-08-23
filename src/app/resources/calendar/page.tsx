import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { FEAST_DAYS_2026 } from "@/lib/content";
import {
  CalendarDays,
  BookOpen,
  Users,
  Sparkles,
  ArrowRight,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Biblical Calendar | Congregation of YHVH",
  description:
    "The biblical feast days and appointed times (moedim) of YHVH for 2026, including Passover, Shavuot, Yom Teruah, Yom Kippur, and Sukkot.",
};

const principles = [
  {
    title: "The Moedim",
    detail: "The set-apart times of YHVH are His appointments with His people throughout the year.",
    icon: CalendarDays,
  },
  {
    title: "Rooted in the Torah",
    detail: "Established in Scripture and fulfilled by Yahshua the Messiah.",
    icon: BookOpen,
  },
  {
    title: "For All Generations",
    detail: "A pattern of worship, remembrance, and hope for every believer.",
    icon: Users,
  },
  {
    title: "Walk in His Times",
    detail: "Align your life with YHVH's calendar and be part of His eternal plan.",
    icon: Sparkles,
  },
];

export default function BiblicalCalendarPage() {
  const today = new Date();

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/gs/calendar-hero.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-right"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-[#fdfbf6] via-[#fdfbf6]/85 to-[#fdfbf6]/30"
          />
        </div>

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20 md:py-24 text-center">
          <p
            className="text-2xl text-yhvh-gold-dark/70"
            style={{ fontFamily: "var(--font-hebrew)" }}
          >
            מועדים
          </p>
          <h1 className="mt-3 font-heading text-4xl sm:text-5xl lg:text-6xl">
            <span className="gold-leaf-text">Biblical Calendar</span>
          </h1>
          <p className="mt-4 font-subheading text-xs uppercase tracking-[0.28em] text-muted-foreground">
            The Appointed Times (Moedim) of YHVH &mdash; 2026
          </p>

          <div aria-hidden className="mt-6 flex items-center justify-center gap-3">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-yhvh-gold/60" />
            <span className="size-1.5 rotate-45 bg-yhvh-gold/70" />
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-yhvh-gold/60" />
          </div>

          <figure className="mt-8">
            <blockquote className="mx-auto max-w-2xl font-scripture text-lg italic leading-relaxed text-foreground md:text-xl">
              &ldquo;These are the appointed feasts of YHVH, the holy convocations,
              which you shall proclaim at the time appointed for them.&rdquo;
            </blockquote>
            <figcaption className="mt-3 font-subheading text-xs uppercase tracking-[0.25em] text-yhvh-gold-dark">
              &mdash; Leviticus 23:4
            </figcaption>
          </figure>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-20 space-y-14">
        {/* ── Principles ───────────────────────────────────────── */}
        <section className="parchment-plate rounded-xl">
          <ul className="grid divide-y divide-yhvh-gold/15 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
            {principles.map(({ title, detail, icon: Icon }) => (
              <li key={title} className="p-6 text-center">
                <span className="inline-flex size-12 items-center justify-center rounded-full border border-yhvh-gold/25 bg-yhvh-gold/[0.07] text-yhvh-gold-dark">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h2 className="mt-4 font-heading text-base text-foreground">{title}</h2>
                <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">
                  {detail}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* ── The feasts, as a year-long timeline ──────────────── */}
        <section>
          <ol className="relative space-y-6">
            {/* The rule the medallions sit on. Hidden below lg where the
                medallions stack inside the cards instead. */}
            <span
              aria-hidden
              className="absolute left-7 top-6 bottom-6 hidden w-px bg-gradient-to-b from-transparent via-yhvh-gold/30 to-transparent lg:block"
            />

            {FEAST_DAYS_2026.map(feast => {
              const isPast = new Date(`${feast.isoStart}T00:00:00`) < today;

              return (
                <li key={feast.hebrewName} className="relative lg:pl-20">
                  <span
                    aria-hidden
                    className={`absolute left-0 top-8 hidden size-14 items-center justify-center rounded-full border bg-[#fdfbf6] lg:flex ${
                      isPast
                        ? "border-yhvh-gold/20 text-yhvh-gold-dark/30"
                        : "border-yhvh-gold/50 text-yhvh-gold-dark"
                    }`}
                  >
                    <CalendarDays className="size-6" />
                  </span>

                  <article
                    className={`parchment-plate overflow-hidden rounded-xl transition-opacity ${
                      isPast ? "opacity-70" : ""
                    }`}
                  >
                    <div className="grid md:grid-cols-[1fr_260px]">
                      <div className="p-6 md:p-7">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <h2 className="font-heading text-2xl text-foreground">
                            {feast.name}
                          </h2>
                          <p className="font-scripture text-base italic text-yhvh-gold-dark">
                            ({feast.hebrewName})
                          </p>
                        </div>

                        <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-yhvh-gold/30 bg-yhvh-gold/[0.07] px-3.5 py-1 font-subheading text-xs uppercase tracking-widest text-yhvh-gold-dark">
                          <CalendarDays className="size-3.5" aria-hidden />
                          {feast.dates}
                        </p>

                        <p className="mt-4 font-body text-sm leading-relaxed text-muted-foreground">
                          {feast.description}
                        </p>

                        <p className="mt-4 font-subheading text-xs uppercase tracking-widest text-muted-foreground/70">
                          {feast.scripture}
                        </p>
                      </div>

                      <div className="relative order-first h-40 md:order-last md:h-full">
                        <Image
                          src={feast.image}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 100vw, 260px"
                          className="object-cover"
                        />
                        <div
                          aria-hidden
                          className="absolute inset-0 bg-gradient-to-r from-[#fdfbf6] via-[#fdfbf6]/25 to-transparent md:bg-gradient-to-r"
                        />
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        </section>

        {/* ── Keep in step ─────────────────────────────────────── */}
        <section className="parchment-plate scribe-lines rounded-xl p-7 md:p-10">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-yhvh-gold/15 text-yhvh-gold-dark">
                <CalendarDays className="size-5" aria-hidden />
              </span>
              <div>
                <h2 className="font-heading text-xl text-foreground">
                  Stay in step with His calendar
                </h2>
                <p className="mt-2 max-w-lg font-body text-sm leading-relaxed text-muted-foreground">
                  Every Shabbat gathering and appointed time, with the weekly readings
                  alongside them.
                </p>
              </div>
            </div>

            <Link
              href="/events"
              className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-md bg-yhvh-gold px-6 py-3 font-subheading text-sm uppercase tracking-widest text-white transition-colors hover:bg-yhvh-gold-dark"
            >
              View upcoming events
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </section>

        {/* ── Closing ──────────────────────────────────────────── */}
        <section className="grid gap-5 md:grid-cols-[1.4fr_1fr]">
          <figure className="parchment-plate flex items-center gap-5 rounded-xl p-7">
            <span
              aria-hidden
              className="inline-flex size-12 shrink-0 items-center justify-center rounded-md bg-[#131a2e] text-yhvh-gold-light"
            >
              <BookOpen className="size-5" />
            </span>
            <div>
              <blockquote className="font-scripture text-base italic leading-relaxed text-foreground">
                &ldquo;These feasts are a shadow of good things to come, but the reality
                is found in Messiah.&rdquo;
              </blockquote>
              <figcaption className="mt-2 font-subheading text-xs uppercase tracking-widest text-yhvh-gold-dark">
                &mdash; Colossians 2:16&ndash;17
              </figcaption>
            </div>
          </figure>

          <div className="parchment-plate rounded-xl p-7">
            <p className="font-scripture text-base italic leading-relaxed text-muted-foreground">
              Let us keep the <span className="text-yhvh-gold-dark">moedim</span> of
              YHVH with joy and reverence, as He has commanded.
            </p>
          </div>
        </section>

        <p className="text-center font-body text-xs text-muted-foreground/60">
          Dates are approximate and may vary based on the observed biblical calendar.
          Please confirm with congregation leadership.
        </p>
      </div>
    </>
  );
}
