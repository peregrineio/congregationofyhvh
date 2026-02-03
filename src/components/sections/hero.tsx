"use client";

import Link from "next/link";
import { SITE_CONFIG, SCRIPTURES } from "@/lib/constants";
import { STATEMENT_OF_FAITH_SHORT } from "@/lib/content";
import { GoldButton } from "@/components/ui/gold-button";
import { OutlinedButton } from "@/components/ui/outlined-button";
import { Clock } from "@/components/icons";
import { FadeIn } from "@/components/ui/motion";

export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 py-24 text-center">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover"
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Overlay for readability -- falls back to solid color if video fails */}
      <div className="absolute inset-0 z-10 bg-[#FEFDFB]/75" />

      {/* Content */}
      <div className="relative z-20 mx-auto max-w-3xl space-y-8">
        {/* Congregation name */}
        <FadeIn delay={0}>
          <h1 className="font-heading text-4xl font-bold tracking-wide text-warm-black sm:text-5xl md:text-6xl lg:text-7xl">
            {SITE_CONFIG.name}
          </h1>
          {/* Gold underline accent */}
          <div className="mx-auto mt-5 h-[2px] w-16 bg-yhvh-gold" />
        </FadeIn>

        {/* Tagline */}
        <FadeIn delay={0.15}>
          <p className="font-subheading text-lg text-warm-gray md:text-xl">
            {SITE_CONFIG.tagline}
          </p>
        </FadeIn>

        {/* Short statement of faith */}
        <FadeIn delay={0.3}>
          <p className="mx-auto max-w-xl font-body text-sm leading-relaxed text-light-gray md:text-base">
            {STATEMENT_OF_FAITH_SHORT}
          </p>
        </FadeIn>

        {/* Service time badge */}
        <FadeIn delay={0.4}>
          <div className="mx-auto inline-flex items-center gap-3 rounded-lg border border-warm-border bg-soft-cream px-5 py-3 shadow-sm">
            <div className="flex size-8 items-center justify-center rounded-full bg-yhvh-gold/10">
              <Clock className="size-4 text-yhvh-gold" />
            </div>
            <span className="font-subheading text-sm font-medium text-warm-gray">
              Shabbat Services: {SITE_CONFIG.serviceDay} at{" "}
              {SITE_CONFIG.serviceTime}
            </span>
          </div>
        </FadeIn>

        {/* CTAs */}
        <FadeIn delay={0.5}>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/shabbat">
              <GoldButton size="lg">Join Us This Shabbat</GoldButton>
            </Link>
            <Link href="/about/vision-mission">
              <OutlinedButton size="lg">Learn More</OutlinedButton>
            </Link>
          </div>
        </FadeIn>

        {/* Hero scripture */}
        <FadeIn delay={0.65}>
          <p className="pt-6 font-scripture text-sm italic text-light-gray md:text-base">
            &ldquo;{SCRIPTURES.hero}&rdquo;
            <span className="ml-1 not-italic">&mdash; {SCRIPTURES.heroRef}</span>
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
