// node --import tsx --test src/lib/teachings.test.ts   (npm test)
import { test } from "node:test";
import assert from "node:assert/strict";
import { formatDuration, formatTeachingDate, parseIsoDuration } from "./teachings";

const fmt = (iso: string) => {
  const s = parseIsoDuration(iso);
  return s === undefined ? undefined : formatDuration(s);
};

test("ISO 8601 durations format as m:ss under an hour, h:mm:ss over", () => {
  assert.equal(fmt("PT45M32S"), "45:32");
  assert.equal(fmt("PT5M7S"), "5:07");
  assert.equal(fmt("PT1H2M3S"), "1:02:03");
  assert.equal(fmt("PT2H"), "2:00:00");
  assert.equal(fmt("PT59S"), "0:59");
  assert.equal(parseIsoDuration("P1DT2M"), 86520);
});

test("no duration for P0D, empty or garbage", () => {
  assert.equal(parseIsoDuration("P0D"), undefined);
  assert.equal(parseIsoDuration(""), undefined);
  assert.equal(parseIsoDuration(undefined), undefined);
  assert.equal(parseIsoDuration("garbage"), undefined);
  assert.equal(parseIsoDuration("PT"), undefined);
});

test("dates are Central time, across the DST change", () => {
  // 02:30 UTC on 2 Nov 2026 is still 1 Nov in Chicago (CST, UTC-6)
  assert.equal(formatTeachingDate("2026-11-02T02:30:00Z"), "November 1, 2026");
  // 04:30 UTC on 1 Nov 2026 is 31 Oct in Chicago (CDT, UTC-5)
  assert.equal(formatTeachingDate("2026-11-01T04:30:00Z"), "October 31, 2026");
  assert.equal(formatTeachingDate("not a date"), "");
});

test("getDurations: 120 ids make exactly 3 videos.list calls", async () => {
  const { getDurations } = await import("./teachings-api");
  const calls: string[] = [];
  const realFetch = globalThis.fetch;
  globalThis.fetch = (async (input: string | URL | Request) => {
    const url = new URL(String(input));
    calls.push(url.pathname);
    const ids = (url.searchParams.get("id") ?? "").split(",");
    return new Response(JSON.stringify({ items: ids.map((id) => ({ id, contentDetails: { duration: "PT10M" } })) }), { status: 200 });
  }) as typeof fetch;
  try {
    const ids = Array.from({ length: 120 }, (_, i) => `v${i}`);
    const out = await getDurations("TEST-KEY", [...ids, "v1", "v2"]); // duplicates count once
    assert.equal(calls.length, 3);
    assert.ok(calls.every((p) => p === "/youtube/v3/videos"));
    assert.equal(out.size, 120);
    assert.equal(out.get("v0"), 600);
  } finally {
    globalThis.fetch = realFetch;
  }
});

// ── series rules (prompt 4)
import { groupByTopic, orderSeries, pickFeatured, slugify, uniqueSlugs, topicsToSeries, normalizeForSearch } from "./teachings";
import type { YouTubeVideo } from "./youtube";

const CHANNEL: [string, number][] = [
  ["Torah Portion 2026-2027", 1],
  ["Frank Galvan", 3],
  ["Spanish Teachings", 4],
  ["Torah Portion 2025-2026", 15],
  ["Torah Portions 2024-2025", 13],
  ["Ray Flowers - Associate Pastor", 23],
  ["Dolen Lene - Deacon", 11],
  ["Jeremiah Longoria - Deacon", 13],
  ["Frank Longoria - Pastor", 0],
];
const playlists = (overrides: Record<string, number> = {}) =>
  CHANNEL.map(([title, n], position) => ({
    id: `PL${position}`,
    title,
    position,
    videoIds: Array.from({ length: overrides[title] ?? n }, (_, i) => `${position}-${i}`),
  }));

test("display order: torah newest first, teachers by role then channel order, Spanish last; empty hidden", () => {
  assert.deepEqual(
    orderSeries(playlists()).map((s) => s.title),
    [
      "Torah Portion 2026-2027",
      "Torah Portion 2025-2026",
      "Torah Portions 2024-2025",
      "Ray Flowers - Associate Pastor",
      "Dolen Lene - Deacon",
      "Jeremiah Longoria - Deacon",
      "Frank Galvan",
      "Spanish Teachings",
    ],
  );
});

