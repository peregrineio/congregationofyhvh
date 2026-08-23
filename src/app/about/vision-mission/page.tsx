import type { Metadata } from "next";
import Image from "next/image";
import { SITE_CONFIG } from "@/lib/constants";
import {
  VISION_STATEMENT,
  MISSION_STATEMENT,
  ABOUT_US,
  CLOSING_INVITATION,
} from "@/lib/content";
import {
  AboutHero,
  PillarStrip,
  ClosingBand,
} from "@/components/about/about-hero";
import {
  Star,
  Sparkles,
  ScrollText,
  Cross,
  Users,
  HandHeart,
  Heart,
  Clock,
  MapPin,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Vision & Mission | Congregation of YHVH",
  description:
    "Our purpose, our calling, and our journey together as a Messianic congregation devoted to YHVH.",
};

const defines = [
  { title: "Torah-Rooted", detail: "We base our lives on the Torah, the eternal Word of YHVH.", icon: ScrollText },
  { title: "Messiah-Centered", detail: "We follow Yahshua the Messiah, our Lord and Redeemer.", icon: Cross },
  { title: "Family-Focused", detail: "We strengthen and encourage families to walk in righteousness.", icon: Users },
  { title: "Disciple-Making", detail: "We teach, train, and equip believers to fulfill their calling.", icon: Sparkles },
  { title: "Community-Driven", detail: "We walk together in love, unity, and accountability as one body.", icon: HandHeart },
];

export default function VisionMissionPage() {
  return (
    <>
      <AboutHero
        eyebrow="Who We Are"
        title={["Vision &", "Mission"]}
        tagline="Our purpose. Our calling. Our journey together."
        image={{ src: "/images/gs/about-vision-hero.webp" }}
      >
        <p>{SITE_CONFIG.description}</p>
      </AboutHero>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-20 space-y-14">
        {/* ── Vision + Mission ─────────────────────────────────── */}
        <section className="grid gap-6 md:grid-cols-2">
          {[
            { label: "Our Vision", body: VISION_STATEMENT, icon: Star },
            { label: "Our Mission", body: MISSION_STATEMENT, icon: Sparkles },
          ].map(({ label, body, icon: Icon }) => (
            <article
              key={label}
              className="parchment-plate relative overflow-hidden rounded-xl p-8 text-center"
            >
              <span className="inline-flex size-16 items-center justify-center rounded-full border border-yhvh-gold/25 bg-yhvh-gold/[0.07] text-yhvh-gold-dark">
                <Icon className="size-7" aria-hidden />
              </span>
              <h2 className="mt-5 font-heading text-2xl text-foreground">{label}</h2>
              <span aria-hidden className="mx-auto mt-3 block h-px w-16 bg-yhvh-gold/50" />
              <p className="mt-5 font-body text-sm leading-relaxed text-muted-foreground">
                {body}
              </p>
              <div aria-hidden className="mt-6 flex items-center justify-center gap-2">
                <span className="h-px w-8 bg-yhvh-gold/40" />
                <Sparkles className="size-3.5 text-yhvh-gold/60" />
                <span className="h-px w-8 bg-yhvh-gold/40" />
              </div>
            </article>
          ))}
        </section>

        {/* ── About us ─────────────────────────────────────────── */}
        <section className="parchment-plate scribe-lines rounded-xl p-7 md:p-10">
          <p className="drop-cap font-body text-base leading-relaxed text-muted-foreground">
            {ABOUT_US}
          </p>
        </section>

        {/* ── What defines us ──────────────────────────────────── */}
        <section>
          <div className="text-center">
            <h2 className="font-heading text-3xl text-foreground">What Defines Us</h2>
            <div aria-hidden className="mt-4 flex items-center justify-center gap-3">
              <span className="h-px w-16 bg-gradient-to-r from-transparent to-yhvh-gold/60" />
              <span className="size-1.5 rotate-45 bg-yhvh-gold/70" />
              <span className="h-px w-16 bg-gradient-to-l from-transparent to-yhvh-gold/60" />
            </div>
            <p className="mt-3 font-body text-sm text-muted-foreground">
              The foundations that guide everything we do.
            </p>
          </div>

          <div className="mt-8">
            <PillarStrip items={defines} />
          </div>
        </section>

        {/* ── Invitation band ──────────────────────────────────── */}
        <section className="night-sky relative overflow-hidden rounded-xl">
          {/* Decorative layers, all BEHIND the copy. The photograph is
              full-bleed rather than a right-hand third — a partial-width
              image leaves a hard vertical seam where it stops, and this one
              previously painted over the invitation text because it sat
              after the content in the DOM. */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <Image
              src="/images/gs/about-vision-band.webp"
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-right opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0e1220] via-[#0e1220]/85 to-[#0e1220]/55" />
          </div>
          <div aria-hidden className="star-field absolute inset-0 opacity-70" />

          <div className="relative z-10 grid items-center gap-8 p-7 md:grid-cols-[1.15fr_1fr] md:p-10">
            <figure>
              <blockquote className="font-scripture text-xl italic leading-relaxed text-white/90 md:text-2xl">
                &ldquo;Come now, let us reason together, says YHVH.&rdquo;
              </blockquote>
              <figcaption className="mt-3 font-subheading text-xs uppercase tracking-[0.25em] text-yhvh-gold-light">
                &mdash; Isaiah 1:18
              </figcaption>
            </figure>

            <div className="border-t border-yhvh-gold/20 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
              <p className="font-body text-sm leading-relaxed text-white/85">
                {CLOSING_INVITATION}
              </p>
            </div>
          </div>
        </section>

        {/* ── Practical details ────────────────────────────────── */}
        <section className="parchment-plate rounded-xl">
          <ul className="grid divide-y divide-yhvh-gold/15 md:grid-cols-3 md:divide-y-0 md:divide-x">
            {[
              {
                title: "Service Time",
                icon: Clock,
                body: `${SITE_CONFIG.serviceDay} at ${SITE_CONFIG.serviceTime}`,
              },
              {
                title: "Location",
                icon: MapPin,
                body: `${SITE_CONFIG.addressLine1} ${SITE_CONFIG.addressLine2}, ${SITE_CONFIG.city}, ${SITE_CONFIG.state} ${SITE_CONFIG.zip}`,
              },
              {
                title: "All Are Welcome",
                icon: Heart,
                body: "Whether you're new to the faith or have been walking this path for years, there is a place for you here.",
              },
            ].map(({ title, icon: Icon, body }) => (
              <li key={title} className="flex items-start gap-4 p-7">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-yhvh-gold text-white">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div>
                  <h2 className="font-heading text-base text-foreground">{title}</h2>
                  <p className="mt-1.5 font-body text-sm leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <ClosingBand />
      </div>
    </>
  );
}
