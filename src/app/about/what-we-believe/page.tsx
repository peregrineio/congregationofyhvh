import type { Metadata } from "next";
import Image from "next/image";
import { WHAT_WE_BELIEVE, CLOSING_AFFIRMATION } from "@/lib/content";
import {
  AboutHero,
  PillarStrip,
  ClosingBand,
  AffirmationBand,
} from "@/components/about/about-hero";
import { BeliefAccordion } from "@/components/about/belief-accordion";
import {
  BookOpen,
  Cross,
  Sparkles,
  Users,
  ScrollText,
  Star,
  Flame,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "What We Believe | Congregation of YHVH",
  description:
    "Twelve foundational truths that guide the faith and practice of the Congregation of YHVH.",
};

const pillars = [
  { title: "Biblical Foundation", detail: "The entire Bible is our authority.", icon: BookOpen },
  { title: "Messiah Centered", detail: "Yahshua is the heart of our faith.", icon: Cross },
  { title: "Spirit Empowered", detail: "Led by the Ruach Ha'Qodesh.", icon: Flame },
  { title: "Covenant People", detail: "Rooted in Israel, called to all nations.", icon: Users },
  { title: "Set-Apart Living", detail: "Obedience as an act of worship.", icon: ScrollText },
  { title: "Eternal Hope", detail: "Awaiting the return of our King.", icon: Star },
];

export default function WhatWeBelievePage() {
  return (
    <>
      <AboutHero
        eyebrow="The Foundation of Our Faith"
        title={["What We", "Believe"]}
        tagline={`${WHAT_WE_BELIEVE.length} foundational truths that guide our faith and practice.`}
        image={{ src: "/images/gs/about-wwb-hero.webp" }}
      >
        <p>
          Our beliefs are rooted in the Scriptures, centered on Yahshua the Messiah,
          and empowered by the Ruach Ha&apos;Qodesh to live set-apart lives for the
          glory of YHVH.
        </p>
      </AboutHero>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-20 space-y-14">
        <PillarStrip items={pillars} />

        {/* ── The twelve points + built on truth ───────────────── */}
        <section className="grid gap-8 lg:grid-cols-[1fr_300px] lg:items-start">
          <BeliefAccordion points={[...WHAT_WE_BELIEVE]} />

          <aside className="parchment-plate relative overflow-hidden rounded-xl">
            <div className="relative z-10 p-7 text-center">
              <span className="inline-flex size-16 items-center justify-center rounded-full border border-yhvh-gold/25 bg-yhvh-gold/[0.07] text-yhvh-gold-dark">
                <ScrollText className="size-7" aria-hidden />
              </span>
              <h2 className="mt-5 font-heading text-xl text-foreground">
                Built on Truth
              </h2>
              <span aria-hidden className="mx-auto mt-3 block h-px w-14 bg-yhvh-gold/50" />
              <p className="mt-5 font-body text-sm leading-relaxed text-muted-foreground">
                Every doctrine we hold is shaped by the Word of YHVH and the example of
                Yahshua the Messiah.
              </p>
              <p className="mt-4 font-body text-sm leading-relaxed text-muted-foreground">
                We stand on eternal truth that transforms hearts, strengthens families,
                and advances the Kingdom of Elohim.
              </p>
            </div>

            {/* Landscape fades up into the card rather than sitting in a box. */}
            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-52">
              <Image
                src="/images/gs/about-wwb-truth.webp"
                alt=""
                fill
                sizes="300px"
                className="object-cover object-bottom"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#fdfbf6] via-[#fdfbf6]/40 to-transparent" />
            </div>
          </aside>
        </section>

        <AffirmationBand heading="Our Affirmation" icon={Sparkles}>
          {CLOSING_AFFIRMATION}
        </AffirmationBand>

        <ClosingBand />
      </div>
    </>
  );
}
