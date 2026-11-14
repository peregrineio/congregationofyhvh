// node --import tsx --test src/lib/teachings-phone.test.ts   (npm test)
// /teachings phone standard (P16, P17, P18, P20 adapted; blueprint §3.9). Source reads only.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";

const read = (f: string) => readFileSync(f, "utf8");
const DIR = "src/components/teachings";
const NEW = [...readdirSync(DIR).filter((f) => f !== "video-embed.tsx").map((f) => `${DIR}/${f}`), "src/app/teachings/page.tsx", "src/app/teachings/loading.tsx", "src/lib/teachings.ts", "src/lib/teachings-api.ts", "src/lib/teachings-types.ts", "src/lib/youtube-playlists.ts"];

test("P17: 16px / 44px fields on phones, scoped to .teachings-page", () => {
  assert.match(read("src/app/globals.css"), /@media \(max-width: 639\.98px\) \{\s*\.teachings-page :is\(input[\s\S]*?min-height: 44px;\s*font-size: max\(16px, 1em\);/);
});

test("P18: the arch strip is the only sideways box, with a ScrollCue", () => {
  const arches = read(`${DIR}/series-arches.tsx`);
  for (const s of ["snap-x", "data-scroll-box", "data-scroll-cue", "Scroll sideways for more series", 'aria-label="Teaching series, scrolls sideways"']) assert.ok(arches.includes(s), s);
});

test("grid: one column under 640px, 2 at sm, 3 at lg", () => {
  const grid = read(`${DIR}/teachings-grid.tsx`);
  assert.match(grid, /className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"/);
  assert.doesNotMatch(grid, /(?<![a-z]:)grid-cols-[23]/);
});

test("P16: 44px targets (dots are real boxes, never an ::after overhang)", () => {
  const carousel = read(`${DIR}/series-carousel.tsx`);
  assert.match(carousel, /aria-label=\{`Page \$\{i \+ 1\} of \$\{pages\}`\}[\s\S]{0,200}className="flex size-11/);
  assert.doesNotMatch(carousel + read("src/app/globals.css"), /\.teachings-page[^{]*::after/);
  assert.ok(read(`${DIR}/teachings-hero.tsx`).includes("max-sm:size-11"));
  assert.ok(read(`${DIR}/section-rule-header.tsx`).includes("max-sm:min-h-11"));
  assert.ok(read(`${DIR}/teachings-grid.tsx`).includes("min-h-11"));
});

test("P20: the page leaves room for the chat button", () => {
  assert.ok(read("src/app/teachings/page.tsx").includes("pb-[calc(6.5rem+env(safe-area-inset-bottom))]"));
});

test("church copy: no banned words, cross or church icons", () => {
  for (const f of NEW) {
    const src = read(f).replace(/\/\/.*$|\/\*[\s\S]*?\*\//gm, "");
    assert.doesNotMatch(src, /\btithes?\b|\bmembers?\b|\bCross\b|\bChurch\b/i, f);
  }
});

test("mock content never ships", () => {
  for (const f of NEW) assert.doesNotMatch(read(f), /Matt Koo|\bEver\b(?! ?Galvan)|Ever Galvan|Discipleship & Walk|Prophecy|Foundations of the Faith/, f);
});
