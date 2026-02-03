import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { WHAT_WE_BELIEVE, CLOSING_AFFIRMATION } from "@/lib/content";

export const metadata: Metadata = {
  title: "What We Believe | Congregation of YHVH",
  description:
    "The 12 doctrinal points of the Congregation of YHVH, rooted in Scripture and the testimony of Yahshua the Messiah.",
};

export default function WhatWeBelievePage() {
  return (
    <>
      <PageHero
        title="What We Believe"
        subtitle="12 foundational truths that guide our faith and practice"
        scripture={{
          quote:
            "Your word is truth.",
          reference: "John 17:17",
        }}
      />

      <div className="mx-auto max-w-4xl px-4 py-16 space-y-8">
        {WHAT_WE_BELIEVE.map((point, index) => (
          <div key={point.number}>
            <Card className="border-border/40 bg-card">
              <CardContent className="py-6">
                <div className="flex items-start gap-4">
                  {/* Number badge */}
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-heading text-lg font-bold">
                    {point.number}
                  </div>

                  <div className="space-y-3 flex-1">
                    <div>
                      <h3 className="font-heading text-xl font-bold text-foreground">
                        {point.title}
                      </h3>
                      {point.hebrewTerm && (
                        <p className="text-xs text-primary/70 font-subheading mt-0.5">
                          {point.hebrewTerm}
                        </p>
                      )}
                    </div>

                    <p className="font-body text-sm leading-relaxed text-muted-foreground md:text-base">
                      {point.description}
                    </p>

                    {/* Scripture tags */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {point.scriptures.map((ref) => (
                        <Badge
                          key={ref}
                          variant="outline"
                          className="border-primary/20 text-xs text-muted-foreground/80"
                        >
                          {ref}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {index < WHAT_WE_BELIEVE.length - 1 && (
              <Separator className="bg-border/20 my-0" />
            )}
          </div>
        ))}

        {/* Closing affirmation */}
        <Card className="border-accent/30 bg-card mt-12">
          <CardContent className="py-6 text-center">
            <h2 className="font-subheading text-sm font-semibold text-primary uppercase tracking-wider mb-3">
              Our Affirmation
            </h2>
            <p className="font-scripture text-base italic text-muted-foreground leading-relaxed md:text-lg">
              {CLOSING_AFFIRMATION}
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
