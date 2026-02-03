import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { ScriptureQuote } from "@/components/ui/scripture-quote";
import { VISION_STATEMENT, ABOUT_US, MISSION_STATEMENT, CLOSING_INVITATION } from "@/lib/content";
import { SITE_CONFIG } from "@/lib/constants";
import { Clock, MapPin } from "@/components/icons";

export const metadata: Metadata = {
  title: "Vision & Mission | Congregation of YHVH",
  description: VISION_STATEMENT,
};

export default function VisionMissionPage() {
  return (
    <>
      <PageHero
        title="Vision & Mission"
        subtitle="Our purpose and calling as a congregation"
      />

      <div className="mx-auto max-w-4xl px-4 py-16 space-y-16">
        {/* Vision statement */}
        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-bold text-primary">
            Our Vision
          </h2>
          <Card className="border-primary/20 bg-card">
            <CardContent className="py-6">
              <p className="font-body text-base leading-relaxed text-muted-foreground md:text-lg">
                {VISION_STATEMENT}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* About us */}
        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-bold text-primary">
            About Us
          </h2>
          <p className="font-body text-base leading-relaxed text-muted-foreground">
            {ABOUT_US}
          </p>
        </section>

        {/* Mission statement */}
        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-bold text-primary">
            Our Mission
          </h2>
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="py-6">
              <p className="font-body text-base leading-relaxed text-foreground md:text-lg">
                {MISSION_STATEMENT}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Closing invitation */}
        <section className="space-y-4">
          <ScriptureQuote
            quote="Come now, let us reason together, says YHVH."
            reference="Isaiah 1:18"
          />
          <p className="font-body text-base leading-relaxed text-muted-foreground pt-4">
            {CLOSING_INVITATION}
          </p>
        </section>

        {/* Service info sidebar */}
        <Card className="border-border/40 bg-card">
          <CardContent className="py-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-around">
              <div className="flex items-center gap-3">
                <Clock className="size-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {SITE_CONFIG.serviceDay} at {SITE_CONFIG.serviceTime}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Weekly Shabbat Service
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="size-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {SITE_CONFIG.address}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    All are welcome
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
