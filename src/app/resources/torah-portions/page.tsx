import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  TORAH_PORTIONS_WITH_DATES,
  getCurrentPortion,
} from "@/lib/torah-utils";
import { PortionBrowser } from "@/components/resources/portion-browser";
import {
  CalendarDays,
  BookOpen,
  Users,
  Sparkles,
  ArrowRight,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Torah Portions | Congregation of YHVH",
  description:
    "The annual parashot reading schedule — all 54 Torah portions with their Torah, Haftarah, and Brit Chadashah readings.",
};

// The "this week" highlight has to move with the calendar rather than being
// frozen at build time.
export const revalidate = 3600;

const principles = [
  {
    title: "Weekly Cycle",
    detail: "The Torah is divided into 54 weekly portions read throughout the year.",
    icon: CalendarDays,
  },
  {
    title: "Rooted in Scripture",
    detail: "Each portion reveals truth and wisdom for our daily walk with YHVH.",
    icon: BookOpen,
  },
  {
    title: "For Every Generation",
    detail: "A timeless pattern of learning and obedience passed down through generations.",
    icon: Users,
  },
  {
    title: "Walk in His Ways",
    detail: "Let the Word shape your heart and align your life with His eternal plan.",
    icon: Sparkles,
  },
];

export default function TorahPortionsPage() {
  const currentHebrewName = getCurrentPortion();

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/gs/torah-hero.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-right"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-[#fdfbf6] via-[#fdfbf6]/85 to-transparent"
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <div className="max-w-xl">
            <span
              aria-hidden
              className="inline-flex size-11 items-center justify-center rounded-full border border-yhvh-gold/30 bg-yhvh-gold/[0.07] text-yhvh-gold-dark"
            >
              <BookOpen className="size-5" />
            </span>
            <p className="mt-4 font-subheading text-xs uppercase tracking-[0.3em] text-yhvh-gold-dark">
              The Annual Parashot Reading Schedule
            </p>
            <h1 className="mt-3 font-heading text-4xl sm:text-5xl lg:text-6xl text-foreground">
              Torah Portions
            </h1>

            <div aria-hidden className="mt-5 flex items-center gap-3 max-w-xs">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-yhvh-gold/60" />
              <span className="size-1.5 rotate-45 bg-yhvh-gold/70" />
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-yhvh-gold/60" />
            </div>

            <p className="mt-6 font-body text-lg leading-relaxed text-muted-foreground">
              The weekly readings that guide us through the Word of YHVH.
            </p>

            <figure className="mt-6">
              <blockquote className="font-scripture text-lg italic text-foreground">
                &ldquo;Your word is a lamp to my feet and a light to my path.&rdquo;
              </blockquote>
              <figcaption className="mt-2 font-subheading text-xs uppercase tracking-[0.25em] text-yhvh-gold-dark">
                &mdash; Psalm 119:105
              </figcaption>
            </figure>
          </div>
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

        {/* ── The schedule ─────────────────────────────────────── */}
        <section>
          <PortionBrowser
            portions={TORAH_PORTIONS_WITH_DATES}
            currentHebrewName={currentHebrewName}
          />
        </section>

        {/* ── Stay rooted ──────────────────────────────────────── */}
        <section className="parchment-plate relative overflow-hidden rounded-xl">
          <Image
            src="/images/gs/torah-band.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-left"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-[#fdfbf6]/20 via-[#fdfbf6]/90 to-[#fdfbf6]"
          />

          <div className="relative grid items-center gap-8 p-7 md:grid-cols-2 md:p-10">
            <div className="md:col-start-2">
              <h2 className="font-heading text-2xl text-foreground">
                Stay rooted in the Word
              </h2>
              <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground">
                Every reading sits alongside the Shabbat it is taught on, together with
                the recording once it has been published.
              </p>
              <Link
                href="/events"
                className="mt-5 inline-flex items-center gap-2 rounded-md bg-yhvh-gold px-6 py-3 font-subheading text-sm uppercase tracking-widest text-white transition-colors hover:bg-yhvh-gold-dark"
              >
                See the reading calendar
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Closing ──────────────────────────────────────────── */}
        <figure className="parchment-plate scribe-lines rounded-xl p-7 md:p-10">
          <blockquote className="mx-auto max-w-2xl text-center font-scripture text-lg italic leading-relaxed text-foreground md:text-xl">
            &ldquo;He has shown you, O man, what is good; and what does YHVH require of
            you but to do justly, to love kindness, and to walk humbly with your
            Elohim?&rdquo;
          </blockquote>
          <figcaption className="mt-4 text-center font-subheading text-xs uppercase tracking-[0.25em] text-yhvh-gold-dark">
            &mdash; Micah 6:8
          </figcaption>
        </figure>
      </div>
    </>
  );
}
