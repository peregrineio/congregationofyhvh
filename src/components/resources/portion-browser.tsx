"use client";

import { useMemo, useState } from "react";
import type { TorahBook, TorahPortionWithDate } from "@/lib/torah-utils";
import { BOOK_NAMES } from "@/lib/torah-utils";
import { Search, ScrollText, ChevronDown } from "@/components/icons";

/**
 * The annual reading schedule, browsable.
 *
 * Fifty-four rows is too many to scan as one table, so the portions are
 * grouped by book and paged in blocks — the same way the printed schedule
 * is read. Search cuts across every book at once and drops the grouping,
 * because someone typing "Noach" does not care which book it sits in.
 */

const BOOKS: TorahBook[] = ["genesis", "exodus", "leviticus", "numbers", "deuteronomy"];

const HEBREW_BOOK_NAMES: Record<TorahBook, string> = {
  genesis: "Bereshit",
  exodus: "Shemot",
  leviticus: "Vayikra",
  numbers: "Bamidbar",
  deuteronomy: "Devarim",
};

const PAGE_SIZE = 8;

interface Props {
  portions: TorahPortionWithDate[];
  /** Hebrew name of the portion being read this week, if any. */
  currentHebrewName?: string;
}

export function PortionBrowser({ portions, currentHebrewName }: Props) {
  const [book, setBook] = useState<TorahBook>(() => {
    const current = portions.find(p => p.hebrewName === currentHebrewName);
    return current?.book ?? "genesis";
  });
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(PAGE_SIZE);

  const searching = query.trim().length > 0;

  const visible = useMemo(() => {
    if (searching) {
      const q = query.trim().toLowerCase();
      return portions.filter(p =>
        [p.name, p.hebrewName, p.torahReading, p.haftarah, p.britChadashah, p.date]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }
    return portions.filter(p => p.book === book);
  }, [portions, book, query, searching]);

  const list = searching ? visible : visible.slice(0, shown);
  const hasMore = !searching && shown < visible.length;

  function selectBook(next: TorahBook) {
    setBook(next);
    setShown(PAGE_SIZE);
  }

  return (
    <div>
      {/* Search */}
      <div className="mx-auto max-w-2xl">
        <label htmlFor="portion-search" className="sr-only">
          Search portions, dates, or readings
        </label>
        <div className="relative">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-yhvh-gold-dark/60"
          />
          <input
            id="portion-search"
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search portions, dates, or readings…"
            className="w-full rounded-lg border border-yhvh-gold/25 bg-[#fdfbf6] py-3 pl-11 pr-4 font-body text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-yhvh-gold/60 focus:outline-none focus:ring-2 focus:ring-yhvh-gold/25"
          />
        </div>
      </div>

      {/* Book tabs — hidden while searching, since results cross books */}
      {!searching && (
        <div
          role="tablist"
          aria-label="Books of the Torah"
          className="mt-8 grid gap-2 sm:grid-cols-3 lg:grid-cols-5"
        >
          {BOOKS.map(b => {
            const active = b === book;
            return (
              <button
                key={b}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => selectBook(b)}
                className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                  active
                    ? "border-transparent bg-[#131a2e] text-white"
                    : "border-yhvh-gold/25 bg-[#fdfbf6] hover:bg-yhvh-gold/[0.07]"
                }`}
              >
                <span
                  className={`block font-heading text-base ${
                    active ? "text-white" : "text-foreground"
                  }`}
                >
                  {BOOK_NAMES[b].charAt(0) + BOOK_NAMES[b].slice(1).toLowerCase()}
                </span>
                <span
                  className={`mt-0.5 block font-scripture text-sm italic ${
                    active ? "text-yhvh-gold-light" : "text-yhvh-gold-dark"
                  }`}
                >
                  {HEBREW_BOOK_NAMES[b]}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Rows */}
      {list.length === 0 ? (
        <p className="mt-10 text-center font-body text-sm text-muted-foreground">
          No portions match &ldquo;{query.trim()}&rdquo;.
        </p>
      ) : (
        <ol className="mt-8 overflow-hidden rounded-xl border border-yhvh-gold/20">
          {list.map(portion => {
            const isCurrent = portion.hebrewName === currentHebrewName;
            return (
              <li
                key={portion.number}
                className={`grid gap-3 border-b border-yhvh-gold/12 p-5 last:border-b-0 sm:grid-cols-[90px_1fr_auto] sm:items-center sm:gap-5 ${
                  isCurrent ? "bg-yhvh-gold/[0.1]" : "bg-[#fdfbf6]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className={`inline-block size-3 shrink-0 rounded-full border-2 ${
                      isCurrent
                        ? "border-yhvh-gold bg-yhvh-gold"
                        : "border-yhvh-gold/40 bg-transparent"
                    }`}
                  />
                  <span className="font-subheading text-xs uppercase tracking-widest text-muted-foreground">
                    {portion.date}
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2.5">
                    <h3 className="font-heading text-lg text-foreground">
                      {portion.hebrewName}
                    </h3>
                    <p className="font-scripture text-sm italic text-yhvh-gold-dark">
                      &ldquo;{portion.name}&rdquo;
                    </p>
                    {isCurrent && (
                      <span className="rounded-full bg-yhvh-gold px-2.5 py-0.5 font-subheading text-[0.65rem] uppercase tracking-widest text-white">
                        This week
                      </span>
                    )}
                  </div>
                  <p className="mt-1 font-body text-xs text-muted-foreground">
                    Haftarah {portion.haftarah} · Brit Chadashah {portion.britChadashah}
                  </p>
                </div>

                <p className="flex items-center gap-2 font-body text-sm text-foreground sm:justify-end">
                  <ScrollText
                    className="size-4 shrink-0 text-yhvh-gold-dark/70 sm:hidden"
                    aria-hidden
                  />
                  {portion.torahReading}
                </p>
              </li>
            );
          })}
        </ol>
      )}

      {hasMore && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setShown(n => n + PAGE_SIZE)}
            className="inline-flex items-center gap-2 rounded-md border border-yhvh-gold/40 px-6 py-2.5 font-subheading text-sm uppercase tracking-widest text-yhvh-gold-dark transition-colors hover:bg-yhvh-gold/10"
          >
            View more portions
            <ChevronDown className="size-4" aria-hidden />
          </button>
        </div>
      )}

      {/* Legend */}
      <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-yhvh-gold/15 pt-6 sm:flex-row">
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <li className="flex items-center gap-2 font-body text-xs text-muted-foreground">
            <span aria-hidden className="size-3 rounded-full bg-yhvh-gold" />
            Current week
          </li>
          <li className="flex items-center gap-2 font-body text-xs text-muted-foreground">
            <span
              aria-hidden
              className="size-3 rounded-full border-2 border-yhvh-gold/40"
            />
            Other portions
          </li>
        </ul>
        <p className="text-center font-body text-xs text-muted-foreground/70 sm:text-right">
          Dates shown are for the 2025&ndash;2026 reading cycle.
          <br className="hidden sm:block" /> The annual cycle restarts on Simchat Torah.
        </p>
      </div>
    </div>
  );
}
