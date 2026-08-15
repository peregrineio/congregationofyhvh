"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SITE_CONFIG, SCRIPTURES } from "@/lib/constants";
import { STATEMENT_OF_FAITH_SHORT } from "@/lib/content";
import { GoldButton } from "@/components/ui/gold-button";
import { OutlinedButton } from "@/components/ui/outlined-button";
import { Clock } from "@/components/icons";
import { FadeIn } from "@/components/ui/motion";

// Portrait footage (720x1280) for phones held upright; the landscape cut
// (1280x720) for everything else.
const MOBILE_QUERY = "(max-width: 767px) and (orientation: portrait)";

const SOURCES = {
  desktop: { src: "/videos/hero-bg.mp4", poster: "/images/hero-poster.jpg" },
  mobile: {
    src: "/videos/hero-bg-mobile.mp4",
    poster: "/images/hero-poster-mobile.jpg",
  },
} as const;

/**
 * Picks the hero footage by viewport.
 *
 * This has to happen in JS rather than with <source media="...">: unlike
 * <picture>, a <video> ignores media conditions on its sources, so the
 * declarative version would download whichever source came first regardless
 * of screen. Rendering two <video> elements and hiding one with CSS has the
 * same problem -- a display:none video still fetches. Choosing after mount
 * means exactly one of these ~2.4 MB files is ever requested.
 *
 * Returns null until mounted so the server and first client render agree.
 */
function useHeroSource() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const query = window.matchMedia(MOBILE_QUERY);
    const sync = () => setIsMobile(query.matches);

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return { isMobile, ...(isMobile ? SOURCES.mobile : SOURCES.desktop) };
}

export function Hero() {
  const { isMobile, src, poster } = useHeroSource();

  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 py-24 text-center">
      {/* Video Background. The poster carries the hero until the footage is
          decoded -- and stands in permanently where autoplay is refused
          (iOS Low Power Mode), which would otherwise leave a black box.
          key={src} remounts the element on rotation so the new cut loads. */}
      <video
        key={src}
        autoPlay
        muted
        loop
        playsInline
        poster={poster}
        className="absolute inset-0 z-0 h-full w-full object-cover"
      >
        {isMobile !== null && <source src={src} type="video/mp4" />}
      </video>

      {/* Subtle gradient overlay -- edges only, keeps video vibrant */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/20 via-transparent to-black/30" />

      {/* Content */}
      <div className="relative z-20 mx-auto max-w-3xl space-y-8">
        {/* Short statement of faith -- prominent, white text over vibrant video */}
        <FadeIn delay={0}>
          <p
            className="mx-auto max-w-2xl font-body text-lg leading-relaxed text-white md:text-xl lg:text-2xl"
            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.3)" }}
          >
            {STATEMENT_OF_FAITH_SHORT}
          </p>
        </FadeIn>

        {/* Service time badge */}
        <FadeIn delay={0.15}>
          <div className="mx-auto inline-flex items-center gap-3 rounded-lg border border-white/20 bg-black/30 backdrop-blur-sm px-5 py-3 shadow-sm">
            <div className="flex size-8 items-center justify-center rounded-full bg-yhvh-gold/20">
              <Clock className="size-4 text-yhvh-gold" />
            </div>
            <span
              className="font-subheading text-sm font-medium text-white"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}
            >
              Shabbat Services: {SITE_CONFIG.serviceDay} at{" "}
              {SITE_CONFIG.serviceTime}
            </span>
          </div>
        </FadeIn>

        {/* CTAs */}
        <FadeIn delay={0.3}>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/shabbat">
              <GoldButton size="lg">Join Us This Shabbat</GoldButton>
            </Link>
            <Link href="/about/vision-mission">
              <OutlinedButton size="lg" className="border-white text-white hover:bg-white/10">
                Learn More
              </OutlinedButton>
            </Link>
          </div>
        </FadeIn>

        {/* Hero scripture */}
        <FadeIn delay={0.45}>
          <p
            className="pt-6 font-scripture text-sm italic text-white/90 md:text-base"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}
          >
            &ldquo;{SCRIPTURES.hero}&rdquo;
            <span className="ml-1 not-italic">&mdash; {SCRIPTURES.heroRef}</span>
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
