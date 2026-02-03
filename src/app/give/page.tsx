import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { GoldButton } from "@/components/ui/gold-button";
import { SCRIPTURES } from "@/lib/constants";
import { HandHeart, Heart, Users } from "@/components/icons";

export const metadata: Metadata = {
  title: "Give | Congregation of YHVH",
  description:
    "Support the ministry of the Congregation of YHVH through tithes and offerings. Every gift advances the kingdom of YHVH.",
};

export default function GivePage() {
  return (
    <>
      <PageHero
        title="Give"
        subtitle="Support the ministry and advance the kingdom"
        scripture={{
          quote: SCRIPTURES.giving,
          reference: SCRIPTURES.givingRef,
        }}
      />

      <div className="mx-auto max-w-4xl px-4 py-16 space-y-16">
        {/* Why we give */}
        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-bold text-primary">
            Why We Give
          </h2>
          <p className="font-body text-base leading-relaxed text-muted-foreground">
            Giving is an act of worship and obedience. Throughout Scripture, YHVH
            calls His people to be generous stewards of the blessings He has
            given. Tithes and offerings support the ministry of the congregation,
            outreach to the community, and the teaching of YHVH&apos;s Word.
          </p>
          <p className="font-body text-base leading-relaxed text-muted-foreground">
            Your generosity enables us to gather for Shabbat, provide resources
            for study, support families in need, and equip the next generation to
            walk faithfully before YHVH.
          </p>
        </section>

        {/* Donation options */}
        <section>
          <h2 className="font-heading text-2xl font-bold text-primary mb-8 text-center">
            Ways to Give
          </h2>

          <Card className="border-primary/20 bg-card">
            <CardContent className="py-12 text-center space-y-6">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
                <HandHeart className="size-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-heading text-xl text-foreground">
                  Online Giving Coming Soon
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  We are currently setting up our secure online donation system.
                  In the meantime, you can give during our Shabbat services or
                  contact us directly.
                </p>
              </div>
              {/* TODO: Replace with Stripe/PayPal integration (Prompt 41) */}
              <GoldButton disabled className="opacity-50 cursor-not-allowed">
                Give Online
              </GoldButton>
              <p className="text-xs text-muted-foreground/50">
                Secure payment processing will be available soon
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Other ways to support */}
        <section>
          <h2 className="font-heading text-2xl font-bold text-primary mb-6">
            Other Ways to Support
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <Card className="border-border/40 bg-card">
              <CardHeader className="text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 mb-2">
                  <HandHeart className="size-6 text-primary" />
                </div>
                <CardTitle className="font-subheading text-base">
                  In-Person Giving
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Give during our weekly Shabbat service. An offering time is
                  included in each gathering.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card">
              <CardHeader className="text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 mb-2">
                  <Users className="size-6 text-primary" />
                </div>
                <CardTitle className="font-subheading text-base">
                  Volunteer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Give your time and talents. There are many ways to serve within
                  the congregation.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card">
              <CardHeader className="text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 mb-2">
                  <Heart className="size-6 text-primary" />
                </div>
                <CardTitle className="font-subheading text-base">
                  Prayer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Partner with us in prayer. Lift up the congregation, its
                  leadership, and the mission of YHVH.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
}
