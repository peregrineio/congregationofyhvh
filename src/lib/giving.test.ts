// node --import tsx --test src/lib/giving.test.ts   (npm test)
import { test } from "node:test";
import assert from "node:assert/strict";
import { ACKNOWLEDGMENT, checkoutParams, parseGift } from "./giving";

test("presets and other amounts are accepted; cents are kept", () => {
  assert.deepEqual(parseGift({ amount: 50, frequency: "once" }), { amount: 50, frequency: "once" });
  assert.deepEqual(parseGift({ amount: "$1,234.567", frequency: "monthly" }), { amount: 1234.57, frequency: "monthly" });
});

test("bad amounts and frequencies are refused with a plain message", () => {
  assert.ok("error" in parseGift({ amount: 0.5, frequency: "once" }));
  assert.ok("error" in parseGift({ amount: 20000, frequency: "once" }));
  assert.ok("error" in parseGift({ amount: "abc", frequency: "once" }));
  assert.ok("error" in parseGift({ amount: 50, frequency: "weekly" }));
  assert.ok("error" in parseGift(null));
});

test("one-time gift: payment mode, Donate button, acknowledgment on the page and the receipt", () => {
  const p = checkoutParams({ amount: 25.5, frequency: "once" }, "https://congregationofyhvh.com");
  assert.equal(p.get("mode"), "payment");
  assert.equal(p.get("submit_type"), "donate");
  assert.equal(p.get("line_items[0][price_data][unit_amount]"), "2550");
  assert.equal(p.get("custom_text[submit][message]"), ACKNOWLEDGMENT);
  assert.match(p.get("payment_intent_data[description]") ?? "", /intangible religious benefits/);
  assert.equal(p.get("success_url"), "https://congregationofyhvh.com/give/thank-you?session_id={CHECKOUT_SESSION_ID}");
  assert.equal(p.get("line_items[0][price_data][recurring][interval]"), null);
  assert.deepEqual(p.getAll("payment_method_types[0]"), ["card"]);
});

test("monthly gift: subscription mode, monthly price, acknowledgment on the subscription", () => {
  const p = checkoutParams({ amount: 100, frequency: "monthly" }, "https://congregationofyhvh.com");
  assert.equal(p.get("mode"), "subscription");
  assert.equal(p.get("line_items[0][price_data][recurring][interval]"), "month");
  assert.match(p.get("subscription_data[description]") ?? "", /intangible religious benefits/);
  assert.equal(p.get("submit_type"), null);
});

test("wording: never 'tithe', no tax-status or deductibility claims", () => {
  for (const frequency of ["once", "monthly"] as const) {
    const text = [...checkoutParams({ amount: 50, frequency }, "https://x").values()].join(" ");
    assert.doesNotMatch(text, /tithe|501\(c\)|deductib|IRS/i);
  }
});
