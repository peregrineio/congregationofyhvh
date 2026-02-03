import Link from "next/link";
import { PageHero } from "@/components/ui/page-hero";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Sparkles, BookOpen, ScrollText, Heart, Users } from "@/components/icons";

const aboutPages = [
  {
    title: "Vision & Mission",
    description: "Our purpose, calling, and the heart behind this congregation.",
    href: "/about/vision-mission",
    icon: Sparkles,
  },
  {
    title: "Statement of Faith",
    description: "The scriptural foundation of what we believe and proclaim.",
    href: "/about/statement-of-faith",
    icon: ScrollText,
  },
  {
    title: "What We Believe",
    description: "12 doctrinal points rooted in Torah and the testimony of Yahshua.",
    href: "/about/what-we-believe",
    icon: BookOpen,
  },
  {
    title: "Core Values",
    description: "The 9 principles that shape who we are and how we walk.",
    href: "/about/core-values",
    icon: Heart,
  },
  {
    title: "Our Team",
    description: "Meet the shepherds YHVH has placed over this congregation.",
    href: "/about/our-team",
    icon: Users,
  },
] as const;

export default function AboutIndexPage() {
  return (
    <>
      <PageHero
        title="About Us"
        subtitle="Get to know the Congregation of YHVH"
      />

      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="grid gap-4">
          {aboutPages.map((page) => {
            const Icon = page.icon;
            return (
              <Link key={page.href} href={page.href} className="group">
                <Card className="border-border/40 bg-card transition-all hover:border-primary/30 hover:shadow-md">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="size-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="font-subheading text-lg text-foreground group-hover:text-primary transition-colors">
                        {page.title}
                      </CardTitle>
                      <CardDescription className="font-body text-sm text-muted-foreground mt-1">
                        {page.description}
                      </CardDescription>
                    </div>
                    <ArrowRight className="size-5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
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
