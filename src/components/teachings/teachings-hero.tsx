"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search, X } from "@/components/icons";
import type { Series } from "@/lib/teachings-types";

const GROUP_LABEL = { torah: "Torah Portions", teacher: "Teachers", spanish: "En Español", topic: "Topics" } as const;

/**
 * "Teachings Library" hero (mock 01): photoreal art (the existing hero poster), a warm
 * scrim, the title, a subline, and the search + series row. No generated or drawn art.
 */
export function TeachingsHero({
  series,
  query,
  activeSlug,
  showControls,
  onQuery,
  onSeries,
}: {
  series: Series[];
  query: string;
  activeSlug?: string;
  showControls: boolean;
  onQuery?: (q: string) => void;
  onSeries?: (slug: string | null) => void;
}) {
  return (
    <section className="relative isolate overflow-hidden">
      <picture className="absolute inset-0 -z-20">
        <source media="(max-width: 639px)" srcSet="/images/hero-poster-mobile.jpg" />
        <img src="/images/hero-poster.jpg" alt="" fetchPriority="high" className="size-full object-cover" />
      </picture>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(26,24,20,0.55)_100%)]" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-warm-black/55 via-warm-black/35 to-soft-cream" />
      <div className="mx-auto max-w-5xl px-4 pb-28 pt-14 text-center sm:px-6 sm:pb-32 sm:pt-20 lg:min-h-[520px]">
        <h1 className="font-heading text-[36px] leading-[1.08] text-[#FEFDFB] [text-shadow:0_2px_18px_rgba(26,24,20,.45)] sm:text-5xl lg:text-[60px]">Teachings Library</h1>
        <p className="mx-auto mt-4 max-w-2xl font-body text-lg leading-relaxed text-white/90 [text-shadow:0_1px_10px_rgba(26,24,20,.45)] sm:text-xl">
          Every Shabbat teaching from our congregation, gathered by series. Study the Word with us, any day of the week.
        </p>
        {showControls ? (
          <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row sm:justify-center">
            <TeachingsSearch query={query} onQuery={onQuery} />
            <SeriesSelect series={series} activeSlug={activeSlug} onSeries={onSeries} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

function TeachingsSearch({ query, onQuery }: { query: string; onQuery?: (q: string) => void }) {
  const [draft, setDraft] = useState(query);
  const [synced, setSynced] = useState(query);
  const input = useRef<HTMLInputElement>(null);
  const typed = useRef(false);
  // the URL changed from elsewhere (Clear search, an arch): show it
  if (query !== synced) {
    setSynced(query);
    setDraft(query);
  }
  useEffect(() => {
    if (!typed.current || !onQuery) return;
    const t = setTimeout(() => onQuery(draft), 200);
    return () => clearTimeout(t);
  }, [draft, onQuery]);

  const clear = () => {
    typed.current = false;
    setDraft("");
    onQuery?.("");
    input.current?.focus();
  };
  return (
    <form role="search" onSubmit={(e) => e.preventDefault()} className="relative min-w-0 flex-1 sm:max-w-[460px]">
      <label htmlFor="teachings-search" className="sr-only">
        Search teachings
      </label>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-warm-gray" aria-hidden />
      <input
        ref={input}
        id="teachings-search"
        type="search"
        value={draft}
        placeholder="Search teachings…"
        autoComplete="off"
        onChange={(e) => {
          typed.current = true;
          setDraft(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape" && draft) {
            e.preventDefault();
            clear();
          }
        }}
        className="h-12 w-full rounded-lg border border-white/60 bg-warm-white/95 pl-11 pr-12 font-ui text-base text-foreground shadow-sm placeholder:text-warm-gray focus:outline-none focus-visible:ring-2 focus-visible:ring-yhvh-gold [&::-webkit-search-cancel-button]:appearance-none"
      />
      {draft ? (
        <button type="button" aria-label="Clear search" onClick={clear} className="absolute right-1 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-md text-warm-gray hover:text-foreground max-sm:size-11">
          <X className="size-4" aria-hidden />
        </button>
      ) : null}
    </form>
  );
}

function SeriesSelect({ series, activeSlug, onSeries }: { series: Series[]; activeSlug?: string; onSeries?: (slug: string | null) => void }) {
  const groups = (Object.keys(GROUP_LABEL) as (keyof typeof GROUP_LABEL)[]).map((g) => ({ g, items: series.filter((s) => s.group === g) })).filter((x) => x.items.length);
  return (
    <label className="relative block sm:w-[180px]">
      <span className="sr-only">Series</span>
      <select
        aria-label="Series"
        value={activeSlug ?? ""}
        onChange={(e) => onSeries?.(e.target.value || null)}
        className="h-12 w-full appearance-none rounded-lg border border-white/60 bg-warm-white/95 pl-4 pr-10 font-ui text-base text-foreground shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-yhvh-gold"
      >
        <option value="">All Series</option>
        {groups.map(({ g, items }) => (
          <optgroup key={g} label={GROUP_LABEL[g]}>
            {items.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.title} ({s.count})
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-warm-gray" aria-hidden />
    </label>
  );
}
