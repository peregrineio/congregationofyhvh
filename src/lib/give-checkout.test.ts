// node --import tsx --test src/lib/give-checkout.test.ts   (npm test)
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRateLimiter, handleCheckout } from "./give-checkout";

const SITE = "https://congregationofyhvh.com";

function req(body: unknown, headers: Record<string, string> = { origin: SITE }) {
  return new Request(`${SITE}/api/give/checkout`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": "203.0.113.9", ...headers },
    body: JSON.stringify(body),
  });
}

function deps(over: Partial<Parameters<typeof handleCheckout>[1]> = {}) {
  const calls: { url: string; init: RequestInit }[] = [];
  const d = {
    stripeKey: "sk_test_dummy",
    allow: () => true,
    fallbackSite: SITE,
    fetch: (async (url: string, init: RequestInit) => {
      calls.push({ url, init });
      return new Response(JSON.stringify({ url: "https://checkout.stripe.com/c/pay/cs_test_1" }), { status: 200 });
    }) as unknown as typeof fetch,
    ...over,
  };
  return { d, calls };
}

const good = { amount: 50, frequency: "once", name: "", email: "", anonymous: false, website: "" };

test("same-origin gift → 200 with the hosted Checkout URL, idempotency key, Stripe-Version pinned", async () => {
  const { d, calls } = deps();
  const res = await handleCheckout(req(good), d);
  assert.equal(res.status, 200);
  assert.equal((await res.json()).url, "https://checkout.stripe.com/c/pay/cs_test_1");
  const h = calls[0].init.headers as Record<string, string>;
  assert.match(h["Idempotency-Key"], /^[0-9a-f-]{36}$/);
  assert.equal(h["Stripe-Version"], "2024-06-20");
  assert.equal(new URLSearchParams(String(calls[0].init.body)).get("metadata[fund]"), "GENERAL");
});

test("two submits get two different idempotency keys", async () => {
  const { d, calls } = deps();
  await handleCheckout(req(good), d);
  await handleCheckout(req(good), d);
  const k = calls.map((c) => (c.init.headers as Record<string, string>)["Idempotency-Key"]);
  assert.notEqual(k[0], k[1]);
});

test("cross-origin → 403, and Stripe is never called", async () => {
  const { d, calls } = deps();
  assert.equal((await handleCheckout(req(good, { origin: "https://evil.example" }), d)).status, 403);
  assert.equal((await handleCheckout(req(good, {}), d)).status, 403); // no Origin, no Referer
  assert.equal((await handleCheckout(req(good, { referer: `${SITE}/give` }), d)).status, 200); // Referer fallback
  assert.equal(calls.length, 1);
});

test("the 6th request from one IP within 10 minutes → 429", async () => {
  const allow = createRateLimiter();
  const { d } = deps({ allow });
  const codes = [];
  for (let i = 0; i < 6; i++) codes.push((await handleCheckout(req(good), d)).status);
  assert.deepEqual(codes, [200, 200, 200, 200, 200, 429]);
});

test("the limiter forgets hits older than the window", () => {
  const allow = createRateLimiter(5, 1000);
  for (let i = 0; i < 5; i++) assert.equal(allow("ip", 0), true);
  assert.equal(allow("ip", 500), false);
  assert.equal(allow("ip", 1001), true);
});

test("honeypot filled → 400 invalid with a generic message, Stripe never called", async () => {
  const { d, calls } = deps();
  const res = await handleCheckout(req({ ...good, website: "http://spam" }), d);
  assert.equal(res.status, 400);
  assert.equal((await res.json()).message, "Something went wrong. Please try again.");
  assert.equal(calls.length, 0);
});

test("$4.99 → 400; bad email → 400; key missing → 503 for a valid gift", async () => {
  const { d } = deps();
  assert.equal((await handleCheckout(req({ ...good, amount: 4.99 }), d)).status, 400);
  assert.equal((await handleCheckout(req({ ...good, email: "nope" }), d)).status, 400);
  assert.equal((await handleCheckout(req(good), { ...d, stripeKey: undefined })).status, 503);
});
