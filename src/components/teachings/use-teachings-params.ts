"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { TeachingsParams } from "@/lib/teachings";

/**
 * /teachings URL state: ?series= (push, so Back returns to the previous series),
 * ?q= (replace, no history spam), ?view=all (push). Never scrolls the page.
 */
export function useTeachingsParams() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const params: TeachingsParams = useMemo(() => ({ series: sp.get("series"), q: sp.get("q"), view: sp.get("view") }), [sp]);

  const href = useCallback(
    (next: Record<string, string | null>) => {
      const u = new URLSearchParams(sp.toString());
      for (const [k, v] of Object.entries(next)) {
        if (v === null || v === "") u.delete(k);
        else u.set(k, v);
      }
      const qs = u.toString();
      return qs ? `${pathname}?${qs}` : pathname;
    },
    [sp, pathname],
  );

  const actions = useMemo(
    () => ({
      setSeries: (slug: string | null) => router.push(href({ series: slug, view: null }), { scroll: false }),
      setQuery: (q: string) => router.replace(href({ q: q.trim() || null }), { scroll: false }),
      showAll: () => router.push(href({ view: "all", series: null, q: null }), { scroll: false }),
      dropSeries: () => router.replace(href({ series: null }), { scroll: false }),
    }),
    [router, href],
  );
  return { params, ...actions };
}
