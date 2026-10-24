"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface TeaserProps {
  visible: boolean;
  text: string;
  onOpen: () => void;
  onDismiss: () => void;
}

/**
 * Proactive nudge bubble next to the launcher. Replaces auto-opening the
 * chat window — engagement-triggered, page-aware, dismissible.
 */
export function Teaser({ visible, text, onOpen, onDismiss }: TeaserProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed bottom-24 right-6 z-[55] max-w-[260px]"
        >
          <div className="relative parchment-plate rounded-2xl rounded-br-md shadow-xl border border-yhvh-gold/40 px-4 py-3">
            <button
              onClick={onDismiss}
              aria-label="Dismiss"
              className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-[#131a2e] text-white flex items-center justify-center hover:bg-[#0e1220] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpen}
              className="text-left font-body text-sm text-stone-800 leading-snug hover:text-stone-950"
            >
              {text}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
