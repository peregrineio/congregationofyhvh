/**
 * Pull First Fruits of Zion's weekly Torah portion schedule into
 * src/data/ffoz-torah-schedule.json.
 *
 *   npx tsx scripts/fetch-ffoz-schedule.ts
 *
 * The congregation follows FFOZ's readings (Torah, Haftarah and Gospel), so
 * FFOZ is the source of truth, not Hebcal's defaults. Two FFOZ sources:
 *
 *  1. https://ffoz.org/torahportions ships the year's schedule (dates and
 *     which special Sabbath, if any, falls on each) in one of its JS chunks.
 *  2. Each https://ffoz.org/torahportions/parashah/<slug> page carries the
 *     portion's name, English meaning and readings, plus the special
 *     Haftarah and Gospel that replace them on special Sabbaths (shown with
 *     an asterisk on FFOZ).
 *
 * Nothing downloaded is executed: the chunk's data is read with a small
 * literal parser that refuses anything but objects, arrays and strings.
 * Re-run when FFOZ publishes the next year (their page says "NEW FOR
 * 2026-2027" on the card download), then run `npm test`.
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const SITE = "https://ffoz.org";
const SCHEDULE_PAGE = `${SITE}/torahportions`;
const PORTION_PAGE = (slug: string) => `${SITE}/torahportions/parashah/${slug}`;
const OUT = join(process.cwd(), "src/data/ffoz-torah-schedule.json");
const UA = { "user-agent": "Mozilla/5.0 (congregationofyhvh.com schedule sync)" };

type Literal = string | number | boolean | null | Literal[] | { [key: string]: Literal };

interface ChunkEntry {
  title: string;
  slug: string;
  date?: string;
  book?: string;
  special?: string;
  category?: string;
  leyning?: { torah?: string; haftarah?: string; gospel?: string };
}

async function get(url: string): Promise<string> {
  const response = await fetch(url, { headers: UA });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.text();
}

/** Parse a JS object/array literal (unquoted keys, double-quoted strings). */
function parseLiteral(source: string, start: number): { value: Literal; end: number } {
  let i = start;
  const ws = () => {
    while (/\s/.test(source[i])) i++;
  };
  const value = (): Literal => {
    ws();
    const ch = source[i];
    if (ch === "[") {
      i++;
      const out: Literal[] = [];
      ws();
      if (source[i] === "]") return i++, out;
      for (;;) {
        out.push(value());
        ws();
        if (source[i] === ",") { i++; continue; }
        if (source[i] === "]") { i++; return out; }
        throw new Error(`unexpected ${source[i]} at ${i}`);
      }
    }
    if (ch === "{") {
      i++;
      const out: { [key: string]: Literal } = {};
      ws();
      if (source[i] === "}") return i++, out;
      for (;;) {
        ws();
        let key: string;
        if (source[i] === '"') key = value() as string;
        else {
          const m = /^[A-Za-z_$][\w$]*/.exec(source.slice(i, i + 64));
          if (!m) throw new Error(`bad key at ${i}`);
          key = m[0];
          i += key.length;
        }
        ws();
        if (source[i++] !== ":") throw new Error(`expected : at ${i}`);
        out[key] = value();
        ws();
        if (source[i] === ",") { i++; continue; }
        if (source[i] === "}") { i++; return out; }
        throw new Error(`unexpected ${source[i]} at ${i}`);
      }
    }
    if (ch === '"') {
      let j = i + 1;
      while (source[j] !== '"') j += source[j] === "\\" ? 2 : 1;
      const raw = source.slice(i, j + 1);
      i = j + 1;
      return JSON.parse(raw) as string;
    }
    const m = /^(-?\d+(?:\.\d+)?|!0|!1|null|void 0)/.exec(source.slice(i, i + 16));
    if (!m) throw new Error(`non-literal value at ${i}: ${source.slice(i, i + 40)}`);
    i += m[0].length;
    return m[0] === "!0" ? true : m[0] === "!1" ? false : m[0] === "null" || m[0] === "void 0" ? null : Number(m[0]);
  };
  const result = value();
  return { value: result, end: i };
}

