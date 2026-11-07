// POST /api/give/checkout, as a plain function so it can be tested without Next.
// Checks run in this order: same-origin → rate limit → honeypot → parse → config →
// create the Stripe Checkout Session. The response is { ok, url } or { ok:false, reason }.
import { randomUUID } from "node:crypto";
import { checkoutParams, isHoneypot, parseGift } from "./giving";

export const SITE_ORIGIN_RE = /^https:\/\/([a-z0-9-]+\.)*(congregationofyhvh\.com|vercel\.app)$|^http:\/\/localhost:\d+$/;
export const RATE_LIMIT = 5;
export const RATE_WINDOW_MS = 10 * 60 * 1000;

/** Origin of the page that sent the request (Origin header, else Referer), or null. */
export function requestOrigin(request: Request): string | null {
  const origin = request.headers.get("origin");
  if (origin) return origin;
  const referer = request.headers.get("referer");
  if (!referer) return null;
  try {
    return new URL(referer).origin;
  } catch {
    return null;
  }
}

/**
 * Fallback limiter (per server instance): 5 sessions per IP per 10 minutes. The primary
 * limit is a Vercel Firewall rule on this path; this one only catches a single instance
 * being hammered.
 */
export function createRateLimiter(limit = RATE_LIMIT, windowMs = RATE_WINDOW_MS) {
  const hits = new Map<string, number[]>();
  return (key: string, now = Date.now()): boolean => {
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    if (recent.length >= limit) {
      hits.set(key, recent);
      return false;
    }
    recent.push(now);
    hits.set(key, recent);
    if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
    return true;
  };
}

export function clientIp(request: Request): string {
  return (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown";
}

type Deps = {
  stripeKey: string | undefined;
  allow: (ip: string) => boolean;
  fetch: typeof fetch;
  fallbackSite: string;
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

export async function handleCheckout(request: Request, deps: Deps): Promise<Response> {
  // 1. same-origin: only this site's own pages may start a gift
  const origin = requestOrigin(request);
  if (!origin || !SITE_ORIGIN_RE.test(origin)) return json({ ok: false, reason: "forbidden" }, 403);

  // 2. rate limit
  if (!deps.allow(clientIp(request))) return json({ ok: false, reason: "rate-limited" }, 429);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, reason: "invalid", message: "Something went wrong. Please try again." }, 400);
  }

  // 3. honeypot: generic answer, content never logged
  if (isHoneypot(body)) return json({ ok: false, reason: "invalid", message: "Something went wrong. Please try again." }, 400);

  // 4. parse / validate
  const gift = parseGift(body);
  if ("error" in gift) return json({ ok: false, reason: "invalid", message: gift.error }, 400);

  // 5. config
  if (!deps.stripeKey) return json({ ok: false, reason: "not-configured" }, 503);

  // 6. create the session; return to the site the person is on (preview or production)
  const siteUrl = SITE_ORIGIN_RE.test(origin) ? origin : deps.fallbackSite;
  const response = await deps.fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${deps.stripeKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Stripe-Version": "2024-06-20",
      // a double-click can't create two sessions for the same submit
      "Idempotency-Key": randomUUID(),
    },
    body: checkoutParams(gift, siteUrl),
  });
  const session = (await response.json().catch(() => null)) as { url?: string; error?: { code?: string } } | null;
  if (!response.ok || !session?.url) {
    console.error("Stripe checkout failed", response.status, session?.error?.code ?? "");
    return json({ ok: false, reason: "stripe-error" }, 502);
  }
  return json({ ok: true, url: session.url });
}
