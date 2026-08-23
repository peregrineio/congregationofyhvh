"use client";

import { useMemo, useState } from "react";
import type { TorahPortionWithDate } from "@/lib/torah-utils";
import { toDateKey } from "@/lib/torah-utils";
import { SITE_CONFIG } from "@/lib/constants";
import { Flame, CalendarDays, Play, ArrowRight } from "@/components/icons";

export interface CalendarVideo {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
}

export interface CalendarEntry {
  dateKey: string;
  portion: TorahPortionWithDate;
  video?: CalendarVideo;
}

interface EventCalendarProps {
  entries: CalendarEntry[];
  /** Today, resolved on the server so the first paint matches the server. */
  todayKey: string;
  /**
   * Rail rendered beside the grid. It lives here rather than in the page so
   * the month header and view toggle can span the full width above BOTH
   * columns — otherwise the rail starts level with the header and the grid
   * hangs below it.
   */
  aside?: React.ReactNode;
}

type ViewMode = "month" | "week" | "list";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Event types. Only Worship exists today — the congregation's study groups
 * and fellowships have not started yet. The legend renders from this list, so
 * when they begin they appear here and in the cells without restructuring.
 */
const EVENT_TYPES = [
  { key: "worship", label: "Worship", tone: "bg-[#131a2e]", active: true },
] as const;

function monthKey(year: number, month: number) {
  return year * 12 + month;
}

