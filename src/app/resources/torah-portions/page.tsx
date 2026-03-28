"use client";

import { useState } from "react";
import { PageHero } from "@/components/ui/page-hero";
import { BookColumn } from "@/components/ui/book-column";
import {
  getCurrentPortion,
  getCurrentBook,
  getPortionsByBook,
  BOOK_NAMES,
  type TorahBook,
} from "@/lib/torah-utils";

const BOOKS: TorahBook[] = ['genesis', 'exodus', 'leviticus', 'numbers', 'deuteronomy'];

export default function TorahPortionsPage() {
  const [expandedPortion, setExpandedPortion] = useState<string | null>(null);
  const currentPortion = getCurrentPortion();
  const currentBook = getCurrentBook();

  const handlePortionClick = (hebrewName: string) => {
    // Toggle - if already expanded, collapse it
    setExpandedPortion((prev) => (prev === hebrewName ? null : hebrewName));
  };

  return (
    <>
      <PageHero
        title="Torah Portions"
        subtitle="The Annual Parashot Reading Schedule"
        scripture={{
          quote: "Your word is a lamp to my feet and a light to my path.",
          reference: "Psalm 119:105",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-16">
        {/* Intro text */}
        <div className="text-center mb-12">
          <p className="text-muted-foreground max-w-3xl mx-auto">
            The Torah is divided into 54 weekly portions (parashot) that are read throughout the year,
            completing the entire cycle from Genesis to Deuteronomy. Click any portion to see the
            complete Scripture readings.
          </p>
        </div>

        {/* 5-column grid for books */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {BOOKS.map((book) => (
            <BookColumn
              key={book}
              title={BOOK_NAMES[book]}
              portions={getPortionsByBook(book)}
              currentPortion={currentPortion}
              isCurrentBook={book === currentBook}
              expandedPortion={expandedPortion}
              onPortionClick={handlePortionClick}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary" />
            <span className="text-muted-foreground">Current Week</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-800" />
            <span className="text-muted-foreground">Book Header</span>
          </div>
        </div>

        {/* Note about cycle */}
        <p className="text-center text-xs text-muted-foreground/60 pt-8">
          Dates shown are for the 2025-2026 reading cycle. The annual cycle restarts on Simchat Torah.
          Some portions are combined in certain years.
        </p>
      </div>
    </>
  );
}
