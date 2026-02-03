import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/page-hero";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, ScrollText, Info, ArrowRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "Resources | Congregation of YHVH",
  description:
    "Biblical resources including the feast day calendar, Torah portions, and frequently asked questions.",
};

const resourcePages = [
  {
    title: "Biblical Calendar",
    description:
      "The appointed times (moedim) of YHVH for 2026, including all seven annual feasts.",
    href: "/resources/calendar",
    icon: Calendar,
  },
  {
    title: "Torah Portions",
    description:
      "The complete annual parashot schedule with Torah, Haftarah, and Brit Chadashah readings.",
    href: "/resources/torah-portions",
    icon: ScrollText,
  },
  {
    title: "FAQ",
    description:
      "Answers to common questions about the Messianic faith and our congregation.",
    href: "/resources/faq",
    icon: Info,
  },
] as const;

export default function ResourcesIndexPage() {
  return (
    <>
      <PageHero
        title="Resources"
        subtitle="Tools and references for your walk of faith"
      />

      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resourcePages.map((page) => {
            const Icon = page.icon;
            return (
              <Link key={page.href} href={page.href} className="group">
                <Card className="h-full border-border/40 bg-card transition-all hover:border-primary/30 hover:shadow-md">
                  <CardHeader className="space-y-3">
                    <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="size-6 text-primary" />
                    </div>
                    <CardTitle className="font-subheading text-lg text-foreground group-hover:text-primary transition-colors">
                      {page.title}
                    </CardTitle>
                    <CardDescription className="font-body text-sm text-muted-foreground">
                      {page.description}
                    </CardDescription>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      Explore
                      <ArrowRight className="size-3.5" />
                    </span>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
