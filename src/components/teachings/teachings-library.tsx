"use client";

import { useEffect, useRef } from "react";
import { Youtube } from "@/components/icons";
import { GoldButton } from "@/components/ui/gold-button";
import { selectView, type TeachingsParams } from "@/lib/teachings";
import type { TeachingsLibrary } from "@/lib/teachings-types";
import { FeaturedSeries } from "./featured-series";
import { SectionRuleHeader } from "./section-rule-header";
import { SeriesArches } from "./series-arches";
import { TeachingsGrid } from "./teachings-grid";
import { TeachingsHero } from "./teachings-hero";
import { useTeachingsParams } from "./use-teachings-params";
import { prefersReducedMotion } from "./use-scroll-edges";

// Same constant as lib/youtube (that module is server-only by convention; the URL is public).
const CHANNEL_URL = "https://www.youtube.com/@CongregationofYHVH";

type Actions = {
  setSeries: (slug: string | null) => void;
  setQuery: (q: string) => void;
  showAll: () => void;
};

/** The interactive page: reads ?series= ?q= ?view= and filters the server-rendered library in memory. */
export function TeachingsLibraryClient({ library }: { library: TeachingsLibrary }) {
  const { params, setSeries, setQuery, showAll, dropSeries } = useTeachingsParams();
  const unknown = selectView(library, params).unknownSlug;
  // a ?series= that matches nothing is dropped (the All view shows)
  useEffect(() => {
    if (unknown) dropSeries();
  }, [unknown, dropSeries]);
  return <TeachingsLibraryView library={library} params={params} actions={{ setSeries, setQuery, showAll }} />;
}

/** Presentational, shared by the Suspense fallback (default view, links only) and the client. */
export function TeachingsLibraryView({ library, params, actions }: { library: TeachingsLibrary; params: TeachingsParams; actions?: Actions }) {
  const model = selectView(library, params);
  const grid = useRef<HTMLElement>(null);
  const featured = library.featuredSlug ? library.series.find((s) => s.slug === library.featuredSlug) : undefined;
  const toGrid = () => requestAnimationFrame(() => grid.current?.scrollIntoView({ block: "start", behavior: prefersReducedMotion() ? "auto" : "smooth" }));
  const pickSeries = (slug: string | null) => {
    actions?.setSeries(slug);
    toGrid();
  };

  if (library.source === "none")
    return (
      <>
        <TeachingsHero series={[]} query="" showControls={false} />
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <section className="parchment-plate -mt-12 rounded-xl p-9 text-center">
            <h2 className="font-heading text-2xl text-foreground">Teachings are on YouTube</h2>
            <p className="mt-3 font-body text-muted-foreground">We couldn&apos;t load the video list just now. Every teaching is on our channel.</p>
            <a href={CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block">
              <GoldButton>Open our YouTube channel</GoldButton>
            </a>
          </section>
        </div>
      </>
    );

  return (
    <>
      <TeachingsHero series={library.series} query={params.q ?? ""} activeSlug={model.activeSlug} showControls onQuery={actions?.setQuery} onSeries={actions ? pickSeries : undefined} />
      <SeriesArches series={library.series} allCount={library.allIds.length} activeSlug={model.activeSlug} onSelect={actions?.setSeries} />

      {model.showFeatured && featured ? <FeaturedSeries series={featured} videos={library.videos} onViewAll={actions ? () => pickSeries(featured.slug) : undefined} /> : null}

      <section ref={grid} aria-labelledby="teachings-grid-title" className="mx-auto mt-14 max-w-7xl scroll-mt-36 px-4 sm:px-6 lg:px-8">
        <div className="border-t border-yhvh-gold/15 pt-10">
          <span id="teachings-grid-title" className="contents">
            <SectionRuleHeader title={model.heading} actionLabel="View All Teachings" actionHref="/teachings?view=all" onAction={actions?.showAll} />
          </span>
        </div>
        <p aria-live="polite" className="sr-only">
          {model.ids.length} {model.ids.length === 1 ? "teaching" : "teachings"}
        </p>
        {model.ids.length ? (
          <TeachingsGrid key={`${model.heading}|${model.ids.length}`} ids={model.ids} videos={library.videos} initialPageSize={model.initialPageSize} listId={model.listId} />
        ) : (
          <div className="parchment-plate mt-6 rounded-xl p-8 text-center">
            <p className="font-body text-lg text-foreground">No teachings match “{(params.q ?? "").trim()}”.</p>
            <button
              type="button"
              onClick={() => actions?.setQuery("")}
              className="mt-4 inline-flex min-h-11 items-center rounded-lg border-[1.5px] border-yhvh-gold px-5 font-subheading font-semibold text-yhvh-gold-dark hover:bg-yhvh-gold/10"
            >
              Clear search
            </button>
          </div>
        )}
        <p className="mt-12 text-center">
          <a href={CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 font-subheading font-semibold text-yhvh-gold-dark underline decoration-yhvh-gold/50 underline-offset-[6px]">
            <Youtube className="size-5" aria-hidden /> Subscribe on YouTube
          </a>
        </p>
      </section>
    </>
  );
}
