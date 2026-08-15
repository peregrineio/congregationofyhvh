import { NextResponse } from "next/server";
import { getLiveStatus } from "@/lib/youtube";

/**
 * Live-status endpoint for the site-wide banner.
 *
 * Exists so the banner can poll without the YouTube API key ever reaching
 * the browser. Only the boolean and the video id cross the wire; the
 * `reason` is passed through unchanged because it is diagnostic, not
 * sensitive, and makes a silent badge debuggable from the network tab.
 *
 * Quota protection lives in getLiveStatus() — the service-window gate and
 * the 60s revalidate — so hammering this route cannot burn the daily
 * allowance.
 */
export async function GET() {
  const status = await getLiveStatus();

  return NextResponse.json(status, {
    headers: {
      // Mirrors the upstream revalidate so intermediaries do not serve a
      // stale "live" long after the stream ends.
      "cache-control": "public, max-age=60, stale-while-revalidate=30",
    },
  });
}
