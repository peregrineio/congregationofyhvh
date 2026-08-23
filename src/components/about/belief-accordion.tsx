"use client";

import { useState } from "react";
import type { DoctrinalPoint } from "@/lib/content";
import { ChevronDown } from "@/components/icons";

/**
 * The twelve doctrinal points, one open at a time.
 *
 * Collapsed by default rather than open — twelve full statements is a wall
 * of text, and the titles alone are the map someone scans first.
 */
export function BeliefAccordion({ points }: { points: DoctrinalPoint[] }) {
  const [open, setOpen] = useState<number | null>(points[0]?.number ?? null);

  return (
    <ol className="space-y-2.5">
      {points.map(point => {
        const isOpen = open === point.number;
        const panelId = `belief-panel-${point.number}`;
        const buttonId = `belief-button-${point.number}`;

        return (
          <li key={point.number} className="parchment-plate overflow-hidden rounded-xl">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : point.number)}
                className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-yhvh-gold/[0.05] sm:p-5"
              >
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-yhvh-gold font-subheading text-sm text-white">
                  {point.number}
                </span>

                <span className="flex-1">
                  <span className="block font-heading text-base text-foreground">
                    {point.title}
                  </span>
                  {point.hebrewTerm && (
                    <span className="mt-0.5 block font-subheading text-[0.65rem] uppercase tracking-widest text-yhvh-gold-dark">
                      {point.hebrewTerm}
                    </span>
                  )}
                </span>

                <ChevronDown
                  aria-hidden
                  className={`size-5 shrink-0 text-yhvh-gold-dark transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </h3>

            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className="border-t border-yhvh-gold/15 px-5 py-5 sm:pl-[4.25rem]"
              >
                <p className="font-body text-sm leading-relaxed text-muted-foreground">
                  {point.description}
                </p>

                {point.scriptures.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {point.scriptures.map(reference => (
                      <li
                        key={reference}
                        className="rounded-full border border-yhvh-gold/30 bg-yhvh-gold/[0.07] px-3 py-1 font-subheading text-[0.65rem] uppercase tracking-widest text-yhvh-gold-dark"
                      >
                        {reference}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
