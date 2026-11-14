import Link from "next/link";
import { ArrowRight, Play } from "@/components/icons";

/** Play-circle icon + heading + gold hairline + action (mock 01/02). On phones the rule hides and the action wraps below. */
export function SectionRuleHeader({ title, actionLabel, actionHref, onAction }: { title: string; actionLabel?: string; actionHref?: string; onAction?: () => void }) {
  const actionCls = "inline-flex items-center gap-1.5 font-subheading font-semibold text-yhvh-gold-dark underline decoration-yhvh-gold/50 underline-offset-[6px] hover:decoration-yhvh-gold max-sm:min-h-11";
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      <span aria-hidden className="flex size-8 items-center justify-center rounded-full ring-2 ring-yhvh-gold text-yhvh-gold">
        <Play className="ml-0.5 size-3.5 fill-current" />
      </span>
      <h2 className="min-w-0 font-heading text-[28px] leading-tight text-foreground [overflow-wrap:anywhere] sm:text-[34px]">{title}</h2>
      <span aria-hidden className="hidden h-px min-w-8 flex-1 bg-gradient-to-r from-yhvh-gold/60 to-yhvh-gold/20 sm:block" />
      {actionLabel ? (
        onAction ? (
          <button type="button" onClick={onAction} className={actionCls}>
            {actionLabel} <ArrowRight className="size-4" aria-hidden />
          </button>
        ) : (
          <Link href={actionHref ?? "/teachings?view=all"} scroll={false} className={actionCls}>
            {actionLabel} <ArrowRight className="size-4" aria-hidden />
          </Link>
        )
      ) : null}
    </div>
  );
}
