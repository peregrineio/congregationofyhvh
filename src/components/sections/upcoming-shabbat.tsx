import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";
import { getCurrentPortion, getPortionByHebrewName } from "@/lib/torah-utils";
import { GoldButton } from "@/components/ui/gold-button";
import { Clock, MapPin, ArrowRight } from "@/components/icons";
import { FadeIn } from "@/components/ui/motion";

export function UpcomingShabbat() {
  // Get the current portion dynamically based on today's date
  const currentPortionName = getCurrentPortion();
  const currentPortion = getPortionByHebrewName(currentPortionName);

  // Fallback if portion not found
  if (!currentPortion) {
    return null;
  }

  const readings = [
    { label: "Torah", value: currentPortion.torahReading },
    { label: "Haftarah", value: currentPortion.haftarah },
    { label: "Brit Chadashah", value: currentPortion.britChadashah },
  ];

  return (
    <section className="night-sky relative overflow-hidden px-4 py-28 text-white">
      {/* Star field */}
      <div aria-hidden className="star-field absolute inset-0 opacity-70" />

      {/* Candle glow rising from the bottom */}
      <div
        aria-hidden
        className="candle-glow absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-yhvh-gold/15 to-transparent"
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <FadeIn>
          <div className="mb-14 text-center">
            <p
              dir="rtl"
              lang="he"
              className="gold-leaf-text mx-auto mb-4 text-5xl font-bold md:text-6xl"
              style={{ fontFamily: "var(--font-hebrew)" }}
            >
              שבת שלום
            </p>
            <h2 className="font-heading text-2xl font-semibold tracking-[0.15em] text-white/90 md:text-3xl">
              THIS WEEK&rsquo;S SHABBAT
            </h2>
            <p className="mt-3 font-scripture text-base italic text-white/60 md:text-lg">
              As the sun sets, the sacred begins.
            </p>
          </div>
        </FadeIn>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          {/* Illuminated portion plate */}
          <FadeIn delay={0.1}>
            <div className="relative h-full overflow-hidden rounded-2xl border border-yhvh-gold/30 bg-white/[0.04] p-8 backdrop-blur-sm md:p-12">
              {/* Giant ghost portion number */}
              <span
                aria-hidden
                className="pointer-events-none absolute -right-4 -top-10 select-none font-heading text-[11rem] font-bold leading-none text-yhvh-gold/[0.08] md:text-[15rem]"
              >
                {currentPortion.number}
              </span>

              <div className="relative">
                <p className="mb-2 font-subheading text-xs font-semibold uppercase tracking-[0.35em] text-yhvh-gold">
                  Parashat HaShavua · Portion {currentPortion.number} of 54
                </p>
                <h3 className="gold-leaf-text font-heading text-5xl font-bold leading-tight md:text-6xl">
                  {currentPortion.hebrewName}
                </h3>
                <p className="mt-2 font-scripture text-xl italic text-white/70 md:text-2xl">
                  &ldquo;{currentPortion.name}&rdquo;
                </p>
                <p className="mt-1 font-subheading text-xs uppercase tracking-[0.25em] text-white/40">
                  Read on {currentPortion.date}
                </p>

                {/* Scroll columns — three readings */}
                <div className="mt-10 grid gap-6 border-t border-yhvh-gold/20 pt-8 sm:grid-cols-3">
                  {readings.map((r) => (
                    <div key={r.label} className="sm:border-l sm:border-yhvh-gold/20 sm:pl-5 sm:first:border-l-0 sm:first:pl-0">
                      <p className="font-subheading text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-yhvh-gold">
                        {r.label}
                      </p>
                      <p className="mt-2 font-body text-sm leading-relaxed text-white/85">
                        {r.value}
                      </p>
                    </div>
                  ))}
                </div>

                <Link
                  href="/resources/torah-portions"
                  className="mt-9 inline-flex items-center gap-2 font-subheading text-sm font-medium text-yhvh-gold transition-colors hover:text-yhvh-gold-light"
                >
                  View the full reading cycle
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </FadeIn>

          {/* Service details — the gathering */}
          <FadeIn delay={0.2}>
            <div className="flex h-full flex-col justify-between gap-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm md:p-10">
              <div className="space-y-7">
                <h3 className="font-heading text-xl font-semibold tracking-wide text-white">
                  Gather With Us
                </h3>

                <div className="flex items-start gap-4">
                  <div className="candle-glow flex size-11 shrink-0 items-center justify-center rounded-full border border-yhvh-gold/40 bg-yhvh-gold/10">
                    <Clock className="size-5 text-yhvh-gold" />
                  </div>
                  <div>
                    <p className="font-subheading text-base font-medium text-white">
                      {SITE_CONFIG.serviceDay} at {SITE_CONFIG.serviceTime}
                    </p>
                    <p className="mt-0.5 font-body text-sm text-white/50">
                      Weekly Shabbat gathering
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-yhvh-gold/40 bg-yhvh-gold/10">
                    <MapPin className="size-5 text-yhvh-gold" />
                  </div>
                  <div>
                    <p className="font-subheading text-base font-medium text-white">
                      {SITE_CONFIG.addressLine1}, {SITE_CONFIG.addressLine2}
                    </p>
                    <p className="mt-0.5 font-body text-sm text-white/50">
                      {SITE_CONFIG.city}, {SITE_CONFIG.state} {SITE_CONFIG.zip} · All are welcome
                    </p>
                  </div>
                </div>

                <p className="border-l-2 border-yhvh-gold/50 pl-4 font-scripture text-base italic leading-relaxed text-white/70">
                  &ldquo;Remember the Sabbath day, to keep it holy.&rdquo;
                  <span className="mt-1 block font-subheading text-xs not-italic uppercase tracking-[0.2em] text-yhvh-gold/80">
                    Exodus 20:8
                  </span>
                </p>
              </div>

              <Link href="/shabbat" className="block">
                <GoldButton size="lg" className="w-full">
                  What to Expect
                </GoldButton>
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
