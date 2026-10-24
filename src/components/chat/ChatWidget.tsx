"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { ChatButton } from "./ChatButton";
import { ChatWindow } from "./ChatWindow";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { QuickReplies } from "./QuickReplies";
import { TypingIndicator } from "./TypingIndicator";
import { Teaser } from "./Teaser";
import { Message, FlowState, LeadInfo, FlowInput } from "@/lib/chat/types";
import { matchMessage, getEntryByTitle, responseFor } from "@/lib/chat/matchEngine";
import { startFlow, enterFlow, advanceFlow, getStep, interpolate } from "@/lib/chat/flows";
import { isAffirmation, wantsHuman } from "@/lib/chat/normalize";
import {
  getPageContext,
  isSuppressedPage,
  typingDuration,
  chunkResponse,
} from "@/lib/chat/pageAware";
import {
  loadChat,
  saveChat,
  getTeaserShownCount,
  incrementTeaserShownCount,
} from "@/lib/chat/memory";
import { refineSemantic, warmSemantic } from "@/lib/chat/semantic";
import { SITE_CONFIG } from "@/lib/constants";

const TEASER_SESSION_KEY = "cyhvh_teaser_session";
const PAGEVIEWS_SESSION_KEY = "cyhvh_pageviews";
const TEASER_MAX_EVER = 2;
const ENGAGEMENT_TIME_MS = 10_000;
const ENGAGEMENT_SCROLL = 0.5;

/** Chips that start a guided flow instead of answering from the KB. */
const FLOW_CHIPS: Record<string, string> = {
  "plan a visit": "visit",
  "share a prayer request": "prayer",
  "talk to someone": "human",
  "talk to a human": "human",
};

const SENT_MESSAGE: Record<string, string> = {
  prayer: "Your prayer request has been sent to the congregation. 🙏",
  visit: "Your note has been sent — the congregation will know to look out for you.",
  human: "Your message has been sent to the congregation, and someone will be in touch.",
};

