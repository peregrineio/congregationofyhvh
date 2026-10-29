// node --import tsx --test src/lib/torah-utils.test.ts   (npm test)
import { test } from "node:test";
import assert from "node:assert/strict";
import { getCurrentCycle, getCurrentPortion, getNextPortion } from "./torah-utils";

const day = (y: number, m: number, d: number) => new Date(y, m - 1, d);

test("midweek, 'this week' is the upcoming Shabbat's portion (Thu 29 Oct 2026 → Vayera)", () => {
  assert.equal(getCurrentPortion(day(2026, 10, 29)), "Vayera");
});

test("on Shabbat itself it is that day's portion", () => {
  assert.equal(getCurrentPortion(day(2026, 10, 24)), "Lech Lecha");
  assert.equal(getCurrentPortion(day(2026, 10, 31)), "Vayera");
});

test("the day after Shabbat moves on to the next one", () => {
  assert.equal(getCurrentPortion(day(2026, 11, 1)), "Chayei Sarah");
});

test("home, /shabbat and /resources agree with /events (getNextPortion) every day of a week", () => {
  for (let d = 25; d <= 31; d++) {
    const today = day(2026, 10, d);
    assert.equal(getCurrentPortion(today), getNextPortion(today)?.hebrewName, `Oct ${d}`);
  }
});

test("between cycles the Torah Portions page shows the cycle that holds this week's portion", () => {
  // 5 Oct 2026: 5786 has ended (V'Zot HaBerachah, 4 Oct); Beresheet 5787 is next (10 Oct).
  const today = day(2026, 10, 5);
  assert.equal(getCurrentPortion(today), "Beresheet");
  assert.ok(getCurrentCycle(today).some((p) => p.hebrewName === "Beresheet" && p.date === "10 OCT 2026"));
});