/** The schedule chunk declares `let i=[parashot],s=[specials],l=[festivals]`. */
async function readScheduleChunk(): Promise<{ parashot: ChunkEntry[]; specials: ChunkEntry[] }> {
  const html = await get(SCHEDULE_PAGE);
  const chunks = [...new Set(html.match(/\/_next\/static\/chunks\/[\w./-]+\.js/g) ?? [])];
  for (const path of chunks) {
    const js = await get(SITE + path);
    const marker = js.indexOf('hebcalTitle:"Bereshit"');
    if (marker < 0) continue;
    const start = js.lastIndexOf("=[", marker) + 1;
    const parashot = parseLiteral(js, start);
    if (js[parashot.end] !== "," ) throw new Error("schedule chunk layout changed");
    const specialsStart = js.indexOf("=[", parashot.end) + 1;
    const specials = parseLiteral(js, specialsStart);
    return {
      parashot: parashot.value as unknown as ChunkEntry[],
      specials: specials.value as unknown as ChunkEntry[],
    };
  }
  throw new Error("FFOZ schedule chunk not found");
}

/** Decode the page's React Server Component payload into one string. */
function rscText(html: string): string {
  const parts = html.match(/self\.__next_f\.push\(\[1,("(?:[^"\\]|\\.)*")\]\)/g) ?? [];
  return parts
    .map(part => JSON.parse(part.slice(part.indexOf(",") + 1, -2)) as string)
    .join("");
}

function objectAfter(text: string, key: string): Record<string, unknown> | undefined {
  const at = text.indexOf(`"${key}":{`);
  if (at < 0) return undefined;
  let i = text.indexOf("{", at);
  const start = i;
  let depth = 0;
  let inString = false;
  for (; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (ch === "\\") i++;
      else if (ch === '"') inString = false;
    } else if (ch === '"') inString = true;
    else if (ch === "{") depth++;
    else if (ch === "}" && --depth === 0) break;
  }
  return JSON.parse(text.slice(start, i + 1)) as Record<string, unknown>;
}

const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");

async function main() {
  const { parashot, specials } = await readScheduleChunk();
  const portions: Record<string, unknown> = {};
  const schedule: Record<string, unknown>[] = [];

  for (const entry of parashot) {
    const text = rscText(await get(PORTION_PAGE(entry.slug)));
    const page = objectAfter(text, "parashah");
    if (!page || str(page.slug) !== entry.slug) throw new Error(`no portion data on ${entry.slug}`);

    portions[entry.slug] = {
      name: str(page.title),
      meaning: str(page.translation),
      hebrew: str(page.hebrewTitle),
      book: entry.book,
      torah: str(page.torahReading),
      haftarah: str(page.haftarahReading),
      gospel: str(page.gospelReading),
    };

    if (!entry.date) continue;
    const week: Record<string, unknown> = { date: entry.date, slug: entry.slug };
    if (entry.special) {
      // The portion page shows the special Sabbath's readings in place of the
      // regular ones; use what it shows, and the chunk's copy only as backup.
      const shown = objectAfter(text, "specialHaftarah");
      const backup = specials.find(s => s.slug === entry.special);
      week.special = str(shown?.title) || backup?.title?.trim();
      week.haftarah = str(shown?.haftarahReading) || backup?.leyning?.haftarah?.trim() || undefined;
      week.gospel = str(shown?.gospelReading) || backup?.leyning?.gospel?.trim() || undefined;
      if (!shown) console.warn(`! ${entry.slug}: page had no special readings; used the schedule's`);
    }
    schedule.push(week);
    console.log(entry.date, entry.slug, week.special ?? "");
  }

  schedule.sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const data = {
    source: {
      publisher: "First Fruits of Zion",
      schedule: SCHEDULE_PAGE,
      portion: `${SITE}/torahportions/parashah/{slug}`,
      retrieved: new Date().toISOString().slice(0, 10),
      note:
        "Torah and Haftarah references follow the Hebrew Bible, for the diaspora schedule, as FFOZ lists them. " +
        "On a special Sabbath FFOZ replaces the Haftarah and Gospel; `schedule` holds those replacements.",
    },
    portions,
    schedule,
  };
  writeFileSync(OUT, JSON.stringify(data, null, 2) + "\n");
  console.log(`wrote ${Object.keys(portions).length} portions, ${schedule.length} dated weeks -> ${OUT}`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
