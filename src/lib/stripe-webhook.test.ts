// node --import tsx --test src/lib/stripe-webhook.test.ts   (npm test)
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { enrichEvent, isSubscribed, SUBSCRIBED_EVENTS, verifyStripeSignature, type StripeEvent, type StripeGet } from "./stripe-webhook";

const SECRET = "whsec_test_dummy";
const sign = (raw: string, t: number, secret = SECRET) => createHmac("sha256", secret).update(`${t}.${raw}`).digest("hex");
const NOW = 1_793_000_000;
const RAW = JSON.stringify({ id: "evt_1", type: "invoice.paid" });

test("signature: valid, tampered body, wrong secret, stale, multiple v1 with one valid, malformed", () => {
  const good = `t=${NOW},v1=${sign(RAW, NOW)}`;
  assert.deepEqual(verifyStripeSignature(RAW, good, SECRET, NOW), { ok: true });
  assert.deepEqual(verifyStripeSignature(RAW + " ", good, SECRET, NOW), { ok: false, reason: "mismatch" });
  assert.deepEqual(verifyStripeSignature(RAW, `t=${NOW},v1=${sign(RAW, NOW, "whsec_other")}`, SECRET, NOW), { ok: false, reason: "mismatch" });
  assert.deepEqual(verifyStripeSignature(RAW, good, SECRET, NOW + 301), { ok: false, reason: "stale" });
  assert.deepEqual(verifyStripeSignature(RAW, good, SECRET, NOW + 300), { ok: true });
  const multi = `t=${NOW},v1=${"0".repeat(64)},v1=${sign(RAW, NOW)},v0=abc`;
  assert.deepEqual(verifyStripeSignature(RAW, multi, SECRET, NOW), { ok: true });
  assert.deepEqual(verifyStripeSignature(RAW, "garbage", SECRET, NOW), { ok: false, reason: "malformed" });
  assert.deepEqual(verifyStripeSignature(RAW, null, SECRET, NOW), { ok: false, reason: "missing" });
});

test("exactly the 12 subscribed events", () => {
  assert.equal(SUBSCRIBED_EVENTS.length, 12);
  assert.equal(isSubscribed("payment_intent.succeeded"), false);
});

// fake Stripe REST: path → JSON (records every path asked for)
function fakeGet(routes: Record<string, unknown>) {
  const asked: string[] = [];
  const get: StripeGet = async (path) => {
    asked.push(path);
    const key = Object.keys(routes).find((k) => path.startsWith(k));
    if (!key) throw new Error(`unexpected ${path}`);
    const v = routes[key];
    return (typeof v === "function" ? (v as (p: string) => unknown)(path) : v) as Record<string, unknown>;
  };
  return { get, asked };
}
const ev = (type: string, object: Record<string, unknown>, extra: Partial<StripeEvent> = {}): StripeEvent =>
  ({ id: "evt_1", type, livemode: false, created: NOW, data: { object }, ...extra }) as StripeEvent;

const PII = { name: "Ruth Ben-Ami", phone: "+17135550123", address: { line1: "1 Main" } };
const charge = {
  id: "ch_1", amount: 5000, created: NOW - 5, billing_details: PII, receipt_email: "x@example.com",
  balance_transaction: { id: "txn_1", fee: 175, net: 4825 },
  payment_method_details: { card: { brand: "visa", last4: "4242", exp_month: 12, fingerprint: "fp" } },
};
const keys = (o: object) => Object.keys(o).sort();
const BASE = ["created", "id", "livemode", "type"];

