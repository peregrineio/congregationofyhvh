"use client";

import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <div className="flex gap-2">
      {/* Spacer to align with bot messages */}
      <div className="w-8 flex-shrink-0" />

      {/* Typing bubble */}
      <div className="bg-[#F7F2E8] border border-yhvh-gold/20 rounded-2xl rounded-bl-md p-4">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2 h-2 rounded-full bg-yhvh-gold-dark/60"
              animate={{
                y: [0, -6, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
