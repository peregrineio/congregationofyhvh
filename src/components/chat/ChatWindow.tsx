"use client";

import { forwardRef, ReactNode } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  windowRef?: React.RefObject<HTMLDivElement | null>;
  messageContainerRef?: React.RefObject<HTMLDivElement | null>;
  inputArea: ReactNode;
  children: ReactNode;
}

export const ChatWindow = forwardRef<HTMLDivElement, ChatWindowProps>(
  ({ isOpen, onClose, messageContainerRef, inputArea, children }, ref) => {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "fixed z-[55]",
              "bottom-24 right-4 sm:right-6",
              "w-[calc(100%-2rem)] sm:w-[380px]",
              "max-h-[70vh] sm:max-h-[520px]",
              "bg-[#FDFBF6] rounded-2xl shadow-2xl border border-yhvh-gold/30",
              "flex flex-col overflow-hidden"
            )}
            role="dialog"
            aria-label="Chat with the Congregation of YHVH"
          >
            {/* Header — Erev Shabbat night band, honest status line */}
            <div className="night-sky relative shrink-0 overflow-hidden">
              <div aria-hidden className="star-field absolute inset-0 opacity-50" />
              <div className="relative flex items-center justify-between gap-3 px-4 py-3 border-b border-yhvh-gold/30">
                <div className="flex items-center gap-3 min-w-0">
                  <Image
                    src="/images/emblem.png"
                    alt=""
                    width={36}
                    height={36}
                    className="size-9 shrink-0 rounded-full"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="font-heading text-sm font-bold tracking-wide text-yhvh-gold-light truncate">
                      Congregation of YHVH
                    </span>
                    <span className="font-subheading text-[11px] text-white/75">
                      Instant answers · a real person for the rest
                    </span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close chat"
                  className="p-1 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages area */}
            <div
              ref={messageContainerRef}
              aria-live="polite"
              className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4"
            >
              {children}
            </div>

            {/* Input area */}
            <div className="shrink-0">{inputArea}</div>

            {/* Trust line — must stay true: see /api/chat-transcript */}
            <p className="shrink-0 px-4 pb-2 font-subheading text-[10px] text-stone-500 text-center bg-white">
              Runs in your browser — nothing leaves this page unless you press Send.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

ChatWindow.displayName = "ChatWindow";