test("the Pastor's playlist slots before Ray Flowers once it has a video", () => {
  const titles = orderSeries(playlists({ "Frank Longoria - Pastor": 1 })).map((s) => s.title);
  assert.equal(titles.indexOf("Frank Longoria - Pastor"), titles.indexOf("Ray Flowers - Associate Pastor") - 1);
});

test("featured: newest Torah year with 3+ videos", () => {
  assert.equal(pickFeatured(orderSeries(playlists())), "torah-portion-2025-2026");
  assert.equal(pickFeatured(orderSeries(playlists({ "Torah Portion 2026-2027": 3 }))), "torah-portion-2026-2027");
});

test("titles stay verbatim (no renaming); icons and counts follow the rules", () => {
  const series = orderSeries(playlists());
  for (const s of series) assert.ok(CHANNEL.some(([t]) => t === s.title));
  assert.ok(series.every((s) => s.count === s.videoIds.length));
  assert.equal(series.find((s) => s.title === "Frank Galvan")?.icon, "mic");
  assert.equal(series.find((s) => s.title === "Spanish Teachings")?.icon, "languages");
  assert.equal(series[0].icon, "book");
  assert.ok(!series.some((s) => /Frankie|Franklin/.test(s.title)));
});

test("slugs: lowercase, diacritics stripped, collisions get -2", () => {
  assert.equal(slugify("Ray Flowers - Associate Pastor"), "ray-flowers-associate-pastor");
  assert.equal(slugify("Enseñanzas en Español"), "ensenanzas-en-espanol");
  assert.deepEqual(uniqueSlugs(["A b", "a-b", "A B"]), ["a-b", "a-b-2", "a-b-3"]);
});

test("fallback buckets: groupByTopic behaves as the old page did", () => {
  const v = (id: string, title: string, extra: Partial<YouTubeVideo> = {}): YouTubeVideo => ({ id, title, published: "2026-01-01T00:00:00Z", url: "", thumbnail: "", isSpanish: false, ...extra });
  const topics = groupByTopic([
    v("1", "Torah Portion Re'eh"),
    v("2", "Bereshit teaching", { portionHebrewName: "Bereishit" }),
    v("3", "The Feast of Sukkot"),
    v("4", "Walking in faith"),
    v("5", "Deberían Los Cristianos Seguir Observando Las Fiestas Bíblicas"),
    v("6", "Shabbat en español", { isSpanish: true }),
  ]);
  assert.deepEqual(
    topics.map((t) => [t.id, t.videos.map((x) => x.id)]),
    [
      ["torah-portions", ["1", "2"]],
      ["feasts", ["3"]],
      ["more", ["4"]],
      ["espanol", ["5", "6"]],
    ],
  );
  assert.deepEqual(
    topicsToSeries(topics).map((s) => [s.title, s.icon, s.group]),
    [
      ["Torah Portions", "book", "topic"],
      ["The Appointed Feasts", "flame", "topic"],
      ["More Teachings", "play", "topic"],
      ["En Español", "languages", "topic"],
    ],
  );
});

test("search normalises case, accents and punctuation", () => {
  assert.equal(normalizeForSearch("Re'eh — Enseñanza!"), "re eh ensenanza");
});

// ── library + fallback chain (prompt 5), mocked fetch
import { buildTeachingsLibrary } from "./teachings-api";

type Route = (url: URL) => Response | undefined;
async function withFetch<T>(route: Route, key: string | undefined, run: () => Promise<T>): Promise<T> {
  const realFetch = globalThis.fetch;
  const realKey = process.env.YOUTUBE_API_KEY;
  const realWarn = console.warn;
  console.warn = () => {};
  if (key) process.env.YOUTUBE_API_KEY = key;
  else delete process.env.YOUTUBE_API_KEY;
  globalThis.fetch = (async (input: string | URL | Request) => route(new URL(String(input))) ?? new Response("", { status: 404 })) as typeof fetch;
  try {
    return await run();
  } finally {
    globalThis.fetch = realFetch;
    console.warn = realWarn;
    if (realKey === undefined) delete process.env.YOUTUBE_API_KEY;
    else process.env.YOUTUBE_API_KEY = realKey;
  }
}
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });
const item = (id: string, title: string, day: number) => ({
  snippet: { title, publishedAt: `2026-0${(day % 9) + 1}-10T15:00:00Z`, resourceId: { videoId: id }, thumbnails: {} },
  contentDetails: { videoId: id, videoPublishedAt: `2026-0${(day % 9) + 1}-10T15:00:00Z` },
});
const feed = (n: number) =>
  `<feed>${Array.from({ length: n }, (_, i) => `<entry><yt:videoId>r${i}</yt:videoId><title>Torah Portion Re'eh ${i}</title><published>2026-08-0${(i % 9) + 1}T15:00:00Z</published></entry>`).join("")}</feed>`;

