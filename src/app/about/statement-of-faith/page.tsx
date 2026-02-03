import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  STATEMENT_OF_FAITH_SHORT,
  STATEMENT_OF_FAITH_FULL,
  CLOSING_AFFIRMATION,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Statement of Faith | Congregation of YHVH",
  description: STATEMENT_OF_FAITH_SHORT,
};

export default function StatementOfFaithPage() {
  return (
    <>
      <PageHero
        title="Statement of Faith"
        subtitle="The foundation of what we believe and proclaim"
        scripture={{
          quote: "All Scripture is breathed out by Elohim and profitable for teaching, for reproof, for correction, and for training in righteousness.",
          reference: "2 Timothy 3:16",
        }}
      />

      <div className="mx-auto max-w-4xl px-4 py-16 space-y-12">
        {/* Short summary */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="py-6">
            <h2 className="font-subheading text-sm font-semibold text-primary uppercase tracking-wider mb-3">
              Summary
            </h2>
            <p className="font-body text-base leading-relaxed text-foreground md:text-lg">
              {STATEMENT_OF_FAITH_SHORT}
            </p>
          </CardContent>
        </Card>

        <Separator className="bg-border/40" />

        {/* Full statement */}
        <section className="space-y-6">
          <h2 className="font-heading text-2xl font-bold text-primary">
            Full Statement of Faith
          </h2>
          <div className="space-y-6">
            {STATEMENT_OF_FAITH_FULL.map((paragraph, index) => (
              <p
                key={index}
                className="font-body text-base leading-relaxed text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <Separator className="bg-border/40" />

        {/* Affirmation */}
        <Card className="border-accent/30 bg-card">
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
