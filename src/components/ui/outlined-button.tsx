import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ComponentProps } from "react";

type OutlinedButtonProps = ComponentProps<typeof Button>;

export function OutlinedButton({
  className,
  children,
  ...props
}: OutlinedButtonProps) {
  return (
    <Button
      variant="outline"
      className={cn(
        "border-2 border-yhvh-gold text-yhvh-gold font-subheading font-semibold",
        "hover:bg-yhvh-gold hover:text-white transition-all duration-200",
        "px-7 py-3 text-base rounded-md",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
