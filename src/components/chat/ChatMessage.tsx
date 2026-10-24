"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Message } from "@/lib/chat/types";

interface ChatMessageProps {
  message: Message;
  isLatest?: boolean;
  showAvatar?: boolean;
}

const LINK_CLASS = "text-yhvh-gold-dark font-medium underline underline-offset-2 hover:text-[#131a2e]";

/**
 * Parses markdown-like syntax in bot messages
 * Supports: **bold** and [link text](url)
 */
function parseMessageContent(content: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let keyIndex = 0;

  // Combined regex: bold-wrapped links must match before plain bold,
  // or **[text](url)** renders as literal brackets
  const regex = /(\*\*\[(.+?)\]\((.+?)\)\*\*)|(\*\*(.+?)\*\*)|(\[(.+?)\]\((.+?)\))/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(content.slice(lastIndex, match.index));
    }

    if (match[4]) {
      // Bold text: **text**
      parts.push(
        <strong key={`bold-${keyIndex++}`} className="font-semibold">
          {match[5]}
        </strong>
      );
    } else if (match[1] || match[6]) {
      // Link: [text](url) — optionally bold-wrapped
      const linkText = match[1] ? match[2] : match[7];
      const linkUrl = match[1] ? match[3] : match[8];
      const isInternal = linkUrl.startsWith("/");
      const isAppLink = linkUrl.startsWith("mailto:") || linkUrl.startsWith("tel:");

      if (isInternal) {
        parts.push(
          <Link key={`link-${keyIndex++}`} href={linkUrl} className={LINK_CLASS}>
            {linkText}
          </Link>
        );
      } else {
        parts.push(
          <a
            key={`link-${keyIndex++}`}
            href={linkUrl}
            {...(isAppLink ? {} : { target: "_blank", rel: "noopener noreferrer" })}
            className={LINK_CLASS}
          >
            {linkText}
          </a>
        );
      }
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [content];
}

export function ChatMessage({ message, showAvatar = false }: ChatMessageProps) {
  const isBot = message.role === "bot";

  const parsedContent = useMemo(() => {
    if (isBot) {
      // Split by newlines and parse each line
      return message.content.split("\n").map((line, i, arr) => (
        <span key={i}>
          {parseMessageContent(line)}
          {i < arr.length - 1 && <br />}
        </span>
      ));
    }
    return message.content;
  }, [message.content, isBot]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn("flex gap-2", !isBot && "justify-end")}
    >
      {/* Bot avatar — the congregation emblem */}
      {isBot && showAvatar && (
        <Image
          src="/images/emblem.png"
          alt=""
          width={32}
          height={32}
          className="size-8 flex-shrink-0 rounded-full ring-1 ring-yhvh-gold/40"
        />
      )}

      {/* Spacer when avatar not shown but it's a bot message */}
      {isBot && !showAvatar && <div className="w-8 flex-shrink-0" />}

      {/* Message bubble */}
      <div
        className={cn(
          "px-4 py-3 max-w-[85%]",
          isBot
            ? "bg-[#F7F2E8] border border-yhvh-gold/20 text-stone-800 rounded-2xl rounded-bl-md"
            : "bg-[#131a2e] text-white rounded-2xl rounded-br-md"
        )}
      >
        <div className="font-body text-sm leading-relaxed whitespace-pre-wrap">
          {parsedContent}
        </div>
      </div>
    </motion.div>
  );
}
