import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "@/components/icons";

export const metadata: Metadata = {
  title: "Our Team | Congregation of YHVH",
  description:
    "Meet the leadership team of the Congregation of YHVH, shepherding the flock in truth and love.",
};

// The board of the Congregation of YHVH. Bios are short role descriptions
// only until each member provides their own; photos are placeholders.
const teamMembers = [
  {
    name: "Franklin \u201cFrank\u201d Longoria",
    role: "Pastor & President",
    bio: "Shepherds the congregation, teaches the Word, and serves as President of the board.",
    featured: true,
  },
  {
    // TODO: Confirm Matt's surname with the client (heard as both "Wong" and
    // "Coux"). First name only until it is confirmed.
    name: "Matt",
    role: "Secretary & Treasurer",
    bio: "Keeps the records and oversees the finances of the congregation.",
    featured: false,
  },
  {
    name: "Raymond E. Flowers",
    role: "Director",
    bio: "Serves on the board of directors.",
    featured: false,
  },
  {
    name: "Jeremiah Longoria",
    role: "Director",
    bio: "Serves on the board of directors.",
    featured: false,
  },
];

export default function OurTeamPage() {
  return (
    <>
      <PageHero
        title="Our Team"
        subtitle="The shepherds YHVH has placed over this congregation"
        scripture={{
          quote:
            "Shepherd the flock of Elohim that is among you, exercising oversight, not under compulsion, but willingly, as Elohim would have you.",
          reference: "1 Peter 5:2",
        }}
      />

      <div className="mx-auto max-w-4xl px-4 py-16 space-y-12">
        {/* Featured pastor */}
        {teamMembers
          .filter((m) => m.featured)
          .map((member) => (
            <Card
              key={member.name}
              className="border-primary/20 bg-card overflow-hidden"
            >
              <CardContent className="py-8">
                <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
                  {/* Photo placeholder */}
                  <div className="flex size-40 shrink-0 items-center justify-center rounded-lg border-2 border-primary/20 bg-background">
                    {/* TODO: Replace with actual photo */}
                    <User className="size-16 text-muted-foreground/30" />
                  </div>

                  <div className="text-center md:text-left space-y-3">
                    <div>
                      <h2 className="font-heading text-2xl font-bold text-foreground">
                        {member.name}
                      </h2>
                      <p className="font-subheading text-sm text-primary font-medium">
                        {member.role}
                      </p>
                    </div>
                    <p className="font-body text-base leading-relaxed text-muted-foreground">
                      {member.bio}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

        {/* Additional team grid */}
        {teamMembers.filter((m) => !m.featured).length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers
              .filter((m) => !m.featured)
              .map((member) => (
                <Card key={member.name} className="border-border/40 bg-card">
                  <CardContent className="py-6 text-center space-y-3">
                    <div className="mx-auto flex size-24 items-center justify-center rounded-full border border-primary/20 bg-background">
                      <User className="size-10 text-muted-foreground/30" />
                    </div>
                    <div>
                      <h3 className="font-subheading text-base font-semibold text-foreground">
                        {member.name}
                      </h3>
                      <p className="text-xs text-primary">{member.role}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}

        {/* Call to reach leadership */}
        <div className="text-center pt-8">
          <p className="text-sm text-muted-foreground/60">
            Want to connect with our leadership?{" "}
            <a
              href="/contact"
              className="text-primary hover:underline font-medium"
            >
              Contact us
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
