import { Message, LeadInfo } from "./types";

/**
 * localStorage conversation memory — 7-day expiry.
 * Stores messages, captured lead slots, and teaser frequency caps.
 */

const STORAGE_KEY = "cyhvh_chat_v1";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_STORED_MESSAGES = 40;

interface StoredChat {
  messages: { id: string; role: "bot" | "user"; content: string; timestamp: string; quickReplies?: string[] }[];
  lead: LeadInfo;
  savedAt: number;
  teaserShownCount: number;
}

function safeParse(): StoredChat | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredChat;
    if (Date.now() - parsed.savedAt > MAX_AGE_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function loadChat(): { messages: Message[]; lead: LeadInfo } | null {
  const stored = safeParse();
  if (!stored || stored.messages.length === 0) return null;
  return {
    messages: stored.messages.map((m) => ({ ...m, timestamp: new Date(m.timestamp) })),
    lead: stored.lead ?? {},
  };
}

export function saveChat(messages: Message[], lead: LeadInfo): void {
  if (typeof window === "undefined") return;
  try {
    const prev = safeParse();
    const stored: StoredChat = {
      messages: messages.slice(-MAX_STORED_MESSAGES).map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: m.timestamp.toISOString(),
        quickReplies: m.quickReplies,
      })),
      lead,
      savedAt: Date.now(),
      teaserShownCount: prev?.teaserShownCount ?? 0,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Storage full / privacy mode — chat still works, just won't persist
  }
}

export function getTeaserShownCount(): number {
  return safeParse()?.teaserShownCount ?? 0;
}

export function incrementTeaserShownCount(): void {
  if (typeof window === "undefined") return;
  try {
    const prev = safeParse() ?? { messages: [], lead: {}, savedAt: Date.now(), teaserShownCount: 0 };
    prev.teaserShownCount += 1;
    prev.savedAt = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prev));
  } catch {
    // ignore
  }
}
