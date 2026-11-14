"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "@/components/icons";
import { teachingCount } from "@/lib/teachings";
import type { Series } from "@/lib/teachings-types";
import { cn } from "@/lib/utils";
import { SeriesIcon } from "./series-icon";
import { prefersReducedMotion, useScrollEdges } from "./use-scroll-edges";

type Arch = { slug: string | null; title: string; icon: Series["icon"]; count: number };

/**
 * The arched series cards (mock 01): "All Teachings" first, then one arch per non-empty
 * series, verbatim titles and live counts. Each arch is a real link (works without JS);
 * the strip scrolls sideways with a ScrollCue on phones (v3 phone standard P18).
 */
export function SeriesArches({ series, allCount, activeSlug, onSelect }: { series: Series[]; allCount: number; activeSlug?: string; onSelect?: (slug: string | null) => void }) {
  const strip = useRef<HTMLDivElement>(null);
  const edges = useScrollEdges(strip);
  const arches: Arch[] = [{ slug: null, title: "All Teachings", icon: "play", count: allCount }, ...series.map((s) => ({ slug: s.slug, title: s.title, icon: s.icon, count: s.count }))];

  // keep the active arch in view (on load and when the series changes)
  useEffect(() => {
    strip.current?.querySelector<HTMLElement>('[aria-current="true"]')?.scrollIntoView({ inline: "nearest", block: "nearest", behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, [activeSlug]);

  const scrollBy = (dir: 1 | -1) => strip.current?.scrollBy({ left: dir * strip.current.clientWidth * 0.8, behavior: prefersReducedMotion() ? "auto" : "smooth" });

  return (
    <div className="relative z-10 mx-auto -mt-20 max-w-7xl px-4 sm:-mt-24 sm:px-6 lg:px-8">
      {edges.right ? (
        <p data-scroll-cue className="mb-1.5 flex items-center justify-end gap-1 text-[11px] font-medium text-muted-foreground sm:hidden">
          Scroll sideways for more series
          <ChevronRight className="size-3.5" aria-hidden />
        </p>
      ) : null}
      <div className="relative">
        <div
          ref={strip}
          data-scroll-box
          role="region"
          aria-label="Teaching series, scrolls sideways"
          tabIndex={0}
          className="relative flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-1 pb-4 pt-2 [scrollbar-width:none] focus:outline-none focus-visible:ring-2 focus-visible:ring-yhvh-gold [&::-webkit-scrollbar]:hidden"
        >
          {arches.map((a) => {
            const active = (a.slug ?? undefined) === activeSlug;
            return (
              <Link
                key={a.slug ?? "__all__"}
                href={a.slug ? `/teachings?series=${a.slug}` : "/teachings"}
                scroll={false}
                aria-current={active ? "true" : undefined}
                title={a.title}
                onClick={(e) => {
                  if (!onSelect) return;
                  e.preventDefault();
                  onSelect(a.slug);
                }}
                className={cn(
                  "arch-frame group relative flex h-[160px] w-[132px] shrink-0 snap-start flex-col items-center justify-end gap-2 border bg-gradient-to-b px-3 pb-5 pt-6 text-center no-underline backdrop-blur-sm transition-[box-shadow,border-color] sm:h-[190px] sm:w-44",
                  active
                    ? "border-yhvh-gold from-[#5a4119]/85 to-warm-black/80 shadow-[0_0_28px_rgba(201,162,39,.55)]"
                    : "border-yhvh-gold/45 from-[#3a2a12]/70 to-warm-black/70 hover:border-yhvh-gold/80",
                )}
              >
                <SeriesIcon icon={a.icon} className="size-10 text-yhvh-gold-light sm:size-12" />
                <span className="line-clamp-2 font-heading text-[15px] leading-tight text-[#FEFDFB] [overflow-wrap:anywhere] sm:text-[17px]">{a.title}</span>
                <span className="font-subheading text-[13px] text-white/75">{teachingCount(a.count)}</span>
                {active ? <span aria-hidden className="absolute -bottom-px left-1/2 h-[2px] w-16 -translate-x-1/2 rounded-full bg-yhvh-gold shadow-[0_0_10px_rgba(201,162,39,.9)]" /> : null}
              </Link>
            );
          })}
        </div>
        {edges.left ? <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-soft-cream/90 to-transparent" /> : null}
        {edges.right ? <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-soft-cream/90 to-transparent" /> : null}
        {edges.overflow ? (
          <>
            <button type="button" aria-label="Scroll series left" disabled={!edges.left} onClick={() => scrollBy(-1)} className="absolute -left-3 top-1/2 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-warm-white text-foreground sacred-shadow disabled:opacity-0 [@media(pointer:fine)]:sm:flex">
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button type="button" aria-label="Scroll series right" disabled={!edges.right} onClick={() => scrollBy(1)} className="absolute -right-3 top-1/2 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-warm-white text-foreground sacred-shadow disabled:opacity-0 [@media(pointer:fine)]:sm:flex">
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