test("no key → rss (grouped RSS, no durations)", async () => {
  const lib = await withFetch((u) => (u.hostname === "www.youtube.com" ? new Response(feed(3)) : undefined), undefined, () => buildTeachingsLibrary(undefined));
  assert.equal(lib.source, "rss");
  assert.equal(lib.allIds.length, 3);
  assert.ok(lib.series.every((s) => s.group === "topic"));
  assert.ok(Object.values(lib.videos).every((v) => v.durationLabel === undefined));
});

test("quota 403 on playlists → uploads (grouped archive)", async () => {
  const archive = Array.from({ length: 20 }, (_, i) => item(`u${i}`, `Torah Portion Re'eh ${i}`, i));
  const lib = await withFetch(
    (u) => {
      if (u.pathname.endsWith("/playlists")) return json({ error: "quota" }, 403);
      if (u.pathname.endsWith("/playlistItems")) return json({ items: archive });
      if (u.pathname.endsWith("/videos")) return json({ items: [] });
      return undefined;
    },
    "TEST-KEY",
    () => buildTeachingsLibrary("TEST-KEY"),
  );
  assert.equal(lib.source, "uploads");
  assert.equal(lib.allIds.length, 20);
});

test("everything empty → none", async () => {
  const lib = await withFetch((u) => (u.hostname === "www.youtube.com" ? new Response("<feed></feed>") : undefined), undefined, () => buildTeachingsLibrary(undefined));
  assert.equal(lib.source, "none");
  assert.deepEqual(lib.series, []);
});

test("happy path → playlists; a video in two playlists appears once; All = union with uploads", async () => {
  const lib = await withFetch(
    (u) => {
      if (u.pathname.endsWith("/playlists"))
        return json({
          items: [
            { id: "PLa", snippet: { title: "Torah Portion 2025-2026", description: "" }, contentDetails: { itemCount: 2 } },
            { id: "PLb", snippet: { title: "Ray Flowers - Associate Pastor", description: "Teachings from Ray. More here." }, contentDetails: { itemCount: 2 } },
            { id: "PLc", snippet: { title: "Frank Longoria - Pastor", description: "" }, contentDetails: { itemCount: 1 } },
          ],
        });
      if (u.pathname.endsWith("/playlistItems")) {
        const pl = u.searchParams.get("playlistId");
        if (pl === "PLa") return json({ items: [item("a1", "Re'eh", 1), item("shared", "Shared teaching", 2)] });
        if (pl === "PLb") return json({ items: [item("shared", "Shared teaching", 2), item("b1", "Walking", 3)] });
        if (pl === "PLc") return json({ items: [{ snippet: { title: "Private video", resourceId: { videoId: "p" } }, contentDetails: { videoId: "p" } }] });
        return json({ items: [item("up1", "New upload", 8)] }); // uploads archive (UU…)
      }
      if (u.pathname.endsWith("/videos")) return json({ items: (u.searchParams.get("id") ?? "").split(",").map((id) => ({ id, contentDetails: { duration: "PT45M32S" } })) });
      return undefined;
    },
    "TEST-KEY",
    () => buildTeachingsLibrary("TEST-KEY"),
  );
  assert.equal(lib.source, "playlists");
  assert.deepEqual(lib.series.map((s) => [s.title, s.count]), [
    ["Torah Portion 2025-2026", 2],
    ["Ray Flowers - Associate Pastor", 2],
  ]);
  assert.equal(lib.allIds.filter((id) => id === "shared").length, 1);
  assert.deepEqual([...lib.allIds].sort(), ["a1", "b1", "shared", "up1"]);
  assert.equal(lib.videos.a1.durationLabel, "45:32");
  assert.equal(lib.featuredSlug, "torah-portion-2025-2026");
  assert.equal(lib.series[1].blurb, "Teachings from Ray.");
});
