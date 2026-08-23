import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SITE_CONFIG } from "@/lib/constants";
import { getCurrentPortion, getPortionByHebrewName } from "@/lib/torah-utils";
import { YOUTUBE_LIVE_URL } from "@/lib/youtube";
import {
  Clock,
  MapPin,
  ScrollText,
  BookOpen,
  Users,
  Flame,
  Heart,
  Sun,
  Sparkles,
  HandHeart,
  Baby,
  Mail,
  Play,
  Calendar,
  CalendarDays,
  UserPlus,
  ArrowRight,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Weekly Shabbat | Congregation of YHVH",
  description:
    "Join us for Shabbat services. Learn about service times, what to expect, and the weekly Torah portion.",
};

/** The four things a visitor is being invited into, shown in the hero. */
const invitation = [
  { label: "Worship", detail: "Exalt YHVH together", icon: Heart },
  { label: "Learn", detail: "Study His Word", icon: BookOpen },
  { label: "Fellowship", detail: "Build lasting relationships", icon: Users },
  { label: "Grow", detail: "Walk in His commandments", icon: Sun },
];

/**
 * Order of service. Every entry carries its own icon — three of these used to
 * share the same flame, which read as a rendering fault rather than a choice.
 */
const orderOfService = [
  { title: "Shofar Sounding", description: "We begin by sounding the shofar, calling the congregation to worship.", icon: Sparkles },
  { title: "Opening Prayer", description: "Songs of praise and thanksgiving to YHVH.", icon: HandHeart },
  { title: "Torah Portion Reading", description: "The weekly reading from the Torah, Haftarah, and Brit Chadashah.", icon: ScrollText },
  { title: "Teaching", description: "A message grounded in Scripture, applying truth to daily life.", icon: BookOpen },
  { title: "Prayer & Ministry", description: "Corporate prayer and individual ministry as led by the Spirit.", icon: Flame },
  { title: "Fellowship", description: "A time to connect, share a meal, and build community together.", icon: Users },
];

const nextSteps = [
  { title: "New Here?", detail: "Learn who we are and what we believe.", href: "/about", icon: UserPlus },
  { title: "Watch Live", detail: "Join our Shabbat service online.", href: YOUTUBE_LIVE_URL, icon: Play, external: true },
  { title: "Events", detail: "See upcoming gatherings.", href: "/events", icon: CalendarDays },
  { title: "Resources", detail: "Teachings, readings, and more.", href: "/resources", icon: BookOpen },
];

