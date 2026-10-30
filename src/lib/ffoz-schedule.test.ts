// node --import tsx --test src/lib/ffoz-schedule.test.ts   (npm test)
//
// The site's weekly readings must equal First Fruits of Zion's. The expected
// rows below were copied by hand from the rendered portion pages on
// https://ffoz.org/torahportions/parashah/<slug> on 29 Oct 2026, so they check
// the data file rather than repeat it.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  FFOZ_SCHEDULE,
  FFOZ_SOURCE,
  TORAH_CYCLES,
  TORAH_PORTIONS_WITH_DATES,
  getCurrentPortionEntry,
  getNextPortion,
  getPortionOnDate,
  parsePortionDate,
  toDateKey,
} from "./torah-utils";

const day = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

type Row = [date: string, name: string, torah: string, haftarah: string, gospel: string, special?: string];

// The next 8 Shabbats from 29 Oct 2026.
const NEXT_EIGHT: Row[] = [
  ["2026-10-31", "Vayera", "Genesis 18:1-22:24", "2 Kings 4:1-37", "Luke 17:28-37"],
  ["2026-11-07", "Chayei Sarah", "Genesis 23:1-25:18", "1 Kings 1:1-31", "John 4:3-14"],
  ["2026-11-14", "Toldot", "Genesis 25:19-28:9", "Malachi 1:1-2:7", "Matthew 10:21-38"],
  ["2026-11-21", "Vayetze", "Genesis 28:10-32:3", "Hosea 12:13-14:10", "John 1:41-51"],
  ["2026-11-28", "Vayishlach", "Genesis 32:4-36:43", "Obadiah 1:1-21", "Matthew 2:13-23"],
  ["2026-12-05", "Vayeshev", "Genesis 37:1-40:23", "Zechariah 2:14-4:7", "John 10:22-28", "Shabbat Hanukkah"],
  ["2026-12-12", "Miketz", "Genesis 41:1-44:17", "1 Kings 7:40-50", "Matthew 24:8-22", "Shabbat Hanukkah II"],
  ["2026-12-19", "Vayigash", "Genesis 44:18-47:27", "Ezekiel 37:15-28", "Luke 24:30-48"],
];

// 5787 is a leap year: FFOZ reads three double portions together and splits
// the other four, each on its own week.
const DOUBLE_PORTION_WEEKS: Row[] = [
  ["2027-07-17", "Chukat-Balak", "Numbers 19:1-25:9", "Micah 5:6-6:8", "Matthew 21:1-11"],
  ["2027-07-31", "Mattot-Massei", "Numbers 30:2-36:13", "Jeremiah 2:4-28, 3:4", "Mark 11:12-25"],
  ["2027-09-25", "Nitzavim-Vayelech", "Deuteronomy 29:9-31:30", "Isaiah 61:10-63:9", "John 12:41-50"],
  ["2027-03-06", "Vayak’hel", "Exodus 35:1-38:20", "2 Kings 12:1-17", "Matthew 17:22-27", "Shabbat Shekalim"],
  ["2027-03-13", "Pekudei", "Exodus 38:21-40:38", "1 Kings 7:51-8:21", "Luke 16:1-13"],
  ["2027-04-10", "Tazria", "Leviticus 12:1-13:59", "2 Kings 4:42-5:19", "Luke 2:22-33"],
  ["2027-04-17", "Metzora", "Leviticus 14:1-15:33", "Malachi 3:4-24", "Matthew 17:9-13", "Shabbat HaGadol"],
  ["2027-05-01", "Acharei Mot", "Leviticus 16:1-18:30", "Ezekiel 22:1-19", "Matthew 15:10-20"],
  ["2027-05-08", "Kedoshim", "Leviticus 19:1-20:27", "Isaiah 66:1-24", "Mark 9:40-50", "Shabbat Rosh Chodesh"],
  ["2027-05-22", "Behar", "Leviticus 25:1-26:2", "Jeremiah 32:6-27", "Luke 4:14-22"],
  ["2027-05-29", "Bechukotai", "Leviticus 26:3-27:34", "Jeremiah 16:19-17:14", "Matthew 16:20-28"],
];

function assertWeek([date, name, torah, haftarah, gospel, special]: Row) {
  const portion = getPortionOnDate(day(date));
  assert.ok(portion, `${date}: no reading`);
  assert.deepEqual(
    [portion.hebrewName, portion.torahReading, portion.haftarah, portion.gospel, portion.special],
    [name, torah, haftarah, gospel, special],
    date,
  );
}

test("the next 8 Shabbats match FFOZ (Torah, Haftarah, Gospel, special Sabbath)", () => {
  NEXT_EIGHT.forEach(assertWeek);
});

