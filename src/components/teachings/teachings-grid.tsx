"use client";

import { useEffect, useRef, useState } from "react";
import type { TeachingVideo } from "@/lib/teachings-types";
import { TeachingCard } from "./teaching-card";

/** The Latest Teachings grid: 3 across at lg, 2 at sm, 1 on phones; "Load more" adds 12. */
export function TeachingsGrid({ ids, videos, initialPageSize, listId }: { ids: string[]; videos: Record<string, TeachingVideo>; initialPageSize: number; listId?: string }) {
  const [shown, setShown] = useState(initialPageSize);
  const firstNew = useRef<number | null>(null);
  const list = useRef<HTMLUListElement>(null);
  useEffect(() => {
    if (firstNew.current === null) return;
    list.current?.querySelectorAll<HTMLElement>("li > a")[firstNew.current]?.focus();
    firstNew.current = null;
  }, [shown]);
  const visible = ids.slice(0, shown);
  return (
    <>
      <ul ref={list} className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((id) =>
          videos[id] ? (
            <li key={id} className="flex min-w-0">
              <TeachingCard video={videos[id]} listId={listId} className="w-full" />
            </li>
          ) : null,
        )}
      </ul>
      {shown < ids.length ? (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => {
              firstNew.current = shown;
              setShown((n) => n + 12);
            }}
            className="inline-flex min-h-11 items-center rounded-lg border-[1.5px] border-yhvh-gold px-6 font-subheading font-semibold text-yhvh-gold-dark hover:bg-yhvh-gold/10"
          >
            Load more
          </button>
        </div>
      ) : null}
    </>
  );
}
