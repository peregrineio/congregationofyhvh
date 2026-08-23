import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { FAQ_ITEMS } from "@/lib/content";
import { SITE_CONFIG } from "@/lib/constants";
import { FaqBrowser } from "@/components/resources/faq-browser";
import { Flame, Users, Mail, ArrowRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "FAQ | Congregation of YHVH",
  description:
    "Answers to common questions about our faith, our community, and our Shabbat gatherings.",
};

export default function FAQPage() {
  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/gs/faq-hero.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-right"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-[#fdfbf6] via-[#fdfbf6]/85 to-transparent"
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <div className="max-w-xl">
            <p className="flex items-center gap-3 font-subheading text-xs uppercase tracking-[0.3em] text-yhvh-gold-dark">
              FAQ
              <span aria-hidden className="h-px w-10 bg-yhvh-gold/60" />
            </p>

            <h1 className="mt-4 font-heading text-4xl leading-tight sm:text-5xl lg:text-6xl">
              <span className="block text-foreground">Frequently</span>
              <span className="gold-leaf-text block">Asked Questions</span>
            </h1>

            <p className="mt-6 font-body text-lg leading-relaxed text-muted-foreground">
              Find answers to common questions about our faith, our community, and our
              gatherings.
            </p>

            <span aria-hidden className="mt-6 block h-px w-14 bg-yhvh-gold/60" />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-20 space-y-14">
        {/* ── Questions + help rail ────────────────────────────── */}
        <section className="grid gap-8 lg:grid-cols-[280px_1fr] lg:items-start">
          <aside className="parchment-plate scribe-lines rounded-xl p-7 text-center">
            <span className="inline-flex size-14 items-center justify-center rounded-full border border-yhvh-gold/25 bg-yhvh-gold/[0.07] text-yhvh-gold-dark">
              <Flame className="size-6" aria-hidden />
            </span>
            <h2 className="mt-4 font-heading text-xl text-foreground">
              We&apos;re Here To Help
            </h2>
            <span aria-hidden className="mx-auto mt-3 block h-px w-12 bg-yhvh-gold/40" />
            <p className="mt-4 font-body text-sm leading-relaxed text-muted-foreground">
              If you don&apos;t find the answer you&apos;re looking for, please reach
              out. We&apos;d love to hear from you.
            </p>

            <Link
              href="/contact"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-yhvh-gold px-5 py-3 font-subheading text-sm uppercase tracking-widest text-white transition-colors hover:bg-yhvh-gold-dark"
            >
              Contact us
              <ArrowRight className="size-4" aria-hidden />
            </Link>

            {SITE_CONFIG.email && (
              <>
                <span
                  aria-hidden
                  className="mx-auto mt-6 block h-px w-full bg-yhvh-gold/20"
                />
                <p className="mt-5 font-subheading text-[0.7rem] uppercase tracking-widest text-foreground">
                  Still have questions?
                </p>
                <p className="mt-1 font-body text-sm text-muted-foreground">
                  We&apos;re just a message away.
                </p>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="mt-3 flex items-center justify-center gap-2 font-body text-xs text-yhvh-gold-dark underline underline-offset-4 hover:text-foreground"
                >
                  <Mail className="size-4 shrink-0" aria-hidden />
                  <span className="whitespace-nowrap">{SITE_CONFIG.email}</span>
                </a>
              </>
            )}
          </aside>

          <FaqBrowser items={[...FAQ_ITEMS]} />
        </section>

        {/* ── Closing trio ─────────────────────────────────────── */}
        <section className="parchment-plate rounded-xl">
          <div className="grid divide-y divide-yhvh-gold/15 md:grid-cols-3 md:divide-y-0 md:divide-x">
            <div className="p-7 text-center">
              <span className="inline-flex size-12 items-center justify-center rounded-full border border-yhvh-gold/25 bg-yhvh-gold/[0.07] text-yhvh-gold-dark">
                <Flame className="size-5" aria-hidden />
              </span>
              <h2 className="mt-4 font-heading text-lg text-foreground">
                Rooted in Truth
              </h2>
              <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">
                Every answer points us back to the Word of YHVH and the example of
                Yahshua.
              </p>
            </div>

            <figure className="flex flex-col justify-center bg-yhvh-gold/[0.05] p-7 text-center">
              <blockquote className="font-scripture text-lg italic leading-relaxed text-foreground">
                &ldquo;Your word is a lamp to my feet and a light to my path.&rdquo;
              </blockquote>
              <figcaption className="mt-3 font-subheading text-xs uppercase tracking-[0.25em] text-yhvh-gold-dark">
                &mdash; Psalm 119:105
              </figcaption>
            </figure>

            <div className="p-7 text-center">
              <span className="inline-flex size-12 items-center justify-center rounded-full border border-yhvh-gold/25 bg-yhvh-gold/[0.07] text-yhvh-gold-dark">
                <Users className="size-5" aria-hidden />
              </span>
              <h2 className="mt-4 font-heading text-lg text-foreground">
                A Community of Faith
              </h2>
              <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">
                We walk together in obedience, love, and the hope of His promises.
              </p>
            </div>
          </div>
        </section>

        <p className="text-center font-body text-sm text-muted-foreground">
          Can&apos;t find what you&apos;re looking for?{" "}
          <Link
            href="/contact"
            className="text-yhvh-gold-dark underline underline-offset-4 hover:text-foreground"
          >
            Contact us
          </Link>{" "}
          &mdash; we&apos;re happy to help.
        </p>
      </div>
    </>
  );
}