function shortDate(dateKey: string) {
  return new Date(`${dateKey}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function EventCalendar({
  entries,
  todayKey,
  aside,
}: EventCalendarProps) {
  const byDate = useMemo(
    () => new Map(entries.map((entry) => [entry.dateKey, entry])),
    [entries],
  );

  // Navigation is clamped to the reading cycle -- there is nothing to show
  // outside it, and letting someone page into 2031 looks broken.
  const bounds = useMemo(() => {
    const keys = entries.map((entry) => entry.dateKey).sort();
    const parse = (key: string) => {
      const [year, month] = key.split("-").map(Number);
      return monthKey(year, month - 1);
    };
    return keys.length
      ? { min: parse(keys[0]), max: parse(keys[keys.length - 1]) }
      : null;
  }, [entries]);

  // Open on the month containing the next reading, not on today's month --
  // in a gap between cycles today's month can be empty.
  const initial = useMemo(() => {
    const upcoming =
      entries.find((entry) => entry.dateKey >= todayKey) ?? entries[0];
    const [year, month] = (upcoming?.dateKey ?? todayKey)
      .split("-")
      .map(Number);
    return { year, month: month - 1 };
  }, [entries, todayKey]);

  const [view, setView] = useState(initial);
  const [mode, setMode] = useState<ViewMode>("month");
  const [selectedKey, setSelectedKey] = useState<string | null>(() => {
    const upcoming = entries.find((entry) => entry.dateKey >= todayKey);
    return upcoming?.dateKey ?? null;
  });

  const current = monthKey(view.year, view.month);
  const canGoBack = !bounds || current > bounds.min;
  const canGoForward = !bounds || current < bounds.max;

  function shiftMonth(delta: number) {
    setView(({ year, month }) => {
      const next = new Date(year, month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  }

  /**
   * Six weeks of cells, including the tail of the previous month and the head
   * of the next. Blank leading cells make the grid look truncated; showing the
   * adjacent days greyed is how a wall calendar reads.
   */
  const grid = useMemo(() => {
    const firstOfMonth = new Date(view.year, view.month, 1);
    const start = new Date(firstOfMonth);
    start.setDate(1 - firstOfMonth.getDay());

    return Array.from({ length: 42 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return date;
    });
  }, [view]);

  // The week containing the selected day (or today), for the week view.
  const weekCells = useMemo(() => {
    const anchor = new Date(`${selectedKey ?? todayKey}T12:00:00`);
    const start = new Date(anchor);
    start.setDate(anchor.getDate() - anchor.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return date;
    });
  }, [selectedKey, todayKey]);

  const upcomingList = useMemo(
    () => entries.filter((entry) => entry.dateKey >= todayKey).slice(0, 12),
    [entries, todayKey],
  );

  const selected = selectedKey ? byDate.get(selectedKey) : undefined;

  return (
    <div>
      {/* ── Month header + view toggle ─────────────────────────────
          The arrows are clustered around the month rather than pinned to the
          container edges — at full width they drifted so far from the title
          they stopped reading as its controls. */}
      <div className="mb-4 flex items-center justify-center gap-5 sm:gap-8">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          disabled={!canGoBack || mode === "list"}
          aria-label="Previous month"
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-yhvh-gold/30 text-yhvh-gold-dark transition hover:bg-yhvh-gold/10 disabled:cursor-not-allowed disabled:opacity-30"
        >
          &larr;
        </button>

        {/* Fixed min-width so the arrows hold still as the month name
            changes length — otherwise they jog left and right on every click. */}
        <h2 className="min-w-[12rem] text-center font-heading text-2xl tracking-wide sm:min-w-[16rem] sm:text-3xl">
          <span className="gold-leaf-text">{MONTHS[view.month]}</span>{" "}
          <span className="text-muted-foreground">{view.year}</span>
        </h2>

        <button
          type="button"
          onClick={() => shiftMonth(1)}
          disabled={!canGoForward || mode === "list"}
          aria-label="Next month"
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-yhvh-gold/30 text-yhvh-gold-dark transition hover:bg-yhvh-gold/10 disabled:cursor-not-allowed disabled:opacity-30"
        >
          &rarr;
        </button>
      </div>

      <div className="mb-5 flex justify-center">
        <div
          role="tablist"
          aria-label="Calendar view"
          className="inline-flex gap-1 rounded-full border border-yhvh-gold/25 bg-[#fdfbf6] p-1"
        >
          {(["month", "week", "list"] as ViewMode[]).map((m) => (
            <button
              key={m}
              role="tab"
              type="button"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={`rounded-full px-6 py-2 font-subheading text-xs uppercase tracking-widest transition-colors ${
                mode === m
                  ? "bg-yhvh-gold text-white"
                  : "text-yhvh-gold-dark hover:bg-yhvh-gold/10"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Rail and grid sit side by side BELOW the header, so their tops line
          up. The header above spans both. */}
      <div
        className={
          aside
            ? "grid gap-8 lg:grid-cols-[264px_1fr] lg:items-start"
            : undefined
        }
      >
        {aside && <aside className="space-y-6">{aside}</aside>}

        <div className="min-w-0">
          {/* ── The grid ───────────────────────────────────────────── */}
          {mode !== "list" && (
            <div className="overflow-hidden rounded-xl border border-yhvh-gold/25">
              {/* Weekday header — dark band, as in the mock */}
              <div className="grid grid-cols-7 bg-[#131a2e]">
                {WEEKDAYS.map((day) => (
                  <div
                    key={day}
                    className="py-3 text-center font-subheading text-[0.65rem] uppercase tracking-[0.2em] text-white/85 sm:text-xs"
                  >
                    <span className="hidden sm:inline">{day}</span>
                    <span className="sm:hidden">{day[0]}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 bg-[#fdfbf6]">
                {(mode === "month" ? grid : weekCells).map((date) => {
                  const key = toDateKey(date);
                  const entry = byDate.get(key);
                  const isToday = key === todayKey;
                  const isSelected = key === selectedKey;
                  const isPast = key < todayKey;
                  const outside =
                    mode === "month" && date.getMonth() !== view.month;

                  const base =
                    "relative min-h-[4.5rem] border-b border-r border-yhvh-gold/12 p-1.5 text-left sm:min-h-[7.5rem] sm:p-2.5";

                  if (!entry) {
                    return (
                      <div
                        key={key}
                        className={`${base} ${
                          outside
                            ? "text-muted-foreground/35"
                            : "text-muted-foreground"
                        } ${isToday ? "ring-1 ring-inset ring-yhvh-gold" : ""}`}
                      >
                        <span className="font-body text-xs sm:text-sm">
                          {date.getDate()}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedKey(key)}
                      aria-pressed={isSelected}
                      aria-label={`${MONTHS[date.getMonth()]} ${date.getDate()} — Shabbat service, Torah portion ${entry.portion.hebrewName}`}
                      className={`${base} flex flex-col transition-colors ${
                        isSelected
                          ? "bg-yhvh-gold/[0.14] ring-1 ring-inset ring-yhvh-gold"
                          : "bg-yhvh-gold/[0.05] hover:bg-yhvh-gold/[0.1]"
                      } ${isToday && !isSelected ? "ring-1 ring-inset ring-yhvh-gold/60" : ""} ${
                        outside ? "opacity-50" : ""
                      }`}
                    >
                      <span className="flex w-full items-start justify-between">
                        <span
                          className={`font-body text-xs sm:text-sm ${
                            isPast ? "text-muted-foreground" : "text-foreground"
                          }`}
                        >
                          {date.getDate()}
                        </span>
                        {entry.video && (
                          <span
                            aria-hidden
                            title="Teaching available"
                            className="mt-1 size-1.5 shrink-0 rounded-full bg-yhvh-gold"
                          />
                        )}
                      </span>

                      {/* Everything below is desktop-only — at 390px the cell is
                      too narrow for anything but the date and a marker. */}
                      <span className="mt-1 hidden w-full min-w-0 sm:block">
                        <span className="flex items-center gap-1.5">
                          <Flame
                            className="size-3 shrink-0 text-yhvh-gold-dark"
                            aria-hidden
                          />
                          <span className="font-subheading text-[0.6rem] uppercase tracking-widest text-yhvh-gold-dark">
                            Shabbat
                          </span>
                        </span>

                        <span className="mt-1 block w-full truncate font-heading text-[0.78rem] leading-tight text-foreground">
                          {entry.portion.hebrewName}
                        </span>
                        <span className="mt-0.5 block w-full truncate font-body text-[0.62rem] leading-tight text-muted-foreground">
                          {entry.portion.torahReading}
                        </span>
                        <span className="mt-1.5 block font-body text-[0.65rem] leading-tight text-yhvh-blue">
                          Shabbat Service
                          <br />
                          {SITE_CONFIG.serviceTime}
                        </span>
                      </span>

                      {/* Mobile: a dot is all that fits. */}
                      <span
                        aria-hidden
                        className="mt-auto block size-1.5 rounded-full bg-yhvh-gold-dark/60 sm:hidden"
                      />
                    </button>
                  );
                })}
              </div>

              {/* ── Legend + subscribe ──────────────────────────────── */}
              <div className="flex flex-col gap-4 border-t border-yhvh-gold/20 bg-[#fdfbf6] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                  <span className="font-subheading text-[0.65rem] uppercase tracking-[0.2em] text-yhvh-gold-dark">
                    Event Types
                  </span>
                  {EVENT_TYPES.map((type) => (
                    <span key={type.key} className="flex items-center gap-2">
                      <span
                        aria-hidden
                        className={`inline-flex size-5 items-center justify-center rounded ${type.tone}`}
                      >
                        <Flame className="size-3 text-yhvh-gold-light" />
                      </span>
                      <span className="font-body text-xs text-muted-foreground">
                        {type.label}
                      </span>
                    </span>
                  ))}
                </div>

                <a
                  href="/events/calendar.ics"
                  className="inline-flex shrink-0 items-center gap-2 rounded-md border border-yhvh-gold/40 px-4 py-2 font-subheading text-[0.65rem] uppercase tracking-widest text-yhvh-gold-dark transition-colors hover:bg-yhvh-gold/10"
                >
                  <CalendarDays className="size-3.5" aria-hidden />
                  Subscribe to Calendar
                </a>
              </div>
            </div>
          )}

          {/* ── List view ──────────────────────────────────────────── */}
          {mode === "list" && (
            <div className="overflow-hidden rounded-xl border border-yhvh-gold/25 bg-[#fdfbf6]">
              {upcomingList.length === 0 ? (
                <p className="p-8 text-center font-body text-sm text-muted-foreground">
                  No gatherings remain in this reading cycle.
                </p>
              ) : (
                <ol>
                  {upcomingList.map((entry) => (
                    <li key={entry.dateKey}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedKey(entry.dateKey);
                          setMode("month");
                          const [y, m] = entry.dateKey.split("-").map(Number);
                          setView({ year: y, month: m - 1 });
                        }}
                        className="flex w-full items-center gap-4 border-b border-yhvh-gold/12 p-4 text-left transition-colors last:border-b-0 hover:bg-yhvh-gold/[0.07]"
                      >
                        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-yhvh-gold/15 text-yhvh-gold-dark">
                          <Flame className="size-4" aria-hidden />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-heading text-base text-foreground">
                            Shabbat Service &mdash; {entry.portion.hebrewName}
                          </span>
                          <span className="mt-0.5 block font-body text-xs text-muted-foreground">
                            {shortDate(entry.dateKey)} &middot;{" "}
                            {SITE_CONFIG.serviceTime} &middot;{" "}
                            {entry.portion.torahReading}
                          </span>
                        </span>
                        {entry.video && (
                          <Play
                            aria-label="Teaching available"
                            className="size-4 shrink-0 text-yhvh-gold-dark"
                          />
                        )}
                        <ArrowRight
                          aria-hidden
                          className="size-4 shrink-0 text-yhvh-gold/60"
                        />
                      </button>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}

          <p className="mt-3 text-center font-body text-xs text-muted-foreground">
            Shabbat service every {SITE_CONFIG.serviceDay} at{" "}
            {SITE_CONFIG.serviceTime}. Dates marked with a dot have a recorded
            teaching.
          </p>

          {/* ── Detail ─────────────────────────────────────────────── */}
          {selected && (
            <EventDetail
              entry={selected}
              isPast={selected.dateKey < todayKey}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function EventDetail({
  entry,
  isPast,
}: {
  entry: CalendarEntry;
  isPast: boolean;
}) {
  const { portion, video } = entry;

  const readings = [
    { label: "Torah", value: portion.torahReading },
    { label: "Haftarah", value: portion.haftarah },
    { label: "Brit Chadashah", value: portion.britChadashah },
  ];

  const readable = new Date(`${entry.dateKey}T12:00:00`).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  );

  return (
    <article className="parchment-plate mt-8 rounded-xl p-6 sm:p-9">
      <p className="font-subheading text-xs uppercase tracking-[0.25em] text-yhvh-gold-dark">
        {readable}
      </p>

      <h3 className="mt-2 font-heading text-3xl sm:text-4xl">
        <span className="gold-leaf-text">{portion.hebrewName}</span>
      </h3>
      <p className="mt-1 font-scripture text-lg italic text-muted-foreground">
        &ldquo;{portion.name}&rdquo; &mdash; Portion {portion.number} of 54
        {portion.combined && " (combined)"}
      </p>

      <dl className="mt-6 grid gap-4 sm:grid-cols-3">
        {readings.map((reading) => (
          <div
            key={reading.label}
            className="border-t border-yhvh-gold/30 pt-3"
          >
            <dt className="font-subheading text-[0.65rem] uppercase tracking-[0.2em] text-yhvh-gold-dark">
              {reading.label}
            </dt>
            <dd className="mt-1 font-body text-sm text-foreground">
              {reading.value}
            </dd>
          </div>
        ))}
      </dl>

      {video ? (
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-7 flex flex-col gap-4 rounded-lg border border-yhvh-gold/25 p-3 transition hover:border-yhvh-gold/60 hover:bg-yhvh-gold/[0.06] sm:flex-row sm:items-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- i.ytimg.com
              is not in next.config images.remotePatterns, and adding a remote
              host for one thumbnail is not worth the config surface. */}
          <img
            src={video.thumbnail}
            alt=""
            width={320}
            height={180}
            loading="lazy"
            className="w-full rounded object-cover sm:w-44"
          />
          <span className="min-w-0">
            <span className="block font-subheading text-[0.65rem] uppercase tracking-[0.2em] text-yhvh-gold-dark">
              Watch this teaching
            </span>
            <span className="mt-1 block font-heading text-base text-foreground group-hover:underline">
              {video.title}
            </span>
          </span>
        </a>
      ) : (
        <p className="mt-7 rounded-lg border border-dashed border-yhvh-gold/30 p-4 font-body text-sm text-muted-foreground">
          {isPast
            ? "No recording has been matched to this portion yet."
            : `Join us on Shabbat at ${SITE_CONFIG.serviceTime} — the teaching will be posted here afterward.`}
        </p>
      )}
    </article>
  );
}
