import { ScriptureQuote } from "@/components/ui/scripture-quote";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  scripture?: {
    quote: string;
    reference: string;
  };
}

export function PageHero({ title, subtitle, scripture }: PageHeroProps) {
  return (
    <section className="relative bg-soft-cream py-20 px-4 text-center">
      <div className="relative z-10 mx-auto max-w-3xl space-y-4">
        <h1 className="font-heading text-3xl font-bold tracking-wide text-warm-black sm:text-4xl md:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="font-subheading text-lg text-warm-gray">
            {subtitle}
          </p>
        )}
        <div className="w-12 h-[2px] bg-yhvh-gold mx-auto" />
        {scripture && (
          <div className="pt-4 mx-auto max-w-xl text-center">
            <ScriptureQuote
              quote={scripture.quote}
              reference={scripture.reference}
              className="border-l-0 pl-0 text-center"
            />
          </div>
        )}
      </div>
    </section>
  );
}
