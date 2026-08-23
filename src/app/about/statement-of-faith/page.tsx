import type { Metadata } from "next";
import Image from "next/image";
import {
  STATEMENT_OF_FAITH_SHORT,
  STATEMENT_OF_FAITH_FULL,
  CLOSING_AFFIRMATION,
} from "@/lib/content";
import {
  AboutHero,
  PillarStrip,
  ClosingBand,
} from "@/components/about/about-hero";
import {
  BookOpen,
  Cross,
  Sparkles,
  ScrollText,
  Flame,
  Users,
  Star,
  HandHeart,
  Heart,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Statement of Faith | Congregation of YHVH",
  description:
    "Our beliefs are rooted in the Scriptures and centered on Yahshua the Messiah.",
};

const pillars = [
  { title: "Scripture as Authority", detail: "The final authority in all matters of faith and practice.", icon: BookOpen },
  { title: "Yahshua the Messiah", detail: "The promised Savior and Son of the living Elohim.", icon: Cross },
  { title: "Salvation By Grace", detail: "Through faith in Yahshua, not by our works.", icon: Sparkles },
  { title: "Obedience In Faith", detail: "Walking in the commandments as an expression of love.", icon: ScrollText },
  { title: "Ruach Ha'Qodesh", detail: "Empowers, guides, and equips every believer.", icon: Flame },
  { title: "One Covenant Family", detail: "Grafted into Israel and united in the Messiah.", icon: Users },
];

const coreBeliefs = [
  { title: "The Word of YHVH", detail: "Our standard for truth and life.", icon: BookOpen },
  { title: "Yahshua the Messiah", detail: "Our Lord, Redeemer, and King.", icon: Cross },
  { title: "Grace Through Faith", detail: "Our entry into righteousness.", icon: Sparkles },
  { title: "Walking in Obedience", detail: "Our response of love and devotion.", icon: ScrollText },
  { title: "Empowered by the Ruach", detail: "Our strength for daily victory.", icon: Flame },
  { title: "One Body in Messiah", detail: "Our unity, purpose, and calling.", icon: Users },
];

export default function StatementOfFaithPage() {
  return (
    <>
      <AboutHero
        eyebrow="What We Believe"
        title={["Statement", "of Faith"]}
        image={{ src: "/images/gs/about-sof-hero.webp" }}
        scripture={{
          quote:
            "All Scripture is breathed out by Elohim and profitable for teaching, for reproof, for correction, and for training in righteousness.",
          reference: "2 Timothy 3:16",
        }}
      >
        <p>{STATEMENT_OF_FAITH_SHORT}</p>
      </AboutHero>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-20 space-y-14">
        <PillarStrip items={pillars} />

        {/* ── Full statement + core beliefs rail ───────────────── */}
        <section className="grid gap-8 lg:grid-cols-[1fr_300px] lg:items-start">
          <article className="parchment-plate rounded-xl p-7 md:p-9">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-11 items-center justify-center rounded-full bg-yhvh-gold/15 text-yhvh-gold-dark">
                <BookOpen className="size-5" aria-hidden />
              </span>
              <h2 className="font-heading text-2xl text-foreground">
                Our Statement of Faith
              </h2>
            </div>

            <span aria-hidden className="mt-5 block h-px w-full bg-yhvh-gold/25" />

            {/* The vertical rule threading the markers is decorative; each
                belief is a real list item so it reads correctly aloud. */}
            <ol className="relative mt-6 space-y-6">
              <span
                aria-hidden
                className="absolute left-[7px] top-3 bottom-3 w-px bg-gradient-to-b from-transparent via-yhvh-gold/25 to-transparent"
              />
              {STATEMENT_OF_FAITH_FULL.map((paragraph, i) => (
                <li key={i} className="relative flex gap-4">
                  <span
                    aria-hidden
                    className="mt-1.5 size-3.5 shrink-0 rounded-full border-2 border-yhvh-gold bg-[#fdfbf6]"
                  />
                  <p className="font-body text-sm leading-relaxed text-muted-foreground">
                    {paragraph}
                  </p>
                </li>
              ))}
            </ol>
          </article>

          <aside className="parchment-plate scribe-lines rounded-xl p-7">
            <h2 className="font-heading text-xl text-foreground">Core Beliefs</h2>
            <span aria-hidden className="mt-3 block h-px w-16 bg-yhvh-gold/50" />

            <ul className="mt-6 space-y-5">
              {coreBeliefs.map(({ title, detail, icon: Icon }) => (
                <li key={title} className="flex items-start gap-3.5">
                  <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-yhvh-gold text-white">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-heading text-sm text-foreground">{title}</h3>
                    <p className="mt-0.5 font-body text-xs leading-relaxed text-muted-foreground">
                      {detail}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        {/* ── Affirmation ──────────────────────────────────────── */}
        <section className="parchment-plate relative overflow-hidden rounded-xl">
          <div className="grid md:grid-cols-[280px_1fr]">
            <div className="relative h-44 md:h-full">
              <Image
                src="/images/gs/about-sof-affirmation.webp"
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 280px"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#fdfbf6]"
              />
            </div>

            <div className="flex items-center gap-6 p-7 md:p-9">
              <span
                aria-hidden
                className="hidden size-16 shrink-0 items-center justify-center rounded-full border border-yhvh-gold/30 bg-[#fdfbf6] text-yhvh-gold-dark sm:flex"
              >
                <Star className="size-7" />
              </span>
              <div>
                <h2 className="font-heading text-xl text-foreground">Our Affirmation</h2>
                <span aria-hidden className="mt-2 block h-px w-14 bg-yhvh-gold/50" />
                <p className="mt-4 font-scripture text-base italic leading-relaxed text-muted-foreground">
                  {CLOSING_AFFIRMATION}
                </p>
              </div>
            </div>
          </div>
        </section>

        <ClosingBand />
      </div>
    </>
  );
}
