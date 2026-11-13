import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/ui/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "@/components/icons";

export const metadata: Metadata = {
  title: "Our Leaders | Congregation of YHVH",
  description:
    "Meet the leaders of the Congregation of YHVH, shepherding the flock in truth and love.",
};

// Names and titles as given by the congregation (Sam, 2026-11-07). Bios stay
// empty until each leader provides their own; never write one for them.
// photo: null shows the placeholder until a headshot arrives.
type Leader = {
  name: string;
  role: string;
  photo: string | null;
  bio?: string;
  featured?: boolean;
};

const leaders: Leader[] = [
  {
    name: "Frank Longoria",
    role: "Senior Pastor",
    photo: "/images/leaders/frank-longoria.jpg",
    bio: "Shepherds the congregation, teaches the Word, and serves as President of the board.",
    featured: true,
  },
  { name: "Matt Koo", role: "Deacon & Church Secretary", photo: "/images/leaders/matt-koo.jpg" },
  { name: "Raymond E. Flowers", role: "Associate Pastor & Director", photo: "/images/leaders/raymond-flowers.jpg" },
  { name: "Jeremiah Longoria", role: "Director & Elder", photo: "/images/leaders/jeremiah-longoria.jpg" },
  { name: "Jairo Medrano", role: "Worship Team Leader", photo: "/images/leaders/jairo-medrano.jpg" },
  { name: "Nohemi Longoria", role: "Children’s Ministry Director", photo: "/images/leaders/nohemi-longoria.jpg" },
  {
    name: "Hussam Shahin",
    role: "Audio and Video Specialist & Youth Ministry Leader",
    photo: "/images/leaders/hussam-shahin-solo.jpg",
  },
  { name: "John Nunez", role: "Deacon", photo: "/images/leaders/john-nunez.jpg" },
  { name: "Frankie Galvan", role: "Deacon", photo: "/images/leaders/frankie-galvan.jpg" },
];

export default function OurLeadersPage() {
  const featured = leaders.filter((l) => l.featured);
  const others = leaders.filter((l) => !l.featured);

  return (
    <>
      <PageHero
        title="Our Leaders"
        subtitle="The shepherds YHVH has placed over this congregation"
        scripture={{
          quote:
            "Shepherd the flock of God which is among you, serving as overseers, not by compulsion but willingly, not for dishonest gain but eagerly.",
          reference: "1 Peter 5:2",
        }}
      />

      <div className="mx-auto max-w-6xl px-4 py-16 space-y-12">
        {/* Featured pastor */}
        {featured.map((leader) => (
          <Card key={leader.name} className="border-primary/20 bg-card overflow-hidden">
            <CardContent className="py-8">
              <div className="flex flex-col items-center gap-8 md:flex-row md:items-center">
                <div className="relative h-64 w-52 shrink-0 overflow-hidden rounded-lg border-2 border-primary/20 bg-background">
                  {leader.photo ? (
                    <Image
                      src={leader.photo}
                      alt={`${leader.name}, ${leader.role}`}
                      fill
                      sizes="208px"
                      className="object-cover object-top"
                      priority
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <User className="size-16 text-muted-foreground/30" />
                    </div>
                  )}
                </div>

                <div className="text-center md:text-left space-y-3">
                  <div>
                    <h2 className="font-heading text-2xl font-bold text-foreground">{leader.name}</h2>
                    <p className="font-subheading text-sm text-primary font-medium">{leader.role}</p>
                  </div>
                  {leader.bio && (
                    <p className="font-body text-base leading-relaxed text-muted-foreground">{leader.bio}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Leaders grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {others.map((leader) => (
            <Card key={leader.name} className="border-border/40 bg-card">
              <CardContent className="px-3 py-6 text-center space-y-3">
                <div className="relative mx-auto size-24 overflow-hidden rounded-full border border-primary/20 bg-background sm:size-28">
                  {leader.photo ? (
                    <Image
                      src={leader.photo}
                      alt={`${leader.name}, ${leader.role}`}
                      fill
                      sizes="112px"
                      className="object-cover object-top"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <User className="size-12 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-subheading text-sm font-semibold text-foreground sm:text-base">{leader.name}</h3>
                  <p className="text-xs leading-snug text-primary">{leader.role}</p>
                </div>
                {leader.bio && <p className="text-sm text-muted-foreground">{leader.bio}</p>}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to reach leadership */}
        <div className="text-center pt-8">
          <p className="text-sm text-muted-foreground/60">
            Want to connect with our leaders?{" "}
            <a href="/contact" className="text-primary hover:underline font-medium">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
