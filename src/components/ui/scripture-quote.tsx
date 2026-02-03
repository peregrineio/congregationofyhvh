import { cn } from "@/lib/utils";

interface ScriptureQuoteProps {
  quote: string;
  reference: string;
  className?: string;
}

export function ScriptureQuote({
  quote,
  reference,
  className,
}: ScriptureQuoteProps) {
  return (
    <blockquote
      className={cn(
        "relative border-l-[3px] border-yhvh-gold/50 pl-6 py-2",
        className
      )}
    >
      <p className="font-scripture text-lg md:text-xl italic text-warm-gray leading-relaxed">
        &ldquo;{quote}&rdquo;
      </p>
      <cite className="block mt-2 text-sm font-subheading text-light-gray not-italic tracking-wide">
        &mdash; {reference}
      </cite>
    </blockquote>
  );
}
