"use client";

import { useEffect, useState } from "react";

/**
 * Site-wide "we are streaming" bar.
 *
 * Renders nothing at all unless the channel is actually live, so it costs
 * the other six days of the week nothing visually. Someone arriving at 3:15
 * on a Shabbat gets pulled straight into the stream instead of hunting for
 * a link.
 *
 * Polling is intentionally lazy: the server route only spends YouTube quota
 * inside the Saturday service window and caches for 60s, so this can check
 * every two minutes without any risk to the daily allowance. It also pauses
 * while the tab is hidden — no point polling a backgrounded tab.
 */

const POLL_INTERVAL_MS = 120_000;

interface LiveResponse {
  isLive: boolean;
  videoId?: string;
  title?: string;
}

export function LiveBar() {
  const [live, setLive] = useState<LiveResponse | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      if (document.visibilityState === "hidden") return;

      try {
        const response = await fetch("/api/live");
        if (!response.ok) return;

        const data = (await response.json()) as LiveResponse;
        if (!cancelled) setLive(data.isLive ? data : null);
      } catch {
        // Offline, blocked, or the route is unhappy -- stay silent rather
        // than surfacing an error the congregation cannot act on.
      }
    }

    check();
    const timer = setInterval(check, POLL_INTERVAL_MS);
    document.addEventListener("visibilitychange", check);

    return () => {
      cancelled = true;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", check);
    };
  }, []);

  if (!live?.isLive) return null;

  const href = live.videoId
    ? `https://www.youtube.com/watch?v=${live.videoId}`
    : "https://www.youtube.com/@CongregationofYHVH/live";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      // role=status so screen readers announce it when it appears mid-visit
      role="status"
      className="group fixed inset-x-0 top-0 z-[70] flex items-center justify-center gap-3 bg-[#7f1d1d] px-4 py-2 text-center text-sm text-white shadow-lg"
    >
      <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden>
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75 motion-reduce:animate-none" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
      </span>

      <span className="truncate">
        <strong className="font-semibold tracking-wide">LIVE NOW</strong>
        <span className="mx-2 opacity-60">&middot;</span>
        <span className="opacity-95">
          {live.title ?? "Shabbat service is streaming"}
        </span>
      </span>

      <span className="hidden shrink-0 underline underline-offset-4 group-hover:no-underline sm:inline">
        Watch
      </span>
    </a>
  );
}
