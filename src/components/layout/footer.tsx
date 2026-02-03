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
      <h3 className="font-subheading text-sm font-semibold text-yhvh-gold mb-4 uppercase tracking-wider">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-white/60 hover:text-yhvh-gold transition-colors font-body"
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
      {/* Scripture banner -- warm cream above dark footer */}
      <div className="bg-soft-cream py-8 border-t border-warm-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-scripture text-base md:text-lg italic text-warm-gray">
            &ldquo;{SCRIPTURES.footer}&rdquo;
          </p>
          <p className="text-xs text-light-gray mt-2 font-subheading tracking-wide">
            &mdash; {SCRIPTURES.footerRef}
          </p>
        </div>
      </div>

      {/* Main footer -- dark for grounding contrast */}
      <div className="bg-footer-dark text-white/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Column 1: About */}
            <div>
              <Link href="/" className="inline-block mb-4">
                <span className="font-heading text-xl font-bold text-yhvh-gold tracking-wide">
                  {SITE_CONFIG.name}
                </span>
              </Link>
              <p className="text-sm text-white/50 leading-relaxed font-body">
                {SITE_CONFIG.description}
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <FooterLinkGroup title="Quick Links" links={FOOTER_LINKS.quickLinks} />

            {/* Column 3: Resources */}
            <FooterLinkGroup title="Resources" links={FOOTER_LINKS.resources} />

            {/* Column 4: Contact */}
            <div>
              <h3 className="font-subheading text-sm font-semibold text-yhvh-gold mb-4 uppercase tracking-wider">
                Contact
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5 text-sm text-white/60 font-body">
                  <MapPin className="size-4 text-yhvh-gold/70 mt-0.5 shrink-0" />
                  <span>{SITE_CONFIG.address}</span>
                </li>
                <li className="flex items-center gap-2.5 text-sm text-white/60 font-body">
                  <Clock className="size-4 text-yhvh-gold/70 shrink-0" />
                  <span>
                    {SITE_CONFIG.serviceDay} at {SITE_CONFIG.serviceTime}
                  </span>
                </li>
                {SITE_CONFIG.email && (
                  <li className="flex items-center gap-2.5 text-sm text-white/60 font-body">
                    <Mail className="size-4 text-yhvh-gold/70 shrink-0" />
                    <a
                      href={`mailto:${SITE_CONFIG.email}`}
                      className="hover:text-yhvh-gold transition-colors"
                    >
                      {SITE_CONFIG.email}
                    </a>
                  </li>
                )}
                {SITE_CONFIG.phone && (
                  <li className="flex items-center gap-2.5 text-sm text-white/60 font-body">
                    <Phone className="size-4 text-yhvh-gold/70 shrink-0" />
                    <a
                      href={`tel:${SITE_CONFIG.phone}`}
                      className="hover:text-yhvh-gold transition-colors"
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
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-xs text-white/30 font-subheading">
              &copy; {currentYear} {SITE_CONFIG.name}. All rights reserved. Built
              with reverence by{" "}
              <a
                href="https://peregrine.io"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-yhvh-gold transition-colors"
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
