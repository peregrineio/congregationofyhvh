import Image from "next/image";
import type { ReactNode } from "react";

interface AboutHeroProps {
  /** Small tracked label above the title. */
  eyebrow: string;
  /** Rendered as two lines: the first in ink, the second in gold leaf. */
  title: [string, string] | [string];
  /** Gold sub-line under the title. */
  tagline?: string;
  children?: ReactNode;
  scripture?: { quote: string; reference: string };
  image: { src: string; alt?: string };
}

/**
 * Shared hero for the About suite.
 *
 * All four pages use the same shape — eyebrow, split title, tagline, copy,
 * and a photograph on the right that dissolves into the parchment on the
 * left. The artwork is generated with that empty left region built in, so
 * the scrim only has to deepen it rather than fight it.
 */
export function AboutHero({
  eyebrow,
  title,
  tagline,
  children,
  scripture,
  image,
}: AboutHeroProps) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src={image.src}
          alt={image.alt ?? ""}
          fill
          priority
          sizes="100vw"
          className="object-cover object-right"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-[#fdfbf6] via-[#fdfbf6]/88 to-transparent"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#fdfbf6] to-transparent"
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-24">
        <div className="max-w-xl">
          <p className="flex items-center gap-3 font-subheading text-xs uppercase tracking-[0.3em] text-yhvh-gold-dark">
            {eyebrow}
            <span aria-hidden className="h-px w-10 bg-yhvh-gold/60" />
          </p>

          <h1 className="mt-4 font-heading text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
            <span className="block text-foreground">{title[0]}</span>
            {title[1] && <span className="gold-leaf-text block">{title[1]}</span>}
          </h1>

          {tagline && (
            <p className="mt-4 font-subheading text-lg text-yhvh-gold-dark md:text-xl">
              {tagline}
            </p>
          )}

          {children && (
            <div className="mt-5 font-body text-base leading-relaxed text-muted-foreground">
              {children}
            </div>
          )}

          <div aria-hidden className="mt-7 flex items-center gap-3 max-w-sm">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-yhvh-gold/60" />
            <span className="size-1.5 rotate-45 bg-yhvh-gold/70" />
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-yhvh-gold/60" />
          </div>

          {scripture && (
            <figure className="mt-7 border-l-2 border-yhvh-gold/50 pl-5">
              <blockquote className="font-scripture text-base italic leading-relaxed text-foreground md:text-lg">
                &ldquo;{scripture.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-2 font-subheading text-xs uppercase tracking-[0.2em] text-yhvh-gold-dark">
                &mdash; {scripture.reference}
              </figcaption>
            </figure>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * The six-across pillar strip that sits under every About hero.
 * Five items on Vision & Mission, six on the others — the grid adapts.
 */
export function PillarStrip({
  items,
}: {
  items: { title: string; detail: string; icon: React.ComponentType<{ className?: string }> }[];
}) {
  return (
    <section className="parchment-plate rounded-xl">
      <ul
        className={`grid divide-y divide-yhvh-gold/15 sm:grid-cols-2 sm:divide-y-0 lg:divide-x ${
          items.length === 5 ? "lg:grid-cols-5" : "lg:grid-cols-3 xl:grid-cols-6"
        }`}
      >
        {items.map(({ title, detail, icon: Icon }) => (
          <li key={title} className="p-6 text-center">
            <span className="inline-flex size-12 items-center justify-center rounded-full border border-yhvh-gold/25 bg-yhvh-gold/[0.07] text-yhvh-gold-dark">
              <Icon className="size-5" />
            </span>
            <h2 className="mt-4 font-heading text-sm leading-snug text-foreground">
              {title}
            </h2>
            <span aria-hidden className="mx-auto mt-2 block h-px w-8 bg-yhvh-gold/40" />
            <p className="mt-2 font-body text-xs leading-relaxed text-muted-foreground">
              {detail}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** The closing Ecclesiastes band shared by every About page. */
export function ClosingBand() {
  return (
    <section className="parchment-plate scribe-lines relative overflow-hidden rounded-xl px-7 py-10 text-center md:px-12">
      <span
        aria-hidden
        className="hebrew-ghost pointer-events-none absolute -right-2 top-1/2 -translate-y-1/2 text-[6rem] md:text-[9rem]"
      >
        אמת
      </span>
      <figure className="relative">
        <blockquote className="mx-auto max-w-2xl font-scripture text-lg italic leading-relaxed text-foreground md:text-xl">
          &ldquo;Fear Elohim and keep His commandments, for this is the whole duty of
          man.&rdquo;
        </blockquote>
        <figcaption className="mt-3 font-subheading text-xs uppercase tracking-[0.25em] text-yhvh-gold-dark">
          Ecclesiastes 12:13
        </figcaption>
      </figure>
    </section>
  );
}

/** Dark navy affirmation / commitment band. */
export function AffirmationBand({
  heading,
  children,
  aside,
  icon: Icon,
}: {
  heading: string;
  children: ReactNode;
  aside?: { heading: string; body: ReactNode };
  icon: React.ComponentType<{ className?: string }>;
}) {
  // star-field must sit on a CHILD, not alongside night-sky — it sets
  // background-image and would otherwise override the indigo base, leaving
  // white text on parchment.
  return (
    <section className="night-sky relative overflow-hidden rounded-xl">
      <div aria-hidden className="star-field absolute inset-0 opacity-70" />
      <div className="relative grid gap-8 p-7 md:p-10 lg:grid-cols-[auto_1fr_auto] lg:items-center">
        <span
          aria-hidden
          className="hidden size-20 shrink-0 items-center justify-center rounded-full border border-yhvh-gold/30 text-yhvh-gold-light lg:flex"
        >
          <Icon className="size-9" />
        </span>

        <div>
          <h2 className="font-heading text-xl text-yhvh-gold-light">{heading}</h2>
          <span aria-hidden className="mt-3 block h-px w-full max-w-md bg-yhvh-gold/30" />
          <div className="mt-4 font-scripture text-base italic leading-relaxed text-white/85 md:text-lg">
            {children}
          </div>
        </div>

        {aside && (
          <div className="border-t border-yhvh-gold/20 pt-6 lg:max-w-xs lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <h3 className="font-subheading text-xs uppercase tracking-[0.25em] text-yhvh-gold-light">
              {aside.heading}
            </h3>
            <div className="mt-3 font-body text-sm leading-relaxed text-white/70">
              {aside.body}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
