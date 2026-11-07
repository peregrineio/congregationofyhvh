// node --import tsx --test src/lib/stripe-webhook.test.ts   (npm test)
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
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

// fake Stripe REST (always answers in the PINNED 2024-06-20 shape): path → JSON
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

// Event payloads are 2026-09-30.endive shaped (what Sam's Workbench destination sends):
// the library may only use the envelope and data.object.id from them.
const ev = (type: string, object: Record<string, unknown>, extra: Partial<StripeEvent> = {}): StripeEvent =>
  ({ id: "evt_1", type, livemode: false, created: NOW, data: { object }, ...extra }) as StripeEvent;
const NEW_INVOICE = { id: "in_1", object: "invoice", amount_paid: 2500, payments: { data: [{ payment: { type: "payment_intent", payment_intent: "pi_2" } }] },
  parent: { type: "subscription_details", subscription_details: { subscription: "sub_1", metadata: {} } } }; // no charge / payment_intent / subscription
const NEW_SUBSCRIPTION = { id: "sub_1", object: "subscription", status: "active", items: { data: [{ current_period_end: NOW + 9, price: { unit_amount: 1 } }] } }; // no current_period_end

const PII = { name: "Ruth Ben-Ami", phone: "+17135550123", address: { line1: "1 Main" } };
const charge = {
  id: "ch_1", amount: 5000, amount_refunded: 1500, created: NOW - 5, billing_details: PII, receipt_email: "x@example.com",
  balance_transaction: { id: "txn_1", fee: 175, net: 4825 },
  payment_method_details: { card: { brand: "visa", last4: "4242", exp_month: 12, fingerprint: "fp" } },
};
const keys = (o: object) => Object.keys(o).sort();
const BASE = ["created", "id", "livemode", "type"];
const evOf = async (e: StripeEvent, get: StripeGet) => ((await enrichEvent(e, get)) as { event: Record<string, unknown> }).event;

test("one-time checkout → gift with only the listed fields (session re-read at the pinned version)", async () => {
  const { get, asked } = fakeGet({
    "/v1/checkout/sessions/cs_1": {
      id: "cs_1", mode: "payment", payment_status: "paid", customer_details: { email: "giver@example.com", name: "Ruth", phone: "x" },
      metadata: { anonymous: "false", frequency: "once", fund: "GENERAL", give_name: "Ruth", other: "drop" },
      payment_intent: { id: "pi_1", latest_charge: charge },
    },
  });
  // the event's own copy is incomplete / differently shaped; only its id is used
  const e = await evOf(ev("checkout.session.completed", { id: "cs_1", object: "checkout.session" }), get);
  assert.deepEqual(keys(e), [...BASE, "amount", "card_brand", "card_last4", "charge_id", "checkout_email", "fee", "frequency", "kind", "metadata", "net", "paid_at", "payment_intent_id"].sort());
  assert.deepEqual(e, { id: "evt_1", type: "checkout.session.completed", livemode: false, created: NOW, kind: "gift", charge_id: "ch_1", amount: 5000, fee: 175, net: 4825,
    card_brand: "visa", card_last4: "4242", paid_at: NOW - 5, payment_intent_id: "pi_1", checkout_email: "giver@example.com", frequency: "once",
    metadata: { anonymous: "false", frequency: "once", fund: "GENERAL", give_name: "Ruth" } });
  assert.match(asked[0], /expand\[\]=payment_intent\.latest_charge\.balance_transaction/);
  assert.doesNotMatch(JSON.stringify(e), /Ben-Ami|7135550123|Main|x@example|fingerprint/);
});

test("subscription-mode checkout → subscription_started, no gift", async () => {
  const { get } = fakeGet({ "/v1/checkout/sessions/cs_2": { id: "cs_2", mode: "subscription", subscription: "sub_1", amount_total: 2000, customer_details: { email: "g@example.com", name: "N" }, metadata: { anonymous: "true" } } });
  const e = await evOf(ev("checkout.session.completed", { id: "cs_2" }), get);
  assert.equal(e.kind, "subscription_started");
  assert.deepEqual(keys(e), [...BASE, "amount", "checkout_email", "kind", "metadata", "subscription_id"].sort());
});

test("unpaid checkout and a $0 invoice are ignored; an event without an object id is ignored", async () => {
  const { get } = fakeGet({ "/v1/checkout/sessions/cs_3": { id: "cs_3", mode: "payment", payment_status: "unpaid" }, "/v1/invoices/in_0": { id: "in_0", amount_paid: 0 } });
  assert.equal((await enrichEvent(ev("checkout.session.completed", { id: "cs_3" }), get)).status, "ignored");
  assert.equal((await enrichEvent(ev("invoice.paid", { id: "in_0" }), get)).status, "ignored");
  assert.equal((await enrichEvent(ev("invoice.paid", {}), get)).status, "ignored");
});

test("invoice.paid at 2026-09-30 (no charge/payment_intent on the payload) → monthly gift from the pinned invoice", async () => {
  const { get, asked } = fakeGet({
    "/v1/invoices/in_1": { id: "in_1", amount_paid: 2500, customer_email: "g@example.com", customer_name: "Ruth", payment_intent: "pi_2", charge,
      subscription: { id: "sub_1", metadata: { anonymous: "false", frequency: "monthly", give_name: "Ruth" } } },
  });
  const e = await evOf(ev("invoice.paid", NEW_INVOICE), get);
  assert.equal(e.kind, "gift");
  assert.equal(e.frequency, "monthly");
  assert.equal(e.invoice_id, "in_1");
  assert.equal(e.subscription_id, "sub_1");
  assert.equal(e.charge_id, "ch_1");
  assert.equal(e.payment_intent_id, "pi_2");
  assert.equal(e.fee, 175);
  assert.deepEqual(e.metadata, { anonymous: "false", frequency: "monthly", give_name: "Ruth" });
  assert.match(asked[0], /^\/v1\/invoices\/in_1\?expand\[\]=charge\.balance_transaction&expand\[\]=subscription$/);
  assert.ok(!("customer_name" in e));
});

