/**
 * Page-aware greetings + proactive teaser copy.
 * Specific, page-matched openers outperform generic "we're here to help".
 */

export interface PageContext {
  greeting: string;
  quickReplies: string[];
  teaser: string;
}

const DEFAULT_QUICK_REPLIES = ["Service times", "Plan a visit", "Share a prayer request", "Talk to someone"];

const DEFAULT_CONTEXT: PageContext = {
  greeting:
    "Shalom! 👋 I can answer questions about Shabbat services, what we believe, and visiting — or pass a prayer request along to the congregation.",
  quickReplies: DEFAULT_QUICK_REPLIES,
  teaser: "Thinking of visiting? I can answer your questions. 🕯️",
};

const PAGE_CONTEXTS: { prefix: string; context: PageContext }[] = [
  {
    prefix: "/shabbat",
    context: {
      greeting:
        "Shabbat shalom! 🕯️ Questions about service times, what to expect, or bringing the kids? Ask away.",
      quickReplies: ["Service times", "What to expect", "Are children welcome?", "Plan a visit"],
      teaser: "First Shabbat with us? I can tell you what to expect.",
    },
  },
  {
    prefix: "/events",
    context: {
      greeting:
        "Shalom! 👋 I can tell you this week's Torah portion, when we gather, or how to watch online.",
      quickReplies: ["This week's Torah portion", "Service times", "Watch online"],
      teaser: "Want this week's Torah portion? Just ask.",
    },
  },
  {
    prefix: "/resources/torah-portions",
    context: {
      greeting: "Shalom! 👋 Looking for this week's reading? I can pull it up for you.",
      quickReplies: ["This week's Torah portion", "Watch online", "Service times"],
      teaser: "Want this week's Torah portion? Just ask.",
    },
  },
  {
    prefix: "/resources/calendar",
    context: {
      greeting: "Shalom! 👋 Questions about the appointed times or why we keep them? Ask me.",
      quickReplies: ["Biblical feasts", "Why Saturday?", "Service times"],
      teaser: "Curious about the biblical feasts? Ask me.",
    },
  },
  {
    prefix: "/resources/faq",
    context: {
      greeting: "Shalom! 👋 Didn't see your question here? Ask me — or I'll pass it to someone who knows.",
      quickReplies: ["What is a Messianic congregation?", "Do I need to be Jewish?", "Talk to someone"],
      teaser: "Didn't find your question? Ask me.",
    },
  },
  {
    prefix: "/about",
    context: {
      greeting: "Shalom! 👋 I can summarize what we believe, or connect you with someone to talk it through.",
      quickReplies: ["What we believe", "Who is Yahshua?", "Talk to someone"],
      teaser: "Questions about what we believe? Ask me.",
    },
  },
  {
    prefix: "/give",
    context: {
      greeting: "Shalom! 👋 Questions about giving? I can explain the ways to give today.",
      quickReplies: ["How to give", "Get involved", "Talk to someone"],
      teaser: "Questions about giving? Ask me.",
    },
  },
  {
    prefix: "/contact",
    context: {
      greeting: "Shalom! 👋 I can answer quick questions here, or pass a message or prayer request along.",
      quickReplies: ["Talk to someone", "Share a prayer request", "Get directions"],
      teaser: "Prefer to chat? I can pass a message along.",
    },
  },
];

/** Pages where the widget should stay completely out of the way. */
const SUPPRESSED_PREFIXES: string[] = [];

export function isSuppressedPage(pathname: string): boolean {
  return SUPPRESSED_PREFIXES.some((p) => pathname.startsWith(p));
}

export function getPageContext(pathname: string): PageContext {
  const match = PAGE_CONTEXTS.find(({ prefix }) => pathname.startsWith(prefix));
  return match?.context ?? DEFAULT_CONTEXT;
}

// ---- Typing timing (Typebot's shipped formula) ----

const WPM = 400;
const MIN_TYPING_MS = 500;
const MAX_TYPING_MS = 3000;

/** wordCount / 400wpm, clamped to [500ms, 3000ms]. */
export function typingDuration(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  const ms = (words / WPM) * 60_000;
  return Math.min(MAX_TYPING_MS, Math.max(MIN_TYPING_MS, ms));
}

/** Split a response into sequential bubbles on blank lines (max 3 chunks). */
export function chunkResponse(text: string): string[] {
  const parts = text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  if (parts.length <= 3) return parts.length > 0 ? parts : [text];
  // Re-merge the tail so long answers don't become a bubble flood
  return [parts[0], parts[1], parts.slice(2).join("\n\n")];
}
