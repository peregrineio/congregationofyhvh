import Link from "next/link";
import { MapPin, BookOpen, HandHeart, Users, ArrowRight } from "@/components/icons";
import { FadeIn } from "@/components/ui/motion";

const gates = [
  {
    numeral: "I",
    hebrew: "ביקור",
    title: "Visit Us",
    description:
      "Join us for Shabbat services. Learn about service times, location, and what to expect.",
    href: "/shabbat",
    icon: MapPin,
  },
  {
    numeral: "II",
    hebrew: "לימוד",
    title: "Learn",
    description:
      "Explore our beliefs, statement of faith, and the foundational truths of our congregation.",
    href: "/about/what-we-believe",
    icon: BookOpen,
  },
  {
    numeral: "III",
    hebrew: "נתינה",
    title: "Give",
    description:
      "Support the ministry through tithes and offerings. Every gift advances the kingdom.",
    href: "/give",
    icon: HandHeart,
  },
  {
    numeral: "IV",
    hebrew: "קהילה",
    title: "Connect",
    description:
      "Reach out to our community. Whether you have questions or want to get involved, we are here.",
    href: "/contact",
    icon: Users,
  },
] as const;

export function QuickAccess() {
  return (
    <section className="relative bg-soft-cream px-4 py-28">
      <div className="mx-auto max-w-6xl">
        {/* Editorial header — left-aligned, asymmetric */}
        <FadeIn>
          <div className="mb-16 grid items-end gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <p className="mb-3 font-subheading text-xs font-semibold uppercase tracking-[0.35em] text-yhvh-gold-dark">
                Begin Here
              </p>
              <h2 className="font-heading text-4xl font-bold tracking-wide text-warm-black md:text-5xl">
                Four Gates<span className="text-yhvh-gold">.</span>
              </h2>
            </div>
            <p className="max-w-sm font-body text-base leading-relaxed text-warm-gray md:text-right">
              Every journey into this community passes through one of these
              doors. Choose yours.
            </p>
          </div>
        </FadeIn>

        {/* The ledger */}
        <div className="border-t border-yhvh-gold/25">
          {gates.map((gate, i) => {
            const Icon = gate.icon;
            return (
              <FadeIn key={gate.title} delay={i * 0.08}>
                <Link href={gate.href} className="group block">
                  <div className="gate-row grid grid-cols-[auto_1fr_auto] items-center gap-5 border-b border-yhvh-gold/25 px-2 py-7 md:grid-cols-[5rem_auto_1fr_auto_auto] md:gap-8 md:px-4 md:py-9">
                    {/* Roman numeral */}
                    <span className="font-heading text-3xl font-semibold text-yhvh-gold/45 transition-colors duration-300 group-hover:text-yhvh-gold md:text-4xl">
                      {gate.numeral}
                    </span>

                    {/* Hebrew gate word */}
                    <span
                      dir="rtl"
                      lang="he"
                      aria-hidden
                      className="hidden w-24 text-2xl font-medium text-yhvh-gold-dark/50 transition-colors duration-300 group-hover:text-yhvh-gold-dark md:block"
                      style={{ fontFamily: "var(--font-hebrew)" }}
                    >
                      {gate.hebrew}
                    </span>

                    {/* Title + description */}
                    <div className="min-w-0">
                      <h3 className="font-heading text-xl font-semibold tracking-wide text-warm-black md:text-2xl">
                        {gate.title}
                      </h3>
                      <p className="mt-1.5 max-w-xl font-body text-sm leading-relaxed text-warm-gray md:text-base">
                        {gate.description}
                      </p>
                    </div>

                    {/* Icon medallion */}
                    <div className="hidden size-12 items-center justify-center rounded-full border border-yhvh-gold/30 bg-warm-white transition-all duration-300 group-hover:border-yhvh-gold group-hover:bg-yhvh-gold/10 md:flex">
                      <Icon className="size-5 text-yhvh-gold" />
                    </div>

                    {/* Arrow */}
                    <ArrowRight className="size-5 shrink-0 text-yhvh-gold-dark/40 transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-yhvh-gold" />
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
