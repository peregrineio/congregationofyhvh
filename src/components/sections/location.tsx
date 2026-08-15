import { SITE_CONFIG } from "@/lib/constants";
import { MapPin, Clock, Mail, Phone, Navigation } from "lucide-react";
import { GoldButton } from "@/components/ui/gold-button";
import { FadeIn } from "@/components/ui/motion";

export function Location() {
  // Encode address for URLs
  const encodedAddress = encodeURIComponent(SITE_CONFIG.address);

  // Directions URL - opens Google Maps app on mobile
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;

  // Embed URL for the iframe (no API key required)
  const embedUrl = `https://www.google.com/maps?q=${encodedAddress}&output=embed`;

  return (
    <section className="relative overflow-hidden bg-warm-white px-4 py-28">
      {/* Ghosted Hebrew — "Bo'u" (Come) */}
      <span
        aria-hidden
        dir="rtl"
        className="hebrew-ghost absolute bottom-0 left-[-1%] text-[10rem] font-bold md:text-[17rem]"
      >
        בואו
      </span>

      <div className="relative mx-auto max-w-6xl">
        {/* Editorial header — right-aligned to mirror Four Gates */}
        <FadeIn>
          <div className="mb-16 grid items-end gap-6 md:grid-cols-[auto_1fr]">
            <p className="order-2 max-w-sm font-body text-base leading-relaxed text-warm-gray md:order-1">
              A place is already set for you. Come as you are — we would love
              to welcome you in person this Shabbat.
            </p>
            <div className="order-1 md:order-2 md:text-right">
              <p className="mb-3 font-subheading text-xs font-semibold uppercase tracking-[0.35em] text-yhvh-gold-dark">
                Houston, Texas
              </p>
              <h2 className="font-heading text-4xl font-bold tracking-wide text-warm-black md:text-5xl">
                Find Us<span className="text-yhvh-gold">.</span>
              </h2>
            </div>
          </div>
        </FadeIn>

        <div className="grid gap-10 md:grid-cols-[1.15fr_1fr] md:items-stretch">
          {/* Map — sepia manuscript plate in an arched frame */}
          <FadeIn delay={0.1}>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block h-80 overflow-hidden md:h-full md:min-h-[30rem]"
            >
              <div className="arch-frame relative h-full w-full overflow-hidden border-2 border-yhvh-gold/40 shadow-[0_20px_60px_-20px_rgba(139,105,20,0.35)] transition-colors duration-500 group-hover:border-yhvh-gold">
                <iframe
                  src={embedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="map-sepia pointer-events-none h-full w-full"
                  title="Congregation of YHVH Location"
                />
                {/* Overlay hint */}
                <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-yhvh-gold-dark/25 via-transparent to-transparent pb-8 transition-opacity duration-500 group-hover:opacity-0">
                  <span className="flex items-center gap-2 rounded-full bg-warm-white/95 px-5 py-2.5 font-subheading text-sm font-medium text-warm-black shadow-lg">
                    <Navigation className="size-4 text-yhvh-gold" />
                    Tap for directions
                  </span>
                </div>
              </div>
            </a>
          </FadeIn>

          {/* Engraved contact ledger */}
          <FadeIn delay={0.2}>
            <div className="flex h-full flex-col justify-center">
              <div className="parchment-plate rounded-2xl px-8 py-10 md:px-10">
                <dl className="divide-y divide-yhvh-gold/15">
                  <div className="py-6 first:pt-0">
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/item flex items-start gap-5"
                    >
                      <MapPin className="mt-1 size-5 shrink-0 text-yhvh-gold" />
                      <div>
                        <dt className="font-subheading text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-yhvh-gold-dark">
                          Location
                        </dt>
                        <dd className="mt-1.5 font-body text-base leading-relaxed text-warm-gray transition-colors group-hover/item:text-yhvh-gold-dark">
                          {SITE_CONFIG.addressLine1} {SITE_CONFIG.addressLine2}
                          <br />
                          {SITE_CONFIG.city}, {SITE_CONFIG.state} {SITE_CONFIG.zip}
                        </dd>
                      </div>
                    </a>
                  </div>

                  <div className="flex items-start gap-5 py-6">
                    <Clock className="mt-1 size-5 shrink-0 text-yhvh-gold" />
                    <div>
                      <dt className="font-subheading text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-yhvh-gold-dark">
                        Shabbat Services
                      </dt>
                      <dd className="mt-1.5 font-body text-base text-warm-gray">
                        {SITE_CONFIG.serviceDay} at {SITE_CONFIG.serviceTime}
                      </dd>
                    </div>
                  </div>

                  {SITE_CONFIG.email && (
                    <div className="flex items-start gap-5 py-6">
                      <Mail className="mt-1 size-5 shrink-0 text-yhvh-gold" />
                      <div>
                        <dt className="font-subheading text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-yhvh-gold-dark">
                          Email
                        </dt>
                        <dd className="mt-1.5">
                          <a
                            href={`mailto:${SITE_CONFIG.email}`}
                            className="font-body text-base text-yhvh-blue transition-colors hover:text-yhvh-gold"
                          >
                            {SITE_CONFIG.email}
                          </a>
                        </dd>
                      </div>
                    </div>
                  )}

                  {SITE_CONFIG.phone && (
                    <div className="flex items-start gap-5 py-6">
                      <Phone className="mt-1 size-5 shrink-0 text-yhvh-gold" />
                      <div>
                        <dt className="font-subheading text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-yhvh-gold-dark">
                          Phone
                        </dt>
                        <dd className="mt-1.5">
                          <a
                            href={`tel:${SITE_CONFIG.phone}`}
                            className="font-body text-base text-yhvh-blue transition-colors hover:text-yhvh-gold"
                          >
                            {SITE_CONFIG.phone}
                          </a>
                        </dd>
                      </div>
                    </div>
                  )}
                </dl>

                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 block"
                >
                  <GoldButton className="w-full">
                    <Navigation className="mr-2 size-4" />
                    Get Directions
                  </GoldButton>
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
