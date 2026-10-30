// Torah Portions Utilities
// Helper functions for Torah portion date calculations and categorization
//
// The congregation follows First Fruits of Zion's weekly readings (Torah,
// Haftarah and Gospel). Every reading below comes from
// src/data/ffoz-torah-schedule.json, which scripts/fetch-ffoz-schedule.ts
// pulls from ffoz.org (source URLs and date inside the file). Don't hand-edit
// readings here; re-run the script.

import ffoz from '../data/ffoz-torah-schedule.json';

export type TorahBook = 'genesis' | 'exodus' | 'leviticus' | 'numbers' | 'deuteronomy';

export interface TorahPortionWithDate {
  number: number;
  /** English meaning, as FFOZ gives it ("And He Appeared"). */
  name: string;
  /** Portion name as FFOZ spells it ("Vayera", "B’reisheet"). */
  hebrewName: string;
  /** FFOZ's slug, e.g. "vayera" (https://ffoz.org/torahportions/parashah/vayera). */
  slug: string;
  torahReading: string;
  haftarah: string;
  /** FFOZ's Gospel (or Apostolic) reading for the week. */
  gospel: string;
  book: TorahBook;
  date: string; // e.g., "17 OCT 2025"
  combined?: boolean; // true for combined portions like Vayakhel-Pekudei
  /** Special Sabbath whose Haftarah and Gospel replace the regular ones
   *  (FFOZ marks these with an asterisk), e.g. "Shabbat Hanukkah". */
  special?: string;
  /** Not yet on FFOZ's published schedule; date from the Hebrew calendar. */
  provisional?: boolean;
}

interface FfozPortion {
  name: string;
  meaning: string;
  hebrew: string;
  book: string;
  torah: string;
  haftarah: string;
  gospel: string;
}

interface FfozWeek {
  date: string; // YYYY-MM-DD
  slug: string;
  special?: string;
  haftarah?: string;
  gospel?: string;
}

export const FFOZ_SOURCE = ffoz.source;
const FFOZ_PORTIONS = ffoz.portions as Record<string, FfozPortion>;
export const FFOZ_SCHEDULE = ffoz.schedule as FfozWeek[];

/** The 54 portions in order; a combined reading takes its first half's number. */
const PORTION_ORDER = [
  'breisheet', 'noach', 'lech-lecha', 'vayera', 'chayei-sarah', 'toldot', 'vayetze',
  'vayishlach', 'vayeshev', 'miketz', 'vayigash', 'vayechi',
  'shemot', 'vaera', 'bo', 'beshalach', 'yitro', 'mishpatim', 'terumah', 'tetzaveh',
  'ki-tisa', 'vayakhel', 'pekudei',
  'vayikra', 'tzav', 'shemini', 'tazria', 'metzora', 'acharei-mot', 'kedoshim', 'emor',
  'behar', 'bechukotai',
  'bamidbar', 'nasso', 'behaalotcha', 'shelach', 'korach', 'chukat', 'balak', 'pinchas',
  'mattot', 'massei',
  'devarim', 'vaetchanan', 'ekev', 'reeh', 'shoftim', 'ki-tetze', 'ki-tavo', 'nitzavim',
  'vayelech', 'haazinu', 'vezot-habracha',
];

/**
 * Other spellings of a portion's name, so a YouTube title that says
 * "Beresheet" or "Eikev" still finds FFOZ's "B’reisheet" or "Ekev".
 */
export const PORTION_ALIASES: Record<string, readonly string[]> = {
  'breisheet': ['Beresheet', 'Bereshit', 'Bereishit', 'Bereshith'],
  'lech-lecha': ['Lech Lecha', 'Lekh Lekha'],
  'chayei-sarah': ['Chayei Sara', 'Chaye Sarah'],
  'vayetze': ['Vayetzei', 'Vayeitzei'],
  'vaera': ["Va'eira", 'Vaeira'],
  'vayakhel': ['Vayakhel'],
  'vayakhel-pekudei': ['Vayakhel-Pekudei'],
  'shemini': ['Shemini', 'Shmini'],
  'acharei-mot': ['Achrei Mot', 'Acharei'],
  'nasso': ['Naso'],
  'behaalotcha': ["Beha'alotecha", 'Behaalotecha'],
  'shelach': ["Sh'lach", 'Shlach', 'Shelach Lecha'],
  'mattot': ['Matot'],
  'massei': ['Masei'],
  'mattot-massei': ['Matot-Masei'],
  'ekev': ['Eikev'],
  'ki-tetze': ['Ki Teitzei', 'Ki Tetzei', 'Ki Tetzeh'],
  'vayelech': ['Vayeilech'],
  'nitzavim-vayelech': ['Nitzavim-Vayeilech'],
  'vezot-habracha': ["V'Zot HaBerachah", 'Vezot Haberakhah', 'Vzot Habracha'],
};

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

