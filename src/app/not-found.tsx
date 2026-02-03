import Link from "next/link";
import { GoldButton } from "@/components/ui/gold-button";
import { OutlinedButton } from "@/components/ui/outlined-button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="space-y-6">
        <p className="font-heading text-8xl font-bold text-primary/20">404</p>
        <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
          Page Not Found
        </h1>
        <p className="font-body text-base text-muted-foreground max-w-md mx-auto">
          The page you are looking for does not exist or has been moved. Let us
          help you find your way.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center pt-4">
          <Link href="/">
            <GoldButton>Return Home</GoldButton>
          </Link>
          <Link href="/contact">
            <OutlinedButton>Contact Us</OutlinedButton>
          </Link>
        </div>
        <p className="font-scripture text-sm italic text-muted-foreground/40 pt-6">
          &ldquo;Your word is a lamp to my feet and a light to my path.&rdquo;
          <span className="not-italic"> &mdash; Psalm 119:105</span>
        </p>
      </div>
    </div>
  );
}
