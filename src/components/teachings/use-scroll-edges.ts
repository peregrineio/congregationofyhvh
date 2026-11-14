"use client";

import { useEffect, useState, type RefObject } from "react";

/** Whether a sideways box has more content to the left / right (re-checks on scroll, resize, new children). */
export function useScrollEdges(ref: RefObject<HTMLElement | null>) {
  const [edges, setEdges] = useState({ left: false, right: false, overflow: false });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const check = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const overflow = el.scrollWidth - el.clientWidth > 1;
        setEdges({ overflow, left: overflow && el.scrollLeft > 1, right: overflow && el.scrollLeft + el.clientWidth < el.scrollWidth - 1 });
      });
    };
    check();
    el.addEventListener("scroll", check, { passive: true });
    const ro = new ResizeObserver(check);
    ro.observe(el);
    for (const c of Array.from(el.children)) ro.observe(c);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", check);
      ro.disconnect();
    };
  }, [ref]);
  return edges;
}

export const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
