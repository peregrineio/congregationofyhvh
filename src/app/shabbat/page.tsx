import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/page-hero";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SITE_CONFIG } from "@/lib/constants";
import { getCurrentPortion, getPortionByHebrewName } from "@/lib/torah-utils";
import { Clock, MapPin, ScrollText, BookOpen, Users, Flame, ArrowRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "Weekly Shabbat | Congregation of YHVH",
  description:
    "Join us for Shabbat services. Learn about service times, what to expect, and the weekly Torah portion.",
};

const orderOfService = [
  { title: "Shofar Sounding", description: "We begin by sounding the shofar, calling the congregation to worship.", icon: Flame },
  { title: "Opening Prayer & Worship", description: "Songs of praise and thanksgiving to YHVH.", icon: Flame },
  { title: "Torah Portion Reading", description: "The weekly reading from the Torah, Haftarah, and Brit Chadashah.", icon: ScrollText },
  { title: "Teaching", description: "A message grounded in Scripture, applying truth to daily life.", icon: BookOpen },
  { title: "Prayer & Ministry", description: "Corporate prayer and individual ministry as led by the Spirit.", icon: Flame },
  { title: "Fellowship", description: "A time to connect, share a meal, and build community together.", icon: Users },
];

export default function ShabbatPage() {
  // Get the current portion dynamically based on today's date
  const currentPortionName = getCurrentPortion();
  const currentPortion = getPortionByHebrewName(currentPortionName);

  // Fallback if portion not found (shouldn't happen)
  if (!currentPortion) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <PageHero
        title="Weekly Shabbat"
        subtitle="Gather with us to worship, learn, and grow"
        scripture={{
          quote:
            "Remember the Sabbath day, to keep it holy.",
          reference: "Exodus 20:8",
        }}
      />

      <div className="mx-auto max-w-5xl px-4 py-16 space-y-16">
        {/* Service info */}
        <section className="grid gap-6 md:grid-cols-2">
          <Card className="border-primary/20 bg-card">
            <CardHeader>
              <CardTitle className="font-subheading text-lg flex items-center gap-2">
                <Clock className="size-5 text-primary" />
                Service Times
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="font-body text-base text-foreground">
                {SITE_CONFIG.serviceDay} at {SITE_CONFIG.serviceTime}
              </p>
              <p className="text-sm text-muted-foreground">
                We gather weekly to observe the Shabbat as commanded by YHVH. All
                are welcome to join, whether you are new to the faith or have been
                walking this path for years.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card">
            <CardHeader>
              <CardTitle className="font-subheading text-lg flex items-center gap-2">
                <MapPin className="size-5 text-primary" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="font-body text-base text-foreground">
                {SITE_CONFIG.address}
              </p>
              <p className="text-sm text-muted-foreground">
                {/* TODO: Add parking and directions info */}
                All are welcome. Come as you are.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* What to expect */}
        <section>
          <h2 className="font-heading text-2xl font-bold text-primary mb-8 text-center">
            What to Expect
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {orderOfService.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card key={index} className="border-border/40 bg-card">
                  <CardContent className="py-5 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                        <Icon className="size-4 text-primary" />
                      </div>
                      <h3 className="font-subheading text-sm font-semibold text-foreground">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground pl-11">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Torah portion preview */}
        <section>
          <h2 className="font-heading text-2xl font-bold text-primary mb-6 text-center">
            This Week&apos;s Torah Portion
          </h2>
          <Card className="border-primary/20 bg-card">
            <CardContent className="py-6">
              <div className="text-center space-y-3">
                <p className="font-heading text-2xl text-primary">
                  {currentPortion.hebrewName}
                </p>
                <p className="text-muted-foreground">
                  &ldquo;{currentPortion.name}&rdquo; &mdash; Portion{" "}
                  {currentPortion.number}
                </p>
                <div className="space-y-1 text-sm text-muted-foreground pt-2">
                  <p>
                    <span className="text-foreground font-medium">Torah:</span>{" "}
                    {currentPortion.torahReading}
                  </p>
                  <p>
                    <span className="text-foreground font-medium">Haftarah:</span>{" "}
                    {currentPortion.haftarah}
                  </p>
                  <p>
                    <span className="text-foreground font-medium">
                      Brit Chadashah:
                    </span>{" "}
                    {currentPortion.britChadashah}
                  </p>
                </div>
                <Link
                  href="/resources/torah-portions"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline pt-2"
                >
                  View full annual schedule
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Children's Shabbat placeholder */}
        <section>
          <Card className="border-border/40 bg-card/50">
            <CardContent className="py-8 text-center">
              <h2 className="font-heading text-xl text-primary mb-2">
                Children&apos;s Shabbat
              </h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                We are developing dedicated children&apos;s programming to help
                the next generation grow in their understanding of YHVH&apos;s
                Word. More details coming soon.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}
