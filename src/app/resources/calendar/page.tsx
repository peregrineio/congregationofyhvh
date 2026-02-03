import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FEAST_DAYS_2026 } from "@/lib/content";
import { Calendar } from "@/components/icons";

export const metadata: Metadata = {
  title: "Biblical Calendar | Congregation of YHVH",
  description:
    "The biblical feast days and appointed times (moedim) of YHVH for 2026, including Passover, Shavuot, Yom Teruah, Yom Kippur, and Sukkot.",
};

export default function BiblicalCalendarPage() {
  return (
    <>
      <PageHero
        title="Biblical Calendar"
        subtitle="The Appointed Times (Moedim) of YHVH -- 2026"
        scripture={{
          quote:
            "These are the appointed feasts of YHVH, the holy convocations, which you shall proclaim at the time appointed for them.",
          reference: "Leviticus 23:4",
        }}
      />

      <div className="mx-auto max-w-4xl px-4 py-16 space-y-6">
        {FEAST_DAYS_2026.map((feast) => (
          <Card
            key={feast.hebrewName}
            className="border-border/40 bg-card hover:border-primary/30 transition-colors"
          >
            <CardContent className="py-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="size-6 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-heading text-xl font-bold text-foreground">
                      {feast.name}
                    </h3>
                    <span className="text-sm text-primary/80 font-subheading">
                      ({feast.hebrewName})
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-primary/30 text-xs"
                  >
                    {feast.dates}
                  </Badge>
                  <p className="font-body text-sm leading-relaxed text-muted-foreground">
                    {feast.description}
                  </p>
                  <p className="text-xs text-muted-foreground/60">
                    {feast.scripture}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <p className="text-center text-xs text-muted-foreground/50 pt-8">
          Dates are approximate and may vary based on the observed biblical
          calendar. Please confirm with congregation leadership.
        </p>
      </div>
    </>
  );
}
