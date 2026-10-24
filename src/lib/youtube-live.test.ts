// node --import tsx --test src/lib/youtube-live.test.ts   (npm test)
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseLivePage, isWithinServiceWindow } from "./youtube";

const fixture = (name: string) => readFileSync(join(import.meta.dirname, "__fixtures__", name), "utf8");
const live = fixture("youtube-live-page.live.html");
const offline = fixture("youtube-live-page.offline.html");

test("live page (saved while streaming, 10/24) → live with its video id", () => {
  assert.deepEqual(parseLivePage(live), { videoId: "afl4_IXfHhI", title: "Shabbat Shalom" });
});

test("channel page with no stream → not live", () => {
  assert.equal(parseLivePage(offline), null);
});

test("upcoming stream (no isLive) → not live", () => {
  assert.equal(parseLivePage(live.replace('"isLive":true,', '"isUpcoming":true,')), null);
});

test("another channel's live video → not live", () => {
  assert.equal(parseLivePage(live, "UCxxxxxxxxxxxxxxxxxxxxxx"), null);
});

test("canonical disagrees with the player video → not live", () => {
  assert.equal(parseLivePage(live.replace("watch?v=afl4_IXfHhI", "watch?v=zzzzzzzzzzz")), null);
});

test("consent wall / empty page → not live", () => {
  assert.equal(parseLivePage("<html><title>Before you continue to YouTube</title></html>"), null);
  assert.equal(parseLivePage(""), null);
});

test("service window: Sat 2–6 PM Central only", () => {
  assert.equal(isWithinServiceWindow(new Date("2026-10-24T21:30:00Z")), true); // Sat 4:30 PM CDT
  assert.equal(isWithinServiceWindow(new Date("2026-10-24T18:30:00Z")), false); // Sat 1:30 PM CDT
  assert.equal(isWithinServiceWindow(new Date("2026-10-25T21:30:00Z")), false); // Sun
});

test("player JSON embedded as an escaped string (\\x22) → still live", () => {
  const escaped = live.replace(/"videoDetails":\{[^}]*\}/, (m) => m.replace(/"/g, "\\x22"));
  assert.notEqual(escaped, live);
  assert.equal(parseLivePage(escaped)?.videoId, "afl4_IXfHhI");
});