test("charge.refunded → charge + refunds re-read; cumulative amount + each refund; request id kept", async () => {
  const { get } = fakeGet({
    "/v1/charges/ch_1": charge,
    "/v1/refunds?charge=ch_1": { data: [
      { id: "re_2", amount: 500, created: NOW, status: "succeeded", reason: "requested_by_customer" },
      { id: "re_1", amount: 1000, created: NOW - 100, status: "succeeded" },
      { id: "re_x", amount: 9, created: NOW, status: "failed" }] },
  });
  const e = await evOf(ev("charge.refunded", { id: "ch_1", object: "charge" }, { request: { id: "req_9" } }), get);
  assert.deepEqual(keys(e), [...BASE, "amount_refunded", "charge_id", "refunds"].sort());
  assert.equal(e.amount_refunded, 1500);
  assert.deepEqual(e.refunds, [
    { refund_id: "re_2", amount: 500, created: NOW, request_id: "req_9" },
    { refund_id: "re_1", amount: 1000, created: NOW - 100, request_id: "req_9" }]);
});

test("disputes re-read: created has no money fields; funds_withdrawn carries balance transactions + dispute_fee", async () => {
  const dp = { id: "dp_1", charge: "ch_1", amount: 5000, reason: "fraudulent", status: "needs_response", evidence_details: { due_by: NOW + 86400 }, evidence: { customer_name: "X" },
    balance_transactions: [{ id: "txn_d", amount: -5000, fee: 1500, net: -6500 }] };
  const { get, asked } = fakeGet({ "/v1/disputes/dp_1": dp });
  const c = await evOf(ev("charge.dispute.created", { id: "dp_1", object: "dispute" }), get);
  assert.deepEqual(keys(c), [...BASE, "amount", "charge_id", "dispute_id", "evidence_due_by", "reason", "status"].sort());
  const w = await evOf(ev("charge.dispute.funds_withdrawn", { id: "dp_1" }), get);
  assert.equal(w.dispute_fee, 1500);
  assert.deepEqual(w.balance_transactions, [{ amount: -5000, fee: 1500 }]);
  assert.ok(!JSON.stringify(w).includes("customer_name"));
  assert.deepEqual(asked, ["/v1/disputes/dp_1", "/v1/disputes/dp_1"]);
});

test("payout.paid re-reads the payout and collects every page of balance transactions", async () => {
  const page1 = { has_more: true, data: Array.from({ length: 100 }, (_, i) => ({ id: `txn_${i}`, type: "charge", source: `ch_${i}`, amount: 100, fee: 3, net: 97 })) };
  const page2 = { has_more: false, data: [{ id: "txn_r", type: "refund", source: { id: "re_1" }, amount: -50, fee: 0, net: -50 }, { id: "txn_p", type: "payout", source: "po_1", amount: -9650, fee: 0, net: -9650 }] };
  const { get, asked } = fakeGet({
    "/v1/payouts/po_1": { id: "po_1", amount: 9650, arrival_date: NOW, status: "paid", destination: "ba_x", bank_account: { last4: "6789" } },
    "/v1/balance_transactions": (p: string) => (p.includes("starting_after=txn_99") ? page2 : page1),
  });
  const e = await evOf(ev("payout.paid", { id: "po_1", object: "payout" }), get);
  const lines = e.lines as Record<string, unknown>[];
  assert.equal(lines.length, 102);
  assert.equal(asked.length, 3);
  assert.deepEqual(lines[0], { balance_transaction_id: "txn_0", type: "charge", source_id: "ch_0", charge_id: "ch_0", amount: 100, fee: 3, net: 97 });
  assert.equal(lines[100].charge_id, null);
  assert.deepEqual(keys(e), [...BASE, "amount", "arrival_date", "failure_message", "lines", "payout_id", "status"].sort());
  assert.ok(!JSON.stringify(e).includes("6789"));
});

test("customer.subscription.* at 2026-09-30 (no top-level current_period_end) → state from the pinned subscription", async () => {
  const { get } = fakeGet({
    "/v1/subscriptions/sub_1": { id: "sub_1", status: "canceled", start_date: NOW - 999, current_period_end: NOW + 9, canceled_at: NOW,
      items: { data: [{ price: { unit_amount: 2500 }, quantity: 2 }] }, metadata: { anonymous: "false" }, customer: "cus_1", default_payment_method: "pm_1" },
  });
  const e = await evOf(ev("customer.subscription.deleted", NEW_SUBSCRIPTION), get);
  assert.deepEqual(keys(e), [...BASE, "amount", "canceled_at", "current_period_end", "metadata", "started_at", "status", "subscription_id"].sort());
  assert.equal(e.amount, 5000);
  assert.equal(e.current_period_end, NOW + 9);
  assert.equal(e.status, "canceled");
});

test("the library has no logging", () => {
  assert.doesNotMatch(readFileSync(new URL("./stripe-webhook.ts", import.meta.url), "utf8"), /console\./);
});
