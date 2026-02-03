import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { MapPin, BookOpen, HandHeart, Users } from "@/components/icons";
import { ArrowRight } from "@/components/icons";

const cards = [
  {
    title: "Visit Us",
    description:
      "Join us for Shabbat services. Learn about service times, location, and what to expect.",
    href: "/shabbat",
    icon: MapPin,
  },
  {
    title: "Learn",
    description:
      "Explore our beliefs, statement of faith, and the foundational truths of our congregation.",
    href: "/about/what-we-believe",
    icon: BookOpen,
  },
  {
    title: "Give",
    description:
      "Support the ministry through tithes and offerings. Every gift advances the kingdom.",
    href: "/give",
    icon: HandHeart,
  },
  {
    title: "Connect",
    description:
      "Reach out to our community. Whether you have questions or want to get involved, we are here.",
    href: "/contact",
    icon: Users,
  },
] as const;

export function QuickAccess() {
  return (
    <section className="bg-warm-white py-24 px-4">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title="Get Started" subtitle="Find your place in our community" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.title} href={card.href} className="group">
                <div className="h-full rounded-lg border border-warm-border bg-white p-6 shadow-sm gold-top-border transition-all duration-200 hover:shadow-md hover:shadow-black/5 hover:-translate-y-0.5">
                  <div className="space-y-4">
                    <div className="flex size-12 items-center justify-center rounded-full bg-yhvh-gold/10">
                      <Icon className="size-5 text-yhvh-gold" />
                    </div>
                    <h3 className="font-subheading text-lg font-semibold text-warm-black">
                      {card.title}
                    </h3>
                    <p className="font-body text-sm leading-relaxed text-warm-gray">
                      {card.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-subheading font-medium text-yhvh-gold opacity-0 transition-opacity group-hover:opacity-100">
                      Learn more
                      <ArrowRight className="size-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
