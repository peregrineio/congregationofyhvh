"use client";

import { useMemo, useState } from "react";
import type { FAQCategory, FAQItem } from "@/lib/content";
import {
  Church,
  BookOpen,
  Flame,
  Users,
  HandHeart,
  ChevronDown,
} from "@/components/icons";

/**
 * FAQ grouped by what someone is actually asking about.
 *
 * "All" leads rather than a single category, so a visitor who does not yet
 * know our vocabulary is never forced to guess which bucket their question
 * belongs to before they can read anything.
 */

const CATEGORY_ICONS: Record<FAQCategory, typeof Church> = {
  "About YHVH": Church,
  "Faith & Beliefs": BookOpen,
  "Worship & Shabbat": Flame,
  Visiting: Users,
  "Get Involved": HandHeart,
};

const CATEGORIES: FAQCategory[] = [
  "About YHVH",
  "Faith & Beliefs",
  "Worship & Shabbat",
  "Visiting",
  "Get Involved",
];

export function FaqBrowser({ items }: { items: FAQItem[] }) {
  const [category, setCategory] = useState<FAQCategory | "All">("All");
  const [open, setOpen] = useState<string | null>(items[0]?.question ?? null);

  const visible = useMemo(
    () => (category === "All" ? items : items.filter(i => i.category === category)),
    [items, category]
  );

  // Only offer a category that actually has questions behind it.
  const available = CATEGORIES.filter(c => items.some(i => i.category === c));

  return (
    <div>
      <div
        role="tablist"
        aria-label="Question categories"
        className="parchment-plate grid divide-y divide-yhvh-gold/15 rounded-xl sm:grid-cols-3 sm:divide-y-0 lg:grid-cols-6 lg:divide-x"
      >
        <button
          role="tab"
          type="button"
          aria-selected={category === "All"}
          onClick={() => setCategory("All")}
          className={`flex flex-col items-center gap-2 p-5 transition-colors hover:bg-yhvh-gold/[0.06] ${
            category === "All" ? "bg-yhvh-gold/[0.1]" : ""
          }`}
        >
          <span className="inline-flex size-11 items-center justify-center rounded-full border border-yhvh-gold/25 bg-yhvh-gold/[0.07] text-yhvh-gold-dark">
            <BookOpen className="size-5" aria-hidden />
          </span>
          <span className="font-subheading text-[0.7rem] uppercase tracking-widest text-foreground">
            All
          </span>
          <span
            aria-hidden
            className={`h-0.5 w-8 rounded-full transition-colors ${
              category === "All" ? "bg-yhvh-gold" : "bg-transparent"
            }`}
          />
        </button>

        {available.map(c => {
          const Icon = CATEGORY_ICONS[c];
          const active = category === c;
          return (
            <button
              key={c}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={() => setCategory(c)}
              className={`flex flex-col items-center gap-2 p-5 text-center transition-colors hover:bg-yhvh-gold/[0.06] ${
                active ? "bg-yhvh-gold/[0.1]" : ""
              }`}
            >
              <span className="inline-flex size-11 items-center justify-center rounded-full border border-yhvh-gold/25 bg-yhvh-gold/[0.07] text-yhvh-gold-dark">
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="font-subheading text-[0.7rem] uppercase tracking-widest text-foreground">
                {c}
              </span>
              <span
                aria-hidden
                className={`h-0.5 w-8 rounded-full transition-colors ${
                  active ? "bg-yhvh-gold" : "bg-transparent"
                }`}
              />
            </button>
          );
        })}
      </div>

      <ol className="mt-6 space-y-3">
        {visible.map((item, i) => {
          const isOpen = open === item.question;
          const panelId = `faq-panel-${i}`;
          const buttonId = `faq-button-${i}`;

          return (
            <li key={item.question} className="parchment-plate overflow-hidden rounded-xl">
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : item.question)}
                  className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-yhvh-gold/[0.05]"
                >
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-yhvh-gold font-subheading text-sm text-white">
                    {i + 1}
                  </span>
                  <span className="flex-1 font-heading text-base text-foreground md:text-lg">
                    {item.question}
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
                  className="border-t border-yhvh-gold/15 px-5 py-5 pl-[4.25rem]"
                >
                  <p className="font-body text-sm leading-relaxed text-muted-foreground">
                    {item.answer}
                  </p>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
