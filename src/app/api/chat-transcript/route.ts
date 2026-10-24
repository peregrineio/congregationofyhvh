import { NextResponse } from "next/server";
import { SITE_CONFIG } from "@/lib/constants";

/**
 * Delivers what a visitor chose to send from the chat assistant — a visit
 * notice, a prayer request, or a message — to the congregation's inbox.
 *
 * Only called when a guided flow completes. Unlike the Aeopic original,
 * anonymous conversations are never sent: people bring personal things to
 * a congregation's chat, and the widget promises nothing leaves the page
 * unless they send it.
 *
 * Shares the contact form's configuration (RESEND_API_KEY + CONTACT_FROM)
 * and its honesty rule: until both exist this returns 503 so the widget
 * tells the visitor to email instead, rather than confirming a send that
 * never happened. Visitor content is never written to logs.
 */

const MAX_MESSAGES = 60;
const MAX_CONTENT = 2000;
const MAX_FIELD = 300;

interface TranscriptMessage {
  role: "bot" | "user";
  content: string;
  timestamp: string;
}

interface LeadInfo {
  flow?: string;
  name?: string;
  contact?: string;
  visitWhen?: string;
  party?: string;
  topic?: string;
  prayer?: string;
}

interface TranscriptRequest {
  messages: TranscriptMessage[];
  page: string;
  startTime: string;
  endTime: string;
  lead?: LeadInfo;
  /** Questions the bot couldn't answer — a free knowledge-base roadmap */
  unmatched?: string[];
}

function clip(value: unknown, limit: number): string {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function cleanLead(raw: unknown): LeadInfo {
  const lead = (raw ?? {}) as Record<string, unknown>;
  return {
    flow: clip(lead.flow, 20),
    name: clip(lead.name, 80),
    contact: clip(lead.contact, 120),
    visitWhen: clip(lead.visitWhen, 60),
    party: clip(lead.party, 60),
    topic: clip(lead.topic, MAX_CONTENT),
    prayer: clip(lead.prayer, MAX_CONTENT),
  };
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "unknown";
  return date.toLocaleString("en-US", {
    timeZone: "America/Chicago",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatSubject(lead: LeadInfo): string {
  const who = lead.name || "A visitor";
  switch (lead.flow) {
    case "prayer":
      return `🙏 Prayer request — ${who}`;
    case "visit":
      return `🕯️ Planning a visit — ${who}${lead.visitWhen ? ` (${lead.visitWhen})` : ""}`;
    default:
      return `💬 Message from the website — ${who}`;
  }
}

function formatBody(data: TranscriptRequest, lead: LeadInfo): string {
  let body = "";

  if (lead.flow === "prayer") {
    body += "=== PRAYER REQUEST ===\n";
    body += `For: ${lead.name || "(not given)"}\n`;
    body += `Request:\n${lead.prayer || "(not given)"}\n\n`;
    body += lead.contact
      ? `They would like someone to reach out: ${lead.contact}\n\n`
      : "They did not ask for follow-up.\n\n";
  } else if (lead.flow === "visit") {
    body += "=== PLANNING A VISIT ===\n";
    body += `Name: ${lead.name || "(not given)"}\n`;
    if (lead.visitWhen) body += `When: ${lead.visitWhen}\n`;
    if (lead.party) body += `Coming with: ${lead.party}\n`;
    body += `Contact: ${lead.contact || "(not given)"}\n\n`;
  } else {
    body += "=== MESSAGE FOR THE CONGREGATION ===\n";
    body += `Name: ${lead.name || "(not given)"}\n`;
    body += `Contact: ${lead.contact || "(not given)"}\n`;
    if (lead.topic) body += `About: ${lead.topic}\n`;
    body += "\n";
  }

  body += `Sent from the chat assistant on ${SITE_CONFIG.domain.replace(/^https?:\/\//, "")}${clip(data.page, 200)}\n`;
  body += `Started: ${formatTimestamp(data.startTime)} (Central)\n\n---\n\n`;

  for (const msg of data.messages.slice(-MAX_MESSAGES)) {
    const role = msg.role === "bot" ? "Assistant" : "Visitor";
    body += `[${role}] ${clip(msg.content, MAX_CONTENT)}\n\n`;
  }

  const unmatched = (data.unmatched ?? []).map((q) => clip(q, MAX_FIELD)).filter(Boolean);
  if (unmatched.length > 0) {
    body += "---\n\nQUESTIONS THE ASSISTANT COULDN'T ANSWER (worth adding to its knowledge base):\n";
    for (const q of unmatched.slice(0, 20)) body += `  • ${q}\n`;
  }

  return body;
}

export async function POST(request: Request) {
  let data: TranscriptRequest;
  try {
    data = (await request.json()) as TranscriptRequest;
  } catch {
    return NextResponse.json({ ok: false, reason: "bad-request" }, { status: 400 });
  }

  if (!Array.isArray(data.messages)) {
    return NextResponse.json({ ok: false, reason: "bad-request" }, { status: 400 });
  }

  const lead = cleanLead(data.lead);
  if (!lead.contact && !lead.name && !lead.prayer) {
    return NextResponse.json({ ok: false, reason: "nothing-to-send" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM;

  if (!apiKey || !from) {
    return NextResponse.json(
      { ok: false, reason: "not-configured", email: SITE_CONFIG.email },
      { status: 503 }
    );
  }

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(lead.contact ?? "");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [SITE_CONFIG.email],
        ...(isEmail ? { reply_to: lead.contact } : {}),
        subject: `[${SITE_CONFIG.name}] ${formatSubject(lead)}`,
        text: formatBody(data, lead),
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, reason: "send-failed", email: SITE_CONFIG.email },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, reason: "send-failed", email: SITE_CONFIG.email },
      { status: 502 }
    );
  }
}
