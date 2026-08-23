import type { Metadata } from "next";
import { CORE_VALUES, CLOSING_AFFIRMATION } from "@/lib/content";
import {
  AboutHero,
  PillarStrip,
  ClosingBand,
  AffirmationBand,
} from "@/components/about/about-hero";
import {
  BookOpen,
  Cross,
  Flame,
  Users,
  ScrollText,
  Star,
  Sparkles,
  HandHeart,
  Heart,
  Church,
  Baby,
  Sun,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Core Values | Congregation of YHVH",
  description:
    "The principles that shape who we are and how we walk as a congregation devoted to YHVH.",
};

const pillars = [
  { title: "Scripture Centered", detail: "The Word of YHVH is our foundation and final authority.", icon: BookOpen },
  { title: "Messiah Exalted", detail: "Yahshua is the heart of our faith and the focus of our worship.", icon: Cross },
  { title: "Spirit Empowered", detail: "We rely on the Ruach Ha'Qodesh to live, serve, and grow.", icon: Flame },
  { title: "Covenant People", detail: "We walk together as one body, called out and set apart.", icon: Users },
  { title: "Set-Apart Living", detail: "Obedience to YHVH is our expression of love and faith.", icon: ScrollText },
  { title: "Eternal Hope", detail: "We look forward to the return of our King and His Kingdom.", icon: Star },
];

/**
 * An icon per value, keyed by number so the mapping survives a wording
 * change in content.ts. Falls back to the seal if a value is ever added.
 */
const VALUE_ICONS: Record<number, React.ComponentType<{ className?: string }>> = {
  1: Sun,
  2: Cross,
  3: ScrollText,
  4: BookOpen,
  5: Flame,
  6: Users,
  7: Church,
  8: Sparkles,
  9: Baby,
};

export default function CoreValuesPage() {
  return (
    <>
      <AboutHero
        eyebrow="Our Foundation. Our Direction."
        title={["Core", "Values"]}
        tagline="The principles that shape who we are and how we walk"
        image={{ src: "/images/gs/about-values-hero.webp" }}
        scripture={{
          quote: "If you love Me, keep My commandments.",
          reference: "John 14:15",
        }}
      >
        <p>
          Our core values are rooted in the Word of YHVH and guide every area of our
          life together as a congregation.
        </p>
      </AboutHero>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-20 space-y-14">
        <PillarStrip items={pillars} />

        {/* ── The values ───────────────────────────────────────── */}
        <section>
          <div className="text-center">
            <h2 className="font-heading text-3xl text-foreground">Our Core Values</h2>
            <div aria-hidden className="mt-4 flex items-center justify-center gap-3">
              <span className="h-px w-16 bg-gradient-to-r from-transparent to-yhvh-gold/60" />
              <span className="size-1.5 rotate-45 bg-yhvh-gold/70" />
              <span className="h-px w-16 bg-gradient-to-l from-transparent to-yhvh-gold/60" />
            </div>
            <p className="mt-3 font-body text-sm text-muted-foreground">
              {CORE_VALUES.length} principles that guide our life together.
            </p>
          </div>

          <ol className="mt-9 grid gap-4 md:grid-cols-2">
            {CORE_VALUES.map(value => {
              const Icon = VALUE_ICONS[value.number] ?? HandHeart;

              return (
                <li
                  key={value.number}
                  className="parchment-plate group relative flex gap-4 rounded-xl p-5 transition-shadow duration-300 hover:shadow-[0_18px_50px_-18px_rgba(139,105,20,0.3)] sm:p-6"
                >
                  {/* Hex-ish gold marker, per the mock */}
                  <span
                    aria-hidden
                    className="flex size-9 shrink-0 rotate-45 items-center justify-center rounded-md bg-yhvh-gold"
                  >
                    <span className="-rotate-45 font-subheading text-sm text-white">
                      {value.number}
                    </span>
                  </span>

                  <span className="inline-flex size-12 shrink-0 items-center justify-center self-start rounded-full border border-yhvh-gold/25 bg-yhvh-gold/[0.07] text-yhvh-gold-dark">
                    <Icon className="size-5" />
                  </span>

                  <div className="min-w-0">
                    <h3 className="font-heading text-base text-foreground">
                      {value.title}
                    </h3>
                    {value.hebrewTerm && (
                      <p className="mt-0.5 font-subheading text-[0.65rem] uppercase tracking-widest text-yhvh-gold-dark">
                        {value.hebrewTerm}
                      </p>
                    )}
                    <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">
                      {value.description}
                    </p>

                    <figure className="mt-3 border-l-2 border-yhvh-gold/40 pl-3">
                      <blockquote className="font-scripture text-xs italic leading-relaxed text-muted-foreground">
                        &ldquo;{value.scripture}&rdquo;
                      </blockquote>
                      <figcaption className="mt-1 font-subheading text-[0.6rem] uppercase tracking-widest text-yhvh-gold-dark">
                        {value.scriptureRef}
                      </figcaption>
                    </figure>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <AffirmationBand
          heading="Our Commitment"
          icon={Heart}
          aside={{
            heading: "Living What We Believe",
            body: "These values are not just words — they are the foundation of how we worship, serve, teach, and love one another every day.",
          }}
        >
          {CLOSING_AFFIRMATION}
        </AffirmationBand>

        <ClosingBand />
      </div>
    </>
  );
}
