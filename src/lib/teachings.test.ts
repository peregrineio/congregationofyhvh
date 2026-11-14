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
