"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface QuickRepliesProps {
  replies: string[];
  onSelect: (reply: string) => void;
  disabled?: boolean;
}

export function QuickReplies({ replies, onSelect, disabled = false }: QuickRepliesProps) {
  if (!replies || replies.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.3 }}
      className="flex flex-wrap gap-2 mt-3 ml-10"
    >
      {replies.map((reply, index) => (
        <button
          key={index}
          onClick={() => !disabled && onSelect(reply)}
          disabled={disabled}
          className={cn(
            "px-3 py-1.5 rounded-full font-subheading text-sm bg-white",
            "border border-yhvh-gold/50 text-yhvh-gold-dark",
            "transition-all duration-200",
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[#131a2e] hover:text-yhvh-gold-light hover:border-[#131a2e] cursor-pointer"
          )}
        >
          {reply}
        </button>
      ))}
    </motion.div>
  );
}
