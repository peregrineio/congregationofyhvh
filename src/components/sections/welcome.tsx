import { SectionHeading } from "@/components/ui/section-heading";
import { PASTOR_WELCOME, CLOSING_INVITATION } from "@/lib/content";
import { User } from "@/components/icons";

export function Welcome() {
  return (
    <section className="bg-soft-cream py-24 px-4">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          title="Welcome"
          subtitle="A Message from Our Pastor"
        />

        <div className="grid gap-10 md:grid-cols-[auto_1fr] md:items-start">
          {/* Pastor photo placeholder */}
          <div className="mx-auto flex size-48 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-warm-border bg-white shadow-sm md:mx-0">
            {/* TODO: Replace with Pastor Frank's photo */}
            <User className="size-20 text-light-gray/40" />
          </div>

          {/* Welcome text */}
          <div className="space-y-5">
            <p className="font-body text-base leading-relaxed text-warm-gray md:text-lg">
              {PASTOR_WELCOME}
            </p>
            <p className="font-body text-base leading-relaxed text-light-gray">
              {CLOSING_INVITATION}
            </p>
            <div className="pt-2">
              {/* TODO: Update with Pastor's real name */}
              <p className="font-subheading text-sm font-semibold text-yhvh-gold">
                Pastor Frank
              </p>
              <p className="text-xs text-light-gray">
                Senior Pastor, Congregation of YHVH
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
