import { NextResponse } from "next/server";
import { SITE_CONFIG } from "@/lib/constants";
import { checkoutParams, parseGift } from "@/lib/giving";

/**
 * Start an online gift: create a Stripe Checkout Session and hand back its
 * URL. The card is entered on Stripe's page, never here.
 *
 * Needs STRIPE_SECRET_KEY. Without it every request gets 503
 * "not-configured" and the form tells people how else to give, rather than
 * pretending to take a gift it can't.
 */
export async function POST(request: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return NextResponse.json({ ok: false, reason: "not-configured" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "bad-request" }, { status: 400 });
  }
  const gift = parseGift(body);
  if ("error" in gift) {
    return NextResponse.json({ ok: false, reason: "invalid", message: gift.error }, { status: 400 });
  }

  // Return to the site the person is on (preview or production), never another host.
  const origin = new URL(request.url).origin;
  const siteUrl = /^https:\/\/([a-z0-9-]+\.)*(congregationofyhvh\.com|vercel\.app)$|^http:\/\/localhost:\d+$/.test(origin)
    ? origin
    : SITE_CONFIG.domain;

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Stripe-Version": "2024-06-20",
    },
    body: checkoutParams(gift, siteUrl),
  });
  const session = (await response.json().catch(() => null)) as { url?: string; error?: { message?: string } } | null;
  if (!response.ok || !session?.url) {
    console.error("Stripe checkout failed", response.status, session?.error?.message);
    return NextResponse.json({ ok: false, reason: "stripe-error" }, { status: 502 });
  }
  return NextResponse.json({ ok: true, url: session.url });
}
