"use client";

import { useState, forwardRef, KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(
  ({ onSend, disabled = false, placeholder = "Type a message..." }, ref) => {
    const [value, setValue] = useState("");

    const handleSend = () => {
      const trimmed = value.trim();
      if (trimmed && !disabled) {
        onSend(trimmed);
        setValue("");
      }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };

    return (
      <div className="border-t border-yhvh-gold/20 p-3 bg-white">
        <div className="flex items-center gap-2">
          <input
            ref={ref}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "flex-1 px-4 py-2.5 rounded-full border border-stone-300 bg-white",
              // 16px below sm so iOS doesn't zoom the page on focus
              "font-subheading text-base sm:text-sm text-stone-900 placeholder:text-stone-500",
              "focus:outline-none focus:ring-2 focus:ring-yhvh-gold/50 focus:border-yhvh-gold",
              "transition-all",
              disabled && "bg-stone-50 cursor-not-allowed opacity-60"
            )}
          />
          <button
            onClick={handleSend}
            disabled={disabled || !value.trim()}
            aria-label="Send message"
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              "transition-all duration-200",
              value.trim() && !disabled
                ? "bg-[#131a2e] text-yhvh-gold-light hover:bg-[#0e1220]"
                : "bg-stone-100 text-stone-400 cursor-not-allowed"
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }
);

ChatInput.displayName = "ChatInput";