/** "2026-10-31" -> "31 OCT 2026" */
function displayDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

/** One dated reading, with FFOZ's special-Sabbath replacements applied. */
function week(
  iso: string,
  slug: string,
  extra: Partial<Pick<TorahPortionWithDate, 'special' | 'haftarah' | 'gospel' | 'provisional'>> = {},
): TorahPortionWithDate {
  const portion = FFOZ_PORTIONS[slug];
  if (!portion) throw new Error(`No FFOZ portion "${slug}"`);
  const combined = !PORTION_ORDER.includes(slug);
  const number = PORTION_ORDER.findIndex(s => slug === s || slug.startsWith(`${s}-`)) + 1;
  return {
    number,
    name: portion.meaning,
    hebrewName: portion.name,
    slug,
    torahReading: portion.torah,
    haftarah: extra.haftarah ?? portion.haftarah,
    gospel: extra.gospel ?? portion.gospel,
    book: portion.book.toLowerCase() as TorahBook,
    date: displayDate(iso),
    ...(combined ? { combined: true } : {}),
    ...(extra.special ? { special: extra.special } : {}),
    ...(extra.provisional ? { provisional: true } : {}),
  };
}

const fromFfoz = (from: string, to: string) =>
  FFOZ_SCHEDULE.filter(w => w.date >= from && w.date <= to).map(w =>
    week(w.date, w.slug, { special: w.special, haftarah: w.haftarah, gospel: w.gospel }),
  );

// 5786 (2025-2026) has passed and FFOZ no longer publishes its dates, which
// were the same diaspora schedule. Names and regular readings follow FFOZ;
// that year's special-Sabbath replacements aren't shown. Its last two
// readings are on FFOZ's current schedule and come from it.
const PORTIONS_5786: TorahPortionWithDate[] = [
  ...([
    ['2025-10-18', 'breisheet'], ['2025-10-25', 'noach'], ['2025-11-01', 'lech-lecha'],
    ['2025-11-08', 'vayera'], ['2025-11-15', 'chayei-sarah'], ['2025-11-22', 'toldot'],
    ['2025-11-29', 'vayetze'], ['2025-12-06', 'vayishlach'], ['2025-12-13', 'vayeshev'],
    ['2025-12-20', 'miketz'], ['2025-12-27', 'vayigash'], ['2026-01-03', 'vayechi'],
    ['2026-01-10', 'shemot'], ['2026-01-17', 'vaera'], ['2026-01-24', 'bo'],
    ['2026-01-31', 'beshalach'], ['2026-02-07', 'yitro'], ['2026-02-14', 'mishpatim'],
    ['2026-02-21', 'terumah'], ['2026-02-28', 'tetzaveh'], ['2026-03-07', 'ki-tisa'],
    ['2026-03-14', 'vayakhel-pekudei'], ['2026-03-21', 'vayikra'], ['2026-03-28', 'tzav'],
    ['2026-04-11', 'shemini'], ['2026-04-18', 'tazria-metzora'], ['2026-04-25', 'acharei-mot-kedoshim'],
    ['2026-05-02', 'emor'], ['2026-05-09', 'behar-bechukotai'], ['2026-05-16', 'bamidbar'],
    ['2026-05-30', 'nasso'], ['2026-06-06', 'behaalotcha'], ['2026-06-13', 'shelach'],
    ['2026-06-20', 'korach'], ['2026-06-27', 'chukat-balak'], ['2026-07-04', 'pinchas'],
    ['2026-07-11', 'mattot-massei'], ['2026-07-18', 'devarim'], ['2026-07-25', 'vaetchanan'],
    ['2026-08-01', 'ekev'], ['2026-08-08', 'reeh'], ['2026-08-15', 'shoftim'],
    ['2026-08-22', 'ki-tetze'], ['2026-08-29', 'ki-tavo'], ['2026-09-05', 'nitzavim-vayelech'],
  ] as const).map(([iso, slug]) => week(iso, slug)),
  ...fromFfoz('2026-09-01', '2026-10-09'),
];

