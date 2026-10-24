"use client";

import { useEffect, useRef } from "react";
import { liveHref, useLiveStatus } from "./use-live";

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

export function LiveBar() {
  const live = useLiveStatus();
  const barRef = useRef<HTMLAnchorElement>(null);

  /**
   * Publish the bar's own height on <html> so the fixed header and the page
   * content can drop by exactly that much (see globals.css). Both the bar and
   * the header are fixed to top-0, so without this the bar simply covers the
   * nav. Measured rather than hard-coded because the stream title wraps to a
   * second line on narrow screens.
   */
  useEffect(() => {
    const root = document.documentElement;
    const node = barRef.current;

    const clear = () => {
      root.removeAttribute("data-live-bar");
      root.style.removeProperty("--live-bar-h");
    };

    if (!node) {
      clear();
      return;
    }

    const publish = () => {
      root.dataset.liveBar = "true";
      root.style.setProperty("--live-bar-h", `${node.offsetHeight}px`);
    };

    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(node);

    return () => {
      observer.disconnect();
      clear();
    };
  }, [live?.isLive]);

  if (!live?.isLive) return null;

  const href = liveHref(live);

  return (
    <a
      ref={barRef}
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
