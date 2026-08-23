import { SITE_CONFIG } from "@/lib/constants";
import { TORAH_PORTIONS_WITH_DATES, parsePortionDate } from "@/lib/torah-utils";

/**
 * Subscribable calendar feed of every Shabbat gathering in the reading cycle.
 *
 * Served as a real .ics rather than a download button that does nothing —
 * someone can point Google/Apple Calendar at this URL and the whole year
 * appears, each entry carrying its portion and readings.
 *
 * Times are emitted with an explicit VTIMEZONE for America/Chicago. Floating
 * times would drift for anyone outside Central, and a bare UTC conversion
 * would silently break when DST shifts mid-cycle.
 */

export const revalidate = 86_400;

const TZID = "America/Chicago";
const SERVICE_HOUR = 15; // 3:00 PM
const SERVICE_MINUTES = 0;
const DURATION_HOURS = 2;

/** Escape per RFC 5545 — commas, semicolons, backslashes and newlines. */
function esc(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Local wall-clock stamp, e.g. 20260822T150000 — paired with TZID. */
function localStamp(date: Date, hour: number, minute: number): string {
  return (
    `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}` +
    `T${pad(hour)}${pad(minute)}00`
  );
}

/** RFC 5545 caps lines at 75 octets; fold with a leading space. */
function fold(line: string): string {
  if (line.length <= 73) return line;
  const parts: string[] = [];
  let rest = line;
  parts.push(rest.slice(0, 73));
  rest = rest.slice(73);
  while (rest.length > 72) {
    parts.push(" " + rest.slice(0, 72));
    rest = rest.slice(72);
  }
  if (rest.length) parts.push(" " + rest);
  return parts.join("\r\n");
}

export async function GET() {
  const now = new Date();
  const dtstamp =
    `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}` +
    `T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Congregation of YHVH//Shabbat Gatherings//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${esc(SITE_CONFIG.name)}`,
    `X-WR-TIMEZONE:${TZID}`,
    "X-WR-CALDESC:Weekly Shabbat gatherings and Torah portions",
    // Minimal but valid US Central definition.
    "BEGIN:VTIMEZONE",
    `TZID:${TZID}`,
    "BEGIN:DAYLIGHT",
    "TZOFFSETFROM:-0600",
    "TZOFFSETTO:-0500",
    "TZNAME:CDT",
    "DTSTART:19700308T020000",
    "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU",
    "END:DAYLIGHT",
    "BEGIN:STANDARD",
    "TZOFFSETFROM:-0500",
    "TZOFFSETTO:-0600",
    "TZNAME:CST",
    "DTSTART:19701101T020000",
    "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU",
    "END:STANDARD",
    "END:VTIMEZONE",
  ];

  for (const portion of TORAH_PORTIONS_WITH_DATES) {
    const date = parsePortionDate(portion.date);
    if (!date) continue;

    const start = localStamp(date, SERVICE_HOUR, SERVICE_MINUTES);
    const end = localStamp(date, SERVICE_HOUR + DURATION_HOURS, SERVICE_MINUTES);

    lines.push(
      "BEGIN:VEVENT",
      `UID:portion-${portion.number}-${start}@congregationofyhvh.com`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART;TZID=${TZID}:${start}`,
      `DTEND;TZID=${TZID}:${end}`,
      fold(`SUMMARY:${esc(`Shabbat Service — ${portion.hebrewName}`)}`),
      fold(
        `DESCRIPTION:${esc(
          [
            `Portion ${portion.number} of 54 — "${portion.name}"`,
            `Torah: ${portion.torahReading}`,
            `Haftarah: ${portion.haftarah}`,
            `Brit Chadashah: ${portion.britChadashah}`,
            "",
            `${SITE_CONFIG.domain}/events`,
          ].join("\n")
        )}`
      ),
      fold(`LOCATION:${esc(SITE_CONFIG.address)}`),
      `URL:${SITE_CONFIG.domain}/events`,
      "STATUS:CONFIRMED",
      "TRANSP:OPAQUE",
      "END:VEVENT"
    );
  }

  lines.push("END:VCALENDAR");

  return new Response(lines.join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="congregation-of-yhvh.ics"',
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
