// node --import tsx --test src/lib/giving.test.ts   (npm test)
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { ACKNOWLEDGMENT, checkoutParams, isHoneypot, parseGift, type GiftRequest } from "./giving";

const gift = (g: Partial<GiftRequest> = {}): GiftRequest => ({ amount: 50, frequency: "once", anonymous: false, ...g });

test("presets and other amounts are accepted; cents are kept", () => {
  assert.deepEqual(parseGift({ amount: 50, frequency: "once" }), { amount: 50, frequency: "once", anonymous: false });
  assert.deepEqual(parseGift({ amount: "$1,234.567", frequency: "monthly" }), { amount: 1234.57, frequency: "monthly", anonymous: false });
});

test("$5 to $10,000: $5 accepted, $4.99 and $10,000.01 refused", () => {
  assert.ok(!("error" in parseGift({ amount: 5, frequency: "once" })));
  assert.ok(!("error" in parseGift({ amount: 10000, frequency: "once" })));
  assert.ok("error" in parseGift({ amount: 4.99, frequency: "once" }));
  assert.ok("error" in parseGift({ amount: 10000.01, frequency: "once" }));
});

test("bad amounts and frequencies are refused with a plain message", () => {
  assert.ok("error" in parseGift({ amount: "abc", frequency: "once" }));
  assert.ok("error" in parseGift({ amount: 50, frequency: "weekly" }));
  assert.ok("error" in parseGift(null));
});

test("name and email: trimmed, email lower-cased, control characters stripped, bad email refused", () => {
  const g = parseGift({ amount: 50, frequency: "once", name: "  Ruth\u0007 Ben-Ami  ", email: "  Ruth@Example.COM " });
  assert.deepEqual(g, { amount: 50, frequency: "once", anonymous: false, name: "Ruth Ben-Ami", email: "ruth@example.com" });
  assert.equal((parseGift({ amount: 50, frequency: "once", name: "x".repeat(200) }) as GiftRequest).name?.length, 80);
  assert.ok("error" in parseGift({ amount: 50, frequency: "once", email: "not-an-email" }));
  assert.ok(!("email" in (parseGift({ amount: 50, frequency: "once", email: "" }) as GiftRequest)));
  assert.equal((parseGift({ amount: 50, frequency: "once", anonymous: true }) as GiftRequest).anonymous, true);
});

test("a fund or fee sent by the client is ignored: always General, one line item, no fee", () => {
  const g = parseGift({ amount: 50, frequency: "once", fund: "BUILDING", cover_fee: true, fee: 2 }) as GiftRequest;
  assert.ok(!("fund" in g) && !("fee" in g) && !("cover_fee" in g));
  for (const frequency of ["once", "monthly"] as const) {
    const p = checkoutParams(gift({ frequency }), "https://x");
    assert.equal(p.get("metadata[fund]"), "GENERAL");
    assert.equal([...p.keys()].filter((k) => /^line_items\[(\d+)\]\[quantity\]$/.test(k)).length, 1);
    assert.equal(p.get("line_items[1][price_data][unit_amount]"), null);
    assert.ok(![...p.keys()].some((k) => /fee/i.test(k)));
  }
});

test("one-time gift: payment mode, Donate button, hosted card checkout, acknowledgment on the page and the receipt", () => {
  const p = checkoutParams(gift({ amount: 25.5 }), "https://congregationofyhvh.com");
  assert.equal(p.get("mode"), "payment");
  assert.equal(p.get("submit_type"), "donate");
  assert.equal(p.get("ui_mode"), null); // hosted (the default), never embedded
  assert.equal(p.get("line_items[0][price_data][unit_amount]"), "2550");
  assert.equal(p.get("custom_text[submit][message]"), ACKNOWLEDGMENT);
  assert.ok((p.get("payment_intent_data[description]") ?? "").endsWith(ACKNOWLEDGMENT));
  assert.equal(p.get("success_url"), "https://congregationofyhvh.com/give/thank-you?session_id={CHECKOUT_SESSION_ID}");
  assert.equal(p.get("line_items[0][price_data][recurring][interval]"), null);
  assert.deepEqual(p.getAll("payment_method_types[0]"), ["card"]);
  assert.equal(p.get("payment_method_types[1]"), null);
});

test("monthly gift: subscription mode, monthly price, acknowledgment on the subscription", () => {
  const p = checkoutParams(gift({ amount: 100, frequency: "monthly" }), "https://congregationofyhvh.com");
  assert.equal(p.get("mode"), "subscription");
  assert.equal(p.get("line_items[0][price_data][recurring][interval]"), "month");
  assert.ok((p.get("subscription_data[description]") ?? "").endsWith(ACKNOWLEDGMENT));
  assert.equal(p.get("custom_text[submit][message]"), ACKNOWLEDGMENT);
  assert.equal(p.get("submit_type"), null);
});

test("metadata is on the session AND on the payment (one-time) / subscription (monthly)", () => {
  const once = checkoutParams(gift({ name: "Ruth", email: "ruth@example.com" }), "https://x");
  for (const [k, v] of [["fund", "GENERAL"], ["frequency", "once"], ["anonymous", "false"], ["give_name", "Ruth"], ["source", "congregationofyhvh.com/give"]]) {
    assert.equal(once.get(`metadata[${k}]`), v);
    assert.equal(once.get(`payment_intent_data[metadata][${k}]`), v);
    assert.equal(once.get(`subscription_data[metadata][${k}]`), null);
  }
  const monthly = checkoutParams(gift({ frequency: "monthly", anonymous: true }), "https://x");
  for (const [k, v] of [["fund", "GENERAL"], ["frequency", "monthly"], ["anonymous", "true"]]) {
    assert.equal(monthly.get(`metadata[${k}]`), v);
    assert.equal(monthly.get(`subscription_data[metadata][${k}]`), v);
    assert.equal(monthly.get(`payment_intent_data[metadata][${k}]`), null);
  }
});

test("anonymous: no give_name anywhere, but the email is still prefilled for the receipt", () => {
  const p = checkoutParams(gift({ anonymous: true, name: "Ruth", email: "ruth@example.com" }), "https://x");
  assert.ok(![...p.keys()].some((k) => k.includes("give_name")));
  assert.equal(p.get("customer_email"), "ruth@example.com");
  assert.equal(checkoutParams(gift(), "https://x").get("customer_email"), null);
});

test("honeypot: any value in the hidden website field rejects", () => {
  assert.equal(isHoneypot({ website: "http://spam" }), true);
  assert.equal(isHoneypot({ website: "  " }), false);
  assert.equal(isHoneypot({}), false);
});

test("wording: never 'tithe', no tax-status or deductibility claims, no premiums", () => {
  for (const frequency of ["once", "monthly"] as const) {
    const text = [...checkoutParams(gift({ frequency }), "https://x").values()].join(" ");
    assert.doesNotMatch(text, /tithe|501\(c\)|deductib|IRS|thank-you gift|premium/i);
  }
  // every user-facing string in giving.ts (string literals outside comments)
  const src = readFileSync(new URL("./giving.ts", import.meta.url), "utf8").replace(/\/\/.*$/gm, "");
  const literals = src.match(/(["'`])(?:\\.|(?!\1).)*\1/g) ?? [];
  for (const s of literals) assert.doesNotMatch(s, /tithe|501\(c\)|deductib|IRS/i, s);
});