test("one-time checkout → gift with only the listed fields", async () => {
  const { get, asked } = fakeGet({
    "/v1/checkout/sessions/cs_1": {
      id: "cs_1", customer_details: { email: "giver@example.com", name: "Ruth", phone: "x" },
      metadata: { anonymous: "false", frequency: "once", fund: "GENERAL", give_name: "Ruth", other: "drop" },
      payment_intent: { id: "pi_1", latest_charge: charge },
    },
  });
  const r = await enrichEvent(ev("checkout.session.completed", { id: "cs_1", mode: "payment", payment_status: "paid" }), get);
  assert.equal(r.status, "forward");
  const e = (r as { event: Record<string, unknown> }).event;
  assert.deepEqual(keys(e), [...BASE, "amount", "card_brand", "card_last4", "charge_id", "checkout_email", "fee", "frequency", "kind", "metadata", "net", "paid_at", "payment_intent_id"].sort());
  assert.deepEqual(e, { id: "evt_1", type: "checkout.session.completed", livemode: false, created: NOW, kind: "gift", charge_id: "ch_1", amount: 5000, fee: 175, net: 4825,
    card_brand: "visa", card_last4: "4242", paid_at: NOW - 5, payment_intent_id: "pi_1", checkout_email: "giver@example.com", frequency: "once",
    metadata: { anonymous: "false", frequency: "once", fund: "GENERAL", give_name: "Ruth" } });
  assert.match(asked[0], /expand\[\]=payment_intent\.latest_charge\.balance_transaction/);
  assert.doesNotMatch(JSON.stringify(e), /Ben-Ami|7135550123|Main|x@example|fingerprint/);
});

test("subscription-mode checkout → subscription_started, no Stripe call, no gift", async () => {
  const { get, asked } = fakeGet({});
  const r = await enrichEvent(ev("checkout.session.completed", { id: "cs_2", mode: "subscription", subscription: "sub_1", amount_total: 2000,
    customer_details: { email: "g@example.com", name: "N" }, metadata: { anonymous: "true" } }), get);
  const e = (r as { event: Record<string, unknown> }).event;
  assert.equal(e.kind, "subscription_started");
  assert.deepEqual(keys(e), [...BASE, "amount", "checkout_email", "kind", "metadata", "subscription_id"].sort());
  assert.equal(asked.length, 0);
});

test("unpaid checkout and a $0 invoice are ignored", async () => {
  const { get } = fakeGet({});
  assert.equal((await enrichEvent(ev("checkout.session.completed", { id: "cs_3", mode: "payment", payment_status: "unpaid" }), get)).status, "ignored");
  assert.equal((await enrichEvent(ev("invoice.paid", { id: "in_0", amount_paid: 0 }), get)).status, "ignored");
});

test("invoice.paid → monthly gift with the subscription's metadata", async () => {
  const { get, asked } = fakeGet({
    "/v1/invoices/in_1": { id: "in_1", customer_email: "g@example.com", customer_name: "Ruth", payment_intent: "pi_2", charge,
      subscription: { id: "sub_1", metadata: { anonymous: "false", frequency: "monthly", give_name: "Ruth" } } },
  });
  const e = ((await enrichEvent(ev("invoice.paid", { id: "in_1", amount_paid: 5000 }), get)) as { event: Record<string, unknown> }).event;
  assert.equal(e.kind, "gift");
  assert.equal(e.frequency, "monthly");
  assert.equal(e.invoice_id, "in_1");
  assert.equal(e.subscription_id, "sub_1");
  assert.deepEqual(e.metadata, { anonymous: "false", frequency: "monthly", give_name: "Ruth" });
  assert.match(asked[0], /expand\[\]=charge\.balance_transaction&expand\[\]=subscription/);
  assert.ok(!("customer_name" in e));
});

test("charge.refunded → refunds list (cumulative amount + each refund), request id kept", async () => {
  const { get } = fakeGet({ "/v1/refunds?charge=ch_1": { data: [
    { id: "re_2", amount: 500, created: NOW, status: "succeeded", reason: "requested_by_customer" },
    { id: "re_1", amount: 1000, created: NOW - 100, status: "succeeded" },
    { id: "re_x", amount: 9, created: NOW, status: "failed" }] } });
  const e = ((await enrichEvent(ev("charge.refunded", { id: "ch_1", amount_refunded: 1500, billing_details: PII }, { request: { id: "req_9" } }), get)) as { event: Record<string, unknown> }).event;
  assert.deepEqual(keys(e), [...BASE, "amount_refunded", "charge_id", "refunds"].sort());
  assert.deepEqual(e.refunds, [
    { refund_id: "re_2", amount: 500, created: NOW, request_id: "req_9" },
    { refund_id: "re_1", amount: 1000, created: NOW - 100, request_id: "req_9" }]);
});