// 5787 (2026-2027), exactly as FFOZ publishes it. FFOZ hasn't yet dated the
// cycle's last two readings (they fall in Tishrei 5788), so those two are
// provisional: Hebrew-calendar dates, FFOZ's readings, and Ha'azinu again on
// Shabbat Shuva as this year. Re-run the fetch script once FFOZ publishes.
const haazinu5787 = FFOZ_SCHEDULE.find(w => w.date === '2026-09-19');
const PORTIONS_5787: TorahPortionWithDate[] = [
  ...fromFfoz('2026-10-10', '2027-09-30'),
  week('2027-10-09', 'haazinu', {
    special: haazinu5787?.special,
    haftarah: haazinu5787?.haftarah,
    gospel: haazinu5787?.gospel,
    provisional: true,
  }),
  week('2027-10-24', 'vezot-habracha', { provisional: true }),
];

/** Each annual cycle, oldest first. Add the next year here when it is published. */
export const TORAH_CYCLES: { year: number; portions: TorahPortionWithDate[] }[] = [
  { year: 5786, portions: PORTIONS_5786 },
  { year: 5787, portions: PORTIONS_5787 },
];

/** The congregation's time zone. "Today" is always the calendar date here,
 *  not on the server (Vercel runs in UTC, which rolled the week over at
 *  7 PM CDT on Saturday). */
export const CONGREGATION_TIME_ZONE = 'America/Chicago';

/**
 * Today's date in Houston, as a Date at local midnight -- the same shape
 * parsePortionDate returns, so the two compare directly. Changeover is at
 * local midnight; there is no sunset logic.
 */
export function chicagoToday(now: Date = new Date()): Date {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: CONGREGATION_TIME_ZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(now);
  const get = (type: string) =>
    parseInt(parts.find(part => part.type === type)?.value ?? '', 10);
  return new Date(get('year'), get('month') - 1, get('day'));
}

/**
 * Every dated portion across all cycles, in reading order. Hebrew names repeat
 * once per cycle, so look a portion up with getPortionByHebrewName (which picks
 * the nearest reading) rather than a bare .find on the name.
 */
export const TORAH_PORTIONS_WITH_DATES: TorahPortionWithDate[] = TORAH_CYCLES.flatMap(
  cycle => cycle.portions,
);

/**
 * "This week's" portion: the reading for the upcoming Shabbat, i.e. the first
 * reading on or after `today` (on Shabbat itself, that day's). Every page that
 * says "this week" uses this, so home, /shabbat, /resources and /events agree
 * midweek. After the last dated reading it stays on that last one.
 */
export function getCurrentPortionEntry(today: Date = chicagoToday()): TorahPortionWithDate {
  return (
    getNextPortion(today) ??
    TORAH_PORTIONS_WITH_DATES[TORAH_PORTIONS_WITH_DATES.length - 1]
  );
}

/**
 * Get the current Torah portion based on today's date
 */
export function getCurrentPortion(today: Date = chicagoToday()): string {
  return getCurrentPortionEntry(today).hebrewName;
}

/**
 * The cycle that holds this week's portion. The Torah Portions page shows only
 * this one, so it always contains the portion the page highlights.
 */
export function getCurrentCycle(today: Date = chicagoToday()): TorahPortionWithDate[] {
  const entry = getCurrentPortionEntry(today);
  return (TORAH_CYCLES.find(cycle => cycle.portions.includes(entry)) ?? TORAH_CYCLES[0]).portions;
}

/**
 * Parse a portion date string like "17 OCT 2025" to a Date object
 */
export function parsePortionDate(dateStr: string): Date | null {
  const months: Record<string, number> = {
    'JAN': 0, 'FEB': 1, 'MAR': 2, 'APR': 3, 'MAY': 4, 'JUN': 5,
    'JUL': 6, 'AUG': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DEC': 11
  };

  const parts = dateStr.split(' ');
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const month = months[parts[1]];
  const year = parseInt(parts[2], 10);

  if (isNaN(day) || month === undefined || isNaN(year)) return null;

  return new Date(year, month, day);
}

/**
 * Get all portions for a specific book
 */
