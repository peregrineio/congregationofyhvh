import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";
import { AboutHero, ClosingBand } from "@/components/about/about-hero";
import {
  BookOpen,
  Users,
  Sparkles,
  Heart,
  Cross,
  HandHeart,
  Mail,
  ArrowRight,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Give | Congregation of YHVH",
  description:
    "Support the ministry of the Congregation of YHVH through tithes and offerings. Every gift advances the kingdom of YHVH.",
};

const whyWeGive = [
  {
    title: "Worship",
    detail:
      "Giving is an act of worship and obedience to YHVH, recognizing that everything we have is from Him.",
    reference: "Psalm 50:14",
    icon: BookOpen,
  },
  {
    title: "Kingdom Impact",
    detail: "Your gifts help us share the Gospel, serve the community, and make disciples.",
    reference: "Matthew 28:19",
    icon: Users,
  },
  {
    title: "Eternal Investment",
    detail: "What we give now has eternal significance and advances YHVH's work on earth.",
    reference: "1 Corinthians 15:58",
    icon: Sparkles,
  },
  {
    title: "Generosity Culture",
    detail: "A generous community reflects the heart of YHVH and encourages others in faith.",
    reference: "2 Corinthians 8:1–2",
    icon: Heart,
  },
  {
    title: "Trust & Providence",
    detail: "When we give, we declare our trust in YHVH as our Provider and Sustainer.",
    reference: "Malachi 3:10",
    icon: Cross,
  },
];

const otherWays = [
  {
    title: "Volunteer",
    detail:
      "Give your time and talents. There are many ways to serve within the congregation.",
    cta: "Learn more",
    href: "/about",
    icon: Users,
  },
  {
    title: "Prayer",
    detail:
      "Partner with us in prayer. Lift up the congregation, its leadership, and the mission of YHVH.",
    cta: "Prayer requests",
    href: "/contact",
    icon: HandHeart,
  },
  {
    title: "Legacy Giving",
    detail:
      "Consider including the work of YHVH in your estate planning and leave a lasting impact.",
    cta: "Contact us",
    href: "/contact",
    icon: Heart,
  },
];

