import Link from "next/link";
import { SITE_CONFIG, FOOTER_LINKS, SCRIPTURES } from "@/lib/constants";
import { MapPin, Phone, Mail, Clock } from "@/components/icons";

function FooterLinkGroup({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="mb-5 font-subheading text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-yhvh-gold">
        {title}
      </h3>
      <div className="mb-5 h-px w-8 bg-gradient-to-r from-yhvh-gold/60 to-transparent" />
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="font-body text-sm text-white/55 transition-colors hover:text-yhvh-gold-light"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      {/* Illuminated colophon — the closing scripture on ruled parchment */}
      <div className="scribe-lines relative overflow-hidden border-t border-yhvh-gold/20 bg-soft-cream py-14">
        {/* Ghosted Hebrew — "Shema" (Hear) */}
        <span
          aria-hidden
          dir="rtl"
          className="hebrew-ghost absolute -top-4 right-[2%] text-[7rem] font-bold md:text-[10rem]"
        >
          שמע
        </span>
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <div className="mx-auto mb-6 h-px w-16 bg-gradient-to-r from-transparent via-yhvh-gold to-transparent" />
          <p className="font-scripture text-lg italic leading-relaxed text-warm-gray md:text-xl">
            &ldquo;{SCRIPTURES.footer}&rdquo;
          </p>
          <p className="mt-3 font-subheading text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-yhvh-gold-dark">
            {SCRIPTURES.footerRef}
          </p>
          <div className="mx-auto mt-6 h-px w-16 bg-gradient-to-r from-transparent via-yhvh-gold to-transparent" />
        </div>
      </div>

      {/* Night-sky footer — every page ends at sundown */}
      <div className="night-sky relative overflow-hidden text-white/70">
        <div aria-hidden className="star-field absolute inset-0 opacity-60" />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-yhvh-gold/10 to-transparent"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Column 1: Identity */}
            <div>
              <Link href="/" className="inline-block">
                <span className="gold-leaf-text font-heading text-xl font-bold tracking-wide">
                  {SITE_CONFIG.name}
                </span>
              </Link>
              {/* John 14:6 — the tagline, in Hebrew and English */}
              <p
                dir="rtl"
                lang="he"
                className="mt-2 text-lg text-yhvh-gold/80"
                style={{ fontFamily: "var(--font-hebrew)" }}
              >
                הדרך והאמת והחיים
              </p>
              <p className="mt-1 font-subheading text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-white/40">
                {SITE_CONFIG.tagline}
              </p>
              <p className="mt-5 font-body text-sm leading-relaxed text-white/45">
                {SITE_CONFIG.description}
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <FooterLinkGroup title="Quick Links" links={FOOTER_LINKS.quickLinks} />

            {/* Column 3: Resources */}
            <FooterLinkGroup title="Resources" links={FOOTER_LINKS.resources} />

            {/* Column 4: Contact */}
            <div>
              <h3 className="mb-5 font-subheading text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-yhvh-gold">
                Contact
              </h3>
              <div className="mb-5 h-px w-8 bg-gradient-to-r from-yhvh-gold/60 to-transparent" />
              <ul className="space-y-3.5">
                <li className="flex items-start gap-3 font-body text-sm text-white/55">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-yhvh-gold/70" />
                  <span>{SITE_CONFIG.address}</span>
                </li>
                <li className="flex items-center gap-3 font-body text-sm text-white/55">
                  <Clock className="size-4 shrink-0 text-yhvh-gold/70" />
                  <span>
                    {SITE_CONFIG.serviceDay} at {SITE_CONFIG.serviceTime}
                  </span>
                </li>
                {SITE_CONFIG.email && (
                  <li className="flex items-center gap-3 font-body text-sm text-white/55">
                    <Mail className="size-4 shrink-0 text-yhvh-gold/70" />
                    <a
                      href={`mailto:${SITE_CONFIG.email}`}
                      className="transition-colors hover:text-yhvh-gold-light"
                    >
                      {SITE_CONFIG.email}
                    </a>
                  </li>
                )}
                {SITE_CONFIG.phone && (
                  <li className="flex items-center gap-3 font-body text-sm text-white/55">
                    <Phone className="size-4 shrink-0 text-yhvh-gold/70" />
                    <a
                      href={`tel:${SITE_CONFIG.phone}`}
                      className="transition-colors hover:text-yhvh-gold-light"
                    >
                      {SITE_CONFIG.phone}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="relative border-t border-yhvh-gold/15">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <p className="text-center font-subheading text-xs text-white/30">
              &copy; {currentYear} {SITE_CONFIG.name}. All rights reserved. Built
              with reverence by{" "}
              <a
                href="https://peregrineio.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-yhvh-gold-light"
              >
                Peregrine IO
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
