/** /teachings skeleton (blueprint §3.6): hero block, 6 arch outlines, 6 card skeletons. */
export default function Loading() {
  return (
    <div className="teachings-page bg-soft-cream pb-20" aria-busy="true" aria-label="Loading teachings">
      <div className="h-[420px] animate-pulse bg-warm-black/20 motion-reduce:animate-none sm:h-[520px]" />
      <div className="mx-auto -mt-20 flex max-w-7xl gap-3 overflow-hidden px-4 sm:-mt-24 sm:px-6 lg:px-8">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="arch-frame h-[160px] w-[132px] shrink-0 animate-pulse border border-yhvh-gold/30 bg-warm-black/15 motion-reduce:animate-none sm:h-[190px] sm:w-44" />
        ))}
      </div>
      <div className="mx-auto mt-14 grid max-w-7xl gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="parchment-plate overflow-hidden rounded-xl">
            <div className="aspect-video animate-pulse bg-warm-sand motion-reduce:animate-none" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-4/5 animate-pulse rounded bg-warm-sand motion-reduce:animate-none" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-warm-sand motion-reduce:animate-none" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