export function getPortionsByBook(book: TorahBook): TorahPortionWithDate[] {
  return getCurrentCycle().filter(p => p.book === book);
}

/**
 * Get the book that contains the current portion
 */
export function getCurrentBook(): TorahBook {
  return getCurrentPortionEntry().book;
}

/**
 * Book display names
 */
export const BOOK_NAMES: Record<TorahBook, string> = {
  genesis: 'GENESIS',
  exodus: 'EXODUS',
  leviticus: 'LEVITICUS',
  numbers: 'NUMBERS',
  deuteronomy: 'DEUTERONOMY',
};

/**
 * Get a portion by its Hebrew name. Each name appears once per cycle, so this
 * returns the reading whose date is nearest `near` (today by default).
 */
export function getPortionByHebrewName(
  hebrewName: string,
  near: Date = chicagoToday(),
): TorahPortionWithDate | undefined {
  let best: TorahPortionWithDate | undefined;
  let bestDistance = Infinity;

  for (const portion of TORAH_PORTIONS_WITH_DATES) {
    if (portion.hebrewName !== hebrewName) continue;
    const date = parsePortionDate(portion.date);
    const distance = date ? Math.abs(date.getTime() - near.getTime()) : Infinity;
    if (!best || distance < bestDistance) {
      best = portion;
      bestDistance = distance;
    }
  }

  return best;
}

// ============================================================
// Calendar helpers (Upcoming Events page)
// ============================================================

/** Local YYYY-MM-DD. Never use toISOString() here -- it converts to UTC and
 *  shifts the date by a day for anyone west of Greenwich, which is everyone
 *  in this congregation. */
export function toDateKey(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Every portion in the cycle keyed by the Saturday it is read. */
export function getPortionsByDateKey(): Map<string, TorahPortionWithDate> {
  const map = new Map<string, TorahPortionWithDate>();

  for (const portion of TORAH_PORTIONS_WITH_DATES) {
    const date = parsePortionDate(portion.date);
    if (date) map.set(toDateKey(date), portion);
  }

  return map;
}

/** The portion read on a specific day, if that day is a reading Saturday. */
export function getPortionOnDate(date: Date): TorahPortionWithDate | undefined {
  return getPortionsByDateKey().get(toDateKey(date));
}

/** First reading Saturday on or after `from`. Undefined once the cycle ends. */
export function getNextPortion(from: Date = chicagoToday()): TorahPortionWithDate | undefined {
  const cutoff = new Date(from);
  cutoff.setHours(0, 0, 0, 0);

  return TORAH_PORTIONS_WITH_DATES.filter(portion => {
    const date = parsePortionDate(portion.date);
    return date !== null && date >= cutoff;
  })[0];
}

/** Bounds of the reading cycle, for clamping calendar navigation. */
export function getCycleRange(): { first: Date; last: Date } | null {
  const dates = TORAH_PORTIONS_WITH_DATES
    .map(portion => parsePortionDate(portion.date))
    .filter((date): date is Date => date !== null)
    .sort((a, b) => a.getTime() - b.getTime());

  if (dates.length === 0) return null;
  return { first: dates[0], last: dates[dates.length - 1] };
}

// ============================================================
// FFOZ display helpers
// ============================================================

/** A reading as FFOZ shows it: an asterisk when a special Sabbath replaced it
 *  (non-breaking, so it never wraps onto a line by itself). */
export function markSpecial(reading: string, portion: Pick<TorahPortionWithDate, 'special'>): string {
  return portion.special ? `${reading}\u00a0*` : reading;
}

/** FFOZ's footnote for a special Sabbath, e.g. "* Special readings for Shabbat Hanukkah". */
export function specialNote(portion: Pick<TorahPortionWithDate, 'special'>): string | undefined {
  return portion.special ? `* Special readings for ${portion.special}` : undefined;
}

/** Every portion name with its other spellings, for matching YouTube titles. */
export function getPortionMatchNames(): { name: string; aliases: readonly string[] }[] {
  const seen = new Map<string, readonly string[]>();
  for (const portion of TORAH_PORTIONS_WITH_DATES) {
    if (!seen.has(portion.hebrewName)) {
      seen.set(portion.hebrewName, PORTION_ALIASES[portion.slug] ?? []);
    }
  }
  return [...seen].map(([name, aliases]) => ({ name, aliases }));
}
