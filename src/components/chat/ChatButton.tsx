"use client";

import { forwardRef } from "react";
import { MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
  hasUnread: boolean;
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
}

/**
 * z-[55]: above the header (z-50) so it is never hidden, below the mobile
 * nav drawer (z-[60]) so an open drawer covers it, and well below the live
 * bar (z-[70]).
 */
export const ChatButton = forwardRef<HTMLButtonElement, ChatButtonProps>(
  ({ isOpen, onClick, hasUnread }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        className={cn(
          "fixed bottom-6 right-6 z-[55]",
          "w-14 h-14 rounded-full",
          "bg-[#131a2e] text-yhvh-gold-light",
          "ring-1 ring-yhvh-gold/60",
          "flex items-center justify-center",
          "shadow-lg shadow-[#131a2e]/40",
          "hover:scale-110 transition-transform duration-200",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-yhvh-gold focus-visible:ring-offset-2"
        )}
      >
        {/* Pulse animation ring for unread messages */}
        {hasUnread && !isOpen && (
          <span className="absolute inset-0 rounded-full bg-yhvh-gold animate-ping opacity-60 motion-reduce:animate-none" />
        )}

        {/* Icon with rotation transition */}
        <span
          className={cn(
            "relative transition-transform duration-300",
            isOpen && "rotate-90"
          )}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </span>
      </button>
    );
  }
);

ChatButton.displayName = "ChatButton";
