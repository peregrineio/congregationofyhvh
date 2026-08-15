import { PASTOR_WELCOME } from "@/lib/content";
import { User } from "@/components/icons";
import { FadeIn } from "@/components/ui/motion";

export function Welcome() {
  return (
    <section className="relative overflow-hidden bg-warm-white px-4 py-28">
      {/* Ghosted Hebrew — "B'ruchim HaBa'im" (Welcome) */}
      <span
        aria-hidden
        dir="rtl"
        className="hebrew-ghost absolute -top-6 right-[-2%] text-[9rem] font-bold md:text-[15rem] lg:text-[19rem]"
      >
        ברוכים הבאים
      </span>

      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[auto_1fr] md:gap-14">
          {/* Vertical editorial rail */}
          <div className="hidden select-none md:flex md:flex-col md:items-center md:gap-6">
            <div className="h-24 w-px bg-gradient-to-b from-transparent via-yhvh-gold to-yhvh-gold/40" />
            <span className="vertical-label font-subheading text-[0.65rem] font-semibold uppercase tracking-widest text-yhvh-gold-dark">
              A Letter From Our Pastor
            </span>
            <div className="h-full w-px bg-gradient-to-b from-yhvh-gold/40 to-transparent" />
          </div>

          {/* The epistle */}
          <FadeIn>
            <div className="parchment-plate scribe-lines relative rounded-2xl px-7 py-10 md:px-14 md:py-14">
              {/* Mobile-only label */}
              <p className="mb-6 font-subheading text-xs font-semibold uppercase tracking-[0.3em] text-yhvh-gold-dark md:hidden">
                A Letter From Our Pastor
              </p>

              {/* Hebrew greeting headline */}
              <div className="mb-3 flex flex-wrap items-baseline gap-x-5 gap-y-1">
                <h2
                  dir="rtl"
                  lang="he"
                  className="gold-leaf-text text-4xl font-bold md:text-5xl"
                  style={{ fontFamily: "var(--font-hebrew)" }}
                >
                  ברוכים הבאים
                </h2>
                <p className="font-heading text-lg tracking-wide text-warm-black md:text-xl">
                  Welcome — you belong here.
                </p>
              </div>

              <div className="gold-accent-bar mb-9 mt-6 max-w-xs" />

              <div className="grid gap-10 lg:grid-cols-[1fr_auto]">
                <div className="max-w-2xl space-y-6">
                  <p className="drop-cap font-body text-base leading-8 text-warm-gray md:text-lg md:leading-9">
                    {PASTOR_WELCOME}
                  </p>
                  {/* NKJV */}
                  <p className="font-scripture text-base italic leading-relaxed text-yhvh-gold-dark md:text-lg">
                    &ldquo;Come to Me, all you who labor and are heavy laden,
                    and I will give you rest.&rdquo;
                    <span className="ml-2 font-subheading text-xs not-italic uppercase tracking-[0.2em] text-light-gray">
                      Matthew 11:28
                    </span>
                  </p>

                  {/* Signature block */}
                  <div className="flex items-center gap-4 pt-4">
                    <div className="h-px w-10 bg-yhvh-gold" />
                    <div>
                      {/* TODO: Update with Pastor's confirmed name */}
                      <p className="font-heading text-base font-semibold tracking-wide text-warm-black">
                        Pastor Frank
                      </p>
                      <p className="font-subheading text-xs uppercase tracking-[0.2em] text-light-gray">
                        Senior Pastor · Congregation of YHVH
                      </p>
                    </div>
                  </div>
                </div>

                {/* Pastor portrait — arched frame, like a sanctuary window */}
                <div className="mx-auto lg:mx-0">
                  <div className="arch-frame flex h-64 w-44 items-end justify-center overflow-hidden border border-yhvh-gold/30 bg-gradient-to-b from-warm-sand to-soft-cream shadow-inner md:h-72 md:w-52">
                    {/* TODO: Replace with Pastor Frank's photo */}
                    <User className="mb-6 size-24 text-yhvh-gold-dark/20" />
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
