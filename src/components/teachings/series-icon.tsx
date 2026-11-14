import { BookOpen, Flame, Languages, Mic, Play } from "@/components/icons";
import type { SeriesIcon as Kind } from "@/lib/teachings-types";

const ICONS = { book: BookOpen, mic: Mic, languages: Languages, flame: Flame, play: Play } as const;

/** The series icons (lucide, through the barrel; never a cross or church glyph). */
export function SeriesIcon({ icon, className }: { icon: Kind; className?: string }) {
  const Icon = ICONS[icon];
  return <Icon className={className} strokeWidth={1.4} aria-hidden />;
}
