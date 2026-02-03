import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Baby, Heart, Star } from "@/components/icons";

export const metadata: Metadata = {
  title: "Ministries | Congregation of YHVH",
  description:
    "Ministries of the Congregation of YHVH -- growing and expanding to serve our community.",
};

const futureMinistries = [
  {
    title: "Men\u2019s Ministry",
    description: "Equipping men to lead their families in the fear of YHVH.",
    icon: Users,
  },
  {
    title: "Women\u2019s Ministry",
    description: "Strengthening women in faith, fellowship, and set-apart living.",
    icon: Heart,
  },
  {
    title: "Youth Ministry",
    description: "Raising the next generation to walk in the truth of YHVH\u2019s Word.",
    icon: Star,
  },
  {
    title: "Children\u2019s Ministry",
    description: "Teaching children the stories, commandments, and love of YHVH.",
    icon: Baby,
  },
];

export default function MinistriesPage() {
  return (
    <>
      <PageHero
        title="Ministries"
        subtitle="Growing and expanding to serve our community"
      />

      <div className="mx-auto max-w-4xl px-4 py-16 space-y-12">
        <div className="text-center space-y-4">
          <p className="font-body text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            As the Congregation of YHVH grows, we are prayerfully developing
            ministries to serve every member of our community. Below is a preview
            of what is coming. If you feel called to serve in any of these areas,
            please{" "}
            <a
              href="/contact"
              className="text-primary hover:underline font-medium"
            >
              reach out to us
            </a>
            .
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {futureMinistries.map((ministry) => {
            const Icon = ministry.icon;
            return (
              <Card
                key={ministry.title}
                className="border-border/40 bg-card/50 opacity-80"
              >
                <CardContent className="py-6 text-center space-y-3">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="size-7 text-primary/60" />
                  </div>
                  <h3 className="font-subheading text-base font-semibold text-foreground">
                    {ministry.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {ministry.description}
                  </p>
                  <span className="inline-block text-xs text-primary/50 font-medium uppercase tracking-wider">
                    Coming Soon
                  </span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
