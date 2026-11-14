import { ArrowRight } from "@/components/icons";
import type { Series, TeachingVideo } from "@/lib/teachings-types";
import { SeriesCarousel } from "./series-carousel";

/** "FEATURED SERIES" band (mock 01): default view only. */
export function FeaturedSeries({ series, videos, onViewAll }: { series: Series; videos: Record<string, TeachingVideo>; onViewAll?: () => void }) {
  const list = series.videoIds.slice(0, 12).flatMap((id) => (videos[id] ? [videos[id]] : []));
  if (list.length === 0) return null;
  return (
    <section aria-labelledby="featured-title" className="mx-auto mt-10 grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-x-16 lg:px-8">
      <div className="min-w-0">
        <h2 id="featured-title" className="flex items-center gap-3 font-subheading text-xs font-semibold uppercase tracking-[0.3em] text-yhvh-gold-dark">
          <span aria-hidden className="h-[1.5px] w-7 bg-yhvh-gold" />
          Featured Series
        </h2>
        <p className="mt-3 font-scripture text-[40px] italic leading-[1.05] text-foreground [overflow-wrap:anywhere] lg:text-[46px]">{series.title}</p>
        {series.blurb ? <p className="mt-3 font-body text-base leading-relaxed text-warm-gray">{series.blurb}</p> : null}
        <a
          href={`/teachings?series=${series.slug}`}
          onClick={(e) => {
            if (!onViewAll) return;
            e.preventDefault();
            onViewAll();
          }}
          className="mt-5 inline-flex items-center gap-2 rounded-lg border-[1.5px] border-yhvh-gold px-5 py-2.5 font-subheading font-semibold text-yhvh-gold-dark no-underline hover:bg-yhvh-gold/10 max-sm:min-h-11"
        >
          View All in Series <ArrowRight className="size-4" aria-hidden />
        </a>
      </div>
      <SeriesCarousel title={series.title} videos={list} listId={series.isPlaylist ? series.id : undefined} />
    </section>
  );
}
