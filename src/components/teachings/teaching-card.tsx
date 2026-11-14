"use client";

import { useState } from "react";
import { CalendarDays, Clock, Play } from "@/components/icons";
import { formatTeachingDate } from "@/lib/teachings";
import type { TeachingVideo } from "@/lib/teachings-types";
import { cn } from "@/lib/utils";

/**
 * One teaching (mock 02), used in the carousel and the grid.
 * Card target: the site has no /teachings/[id] watch page, so per Sam's rule the card
 * opens the video on YouTube in a new tab (blueprint §4, A4). No iframe is mounted here.
 */
export function TeachingCard({ video, listId, className }: { video: TeachingVideo; listId?: string; className?: string }) {
  const [src, setSrc] = useState(video.thumbnail);
  const href = listId ? `${video.url}&list=${listId}` : video.url;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${video.title}, watch on YouTube (opens in a new tab)`}
      className={cn(
        "parchment-plate group flex min-w-0 flex-col overflow-hidden rounded-xl text-foreground no-underline transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_-14px_rgba(139,105,20,.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-yhvh-gold motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      <span className="relative block aspect-video overflow-hidden bg-warm-sand">
        {/* eslint-disable-next-line @next/next/no-img-element -- YouTube thumbnails, with a one-time fallback */}
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => src !== video.thumbnailFallback && setSrc(video.thumbnailFallback)}
          className="size-full object-cover"
        />
        <span aria-hidden className="absolute inset-0 flex items-center justify-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-warm-black/60 text-white ring-1 ring-white/30 transition-transform duration-200 group-hover:scale-[1.08] motion-reduce:transition-none">
            <Play className="ml-0.5 size-6 fill-current" />
          </span>
        </span>
      </span>
      <span className="flex flex-1 flex-col gap-3 p-4">
        <span className="line-clamp-2 font-subheading text-base font-semibold leading-snug [overflow-wrap:anywhere]">{video.title}</span>
        <span className="mt-auto flex items-center justify-between gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-4" aria-hidden />
            {formatTeachingDate(video.publishedAt)}
          </span>
          {video.durationLabel ? (
            <span className="flex items-center gap-1.5 tabular-nums">
              <Clock className="size-4" aria-hidden />
              <span className="sr-only">Duration </span>
              {video.durationLabel}
            </span>
          ) : null}
        </span>
      </span>
    </a>
  );
}
