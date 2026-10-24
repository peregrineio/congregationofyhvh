"use client";

import { useEffect, useState } from "react";

/**
 * Shared live status for the LiveBar and the header's YouTube button: one
 * poll of /api/live every two minutes for the whole page, paused while the
 * tab is hidden. The server route does the real check (API, or the public
 * /live page when there's no key) and caches it for 60s.
 */

export interface LiveResponse {
  isLive: boolean;
  videoId?: string;
  title?: string;
}

const POLL_INTERVAL_MS = 120_000;
let current: LiveResponse | null = null;
const listeners = new Set<(v: LiveResponse | null) => void>();
let timer: ReturnType<typeof setInterval> | undefined;

async function check() {
  if (document.visibilityState === "hidden") return;
  try {
    const response = await fetch("/api/live");
    if (!response.ok) return;
    const data = (await response.json()) as LiveResponse;
    current = data.isLive ? data : null;
    listeners.forEach((l) => l(current));
  } catch {
    // Offline or blocked: stay silent rather than show an error.
  }
}

export function useLiveStatus(): LiveResponse | null {
  const [live, setLive] = useState<LiveResponse | null>(current);
  useEffect(() => {
    listeners.add(setLive);
    if (listeners.size === 1) {
      void check();
      timer = setInterval(check, POLL_INTERVAL_MS);
      document.addEventListener("visibilitychange", check);
    }
    return () => {
      listeners.delete(setLive);
      if (listeners.size === 0) {
        clearInterval(timer);
        document.removeEventListener("visibilitychange", check);
      }
    };
  }, []);
  return live;
}

export const liveHref = (live: LiveResponse) =>
  live.videoId ? `https://www.youtube.com/watch?v=${live.videoId}` : "https://www.youtube.com/@CongregationofYHVH/live";
