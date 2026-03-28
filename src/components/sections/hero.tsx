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
