import { SectionHeading } from "@/components/ui/section-heading";
import { SITE_CONFIG } from "@/lib/constants";
import { MapPin, Clock, Mail, Phone } from "@/components/icons";

export function Location() {
  return (
    <section className="bg-warm-white py-24 px-4">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          title="Visit Us"
          subtitle="We would love to welcome you in person"
        />

        <div className="grid gap-8 md:grid-cols-2">
          {/* Map placeholder */}
          <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-warm-border bg-soft-cream shadow-sm">
            {/* TODO: Embed Google Map (Prompt 40) */}
            <div className="text-center space-y-2">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-yhvh-gold/10">
                <MapPin className="size-6 text-yhvh-gold/50" />
              </div>
              <p className="text-sm text-light-gray font-subheading">
                Map will be added here
              </p>
            </div>
          </div>

          {/* Contact info */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-yhvh-gold/10">
                <MapPin className="size-5 text-yhvh-gold" />
              </div>
              <div>
                <h3 className="font-subheading text-sm font-semibold text-warm-black">
                  Location
                </h3>
                <p className="text-sm text-warm-gray mt-1 font-body">
                  {SITE_CONFIG.address}
                </p>
              </div>
            </div>

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
          </div>
        </div>
      </div>
    </section>
  );
}