test("every double-portion week this cycle matches FFOZ", () => {
  DOUBLE_PORTION_WEEKS.forEach(assertWeek);
  // The split pairs are never also shown combined on a date.
  for (const combined of ["Vayak’hel-Pekudei", "Tazria-Metzora", "Acharei Mot-Kedoshim", "Behar-Bechukotai"]) {
    assert.ok(
      !TORAH_CYCLES[1].portions.some(p => p.hebrewName === combined),
      `${combined} is read as two weeks in 5787`,
    );
  }
});

test("midweek, 'this week' is the upcoming Shabbat's FFOZ reading", () => {
  for (const [date, name] of NEXT_EIGHT) {
    const shabbat = day(date);
    for (let back = 0; back < 7; back++) {
      const today = new Date(shabbat);
      today.setDate(today.getDate() - back);
      assert.equal(getCurrentPortionEntry(today).hebrewName, name, `${toDateKey(today)} -> ${date}`);
    }
  }
});

test("every dated week on FFOZ's schedule is on the site, unchanged", () => {
  for (const week of FFOZ_SCHEDULE) {
    const portion = getPortionOnDate(day(week.date));
    assert.ok(portion, `${week.date} ${week.slug} missing`);
    assert.equal(portion.slug, week.slug, week.date);
    if (week.special) {
      assert.equal(portion.special, week.special, week.date);
      assert.equal(portion.haftarah, week.haftarah, week.date);
      assert.equal(portion.gospel, week.gospel, week.date);
    }
  }
});

// Shabbats in the cycle with no weekly portion: the festival is read instead.
const FESTIVAL_SHABBATOT: Record<string, string> = {
  "2027-04-24": "Shabbat Chol HaMo'ed Pesach",
  "2027-06-12": "Shavuot II",
  "2027-10-02": "Rosh Hashanah 5788",
};

test("the data covers every Shabbat of the 5787 cycle", () => {
  const cycle = TORAH_CYCLES.find(c => c.year === 5787)!.portions;
  const first = parsePortionDate(cycle[0].date)!;
  assert.equal(toDateKey(first), "2026-10-10", "5787 starts with B’reisheet");
  const missing: string[] = [];
  for (const saturday = new Date(first); toDateKey(saturday) <= "2027-10-09"; saturday.setDate(saturday.getDate() + 7)) {
    const key = toDateKey(saturday);
    if (!getPortionOnDate(saturday) && !FESTIVAL_SHABBATOT[key]) missing.push(key);
  }
  assert.deepEqual(missing, [], "Shabbats with no reading");
  // All 54 portions are read, once each (combined readings count both halves).
  const numbers = new Set(cycle.map(p => p.number));
  assert.equal(cycle.at(-1)!.hebrewName, "Vezot ha’Bracha");
  assert.ok(numbers.has(1) && numbers.has(54));
});

test("'this week' never runs out before the cycle ends", () => {
  for (const d = day("2026-10-05"); toDateKey(d) <= "2027-10-24"; d.setDate(d.getDate() + 1)) {
    assert.ok(getNextPortion(d), `nothing after ${toDateKey(d)}`);
  }
});

test("only the two Tishrei 5788 readings FFOZ hasn't published yet are provisional", () => {
  const provisional = TORAH_PORTIONS_WITH_DATES.filter(p => p.provisional).map(p => `${p.date} ${p.slug}`);
  assert.deepEqual(provisional, ["9 OCT 2027 haazinu", "24 OCT 2027 vezot-habracha"]);
});

test("the data file records its FFOZ source and retrieval date", () => {
  assert.equal(FFOZ_SOURCE.schedule, "https://ffoz.org/torahportions");
  assert.match(FFOZ_SOURCE.retrieved, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(FFOZ_SCHEDULE.length >= 49, "a full year of weeks");
});

test("teaching videos titled with older spellings still link to FFOZ's names", async () => {
  const { parseFeed } = await import("./youtube");
  const { getPortionMatchNames } = await import("./torah-utils");
  const entry = (id: string, title: string) =>
    `<entry><yt:videoId>${id}</yt:videoId><title>${title}</title><published>2026-10-10T20:00:00+00:00</published></entry>`;
  const videos = parseFeed(
    entry("a", "Torah Portion Beresheet | by Pastor Frank Longoria") +
      entry("b", "Torah Portion Eikev &quot;Because&quot; | by Dolen Lene") +
      entry("c", "Torah Portion Re&#39;eh (See) | by Pastor Frank Longoria") +
      entry("d", "Torah Portion Ki Teitzei | by Pastor Frank Longoria"),
    getPortionMatchNames(),
  );
  assert.deepEqual(
    videos.map(v => v.portionHebrewName),
    ["B’reisheet", "Ekev", "Re’eh", "Ki Tetze"],
  );
});