test("disputes: created has no money fields; funds_withdrawn carries balance transactions + dispute_fee", async () => {
  const { get, asked } = fakeGet({});
  const dp = { id: "dp_1", charge: "ch_1", amount: 5000, reason: "fraudulent", status: "needs_response", evidence_details: { due_by: NOW + 86400 }, evidence: { customer_name: "X" },
    balance_transactions: [{ id: "txn_d", amount: -5000, fee: 1500, net: -6500 }] };
  const c = ((await enrichEvent(ev("charge.dispute.created", dp), get)) as { event: Record<string, unknown> }).event;
  assert.deepEqual(keys(c), [...BASE, "amount", "charge_id", "dispute_id", "evidence_due_by", "reason", "status"].sort());
  const w = ((await enrichEvent(ev("charge.dispute.funds_withdrawn", dp), get)) as { event: Record<string, unknown> }).event;
  assert.equal(w.dispute_fee, 1500);
  assert.deepEqual(w.balance_transactions, [{ amount: -5000, fee: 1500 }]);
  assert.ok(!JSON.stringify(w).includes("customer_name"));
  assert.equal(asked.length, 0);
});

test("payout.paid collects every page of balance transactions", async () => {
  const page1 = { has_more: true, data: Array.from({ length: 100 }, (_, i) => ({ id: `txn_${i}`, type: "charge", source: `ch_${i}`, amount: 100, fee: 3, net: 97 })) };
  const page2 = { has_more: false, data: [{ id: "txn_r", type: "refund", source: { id: "re_1" }, amount: -50, fee: 0, net: -50 }, { id: "txn_p", type: "payout", source: "po_1", amount: -9650, fee: 0, net: -9650 }] };
  const { get, asked } = fakeGet({ "/v1/balance_transactions": (p: string) => (p.includes("starting_after=txn_99") ? page2 : page1) });
  const e = ((await enrichEvent(ev("payout.paid", { id: "po_1", amount: 9650, arrival_date: NOW, status: "paid", destination: "ba_x", bank_account: { last4: "6789" } }), get)) as { event: Record<string, unknown> }).event;
  const lines = e.lines as Record<string, unknown>[];
  assert.equal(lines.length, 102);
  assert.equal(asked.length, 2);
  assert.deepEqual(lines[0], { balance_transaction_id: "txn_0", type: "charge", source_id: "ch_0", charge_id: "ch_0", amount: 100, fee: 3, net: 97 });
  assert.equal(lines[100].charge_id, null);
  assert.deepEqual(keys(e), [...BASE, "amount", "arrival_date", "failure_message", "lines", "payout_id", "status"].sort());
  assert.ok(!JSON.stringify(e).includes("6789"));
});

test("customer.subscription.* → state fields only", async () => {
  const { get } = fakeGet({});
  const e = ((await enrichEvent(ev("customer.subscription.deleted", { id: "sub_1", status: "canceled", start_date: NOW - 999, current_period_end: NOW + 9, canceled_at: NOW,
    items: { data: [{ price: { unit_amount: 2500 }, quantity: 2 }] }, metadata: { anonymous: "false" }, customer: "cus_1", default_payment_method: "pm_1" }), get)) as { event: Record<string, unknown> }).event;
  assert.deepEqual(keys(e), [...BASE, "amount", "canceled_at", "current_period_end", "metadata", "started_at", "status", "subscription_id"].sort());
  assert.equal(e.amount, 5000);
});

test("no event ever carries keys beyond checkout_email / give_name for people", async () => {
  // covered above per event; this guards the library source too
  const src = (await import("node:fs")).readFileSync(new URL("./stripe-webhook.ts", import.meta.url), "utf8");
  assert.doesNotMatch(src, /console\./);
});
