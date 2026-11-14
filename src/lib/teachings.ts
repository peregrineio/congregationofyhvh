// Pure helpers for the /teachings library (blueprint §3.2–3.4). No env, no
// network, no server-only: safe for client components and node tests.

import type { YouTubeVideo } from "./youtube";
import type { Series, SeriesGroup, SeriesIcon, TeachingsLibrary } from "./teachings-types";

// ── durations and dates

/** ISO 8601 duration → seconds. P0D, empty or invalid → undefined. */
export function parseIsoDuration(iso: string | null | undefined): number | undefined {
  if (!iso) return undefined;
  const m = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/.exec(iso);
  if (!m || iso === "P" || iso.endsWith("T")) return undefined;
  const [, d, h, min, s] = m;
  const total = Number(d ?? 0) * 86400 + Number(h ?? 0) * 3600 + Number(min ?? 0) * 60 + Math.floor(Number(s ?? 0));
  return total > 0 ? total : undefined;
}

/** Under an hour → m:ss; otherwise h:mm:ss. */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${ss}` : `${m}:${ss}`;
}

/** "November 13, 2026" in Central time (the page's existing date format). */
export function formatTeachingDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    timeZone: "America/Chicago",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// ── series rules

/*
 * Display order (blueprint §3.3), rule-based so new playlists need no code:
 * | Rank | Group (rule on the verbatim title)                                   | Order inside the group                         | Icon      |
 * | 0    | "All Teachings" (synthetic, always first; rendered by the page)     | none                                            | play      |
 * | 1    | torah: /^torah portions?\b.*?(\d{4})\s*[-–]\s*(\d{4})/i         | start year, newest first                        | book      |
 * | 2    | teacher: any other title that isn't Spanish                          | role after " - ": Pastor → Associate Pastor →   | mic       |
 * |      |                                                                      | Deacon → none; ties keep channel order          |           |
 * | 3    | spanish: /spanish|español|espanol/i                                  | channel order                                   | languages |
 * Labels are verbatim from YouTube: nothing is mapped, merged or renamed.
 */
const TORAH = /^torah portions?\b.*?(\d{4})\s*[-–]\s*(\d{4})/i;
const SPANISH = /spanish|español|espanol/i;

export type SeriesClass = { group: "torah"; startYear: number } | { group: "spanish" } | { group: "teacher"; roleRank: number };

export function classifySeries(title: string): SeriesClass {
  const torah = TORAH.exec(title);
  if (torah) return { group: "torah", startYear: Number(torah[1]) };
  if (SPANISH.test(title)) return { group: "spanish" };
  const dash = title.lastIndexOf(" - ");
  const role = dash >= 0 ? title.slice(dash + 3).trim() : "";
  // "Associate Pastor" is matched before "Pastor"
  const roleRank = /associate pastor/i.test(role) ? 1 : /pastor/i.test(role) ? 0 : /deacon/i.test(role) ? 2 : 3;
  return { group: "teacher", roleRank };
}

export function iconFor(group: SeriesGroup, topicId?: string): SeriesIcon {
  if (group === "torah") return "book";
  if (group === "teacher") return "mic";
  if (group === "spanish") return "languages";
  return topicId === "torah-portions" ? "book" : topicId === "feasts" ? "flame" : topicId === "espanol" ? "languages" : "play";
}

/** lowercase, no diacritics, non-alphanumerics → "-", trimmed */
export function slugify(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** slugs for a list of titles; a collision appends -2, -3 */
export function uniqueSlugs(titles: readonly string[]): string[] {
  const seen = new Map<string, number>();
  return titles.map((t) => {
    const base = slugify(t) || "series";
    const n = (seen.get(base) ?? 0) + 1;
    seen.set(base, n);
    return n === 1 ? base : `${base}-${n}`;
  });
}

const DEFAULT_BLURB: Record<SeriesGroup, string> = {
  torah: "The weekly reading, taught portion by portion.",
  teacher: "Every teaching in this series, newest first.",
  spanish: "Enseñanzas en español.",
  topic: "",
};

/** the playlist description's first sentence (≤160 chars), else the group's default */
export function seriesBlurb(description: string | undefined, group: SeriesGroup): string {
  const text = (description ?? "").replace(/\s+/g, " ").trim();
  if (!text) return DEFAULT_BLURB[group];
  const first = /^.*?[.!?](\s|$)/.exec(text)?.[0].trim() ?? text;
  return first.length > 160 ? `${first.slice(0, 157).trimEnd()}…` : first;
}

export type PlaylistInput = { id: string; title: string; description?: string; position: number; videoIds: string[] };

/** Playlists → Series in display order, empty playlists dropped. */
export function orderSeries(list: readonly PlaylistInput[]): Series[] {
  const visible = list.filter((p) => p.videoIds.length > 0);
  const rank = (c: SeriesClass) => (c.group === "torah" ? 1 : c.group === "teacher" ? 2 : 3);
  const sorted = visible
    .map((p) => ({ p, c: classifySeries(p.title) }))
    .sort((a, b) => {
      if (rank(a.c) !== rank(b.c)) return rank(a.c) - rank(b.c);
      if (a.c.group === "torah" && b.c.group === "torah") return b.c.startYear - a.c.startYear || a.p.position - b.p.position;
      if (a.c.group === "teacher" && b.c.group === "teacher") return a.c.roleRank - b.c.roleRank || a.p.position - b.p.position;
      return a.p.position - b.p.position;
    });
  const slugs = uniqueSlugs(sorted.map((x) => x.p.title));
  return sorted.map(({ p, c }, i) => ({
    id: p.id,
    slug: slugs[i],
    title: p.title,
    description: p.description || undefined,
    blurb: seriesBlurb(p.description, c.group),
    group: c.group,
    icon: iconFor(c.group),
    videoIds: p.videoIds,
    count: p.videoIds.length,
    isPlaylist: true,
  }));
}

/**
 * Featured series (blueprint §3.4): the newest torah series with 3+ videos; else the
 * newest torah series with any; else the first series in display order.
 */
export function pickFeatured(series: readonly Series[]): string | undefined {
  const torah = series.filter((s) => s.group === "torah" && s.count > 0);
  return (torah.find((s) => s.count >= 3) ?? torah[0] ?? series[0])?.slug;
}

// ── fallback buckets (moved verbatim from the old app/teachings/page.tsx)

export const FEAST_WORDS = [
  "feast",
  "pesach",
  "passover",
  "matzot",
  "unleavened",
  "shavuot",
  "pentecost",
  "teruah",
  "trumpets",
  "yom kippur",
  "atonement",
  "sukkot",
  "tabernacles",
  "shemini",
  "hanukkah",
  "chanukah",
  "purim",
  "first fruits",
  "bikkurim",
];

// Extra Spanish cues for titles the shared detector in lib/youtube misses
// (e.g. "Deberían Los Cristianos Seguir Observando Las Fiestas Bíblicas").
export const SPANISH_WORDS = /\b(deberían|cristianos|fiestas|bíblicas|nuestro|dios|iglesia|enseñanza|porción)\b/i;

export interface Topic {
  id: string;
  title: string;
  blurb: string;
  videos: YouTubeVideo[];
}

/**
 * Group by topic from the title alone. Order matters: Spanish first (a
 * Spanish Torah teaching belongs with the other Spanish ones), then Torah
 * portions, then the feasts, and everything else under "More Teachings".
 */
export function groupByTopic(videos: YouTubeVideo[]): Topic[] {
  const topics: Topic[] = [
    {
      id: "torah-portions",
      title: "Torah Portions",
      blurb: "The weekly reading, taught portion by portion.",
      videos: [],
    },
    {
      id: "feasts",
      title: "The Appointed Feasts",
      blurb: "The moedim of YHVH and what they teach us.",
      videos: [],
    },
    {
      id: "more",
      title: "More Teachings",
      blurb: "Messages and studies beyond the weekly portion.",
      videos: [],
    },
    {
      id: "espanol",
      title: "En Español",
      blurb: "Enseñanzas en español.",
      videos: [],
    },
  ];
  const [torah, feasts, more, spanish] = topics;

  for (const video of videos) {
    const lower = video.title.toLowerCase();
    if (video.isSpanish || SPANISH_WORDS.test(video.title)) spanish.videos.push(video);
    // Titles that say "Torah Portion" count even when the portion name is
    // spelled differently from our data (Bereshit vs Bereishit).
    else if (video.portionHebrewName || lower.includes("torah portion")) torah.videos.push(video);
    else if (FEAST_WORDS.some((word) => lower.includes(word)))
      feasts.videos.push(video);
    else more.videos.push(video);
  }

  return topics.filter((topic) => topic.videos.length > 0);
}

/** The fallback buckets as Series (group "topic"). */
export function topicsToSeries(topics: readonly Topic[]): Series[] {
  const slugs = uniqueSlugs(topics.map((t) => t.title));
  return topics.map((t, i) => ({
    id: t.id,
    slug: slugs[i],
    title: t.title,
    blurb: t.blurb,
    group: "topic" as const,
    icon: iconFor("topic", t.id),
    videoIds: t.videos.map((v) => v.id),
    count: t.videos.length,
    isPlaylist: false,
  }));
}

// ── search

/** case-, accent- and punctuation-insensitive form for matching */
export function normalizeForSearch(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// ── what the page shows for a given URL (blueprint §4, "Grid header text by state")

export interface TeachingsParams {
  series?: string | null;
  q?: string | null;
  view?: string | null;
}

export interface TeachingsViewModel {
  heading: string;
  ids: string[];
  showFeatured: boolean;
  /** 6 in the default view (mock 02), 12 otherwise */
  initialPageSize: number;
  /** the selected series' slug, if it exists */
  activeSlug?: string;
  /** playlist id to add as &list= on card links */
  listId?: string;
  /** a ?series= that matches nothing: the page drops it */
  unknownSlug: boolean;
  /** the normalised search, if any */
  query?: string;
}

export function selectView(library: TeachingsLibrary, params: TeachingsParams): TeachingsViewModel {
  const active = params.series ? library.series.find((s) => s.slug === params.series) : undefined;
  const unknownSlug = Boolean(params.series) && !active;
  const raw = (params.q ?? "").trim();
  const query = normalizeForSearch(raw);
  const listId = active?.isPlaylist ? active.id : undefined;

  if (query) {
    const tokens = query.split(" ");
    const seriesTitles = new Map<string, string[]>();
    for (const s of library.series) for (const id of s.videoIds) seriesTitles.set(id, [...(seriesTitles.get(id) ?? []), s.title]);
    const scope = active ? active.videoIds : library.allIds;
    const ids = scope.filter((id) => {
      const v = library.videos[id];
      if (!v) return false;
      const hay = normalizeForSearch([v.title, ...(seriesTitles.get(id) ?? [])].join(" "));
      return tokens.every((t) => hay.includes(t));
    });
    return {
      heading: `Results for “${raw}” (${ids.length})${active ? ` in ${active.title}` : ""}`,
      ids,
      showFeatured: false,
      initialPageSize: 12,
      activeSlug: active?.slug,
      listId,
      unknownSlug,
      query,
    };
  }
  if (active)
    return { heading: `${active.title} (${active.count})`, ids: active.videoIds, showFeatured: false, initialPageSize: 12, activeSlug: active.slug, listId, unknownSlug };
  if (params.view === "all")
    return { heading: `All Teachings (${library.allIds.length})`, ids: library.allIds, showFeatured: false, initialPageSize: 12, unknownSlug };
  return { heading: "Latest Teachings", ids: library.allIds, showFeatured: Boolean(library.featuredSlug), initialPageSize: 6, unknownSlug };
}

/** "1 Teaching" / "12 Teachings" */
export const teachingCount = (n: number) => `${n} ${n === 1 ? "Teaching" : "Teachings"}`;

// ── QA-only override of the data source (never in production)

export type ForcedSource = "uploads" | "rss" | "none";

/**
 * TEACHINGS_FORCE_SOURCE lets QA render each fallback locally. It is ignored when
 * VERCEL_ENV is "production", so the live site can never be forced.
 */
export function forcedSource(env: { VERCEL_ENV?: string; TEACHINGS_FORCE_SOURCE?: string }): ForcedSource | undefined {
  if (env.VERCEL_ENV === "production") return undefined;
  const v = env.TEACHINGS_FORCE_SOURCE;
  return v === "uploads" || v === "rss" || v === "none" ? v : undefined;
}
