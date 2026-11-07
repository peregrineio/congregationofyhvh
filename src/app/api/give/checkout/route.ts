import { SITE_CONFIG } from "@/lib/constants";
import { createRateLimiter, handleCheckout } from "@/lib/give-checkout";

export const runtime = "nodejs";

const allow = createRateLimiter();

/**
 * Start an online gift: create a Stripe Checkout Session and hand back its
 * URL. The card is entered on Stripe's page, never here.
 *
 * Same-origin only, rate-limited, honeypot-checked (see src/lib/give-checkout.ts).
 * Without STRIPE_SECRET_KEY valid requests get 503 "not-configured" and the
 * form tells people how else to give, rather than pretending to take a gift it can't.
 */
export async function POST(request: Request) {
  return handleCheckout(request, {
    stripeKey: process.env.STRIPE_SECRET_KEY,
    allow,
    fetch,
    fallbackSite: SITE_CONFIG.domain,
  });
}
