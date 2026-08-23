import { NextResponse } from "next/server";
import { SITE_CONFIG } from "@/lib/constants";

/**
 * Contact form delivery.
 *
 * The form used to call preventDefault and show a success message without
 * sending anything, so enquiries were silently discarded. This route sends
 * for real when it is configured, and — critically — reports honestly when
 * it is not, so the UI can tell someone to email directly rather than lie
 * to them.
 *
 * Configure with RESEND_API_KEY and CONTACT_FROM (a verified sending
 * address on a Resend-verified domain). Until both exist, every submission
 * returns 503 with reason "not-configured".
 */

const MAX = { name: 120, email: 200, subject: 160, message: 5000 };

interface Payload {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  /** Honeypot. Real people leave this empty; bots fill everything in. */
  website?: unknown;
}

function asString(value: unknown, limit: number): string {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, reason: "bad-request" }, { status: 400 });
  }

  // Honeypot: accept silently so a bot cannot tell it was caught.
  if (asString(body.website, 100)) {
    return NextResponse.json({ ok: true });
  }

  const name = asString(body.name, MAX.name);
  const email = asString(body.email, MAX.email);
  const subject = asString(body.subject, MAX.subject);
  const message = asString(body.message, MAX.message);

  if (!name || !email || !message) {
    return NextResponse.json({ ok: false, reason: "missing-fields" }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ ok: false, reason: "bad-email" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM;

  if (!apiKey || !from) {
    // Not an error the visitor caused. The UI turns this into "email us
    // directly" rather than a false confirmation.
    return NextResponse.json(
      { ok: false, reason: "not-configured", email: SITE_CONFIG.email },
      { status: 503 }
    );
  }

  const heading = subject || "Website enquiry";

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
        reply_to: email,
        subject: `[${SITE_CONFIG.name}] ${heading}`,
        text: [
          `From: ${name} <${email}>`,
          `Subject: ${heading}`,
          "",
          message,
        ].join("\n"),
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
