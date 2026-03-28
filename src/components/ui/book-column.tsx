"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TorahPortionWithDate } from "@/lib/torah-utils";

interface BookColumnProps {
  title: string;
  portions: TorahPortionWithDate[];
  currentPortion: string;
  isCurrentBook: boolean;
  expandedPortion: string | null;
  onPortionClick: (hebrewName: string) => void;
}

export function BookColumn({
  title,
  portions,
  currentPortion,
  isCurrentBook,
  expandedPortion,
  onPortionClick,
}: BookColumnProps) {
  return (
    <div className="flex flex-col rounded-lg overflow-hidden shadow-sm border border-border/30">
      {/* Book Header */}
      <div
        className={cn(
          "py-3 px-4 text-white font-semibold text-sm tracking-wider text-center",
          isCurrentBook ? "bg-primary" : "bg-gray-800"
        )}
      >
        {title}
      </div>

      {/* Portions List */}
      <div className="flex flex-col bg-card">
        {portions.map((portion) => {
          const isCurrent = portion.hebrewName === currentPortion;
          const isExpanded = portion.hebrewName === expandedPortion;

          return (
            <div key={portion.number} className="border-b border-border/20 last:border-b-0">
              {/* Portion Row - Clickable */}
              <button
                onClick={() => onPortionClick(portion.hebrewName)}
                className={cn(
                  "w-full flex justify-between items-center px-4 py-3 text-left transition-all duration-200",
                  "cursor-pointer hover:bg-muted",
                  isCurrent && "bg-primary text-primary-foreground hover:bg-primary/90",
                  isExpanded && !isCurrent && "bg-primary/10"
                )}
              >
                <div className="flex items-center gap-2">
                  {/* Chevron indicator */}
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      isCurrent ? "text-primary-foreground/70" : "text-muted-foreground",
                      isExpanded && "rotate-180"
                    )}
                  />
                  <span
                    className={cn(
                      "font-medium text-sm uppercase tracking-wide",
                      isCurrent ? "text-primary-foreground" : "text-foreground"
                    )}
                  >
                    {portion.hebrewName}
                  </span>
                </div>
                <span
                  className={cn(
                    "text-xs whitespace-nowrap ml-2",
                    isCurrent ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}
                >
                  {portion.date}
                </span>
              </button>

              {/* Expanded Details Panel */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <PortionDetails portion={portion} isCurrent={isCurrent} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PortionDetails({
  portion,
  isCurrent,
}: {
  portion: TorahPortionWithDate;
  isCurrent: boolean;
}) {
  return (
    <div
      className={cn(
        "px-4 py-4 border-b border-border/20",
        isCurrent ? "bg-primary/90 text-white" : "bg-blue-50"
      )}
    >
      {/* Portion Name */}
      <p
        className={cn(
          "text-xs uppercase tracking-wider mb-4",
          isCurrent ? "text-primary-foreground/70" : "text-gray-500"
        )}
      >
        &ldquo;{portion.name}&rdquo; &mdash; Portion {portion.number}
      </p>

      {/* Readings - Stack vertically */}
      <div className="space-y-3 text-sm">
        {/* Torah */}
        <div>
          <p
            className={cn(
              "font-semibold text-xs uppercase tracking-wide",
              isCurrent ? "text-primary-foreground/80" : "text-gray-600"
            )}
          >
            TORAH
          </p>
          <p className={isCurrent ? "text-white" : "text-gray-800"}>
            {portion.torahReading}
          </p>
        </div>

        {/* Haftarah */}
        <div>
          <p
            className={cn(
              "font-semibold text-xs uppercase tracking-wide",
              isCurrent ? "text-primary-foreground/80" : "text-gray-600"
            )}
          >
            HAFTARAH
          </p>
          <p className={isCurrent ? "text-white" : "text-gray-800"}>
            {portion.haftarah}
          </p>
        </div>

        {/* Brit Chadashah */}
        <div>
          <p
            className={cn(
              "font-semibold text-xs uppercase tracking-wide",
              isCurrent ? "text-primary-foreground/80" : "text-gray-600"
            )}
          >
            BRIT CHADASHAH
          </p>
          <p className={isCurrent ? "text-white" : "text-gray-800"}>
            {portion.britChadashah}
          </p>
        </div>
      </div>
    </div>
  );
}
