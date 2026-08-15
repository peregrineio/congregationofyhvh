// ============================================================
// YouTube — Congregation of YHVH
// ============================================================
//
// Two separate concerns, deliberately kept apart:
//
//   Videos      -> the channel's public RSS feed. No API key, no quota,
//                  no billing. Returns the latest 15 uploads. This is the
//                  backbone of the teaching archive and it always works.
//
//   Live status -> YouTube Data API v3, which DOES need a key and is
//                  quota-limited (a live check costs 100 of 10,000 daily
//                  units, so ~100 checks a day, total). Everything here
//                  degrades to "not live" when the key is absent or the
//                  quota is spent, so the site never depends on it.
//
// Nothing in this file may be imported into a client component: the API
// key must stay server-side. The live badge reaches it through
// /api/live instead.

export const YOUTUBE_CHANNEL_ID = "UCC-BSsQ56m6Na-YC0xpsnVA";
export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@CongregationofYHVH";
export const YOUTUBE_LIVE_URL = `${YOUTUBE_CHANNEL_URL}/live`;

const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;

export interface YouTubeVideo {
  id: string;
  title: string;
  published: string;
  url: string;
  thumbnail: string;
  /** Hebrew portion name when the title names one, e.g. "Re'eh". */
  portionHebrewName?: string;
  /** True for the Spanish-language teachings the channel also publishes. */
  isSpanish: boolean;
}

// ------------------------------------------------------------
// Parsing
// ------------------------------------------------------------

function decodeEntities(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function firstMatch(source: string, pattern: RegExp): string | undefined {
  return source.match(pattern)?.[1];
}

/**
 * Pull the portion name out of a video title.
 *
 * The channel titles teachings like:
 *   Torah Portion Re'eh (See) | by Pastor Frank Longoria
 *   Torah Portion Ekev "Because" | by Dolen Lene
 *
 * Matching is done against the known portion list rather than by parsing
 * the title's shape, so a title that drifts in format still matches and one
 * that merely mentions a portion in passing does not produce a false link.
 * Apostrophe styles are normalised because the feed and the data file do
 * not agree on them (Re'eh vs Re’eh).
 */
function detectPortion(
  title: string,
  portionNames: readonly string[],
): string | undefined {
  const normalise = (value: string) =>
    value.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, " ").trim();

  const haystack = normalise(title);
  if (!haystack.includes("torah portion")) return undefined;

  // Longest name first so "Acharei Mot-Kedoshim" wins over "Kedoshim".
  const candidates = [...portionNames].sort((a, b) => b.length - a.length);

  return candidates.find(name => {
    const needle = normalise(name);
    // Combined portions are hyphenated in the data ("Tazria-Metzora") but
    // the channel may name only one half, so test the parts too.
    return (
      haystack.includes(needle) ||
      needle.split(" ").some(part => part.length > 3 && haystack.includes(part))
    );
  });
}

const SPANISH_MARKERS = [
  "qué", "que debo", "parte", "salvo", "arrepent", "verdadero",
  "estudio", "predica", "palabra de dios",
];

function looksSpanish(title: string): boolean {
  const lower = title.toLowerCase();
  return SPANISH_MARKERS.some(marker => lower.includes(marker));
}

export function parseFeed(
  xml: string,
  portionNames: readonly string[] = [],
): YouTubeVideo[] {
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];

  return entries.flatMap(entry => {
    const id = firstMatch(entry, /<yt:videoId>(.*?)<\/yt:videoId>/);
    const rawTitle = firstMatch(entry, /<title>([\s\S]*?)<\/title>/);
    const published = firstMatch(entry, /<published>(.*?)<\/published>/);
    if (!id || !rawTitle || !published) return [];

    const title = decodeEntities(rawTitle).trim();

    return [
      {
        id,
        title,
        published,
        url: `https://www.youtube.com/watch?v=${id}`,
        // i.ytimg.com is stable and needs no API call.
        thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        portionHebrewName: detectPortion(title, portionNames),
        isSpanish: looksSpanish(title),
      },
    ];
  });
}

