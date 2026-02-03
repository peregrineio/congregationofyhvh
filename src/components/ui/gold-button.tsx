import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ComponentProps } from "react";

type GoldButtonProps = ComponentProps<typeof Button>;

export function GoldButton({ className, children, ...props }: GoldButtonProps) {
  return (
    <Button
      className={cn(
        "bg-yhvh-gold text-white font-subheading font-semibold",
        "hover:bg-yhvh-gold-dark transition-all duration-200",
        "shadow-[0_2px_8px_rgba(201,162,39,0.3)] hover:shadow-[0_4px_16px_rgba(201,162,39,0.4)]",
        "px-7 py-3 text-base rounded-md",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
