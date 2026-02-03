import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  centered = true,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn(centered && "text-center", "mb-14", className)}>
      <h2 className="font-heading text-3xl md:text-4xl font-bold text-warm-black tracking-wide">
        {title}
      </h2>
      {subtitle && (
        <p className="font-subheading text-lg text-warm-gray mt-3 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      {/* Gold centered underline */}
      <div
        className={cn(
          "mt-5 h-[2px] w-12 bg-yhvh-gold",
          centered && "mx-auto"
        )}
      />
    </div>
  );
}
