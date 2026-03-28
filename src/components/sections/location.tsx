import { SectionHeading } from "@/components/ui/section-heading";
import { SITE_CONFIG } from "@/lib/constants";
import { MapPin, Clock, Mail, Phone, Navigation } from "lucide-react";
import { GoldButton } from "@/components/ui/gold-button";

export function Location() {
  // Encode address for URLs
  const encodedAddress = encodeURIComponent(SITE_CONFIG.address);

  // Directions URL - opens Google Maps app on mobile
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;

  // Embed URL for the iframe (no API key required)
  const embedUrl = `https://www.google.com/maps?q=${encodedAddress}&output=embed`;

  return (
    <section className="bg-warm-white py-24 px-4">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          title="Visit Us"
          subtitle="We would love to welcome you in person"
        />

        <div className="grid gap-8 md:grid-cols-2">
          {/* Map - Clickable to open directions */}
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block aspect-video md:aspect-square rounded-lg overflow-hidden border border-warm-border hover:border-yhvh-gold/50 transition-colors relative group shadow-sm"
          >
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="pointer-events-none"
              title="Congregation of YHVH Location"
            />
            {/* Overlay hint */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 px-4 py-2 rounded-full text-sm font-medium text-warm-black shadow-lg flex items-center gap-2">
                <Navigation className="size-4" />
                Click for directions
              </span>
            </div>
          </a>

          {/* Contact info */}
          <div className="space-y-6">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 group"
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-yhvh-gold/10 group-hover:bg-yhvh-gold/20 transition-colors">
                <MapPin className="size-5 text-yhvh-gold" />
              </div>
              <div>
                <h3 className="font-subheading text-sm font-semibold text-warm-black">
                  Location
                </h3>
                <p className="text-sm text-warm-gray mt-1 font-body group-hover:text-yhvh-gold transition-colors">
                  {SITE_CONFIG.addressLine1}
                  <br />
                  {SITE_CONFIG.addressLine2}
                  <br />
                  {SITE_CONFIG.city}, {SITE_CONFIG.state} {SITE_CONFIG.zip}
                </p>
              </div>
            </a>

            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-yhvh-gold/10">
                <Clock className="size-5 text-yhvh-gold" />
              </div>
              <div>
                <h3 className="font-subheading text-sm font-semibold text-warm-black">
                  Service Times
                </h3>
                <p className="text-sm text-warm-gray mt-1 font-body">
                  {SITE_CONFIG.serviceDay} at {SITE_CONFIG.serviceTime}
                </p>
                <p className="text-xs text-light-gray mt-0.5 font-body">
                  Weekly Shabbat Gathering
                </p>
              </div>
            </div>

            {SITE_CONFIG.email && (
              <div className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-yhvh-gold/10">
                  <Mail className="size-5 text-yhvh-gold" />
                </div>
                <div>
                  <h3 className="font-subheading text-sm font-semibold text-warm-black">
                    Email
                  </h3>
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="text-sm text-yhvh-blue hover:text-yhvh-gold transition-colors mt-1 block font-body"
                  >
                    {SITE_CONFIG.email}
                  </a>
                </div>
              </div>
            )}

            {SITE_CONFIG.phone && (
              <div className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-yhvh-gold/10">
                  <Phone className="size-5 text-yhvh-gold" />
                </div>
                <div>
                  <h3 className="font-subheading text-sm font-semibold text-warm-black">
                    Phone
                  </h3>
                  <a
                    href={`tel:${SITE_CONFIG.phone}`}
                    className="text-sm text-yhvh-blue hover:text-yhvh-gold transition-colors mt-1 block font-body"
                  >
                    {SITE_CONFIG.phone}
                  </a>
                </div>
              </div>
            )}

            {/* Get Directions Button */}
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block pt-2"
            >
              <GoldButton className="w-full">
                <Navigation className="size-4 mr-2" />
                Get Directions
              </GoldButton>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