export default function GivePage() {
  return (
    <>
      <AboutHero
        eyebrow="Partner With Us"
        title={["Give"]}
        tagline="Support the ministry and advance the kingdom"
        image={{ src: "/images/gs/give-hero.webp" }}
        scripture={{
          quote:
            "Each one must give as he has decided in his heart, not reluctantly or under compulsion, for Elohim loves a cheerful giver.",
          reference: "2 Corinthians 9:7",
        }}
      >
        <p>
          Your generosity helps us fulfill our calling &mdash; proclaiming the Word,
          discipling believers, serving our community, and equipping the next
          generation to walk in obedience to YHVH.
        </p>
      </AboutHero>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-20 space-y-14">
        {/* ── Why we give ──────────────────────────────────────── */}
        <section className="parchment-plate rounded-xl p-7 md:p-9">
          <div className="text-center">
            <h2 className="font-heading text-3xl text-foreground">Why We Give</h2>
            <div aria-hidden className="mt-4 flex items-center justify-center gap-3">
              <span className="h-px w-16 bg-gradient-to-r from-transparent to-yhvh-gold/60" />
              <span className="size-1.5 rotate-45 bg-yhvh-gold/70" />
              <span className="h-px w-16 bg-gradient-to-l from-transparent to-yhvh-gold/60" />
            </div>
          </div>

          <ul className="mt-9 grid divide-y divide-yhvh-gold/15 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-5 lg:divide-x">
            {whyWeGive.map(({ title, detail, reference, icon: Icon }) => (
              <li key={title} className="p-5 text-center">
                <span className="inline-flex size-12 items-center justify-center rounded-full border border-yhvh-gold/25 bg-yhvh-gold/[0.07] text-yhvh-gold-dark">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-heading text-sm text-foreground">{title}</h3>
                <p className="mt-2 font-body text-xs leading-relaxed text-muted-foreground">
                  {detail}
                </p>
                <p className="mt-3 font-subheading text-[0.6rem] uppercase tracking-widest text-yhvh-gold-dark/70">
                  {reference}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Online giving + the ways that work today ─────────── */}
        <section className="parchment-plate rounded-xl">
          <div className="grid divide-y divide-yhvh-gold/15 lg:grid-cols-2 lg:divide-y-0 lg:divide-x">
            <div className="p-7 text-center md:p-9">
              <span className="inline-flex size-14 items-center justify-center rounded-full border border-yhvh-gold/25 bg-yhvh-gold/[0.07] text-yhvh-gold-dark">
                <HandHeart className="size-6" aria-hidden />
              </span>
              <h2 className="mt-5 font-heading text-2xl text-foreground">
                Online Giving
              </h2>
              <p className="mt-1 font-subheading text-sm uppercase tracking-widest text-yhvh-gold-dark">
                Coming soon
              </p>

              <p className="mx-auto mt-5 max-w-sm font-body text-sm leading-relaxed text-muted-foreground">
                We are currently setting up our secure online donation system to provide
                you with a simple and safe way to give.
              </p>

              {/* Deliberately a disabled button rather than a live link — there
                  is no payment processor behind it yet, and a giving page must
                  never imply it can take a gift it cannot. */}
              <button
                type="button"
                disabled
                aria-describedby="giving-status"
                className="mt-6 inline-flex cursor-not-allowed items-center gap-2 rounded-md bg-yhvh-gold/50 px-7 py-3 font-subheading text-sm uppercase tracking-widest text-white"
              >
                Give online (launching soon)
              </button>
              <p
                id="giving-status"
                className="mt-3 font-body text-xs text-muted-foreground/70"
              >
                Secure payment processing will be available soon.
              </p>
            </div>

            <div className="p-7 md:p-9">
              <h2 className="font-heading text-lg text-foreground">
                In the meantime, you can give:
              </h2>
              <span aria-hidden className="mt-3 block h-px w-full bg-yhvh-gold/25" />

              <ul className="mt-6 space-y-6">
                <li className="flex items-start gap-4">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-yhvh-gold/15 text-yhvh-gold-dark">
                    <Users className="size-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-heading text-base text-foreground">In Person</h3>
                    <p className="mt-1 font-body text-sm leading-relaxed text-muted-foreground">
                      Give during our weekly Shabbat service. An offering time is
                      included in each gathering.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4 border-t border-yhvh-gold/15 pt-6">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-yhvh-gold/15 text-yhvh-gold-dark">
                    <Mail className="size-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-heading text-base text-foreground">By Mail</h3>
                    <p className="mt-1 font-body text-sm leading-relaxed text-muted-foreground">
                      Send your tithes and offerings to:
                    </p>
                    <address className="mt-2 font-body text-sm not-italic leading-relaxed text-foreground">
                      {SITE_CONFIG.name}
                      <br />
                      {SITE_CONFIG.addressLine1} {SITE_CONFIG.addressLine2}
                      <br />
                      {SITE_CONFIG.city}, {SITE_CONFIG.state} {SITE_CONFIG.zip}
                    </address>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── Other ways to support ────────────────────────────── */}
        <section>
          <div className="text-center">
            <h2 className="font-heading text-3xl text-foreground">
              Other Ways to Support
            </h2>
            <div aria-hidden className="mt-4 flex items-center justify-center gap-3">
              <span className="h-px w-16 bg-gradient-to-r from-transparent to-yhvh-gold/60" />
              <span className="size-1.5 rotate-45 bg-yhvh-gold/70" />
              <span className="h-px w-16 bg-gradient-to-l from-transparent to-yhvh-gold/60" />
            </div>
          </div>

          <ul className="mt-9 grid gap-5 md:grid-cols-3">
            {otherWays.map(({ title, detail, cta, href, icon: Icon }) => (
              <li key={title} className="parchment-plate rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-yhvh-gold/25 bg-yhvh-gold/[0.07] text-yhvh-gold-dark">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-heading text-base text-foreground">{title}</h3>
                    <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">
                      {detail}
                    </p>
                    <Link
                      href={href}
                      className="mt-3 inline-flex items-center gap-1.5 font-subheading text-xs uppercase tracking-widest text-yhvh-gold-dark underline-offset-4 hover:underline"
                    >
                      {cta}
                      <ArrowRight className="size-3.5" aria-hidden />
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Thank you band ───────────────────────────────────── */}
        <section className="night-sky relative overflow-hidden rounded-xl">
          <div aria-hidden className="star-field absolute inset-0 opacity-70" />
          <div className="relative grid gap-8 p-7 md:p-10 lg:grid-cols-[auto_1fr_auto] lg:items-center">
            <span
              aria-hidden
              className="hidden size-20 shrink-0 items-center justify-center rounded-full border border-yhvh-gold/30 text-yhvh-gold-light lg:flex"
            >
              <Sparkles className="size-9" />
            </span>

            <figure>
              <blockquote className="font-scripture text-lg italic leading-relaxed text-white/90 md:text-xl">
                &ldquo;Honor YHVH with your wealth and with the firstfruits of all your
                produce; then your barns will be filled with plenty, and your vats will
                overflow with new wine.&rdquo;
              </blockquote>
              <figcaption className="mt-3 font-subheading text-xs uppercase tracking-[0.25em] text-yhvh-gold-light">
                &mdash; Proverbs 3:9&ndash;10
              </figcaption>
            </figure>

            <div className="border-t border-yhvh-gold/20 pt-6 lg:max-w-xs lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <h2 className="font-subheading text-xs uppercase tracking-[0.25em] text-yhvh-gold-light">
                Thank You
              </h2>
              <p className="mt-3 font-body text-sm leading-relaxed text-white/70">
                Your faithful giving empowers the ministry, strengthens the community,
                and glorifies YHVH. May YHVH bless you abundantly!
              </p>
            </div>
          </div>
        </section>

        <ClosingBand />
      </div>
    </>
  );
}
