import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SITE_CONFIG } from "@/lib/constants";
import { ContactForm } from "@/components/contact/contact-form";
import {
  MapPin,
  Clock,
  Mail,
  Phone,
  Flame,
  Users,
  BookOpen,
  ArrowRight,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact Us | Congregation of YHVH",
  description:
    "Get in touch with the Congregation of YHVH in Houston, Texas. Questions, visits, or prayer — we would love to hear from you.",
};

export default function ContactPage() {
  const mapQuery = encodeURIComponent(SITE_CONFIG.address);
  const mapEmbed = `https://www.google.com/maps?q=${mapQuery}&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;

  const details = [
    {
      label: "Our Location",
      icon: MapPin,
      lines: [
        `${SITE_CONFIG.addressLine1} ${SITE_CONFIG.addressLine2},`,
        `${SITE_CONFIG.city}, ${SITE_CONFIG.state} ${SITE_CONFIG.zip}`,
      ],
    },
    {
      label: "Service Time",
      icon: Clock,
      lines: [`${SITE_CONFIG.serviceDay} at ${SITE_CONFIG.serviceTime}`],
    },
    {
      label: "Email Us",
      icon: Mail,
      href: `mailto:${SITE_CONFIG.email}`,
      lines: [SITE_CONFIG.email],
    },
    {
      label: "Call Us",
      icon: Phone,
      href: `tel:${SITE_CONFIG.phone.replace(/[^\d+]/g, "")}`,
      lines: [SITE_CONFIG.phone],
    },
  ];

  const invitations = [
    {
      title: "Visit Us",
      detail: "We'd love to welcome you to our Shabbat gathering.",
      cta: "Plan your visit",
      href: "/shabbat",
      icon: Flame,
    },
    {
      title: "Get Involved",
      detail: "There are many ways to serve, learn, and grow together.",
      cta: "Learn more",
      href: "/about",
      icon: Users,
    },
    {
      title: "Stay Connected",
      detail: "Teachings, readings, and the appointed times of YHVH.",
      cta: "Browse resources",
      href: "/resources",
      icon: BookOpen,
    },
  ];

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/gs/contact-hero.webp"
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
              Get in Touch
              <span aria-hidden className="h-px w-10 bg-yhvh-gold/60" />
            </p>

            <h1 className="mt-4 font-heading text-4xl sm:text-5xl lg:text-6xl text-foreground">
              Contact Us
            </h1>

            <p className="mt-6 font-body text-lg leading-relaxed text-muted-foreground">
              We would love to hear from you. Whether you have a question, want to
              visit, or simply want to connect &mdash; we&apos;re here for you.
            </p>

            <a
              href="#send-a-message"
              className="mt-7 inline-flex items-center gap-2 rounded-md bg-yhvh-gold px-6 py-3 font-subheading text-sm uppercase tracking-widest text-white transition-colors hover:bg-yhvh-gold-dark"
            >
              <Mail className="size-4" aria-hidden />
              Send us a message
              <ArrowRight className="size-4" aria-hidden />
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-20 space-y-14">
        {/* ── Form + details ───────────────────────────────────── */}
        <section
          id="send-a-message"
          className="grid scroll-mt-32 gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start"
        >
          <ContactForm />

          <div className="parchment-plate overflow-hidden rounded-xl">
            <div className="p-7">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-full bg-yhvh-gold/15 text-yhvh-gold-dark">
                  <MapPin className="size-5" aria-hidden />
                </span>
                <h2 className="font-heading text-xl text-foreground">
                  Contact Information
                </h2>
              </div>

              <dl className="mt-6 space-y-5">
                {details.map(({ label, icon: Icon, lines, href }) => (
                  <div key={label} className="flex items-start gap-3.5">
                    <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-yhvh-gold/15 text-yhvh-gold-dark">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <dt className="font-subheading text-xs uppercase tracking-widest text-yhvh-gold-dark">
                        {label}
                      </dt>
                      <dd className="mt-1 font-body text-sm leading-relaxed text-foreground">
                        {href ? (
                          <a
                            href={href}
                            className="break-words underline underline-offset-4 decoration-yhvh-gold/40 hover:text-yhvh-gold-dark"
                          >
                            {lines.join(" ")}
                          </a>
                        ) : (
                          lines.map(line => <span key={line} className="block">{line}</span>)
                        )}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative h-64 border-t border-yhvh-gold/15">
              <iframe
                title={`Map showing ${SITE_CONFIG.name}`}
                src={mapEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 size-full"
              />
            </div>

            <div className="border-t border-yhvh-gold/15 p-5 text-center">
              <a
                href={directions}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-subheading text-xs uppercase tracking-widest text-yhvh-gold-dark underline-offset-4 hover:underline"
              >
                Get directions
                <ArrowRight className="size-3.5" aria-hidden />
              </a>
            </div>
          </div>
        </section>

        {/* ── Invitations ──────────────────────────────────────── */}
        <section className="parchment-plate rounded-xl">
          <ul className="grid divide-y divide-yhvh-gold/15 md:grid-cols-3 md:divide-y-0 md:divide-x">
            {invitations.map(({ title, detail, cta, href, icon: Icon }) => (
              <li key={title} className="p-7 text-center">
                <span className="inline-flex size-12 items-center justify-center rounded-full border border-yhvh-gold/25 bg-yhvh-gold/[0.07] text-yhvh-gold-dark">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h2 className="mt-4 font-heading text-lg text-foreground">{title}</h2>
                <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">
                  {detail}
                </p>
                <Link
                  href={href}
                  className="mt-4 inline-flex items-center gap-1.5 font-subheading text-xs uppercase tracking-widest text-yhvh-gold-dark underline-offset-4 hover:underline"
                >
                  {cta}
                  <ArrowRight className="size-3.5" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Closing ──────────────────────────────────────────── */}
        <section className="parchment-plate scribe-lines relative overflow-hidden rounded-xl px-7 py-12 text-center md:px-12">
          <span
            aria-hidden
            className="hebrew-ghost pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[6rem] md:text-[9rem]"
          >
            יהוה
          </span>
          <figure className="relative">
            <blockquote className="mx-auto max-w-xl font-scripture text-xl italic leading-relaxed text-foreground md:text-2xl">
              &ldquo;Let all that you do be done in love.&rdquo;
            </blockquote>
            <figcaption className="mt-4 font-subheading text-xs uppercase tracking-[0.25em] text-yhvh-gold-dark">
              &mdash; 1 Corinthians 16:14
            </figcaption>
          </figure>
        </section>
      </div>
    </>
  );
}