export default function ShabbatPage() {
  const currentPortionName = getCurrentPortion();
  const currentPortion = getPortionByHebrewName(currentPortionName);

  return (
    <>
      {/* ── Hero — Erev Shabbat night ─────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-[#0e1220]">
        <Image
          src="/images/gs/shabbat-hero.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-right"
        />
        {/* Left-weighted scrim: the artwork is composed with an empty left
            third, and this deepens it so the headline always clears AA. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-[#0e1220] via-[#0e1220]/85 to-transparent"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[#0e1220] via-transparent to-[#0e1220]/40"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32">
          <div className="max-w-2xl">
            <p
              className="text-3xl md:text-4xl leading-none text-yhvh-gold-light/85"
              style={{ fontFamily: "var(--font-hebrew)" }}
            >
              שַׁבָּת
            </p>

            <h1 className="mt-3 font-heading text-5xl md:text-6xl lg:text-7xl leading-[0.95]">
              <span className="block text-white">Weekly</span>
              <span className="gold-leaf-text block">Shabbat</span>
            </h1>

            {/* Gold rule with a centred diamond, as in the mock */}
            <div aria-hidden className="mt-6 flex items-center gap-3 max-w-md">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-yhvh-gold/60 to-yhvh-gold/60" />
              <span className="size-1.5 rotate-45 bg-yhvh-gold/70" />
              <span className="h-px flex-1 bg-gradient-to-l from-transparent via-yhvh-gold/60 to-yhvh-gold/60" />
            </div>

            <p className="mt-6 font-subheading text-lg md:text-xl text-white/85">
              Gather with us to{" "}
              <span className="text-yhvh-gold-light">worship, learn, and grow</span>
            </p>

            {/* Invitation strip */}
            <ul className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-yhvh-gold/25 bg-yhvh-gold/10 sm:grid-cols-4">
              {invitation.map(({ label, detail, icon: Icon }) => (
                <li key={label} className="bg-[#0e1220]/70 px-4 py-4 backdrop-blur-sm">
                  <Icon className="size-5 text-yhvh-gold" aria-hidden />
                  <p className="mt-2 font-subheading text-xs uppercase tracking-widest text-yhvh-gold-light">
                    {label}
                  </p>
                  <p className="mt-1 text-sm text-white/70 leading-snug">{detail}</p>
                </li>
              ))}
            </ul>

            <figure className="mt-8">
              <blockquote className="font-scripture text-lg italic text-white/80">
                &ldquo;Remember the Sabbath day, to keep it holy.&rdquo;
              </blockquote>
              <figcaption className="mt-1 text-sm text-yhvh-gold">— Exodus 20:8</figcaption>
            </figure>

            {/* Service facts */}
            <dl className="mt-8 grid gap-px overflow-hidden rounded-lg border border-yhvh-gold/25 bg-yhvh-gold/10 sm:grid-cols-3">
              <div className="bg-[#0e1220]/70 px-4 py-4 backdrop-blur-sm">
                <dt className="flex items-center gap-2 font-subheading text-xs uppercase tracking-widest text-yhvh-gold-light">
                  <Calendar className="size-4" aria-hidden /> Shabbat Gathering
                </dt>
                <dd className="mt-1.5 text-sm text-white/80">
                  Every {SITE_CONFIG.serviceDay}
                  <br />
                  {SITE_CONFIG.serviceTime}
                </dd>
              </div>
              <div className="bg-[#0e1220]/70 px-4 py-4 backdrop-blur-sm">
                <dt className="flex items-center gap-2 font-subheading text-xs uppercase tracking-widest text-yhvh-gold-light">
                  <MapPin className="size-4" aria-hidden /> Location
                </dt>
                <dd className="mt-1.5 text-sm text-white/80">
                  In person &amp; online
                  <br />
                  {SITE_CONFIG.city}, {SITE_CONFIG.state}
                </dd>
              </div>
              <div className="bg-[#0e1220]/70 px-4 py-4 backdrop-blur-sm">
                <dt className="flex items-center gap-2 font-subheading text-xs uppercase tracking-widest text-yhvh-gold-light">
                  <Play className="size-4" aria-hidden /> Watch Live
                </dt>
                <dd className="mt-1.5 text-sm text-white/80">
                  <a
                    href={YOUTUBE_LIVE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 decoration-yhvh-gold/50 hover:text-white"
                  >
                    Can&apos;t join in person?
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 md:py-20 space-y-16 md:space-y-20">
        {/* ── Service time + location ────────────────────────────── */}
        <section className="grid gap-6 md:grid-cols-2">
          <article className="parchment-plate scribe-lines relative overflow-hidden rounded-xl p-7">
            <Clock
              aria-hidden
              className="pointer-events-none absolute -bottom-6 -right-4 size-40 text-yhvh-gold-dark/[0.06]"
            />
            <div className="relative">
              <span className="inline-flex size-11 items-center justify-center rounded-full bg-yhvh-gold/15 text-yhvh-gold-dark">
                <Clock className="size-5" aria-hidden />
              </span>
              <h2 className="mt-4 font-heading text-2xl text-foreground">Service Time</h2>
              <p className="mt-2 font-subheading text-sm uppercase tracking-widest text-yhvh-gold-dark">
                {SITE_CONFIG.serviceDay} at {SITE_CONFIG.serviceTime}
              </p>
              <span aria-hidden className="mt-4 block h-px w-24 bg-yhvh-gold/40" />
              <p className="mt-4 font-body text-sm leading-relaxed text-muted-foreground">
                We gather weekly to observe the Shabbat as commanded by YHVH. All are
                welcome to join, whether you are new to the faith or have been walking
                this path for years.
              </p>
            </div>
          </article>

          <article className="parchment-plate scribe-lines relative overflow-hidden rounded-xl p-7">
            <MapPin
              aria-hidden
              className="pointer-events-none absolute -bottom-6 -right-4 size-40 text-yhvh-gold-dark/[0.06]"
            />
            <div className="relative">
              <span className="inline-flex size-11 items-center justify-center rounded-full bg-yhvh-gold/15 text-yhvh-gold-dark">
                <MapPin className="size-5" aria-hidden />
              </span>
              <h2 className="mt-4 font-heading text-2xl text-foreground">Location</h2>
              <p className="mt-2 font-subheading text-sm uppercase tracking-widest text-yhvh-gold-dark">
                {SITE_CONFIG.addressLine1}
                <br />
                {SITE_CONFIG.addressLine2}, {SITE_CONFIG.city}, {SITE_CONFIG.state}{" "}
                {SITE_CONFIG.zip}
              </p>
              <span aria-hidden className="mt-4 block h-px w-24 bg-yhvh-gold/40" />
              <p className="mt-4 font-body text-sm leading-relaxed text-muted-foreground">
                All are welcome. Come as you are.
              </p>
            </div>
          </article>
        </section>

        {/* ── What to expect ─────────────────────────────────────── */}
        <section>
          <div className="text-center">
            <h2 className="font-heading text-3xl md:text-4xl text-foreground">
              What to Expect
            </h2>
            <div aria-hidden className="mt-4 flex items-center justify-center gap-3">
              <span className="h-px w-16 bg-gradient-to-r from-transparent to-yhvh-gold/60" />
              <span className="size-1.5 rotate-45 bg-yhvh-gold/70" />
              <span className="h-px w-16 bg-gradient-to-l from-transparent to-yhvh-gold/60" />
            </div>
            <p className="mt-4 font-scripture text-base italic text-muted-foreground">
              A time set apart to draw near to YHVH and one another.
            </p>
          </div>

          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {orderOfService.map(({ title, description, icon: Icon }, i) => (
              <li
                key={title}
                className="parchment-plate group relative rounded-xl p-6 transition-shadow duration-300 hover:shadow-[0_18px_50px_-18px_rgba(139,105,20,0.35)]"
              >
                <span
                  aria-hidden
                  className="absolute right-5 top-5 font-heading text-3xl text-yhvh-gold-dark/10"
                >
                  {i + 1}
                </span>
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-yhvh-gold/15 text-yhvh-gold-dark">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-heading text-lg text-foreground">{title}</h3>
                <span aria-hidden className="mt-3 block h-px w-10 bg-yhvh-gold/40" />
                <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* ── This week's Torah portion ──────────────────────────── */}
        {currentPortion && (
          <section className="parchment-plate relative overflow-hidden rounded-xl">
            <div className="grid lg:grid-cols-[1.35fr_1fr]">
              <div className="p-7 md:p-10">
                <p className="font-subheading text-xs uppercase tracking-[0.25em] text-yhvh-gold-dark">
                  This Week&apos;s Torah Portion
                </p>
                <h2 className="gold-leaf-text mt-3 font-heading text-4xl md:text-5xl">
                  {currentPortion.hebrewName}
                </h2>
                <p className="mt-2 font-scripture text-lg italic text-muted-foreground">
                  &ldquo;{currentPortion.name}&rdquo; — Portion {currentPortion.number}
                </p>
                <span aria-hidden className="mt-5 block h-px w-28 bg-yhvh-gold/40" />
                <p className="mt-5 font-body text-sm leading-relaxed text-muted-foreground max-w-md">
                  Each Sabbath we dive into the Torah, the Prophets (Haftarah), and the
                  Brit Chadashah to grow in understanding and walk in His truth.
                </p>

                <dl className="mt-7 space-y-4">
                  {[
                    { label: "Torah", value: currentPortion.torahReading, icon: ScrollText },
                    { label: "Haftarah", value: currentPortion.haftarah, icon: Flame },
                    { label: "Brit Chadashah", value: currentPortion.britChadashah, icon: BookOpen },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-yhvh-gold/15 text-yhvh-gold-dark">
                        <Icon className="size-4" aria-hidden />
                      </span>
                      <div>
                        <dt className="font-subheading text-xs uppercase tracking-widest text-yhvh-gold-dark">
                          {label}
                        </dt>
                        <dd className="font-body text-sm text-foreground">{value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>

                <Link
                  href="/resources/torah-portions"
                  className="mt-8 inline-flex items-center gap-2 rounded-md border border-yhvh-gold/40 px-5 py-2.5 font-subheading text-sm uppercase tracking-widest text-yhvh-gold-dark transition-colors hover:bg-yhvh-gold/10"
                >
                  <BookOpen className="size-4" aria-hidden />
                  View full annual schedule
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>

              <div className="relative min-h-56 lg:min-h-full">
                <Image
                  src="/images/gs/torah-scroll-card.webp"
                  alt="An open Torah scroll resting on linen"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-r from-[#fdfbf6] via-[#fdfbf6]/20 to-transparent lg:bg-gradient-to-r"
                />
              </div>
            </div>
          </section>
        )}

        {/* ── Children's Shabbat ─────────────────────────────────── */}
        <section className="parchment-plate overflow-hidden rounded-xl">
          <div className="grid md:grid-cols-[0.85fr_1.15fr]">
            <div className="relative min-h-56 md:min-h-full">
              <Image
                src="/images/gs/childrens-shabbat.webp"
                alt="A wooden toy ark with soft animals, for children's Shabbat"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
            </div>

            <div className="p-7 md:p-10">
              <span className="inline-flex size-11 items-center justify-center rounded-full bg-yhvh-gold/15 text-yhvh-gold-dark">
                <Baby className="size-5" aria-hidden />
              </span>
              <h2 className="mt-4 font-heading text-3xl text-foreground">
                Children&apos;s Shabbat
              </h2>
              <span aria-hidden className="mt-3 block h-px w-20 bg-yhvh-gold/40" />
              <p className="mt-4 font-body text-sm leading-relaxed text-muted-foreground">
                We are developing dedicated children&apos;s programming to help the next
                generation grow in their understanding of YHVH&apos;s Word.
              </p>

              <div className="mt-6 flex flex-col gap-4 rounded-lg border border-yhvh-gold/20 bg-yhvh-gold/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <Users className="size-5 shrink-0 text-yhvh-gold-dark" aria-hidden />
                  <div>
                    <p className="font-subheading text-xs uppercase tracking-widest text-yhvh-gold-dark">
                      Service for Kids
                    </p>
                    <p className="font-body text-sm text-foreground">
                      2:00 PM &ndash; 2:45 PM
                    </p>
                  </div>
                </div>
                <p className="font-scripture text-sm italic leading-relaxed text-muted-foreground">
                  Teaching truth.
                  <br />
                  Building faith. Growing together.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stay connected ─────────────────────────────────────── */}
        <section className="parchment-plate relative overflow-hidden rounded-xl">
          <Image
            src="/images/gs/stay-connected.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-left"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-[#fdfbf6]/10 via-[#fdfbf6]/85 to-[#fdfbf6]"
          />
          <div className="relative grid items-center gap-8 p-7 md:grid-cols-2 md:p-10">
            <div className="md:col-start-2">
              <span className="inline-flex size-11 items-center justify-center rounded-full bg-yhvh-gold/15 text-yhvh-gold-dark">
                <Mail className="size-5" aria-hidden />
              </span>
              <h2 className="mt-4 font-heading text-2xl text-foreground">Stay Connected</h2>
              <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground">
                Reach out to receive updates, announcements, and special teachings.
              </p>
              <Link
                href="/contact"
                className="mt-5 inline-flex items-center gap-2 rounded-md bg-yhvh-gold px-6 py-3 font-subheading text-sm uppercase tracking-widest text-white transition-colors hover:bg-yhvh-gold-dark"
              >
                Get in touch
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Next steps ─────────────────────────────────────────── */}
        <nav aria-label="Next steps" className="parchment-plate rounded-xl">
          <ul className="grid divide-y divide-yhvh-gold/15 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
            {nextSteps.map(({ title, detail, href, icon: Icon, external }) => {
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
