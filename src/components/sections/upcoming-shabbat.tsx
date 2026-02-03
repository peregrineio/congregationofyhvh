import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { SITE_CONFIG } from "@/lib/constants";
import { TORAH_PORTIONS } from "@/lib/content";
import { GoldButton } from "@/components/ui/gold-button";
import { Clock, MapPin, ScrollText, ArrowRight } from "@/components/icons";

export function UpcomingShabbat() {
  const currentPortion = TORAH_PORTIONS[0];

  return (
    <section className="bg-soft-cream py-24 px-4">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          title="Upcoming Shabbat"
          subtitle="Join us this week as we gather to worship and study"
        />

        <div className="grid gap-6 md:grid-cols-2">
          {/* Service details card */}
          <div className="rounded-lg border border-warm-border bg-white p-6 shadow-sm gold-top-border">
            <h3 className="font-subheading text-lg font-semibold text-warm-black mb-5">
              Service Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-yhvh-gold/10">
                  <Clock className="size-5 text-yhvh-gold" />
                </div>
                <div>
                  <p className="font-subheading text-sm font-medium text-warm-black">
                    {SITE_CONFIG.serviceDay} at {SITE_CONFIG.serviceTime}
                  </p>
                  <p className="text-xs text-light-gray">Weekly Gathering</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-yhvh-gold/10">
                  <MapPin className="size-5 text-yhvh-gold" />
                </div>
                <div>
                  <p className="font-subheading text-sm font-medium text-warm-black">
                    {SITE_CONFIG.address}
                  </p>
                  <p className="text-xs text-light-gray">All are welcome</p>
                </div>
              </div>
              <div className="pt-2">
                <Link href="/shabbat">
                  <GoldButton size="sm" className="w-full">
                    What to Expect
                  </GoldButton>
                </Link>
              </div>
            </div>
          </div>

          {/* Torah portion card */}
          <div className="rounded-lg border border-warm-border bg-white p-6 shadow-sm gold-top-border">
            <h3 className="font-subheading text-lg font-semibold text-warm-black mb-5 flex items-center gap-2">
              <ScrollText className="size-5 text-yhvh-gold" />
              Torah Portion
            </h3>
            <div className="space-y-4">
              <div>
                <p className="font-heading text-xl text-yhvh-gold">
                  {currentPortion.hebrewName}
                </p>
                <p className="text-sm text-warm-gray">
                  &ldquo;{currentPortion.name}&rdquo; &mdash; Portion{" "}
                  {currentPortion.number}
                </p>
              </div>
              <div className="space-y-2 text-sm border-t border-warm-border/60 pt-4">
                <p className="text-warm-gray">
                  <span className="font-medium text-warm-black">Torah:</span>{" "}
                  {currentPortion.torahReading}
                </p>
                <p className="text-warm-gray">
                  <span className="font-medium text-warm-black">Haftarah:</span>{" "}
                  {currentPortion.haftarah}
                </p>
                <p className="text-warm-gray">
                  <span className="font-medium text-warm-black">
                    Brit Chadashah:
                  </span>{" "}
                  {currentPortion.britChadashah}
                </p>
              </div>
              <Link
                href="/resources/torah-portions"
                className="inline-flex items-center gap-1 text-sm font-subheading font-medium text-yhvh-gold hover:text-yhvh-gold-dark transition-colors pt-1"
              >
                View full schedule
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
