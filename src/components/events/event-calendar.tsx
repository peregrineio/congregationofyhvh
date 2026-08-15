"use client";

import { useMemo, useState } from "react";
import type { TorahPortionWithDate } from "@/lib/torah-utils";
import { toDateKey } from "@/lib/torah-utils";
import { SITE_CONFIG } from "@/lib/constants";

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
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function monthKey(year: number, month: number) {
  return year * 12 + month;
}

export function EventCalendar({ entries, todayKey }: EventCalendarProps) {
  const byDate = useMemo(
    () => new Map(entries.map(entry => [entry.dateKey, entry])),
    [entries],
  );

  // Navigation is clamped to the reading cycle -- there is nothing to show
  // outside it, and letting someone page into 2031 looks broken.
  const bounds = useMemo(() => {
    const keys = entries.map(entry => entry.dateKey).sort();
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
    const upcoming = entries.find(entry => entry.dateKey >= todayKey) ?? entries[0];
    const [year, month] = (upcoming?.dateKey ?? todayKey).split("-").map(Number);
    return { year, month: month - 1 };
  }, [entries, todayKey]);

  const [view, setView] = useState(initial);
  const [selectedKey, setSelectedKey] = useState<string | null>(() => {
    const upcoming = entries.find(entry => entry.dateKey >= todayKey);
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

  const grid = useMemo(() => {
    const firstOfMonth = new Date(view.year, view.month, 1);
    const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
    const leadingBlanks = firstOfMonth.getDay();

    const cells: (Date | null)[] = Array(leadingBlanks).fill(null);
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push(new Date(view.year, view.month, day));
    }
    while (cells.length % 7 !== 0) cells.push(null);

    return cells;
  }, [view]);

  const selected = selectedKey ? byDate.get(selectedKey) : undefined;

  return (
    <div className="mx-auto max-w-5xl">
      {/* ---- Month header ---- */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          disabled={!canGoBack}
          aria-label="Previous month"
          className="rounded-full border border-[#d8cbb0] px-4 py-2 text-sm tracking-widest text-[#6b5a3e] transition hover:bg-[#f5efe2] disabled:cursor-not-allowed disabled:opacity-30"
        >
          &larr;
        </button>

        <h2 className="font-heading text-2xl tracking-wide sm:text-3xl">
          <span className="gold-leaf-text">{MONTHS[view.month]}</span>{" "}
          <span className="text-[#8a7a5c]">{view.year}</span>
        </h2>

        <button
          type="button"
          onClick={() => shiftMonth(1)}
          disabled={!canGoForward}
          aria-label="Next month"
          className="rounded-full border border-[#d8cbb0] px-4 py-2 text-sm tracking-widest text-[#6b5a3e] transition hover:bg-[#f5efe2] disabled:cursor-not-allowed disabled:opacity-30"
        >
          &rarr;
        </button>
      </div>

      {/* ---- Grid ---- */}
      <div className="parchment-plate scribe-lines overflow-hidden rounded-lg p-3 sm:p-5">
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {WEEKDAYS.map(day => (
            <div
              key={day}
              className="pb-2 text-center text-[0.65rem] uppercase tracking-[0.2em] text-[#8a7a5c] sm:text-xs"
            >
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day[0]}</span>
            </div>
          ))}

          {grid.map((date, index) => {
            if (!date) return <div key={`blank-${index}`} aria-hidden />;

            const key = toDateKey(date);
            const entry = byDate.get(key);
            const isToday = key === todayKey;
            const isSelected = key === selectedKey;
            const isPast = key < todayKey;

            if (!entry) {
              return (
                <div
                  key={key}
                  className={`flex min-h-[3rem] items-start justify-end rounded p-1.5 text-xs sm:min-h-[5.5rem] sm:p-2 sm:text-sm ${
                    isToday ? "ring-1 ring-[#b8974a]" : ""
                  } ${isPast ? "text-[#b9ad95]" : "text-[#6b5a3e]"}`}
                >
                  {date.getDate()}
                </div>
              );
            }

            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedKey(key)}
                aria-pressed={isSelected}
                aria-label={`${MONTHS[view.month]} ${date.getDate()} — Torah portion ${entry.portion.hebrewName}`}
                className={`gate-row group flex min-h-[3rem] flex-col items-start rounded border p-1.5 text-left transition sm:min-h-[5.5rem] sm:p-2 ${
                  isSelected
                    ? "border-[#b8974a] bg-[#f7f0df] shadow-sm"
                    : "border-[#e3d8c0] hover:border-[#b8974a] hover:bg-[#faf6ec]"
                } ${isToday ? "ring-1 ring-[#b8974a]" : ""}`}
              >
                <span className="flex w-full items-center justify-between">
                  <span
                    className={`text-xs sm:text-sm ${isPast ? "text-[#b9ad95]" : "text-[#4a3f2a]"}`}
                  >
                    {date.getDate()}
                  </span>
                  {entry.video && (
                    <span
                      aria-hidden
                      title="Teaching available"
                      className="h-1.5 w-1.5 rounded-full bg-[#b8974a]"
                    />
                  )}
                </span>

                <span className="mt-auto hidden w-full truncate font-heading text-[0.7rem] leading-tight text-[#7a6a48] sm:block">
                  {entry.portion.hebrewName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-[#8a7a5c]">
        Shabbat service every {SITE_CONFIG.serviceDay} at {SITE_CONFIG.serviceTime}.
        Dates marked with a dot have a recorded teaching.
      </p>

      {/* ---- Detail ---- */}
      {selected && <EventDetail entry={selected} isPast={selected.dateKey < todayKey} />}
    </div>
  );
}

function EventDetail({ entry, isPast }: { entry: CalendarEntry; isPast: boolean }) {
  const { portion, video } = entry;

  const readings = [
    { label: "Torah", value: portion.torahReading },
    { label: "Haftarah", value: portion.haftarah },
    { label: "Brit Chadashah", value: portion.britChadashah },
  ];

  const readable = new Date(`${entry.dateKey}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="parchment-plate mt-8 rounded-lg p-6 sm:p-9">
      <p className="text-xs uppercase tracking-[0.25em] text-[#8a7a5c]">{readable}</p>

      <h3 className="mt-2 font-heading text-3xl sm:text-4xl">
        <span className="gold-leaf-text">{portion.hebrewName}</span>
      </h3>
      <p className="mt-1 font-heading text-lg text-[#6b5a3e]">
        &ldquo;{portion.name}&rdquo; &mdash; Portion {portion.number} of 54
        {portion.combined && " (combined)"}
      </p>

      <dl className="mt-6 grid gap-4 sm:grid-cols-3">
        {readings.map(reading => (
          <div key={reading.label} className="border-t border-[#d8cbb0] pt-3">
            <dt className="text-[0.65rem] uppercase tracking-[0.2em] text-[#8a7a5c]">
              {reading.label}
            </dt>
            <dd className="mt-1 text-sm text-[#4a3f2a]">{reading.value}</dd>
          </div>
        ))}
      </dl>

      {video ? (
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-7 flex flex-col gap-4 rounded border border-[#e3d8c0] p-3 transition hover:border-[#b8974a] hover:bg-[#faf6ec] sm:flex-row sm:items-center"
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
            <span className="block text-[0.65rem] uppercase tracking-[0.2em] text-[#8a7a5c]">
              Watch this teaching
            </span>
            <span className="mt-1 block font-heading text-base text-[#4a3f2a] group-hover:underline">
              {video.title}
            </span>
          </span>
        </a>
      ) : (
        <p className="mt-7 rounded border border-dashed border-[#d8cbb0] p-4 text-sm text-[#8a7a5c]">
          {isPast
            ? "No recording has been matched to this portion yet."
            : `Join us on Shabbat at ${SITE_CONFIG.serviceTime} — the teaching will be posted here afterward.`}
        </p>
      )}
    </article>
  );
}