// ------------------------------------------------------------
// Fetching
// ------------------------------------------------------------

/**
 * Latest uploads. Revalidated every 15 minutes — the channel posts a few
 * times a week, so anything tighter is wasted work.
 *
 * Returns [] rather than throwing: a YouTube outage should quietly hide the
 * video rails, never break the calendar or take down a page.
 */
export async function getLatestVideos(
  portionNames: readonly string[] = [],
): Promise<YouTubeVideo[]> {
  try {
    const response = await fetch(RSS_URL, {
      next: { revalidate: 900, tags: ["youtube-feed"] },
    });
    if (!response.ok) return [];

    return parseFeed(await response.text(), portionNames);
  } catch {
    return [];
  }
}

/** The teaching video for a portion, newest first if several exist. */
export function findPortionVideo(
  videos: readonly YouTubeVideo[],
  hebrewName: string,
): YouTubeVideo | undefined {
  return videos.find(video => video.portionHebrewName === hebrewName);
}

// ------------------------------------------------------------
// Live status
// ------------------------------------------------------------

export interface LiveStatus {
  isLive: boolean;
  videoId?: string;
  title?: string;
  /** Why we are not live — useful when debugging a silent badge. */
  reason?: "no-api-key" | "outside-window" | "not-live" | "error" | "quota";
}

const OFFLINE: LiveStatus = { isLive: false, reason: "not-live" };

/**
 * Only spend quota when a service could plausibly be running.
 *
 * Service is Saturday 3:00 PM Central. The window opens an hour early (for
 * pre-service streams) and closes three hours after, which covers a long
 * service without polling at 4am on a Tuesday. At a 60s cache that is well
 * inside the free quota; checking around the clock would exhaust it before
 * midday.
 *
 * Central time is derived via Intl rather than a fixed offset so CST/CDT is
 * handled without a date library.
 */
export function isWithinServiceWindow(now: Date = new Date()): boolean {
  const central = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    weekday: "short",
    hour: "numeric",
    hour12: false,
  }).formatToParts(now);

  const weekday = central.find(part => part.type === "weekday")?.value;
  const hour = Number(central.find(part => part.type === "hour")?.value);

  if (weekday !== "Sat" || Number.isNaN(hour)) return false;
  return hour >= 14 && hour < 18; // 2 PM – 6 PM Central
}

/**
 * Is the channel streaming right now?
 *
 * Costs 100 quota units per uncached call, so this is gated twice: by the
 * service window above, and by a 60s revalidate. Absent key, spent quota
 * and network errors all resolve to "not live" — the badge simply does not
 * appear, which is the correct failure mode for a church website.
 */
export async function getLiveStatus(now: Date = new Date()): Promise<LiveStatus> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return { isLive: false, reason: "no-api-key" };
  if (!isWithinServiceWindow(now)) return { isLive: false, reason: "outside-window" };

  const endpoint = new URL("https://www.googleapis.com/youtube/v3/search");
  endpoint.searchParams.set("part", "snippet");
  endpoint.searchParams.set("channelId", YOUTUBE_CHANNEL_ID);
  endpoint.searchParams.set("eventType", "live");
  endpoint.searchParams.set("type", "video");
  endpoint.searchParams.set("maxResults", "1");
  endpoint.searchParams.set("key", apiKey);

  try {
    const response = await fetch(endpoint, { next: { revalidate: 60 } });

    // 403 here is almost always exhausted quota. Treated as offline rather
    // than retried, so a spent quota cannot turn into a request storm.
    if (response.status === 403) return { isLive: false, reason: "quota" };
    if (!response.ok) return { isLive: false, reason: "error" };

    const payload = (await response.json()) as {
      items?: { id?: { videoId?: string }; snippet?: { title?: string } }[];
    };

    const item = payload.items?.[0];
    if (!item?.id?.videoId) return OFFLINE;

    return {
      isLive: true,
      videoId: item.id.videoId,
      title: item.snippet?.title,
    };
  } catch {
    return { isLive: false, reason: "error" };
  }
}
