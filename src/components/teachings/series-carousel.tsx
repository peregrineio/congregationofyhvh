"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "@/components/icons";
import type { TeachingVideo } from "@/lib/teachings-types";
import { cn } from "@/lib/utils";
import { TeachingCard } from "./teaching-card";
import { prefersReducedMotion } from "./use-scroll-edges";

/** Which page dots to show: all when ≤5, else a window of 5 around the current page (each dot is a 44px box). */
export function dotWindow(page: number, pages: number, max = 5): number[] {
  if (pages <= max) return Array.from({ length: pages }, (_, i) => i);
  const start = Math.max(0, Math.min(page - Math.floor(max / 2), pages - max));
  return Array.from({ length: max }, (_, i) => start + i);
}

/**
 * Featured carousel: native scroll-snap (no library). 3 per view at lg, 2 at sm, one card
 * at ~85% on phones (the next one peeks). Prev/next and dots page by the visible width;
 * dots are real 44px buttons. Keyboard: ←/→ page, Home/End first/last.
 */
export function SeriesCarousel({ title, videos, listId }: { title: string; videos: TeachingVideo[]; listId?: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(0);

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const perView = card ? Math.max(1, Math.round(el.clientWidth / (card.offsetWidth || el.clientWidth))) : 1;
    setPages(Math.max(1, Math.ceil(videos.length / perView)));
    setPage(Math.min(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)), Math.ceil(videos.length / perView) - 1));
  }, [videos.length]);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let frame = requestAnimationFrame(measure);
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(onScroll);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [measure]);

  const go = (n: number) => {
    const el = track.current;
    if (!el) return;
    const target = Math.max(0, Math.min(pages - 1, n));
    el.scrollTo({ left: target * el.clientWidth, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  return (
    <div className="relative min-w-0">
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={`Featured series: ${title}`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(page + 1);
          else if (e.key === "ArrowLeft") go(page - 1);
          else if (e.key === "Home") go(0);
          else if (e.key === "End") go(pages - 1);
          else return;
          e.preventDefault();
        }}
        className="rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-yhvh-gold"
      >
        {/* relative: absolutely positioned descendants (e.g. sr-only labels) stay inside the scroll box, so they never widen the page */}
        <div ref={track} className="relative flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] motion-reduce:scroll-auto [&::-webkit-scrollbar]:hidden">
          {videos.map((v) => (
            <div key={v.id} className="flex w-[85%] shrink-0 snap-start sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]">
              <TeachingCard video={v} listId={listId} className="w-full" />
            </div>
          ))}
        </div>
      </div>
      {pages > 1 ? (
        <>
          <button type="button" aria-label="Previous teachings" disabled={page === 0} onClick={() => go(page - 1)} className="absolute -left-14 top-[28%] hidden size-12 items-center justify-center rounded-full bg-warm-white text-foreground sacred-shadow disabled:opacity-40 sm:flex">
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button type="button" aria-label="Next teachings" disabled={page >= pages - 1} onClick={() => go(page + 1)} className="absolute -right-6 top-[28%] hidden size-12 min-[1360px]:-right-14 items-center justify-center rounded-full bg-warm-white text-foreground sacred-shadow disabled:opacity-40 sm:flex">
            <ChevronRight className="size-5" aria-hidden />
          </button>
          <div className="mt-2 flex flex-wrap justify-center">
            {dotWindow(page, pages).map((i) => (
              <button
                key={i}
                type="button"
                aria-label={`Page ${i + 1} of ${pages}`}
                aria-current={i === page ? "true" : undefined}
                onClick={() => go(i)}
                className="flex size-11 items-center justify-center"
              >
                <span className={cn("size-2 rounded-full transition-colors", i === page ? "bg-yhvh-gold" : "bg-warm-gray/30")} />
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
