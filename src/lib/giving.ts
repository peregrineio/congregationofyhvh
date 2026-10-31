// Online giving: amounts, wording and the Stripe Checkout request.
//
// Cards are entered only on Stripe's hosted Checkout page; this site never
// sees them. Wording rules: a gift is a "freewill offering"; never "tithe",
// never claims about tax status or deductibility. The acknowledgment
// sentence goes on the Checkout page, Stripe's receipt and our own receipt.

export const ACKNOWLEDGMENT =
  "No goods or services were provided in exchange for this gift, other than intangible religious benefits.";

export const PRESETS = [25, 50, 100, 250] as const;
export const MIN_GIFT = 1;
export const MAX_GIFT = 10_000;

export type Frequency = "once" | "monthly";

export type GiftRequest = { amount: number; frequency: Frequency };

/** Parse and check what the form sent. Returns an error message instead of throwing. */
export function parseGift(body: unknown): GiftRequest | { error: string } {
  const b = (body ?? {}) as Record<string, unknown>;
  const frequency = b.frequency === "monthly" ? "monthly" : b.frequency === "once" ? "once" : null;
  if (!frequency) return { error: "Choose one-time or monthly." };
  const raw = typeof b.amount === "number" ? b.amount : typeof b.amount === "string" ? Number(b.amount.replace(/[$,\s]/g, "")) : NaN;
  if (!Number.isFinite(raw)) return { error: "Enter an amount." };
  const amount = Math.round(raw * 100) / 100;
  if (amount < MIN_GIFT) return { error: `The smallest online gift is $${MIN_GIFT}.` };
  if (amount > MAX_GIFT) return { error: `For gifts over $${MAX_GIFT.toLocaleString("en-US")}, please contact us.` };
  return { amount, frequency };
}

/** Form fields for POST https://api.stripe.com/v1/checkout/sessions. */
export function checkoutParams(gift: GiftRequest, siteUrl: string): URLSearchParams {
  const p = new URLSearchParams();
  const cents = String(Math.round(gift.amount * 100));
  const monthly = gift.frequency === "monthly";

  p.set("mode", monthly ? "subscription" : "payment");
  // Cards only: buy-now-pay-later (Affirm, Klarna) isn't for gifts, and bank
  // debits settle days later, which the ledger webhook doesn't wait for.
  p.set("payment_method_types[0]", "card");
  p.set("success_url", `${siteUrl}/give/thank-you?session_id={CHECKOUT_SESSION_ID}`);
  p.set("cancel_url", `${siteUrl}/give?canceled=1#give-online`);
  p.set("line_items[0][quantity]", "1");
  p.set("line_items[0][price_data][currency]", "usd");
  p.set("line_items[0][price_data][unit_amount]", cents);
  p.set(
    "line_items[0][price_data][product_data][name]",
    monthly ? "Monthly freewill offering, Congregation of YHVH" : "Freewill offering, Congregation of YHVH",
  );
  p.set("custom_text[submit][message]", ACKNOWLEDGMENT);
  p.set("metadata[source]", "congregationofyhvh.com/give");

  const description = `Freewill offering to the Congregation of YHVH. ${ACKNOWLEDGMENT}`;
  if (monthly) {
    p.set("line_items[0][price_data][recurring][interval]", "month");
    p.set("subscription_data[description]", description);
  } else {
    p.set("submit_type", "donate");
    p.set("payment_intent_data[description]", description);
  }
  return p;
}

export const formatUsd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: n % 1 ? 2 : 0 });