export function ChatWidget() {
  const pathname = usePathname();
  const suppressed = isSuppressedPage(pathname);

  // State
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [teaserVisible, setTeaserVisible] = useState(false);
  const [flowInput, setFlowInput] = useState<FlowInput | null>(null);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatButtonRef = useRef<HTMLButtonElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const isOpenRef = useRef(false);
  const flowRef = useRef<FlowState | null>(null);
  const leadRef = useRef<LeadInfo>({});
  const unmatchedRef = useRef<string[]>([]);
  const missStreakRef = useRef(0);
  const restoredRef = useRef(false);
  const greetedRef = useRef(false);
  const bubbleQueueRef = useRef<Promise<void>>(Promise.resolve());
  const conversationRef = useRef<{ messages: Message[]; startTime: Date | null; page: string }>({
    messages: [],
    startTime: null,
    page: "",
  });

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  // ---- Message plumbing ----

  const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

  const appendMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
    conversationRef.current.messages.push(message);
    if (!conversationRef.current.startTime) {
      conversationRef.current.startTime = new Date();
      conversationRef.current.page = window.location.pathname;
    }
  }, []);

  /**
   * Queue bot bubbles: each chunk shows the typing indicator for a
   * realistic duration (Typebot formula), then lands. Quick replies ride
   * on the final bubble. `instant: true` skips typing (greetings).
   */
  const sendBotBubbles = useCallback(
    (chunks: string[], opts?: { quickReplies?: string[]; instant?: boolean }) => {
      bubbleQueueRef.current = bubbleQueueRef.current.then(async () => {
        for (let i = 0; i < chunks.length; i++) {
          const isLast = i === chunks.length - 1;
          if (!opts?.instant) {
            setIsTyping(true);
            await new Promise((r) => setTimeout(r, typingDuration(chunks[i])));
            setIsTyping(false);
          }
          appendMessage({
            id: generateId(),
            role: "bot",
            content: chunks[i],
            timestamp: new Date(),
            quickReplies: isLast ? opts?.quickReplies : undefined,
          });
          if (!isOpenRef.current) setHasUnread(true);
        }
      });
      return bubbleQueueRef.current;
    },
    [appendMessage]
  );

  // ---- Delivery ----

  /**
   * Send what the visitor chose to share. Unlike the Aeopic original there
   * is no inactivity/close/unload send of anonymous conversations — only an
   * explicit, completed flow leaves the browser. Resolves true only when
   * the congregation's inbox actually accepted it.
   */
  const sendTranscript = useCallback(async (lead: LeadInfo): Promise<boolean> => {
    const conversation = conversationRef.current;
    try {
      const response = await fetch("/api/chat-transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversation.messages.map((m) => ({
            role: m.role,
            content: m.content,
            timestamp: m.timestamp.toISOString(),
          })),
          page: conversation.page,
          startTime: (conversation.startTime ?? new Date()).toISOString(),
          endTime: new Date().toISOString(),
          lead,
          unmatched: unmatchedRef.current.length > 0 ? unmatchedRef.current : undefined,
        }),
      });
      return response.ok;
    } catch {
      return false;
    }
  }, []);

  // ---- Persistence ----

  useEffect(() => {
    if (messages.length > 0) saveChat(messages, leadRef.current);
  }, [messages]);

  // Scroll on new messages. Scroll the message list itself — the Aeopic
  // original used scrollIntoView, which also scrolls the overflow-hidden
  // dialog and pushes its header out of view once the chat grows.
  useEffect(() => {
    const container = messageContainerRef.current;
    container?.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  // ---- Greeting / restore ----

  const showGreeting = useCallback(() => {
    if (greetedRef.current) return;
    greetedRef.current = true;

    const stored = restoredRef.current ? null : loadChat();
    if (stored) {
      restoredRef.current = true;
      leadRef.current = stored.lead;
      setMessages(stored.messages);
      conversationRef.current.messages = [...stored.messages];
      conversationRef.current.startTime = new Date();
      conversationRef.current.page = pathname;
      const name = stored.lead.name;
      sendBotBubbles(
        [`Welcome back${name && name.toLowerCase() !== "anonymous" ? `, ${name}` : ""}! 👋 Pick up where we left off — or ask me something new.`],
        { quickReplies: getPageContext(pathname).quickReplies, instant: true }
      );
      return;
    }

    const ctx = getPageContext(pathname);
    sendBotBubbles([ctx.greeting], { quickReplies: ctx.quickReplies, instant: true });
  }, [pathname, sendBotBubbles]);

  // ---- Open / close ----

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setHasUnread(false);
    setTeaserVisible(false);
    showGreeting();
    warmSemantic(); // lazy-load the in-browser semantic model
    setTimeout(() => inputRef.current?.focus(), 350);
  }, [showGreeting]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    chatButtonRef.current?.focus();
  }, []);

  const handleToggle = useCallback(() => {
    if (isOpen) handleClose();
    else handleOpen();
  }, [isOpen, handleClose, handleOpen]);

  // ---- Proactive teaser (replaces auto-open) ----

  useEffect(() => {
    if (suppressed || isOpen) return;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(TEASER_SESSION_KEY)) return;
    if (getTeaserShownCount() >= TEASER_MAX_EVER) return;
    // Visitors with an existing conversation don't need a nudge
    if (loadChat()) return;

    const pageviews = Number(sessionStorage.getItem(PAGEVIEWS_SESSION_KEY) ?? "0") + 1;
    sessionStorage.setItem(PAGEVIEWS_SESSION_KEY, String(pageviews));

    let elapsed = false;
    let cancelled = false;

    const show = () => {
      if (cancelled || isOpenRef.current) return;
      sessionStorage.setItem(TEASER_SESSION_KEY, "1");
      incrementTeaserShownCount();
      setTeaserVisible(true);
    };

    const scrolledEnough = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      return scrollable <= 0 || window.scrollY / scrollable >= ENGAGEMENT_SCROLL;
    };

    const onScroll = () => {
      if (elapsed && scrolledEnough()) show();
    };

    // Trigger A: engaged time + scroll depth
    const timer = setTimeout(() => {
      elapsed = true;
      if (scrolledEnough()) show();
    }, ENGAGEMENT_TIME_MS);

    // Trigger B: second pageview this session (shorter wait, no scroll gate)
    const pageviewTimer = pageviews >= 2 ? setTimeout(show, 4000) : null;

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (pageviewTimer) clearTimeout(pageviewTimer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname, suppressed, isOpen]);

  const dismissTeaser = useCallback(() => setTeaserVisible(false), []);

  // ---- Keyboard ----

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !chatWindowRef.current) return;
    const chatWindow = chatWindowRef.current;
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = chatWindow.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    chatWindow.addEventListener("keydown", handleTabKey);
    return () => chatWindow.removeEventListener("keydown", handleTabKey);
  }, [isOpen, messages]);

  // ---- Flows ----

  const beginFlow = useCallback(
    (flowId: string) => {
      const state = startFlow(flowId);
      const opening = enterFlow(state);
      flowRef.current = opening.state;
      setFlowInput(opening.input ?? null);
      sendBotBubbles(opening.say, {
        quickReplies: opening.input?.type === "buttons" ? opening.input.options : undefined,
      });
    },
    [sendBotBubbles]
  );

  const feedFlow = useCallback(
    (answer: string) => {
      const state = flowRef.current;
      if (!state) return;
      const result = advanceFlow(state, answer);

      if ("exited" in result) {
        flowRef.current = null;
        setFlowInput(null);
        sendBotBubbles(["No problem — we can pick that up anytime. What else can I help with?"], {
          quickReplies: getPageContext(pathname).quickReplies,
        });
        return;
      }

      flowRef.current = result.state;
      setFlowInput(result.input ?? null);

      const lead = result.completedLead;
      if (lead) {
        leadRef.current = { ...leadRef.current, ...lead };
      }

      sendBotBubbles(result.say, {
        quickReplies: result.input?.type === "buttons" ? result.input.options : undefined,
      });

      if (lead) {
        // Report the real outcome — never confirm a send that didn't happen
        const delivery = sendTranscript(lead);
        bubbleQueueRef.current.then(async () => {
          const ok = await delivery;
          if (ok) {
            sendBotBubbles([SENT_MESSAGE[lead.flow ?? "human"] ?? SENT_MESSAGE.human, "Anything else I can help with?"], {
              quickReplies: getPageContext(pathname).quickReplies,
            });
          } else {
            sendBotBubbles(
              [
                `I'm sorry — I couldn't send that just now. Please reach the congregation directly at **[${SITE_CONFIG.email}](mailto:${SITE_CONFIG.email})**, or use the **[contact page](/contact)**.`,
              ],
              { quickReplies: getPageContext(pathname).quickReplies }
            );
          }
        });
      }
    },
    [pathname, sendBotBubbles, sendTranscript]
  );

  // ---- Message handling ----

  const handleSendMessage = useCallback(
    (content: string) => {
      const trimmed = content.trim();
      if (!trimmed) return;

      appendMessage({ id: generateId(), role: "user", content: trimmed, timestamp: new Date() });

      // 1. Active guided flow consumes the answer — but questions typed
      //    mid-flow must be ANSWERED, never stored as a slot value
      if (flowRef.current) {
        if (wantsHuman(trimmed) && flowRef.current.flowId !== "human") {
          flowRef.current = null;
          setFlowInput(null);
          beginFlow("human");
          return;
        }

        const step = getStep(flowRef.current);
        const looksLikeQuestion =
          !step.input?.freeText &&
          (/\?\s*$/.test(trimmed) ||
            /^(how|what|why|when|where|who|can|do|does|is|are|could|would|should|will)\b/i.test(trimmed) ||
            trimmed.split(/\s+/).length > 7);

        if (looksLikeQuestion) {
          const reAsk = interpolate(step.say[step.say.length - 1], flowRef.current.slots);
          const stepOptions = step.input?.type === "buttons" ? step.input.options : undefined;
          const result = matchMessage(trimmed, { pathname });
          if (result.tier === "strong" || result.tier === "exact") {
            sendBotBubbles(
              [...chunkResponse(result.response), `Now, back to where we were — ${reAsk}`],
              { quickReplies: stepOptions }
            );
          } else {
            sendBotBubbles(
              [`Good question — let's finish this first and someone can cover that. ${reAsk} (Or type "skip" to exit.)`],
              { quickReplies: stepOptions }
            );
          }
          return;
        }

        feedFlow(trimmed);
        return;
      }

      // 2. Human handoff must ALWAYS work
      if (wantsHuman(trimmed)) {
        missStreakRef.current = 0;
        beginFlow("human");
        return;
      }

      // 3. Affirmation → act on the bot's last suggestion
      const lastBot = conversationRef.current.messages.filter((m) => m.role === "bot").slice(-1)[0];
      if (isAffirmation(trimmed) && lastBot?.quickReplies?.length) {
        handleQuickReplyRef.current(lastBot.quickReplies[0]);
        return;
      }

      // 4. Knowledge-base match
      const result = matchMessage(trimmed, { pathname });

      if (result.tier === "fallback") {
        unmatchedRef.current.push(trimmed);
        missStreakRef.current += 1;

        // Semantic refinement: the in-browser embedding model may still
        // understand a paraphrase the lexical engine missed.
        refineSemantic(trimmed).then((semantic) => {
          if (semantic) {
            missStreakRef.current = 0;
            sendBotBubbles(
              ["I think this is what you're after — if not, just say \"talk to someone\":", ...chunkResponse(semantic.response)],
              { quickReplies: semantic.quickReplies }
            );
          } else if (missStreakRef.current >= 2) {
            missStreakRef.current = 0;
            sendBotBubbles(
              ["I'm clearly not getting this one — let me pass it to someone who can help. Want someone from the congregation to follow up?"],
              { quickReplies: ["Talk to someone", "Service times", "No thanks"] }
            );
          } else {
            sendBotBubbles(chunkResponse(result.response), { quickReplies: result.quickReplies });
          }
        });
        return;
      }

      missStreakRef.current = 0;
      sendBotBubbles(chunkResponse(result.response), { quickReplies: result.quickReplies });
    },
    [appendMessage, beginFlow, feedFlow, pathname, sendBotBubbles]
  );

  const handleQuickReply = useCallback(
    (reply: string) => {
      const lower = reply.toLowerCase();

      // Flow-starting chips
      const flowId = FLOW_CHIPS[lower];
      if (flowId) {
        appendMessage({ id: generateId(), role: "user", content: reply, timestamp: new Date() });
        beginFlow(flowId);
        return;
      }
      if (lower === "no thanks") {
        appendMessage({ id: generateId(), role: "user", content: reply, timestamp: new Date() });
        sendBotBubbles(["All good! I'm here if you need me."], {
          quickReplies: getPageContext(pathname).quickReplies,
        });
        return;
      }

      // "Did you mean…?" chips — entry titles answer directly
      const entry = getEntryByTitle(reply);
      if (entry) {
        appendMessage({ id: generateId(), role: "user", content: reply, timestamp: new Date() });
        missStreakRef.current = 0;
        sendBotBubbles(chunkResponse(responseFor(entry)), { quickReplies: entry.quickReplies });
        return;
      }

      handleSendMessage(reply);
    },
    [appendMessage, beginFlow, handleSendMessage, pathname, sendBotBubbles]
  );

  // Stable ref so handleSendMessage can dispatch affirmations without a
  // circular dependency between the two callbacks
  const handleQuickReplyRef = useRef(handleQuickReply);
  useEffect(() => {
    handleQuickReplyRef.current = handleQuickReply;
  }, [handleQuickReply]);

  // ---- Render ----

  if (suppressed) return null;

  const latestBotMessage = messages.filter((m) => m.role === "bot").slice(-1)[0];
  const quickReplies = !isTyping && latestBotMessage?.quickReplies;
  const inputPlaceholder =
    flowInput?.type === "buttons"
      ? "Pick an option above (or type it)"
      : flowInput?.placeholder ?? "Type a message...";

  return (
    <>
      <ChatWindow
        ref={chatWindowRef}
        isOpen={isOpen}
        onClose={handleClose}
        messageContainerRef={messageContainerRef}
        inputArea={
          <ChatInput
            ref={inputRef}
            onSend={handleSendMessage}
            disabled={isTyping}
            placeholder={inputPlaceholder}
          />
        }
      >
        {messages.map((message, index) => {
          const isFirstBot =
            message.role === "bot" && (index === 0 || messages[index - 1]?.role !== "bot");
          return (
            <ChatMessage
              key={message.id}
              message={message}
              showAvatar={isFirstBot}
              isLatest={index === messages.length - 1}
            />
          );
        })}
        {isTyping && <TypingIndicator />}
        {quickReplies && quickReplies.length > 0 && (
          <QuickReplies replies={quickReplies} onSelect={handleQuickReply} disabled={isTyping} />
        )}
        <div ref={messagesEndRef} />
      </ChatWindow>

      <Teaser
        visible={teaserVisible && !isOpen}
        text={getPageContext(pathname).teaser}
        onOpen={handleOpen}
        onDismiss={dismissTeaser}
      />

      <ChatButton ref={chatButtonRef} isOpen={isOpen} onClick={handleToggle} hasUnread={hasUnread} />
    </>
  );
}
