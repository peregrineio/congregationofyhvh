import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { CORE_VALUES, CLOSING_AFFIRMATION } from "@/lib/content";

export const metadata: Metadata = {
  title: "Core Values | Congregation of YHVH",
  description:
    "The 9 core values that define the character and priorities of the Congregation of YHVH.",
};

export default function CoreValuesPage() {
  return (
    <>
      <PageHero
        title="Core Values"
        subtitle="The principles that shape who we are and how we walk"
        scripture={{
          quote: "If you love Me, keep My commandments.",
          reference: "John 14:15",
        }}
      />

      <div className="mx-auto max-w-6xl px-4 py-16">
        {/* Values grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CORE_VALUES.map((value) => (
            <Card
              key={value.number}
              className="border-border/40 bg-card hover:border-primary/30 transition-colors"
            >
              <CardContent className="py-6 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-heading text-sm font-bold">
                    {value.number}
                  </span>
                  <div>
                    <h3 className="font-subheading text-base font-semibold text-foreground">
                      {value.title}
                    </h3>
                    {value.hebrewTerm && (
                      <p className="text-xs text-primary/70">
                        {value.hebrewTerm}
                      </p>
                    )}
                  </div>
                </div>

                <p className="font-body text-sm leading-relaxed text-muted-foreground">
                  {value.description}
                </p>

                <blockquote className="border-l-2 border-primary/30 pl-3 pt-2">
                  <p className="font-scripture text-sm italic text-muted-foreground/80">
                    &ldquo;{value.scripture}&rdquo;
                  </p>
                  <cite className="text-xs text-muted-foreground/50 not-italic block mt-1">
                    &mdash; {value.scriptureRef}
                  </cite>
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Closing affirmation */}
        <Card className="border-accent/30 bg-card mt-12">
          <CardContent className="py-6 text-center">
            <h2 className="font-subheading text-sm font-semibold text-primary uppercase tracking-wider mb-3">
              Our Commitment
            </h2>
            <p className="font-scripture text-base italic text-muted-foreground leading-relaxed md:text-lg max-w-3xl mx-auto">
              {CLOSING_AFFIRMATION}
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
