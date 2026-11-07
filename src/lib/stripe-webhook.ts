// Stripe webhook library: signature check and "enrichment" of the 12 subscribed events
// into the normalized shape the back office's site.ingest_stripe_event expects
// (backoffice migration 0029, part B header). Amounts are integer cents, times unix
// seconds. Only the listed fields are kept; nothing else from Stripe leaves this file.
// No logging here: the route logs only event id, type, livemode and result.
//
// The event payload is treated as a NOTIFICATION only: its envelope (id, type, livemode,
// created, request) and the object id. Every object is then re-read through the REST API
// pinned to 2024-06-20, so the endpoint's own API version doesn't matter. (Stripe's
// Workbench destinations only offer the account's current version, 2026-09-30, whose
// Invoice has no `charge`/`payment_intent` and whose Subscription has no
// `current_period_end`.)
import { createHmac, timingSafeEqual } from "node:crypto";

export const STRIPE_API_VERSION = "2024-06-20";
export const SIGNATURE_TOLERANCE_S = 300;

export const SUBSCRIBED_EVENTS = [
  "checkout.session.completed",
  "invoice.paid",
  "charge.refunded",
  "charge.dispute.created",
  "charge.dispute.funds_withdrawn",
  "charge.dispute.funds_reinstated",
  "charge.dispute.closed",
  "payout.paid",
  "payout.failed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
] as const;

export function isSubscribed(type: string): boolean {
  return (SUBSCRIBED_EVENTS as readonly string[]).includes(type);
}

// ─────────────────────────────────────────────── signature
export type SignatureResult = { ok: true } | { ok: false; reason: "missing" | "malformed" | "stale" | "mismatch" };

/** Stripe-Signature: t=<unix>,v1=<hex>[,v1=<hex>…]. HMAC-SHA256 over `${t}.${raw}`, 300 s tolerance. */
export function verifyStripeSignature(raw: string, header: string | null, secret: string, nowSeconds: number): SignatureResult {
  if (!header || !secret) return { ok: false, reason: "missing" };
  let t: number | null = null;
  const v1: string[] = [];
  for (const part of header.split(",")) {
    const i = part.indexOf("=");
    if (i < 1) continue;
    const k = part.slice(0, i).trim();
    const v = part.slice(i + 1).trim();
    if (k === "t" && /^\d+$/.test(v)) t = Number(v);
    else if (k === "v1" && /^[0-9a-f]{64}$/i.test(v)) v1.push(v.toLowerCase());
  }
  if (t === null || v1.length === 0) return { ok: false, reason: "malformed" };
  if (Math.abs(nowSeconds - t) > SIGNATURE_TOLERANCE_S) return { ok: false, reason: "stale" };
  const expected = createHmac("sha256", secret).update(`${t}.${raw}`, "utf8").digest();
  for (const sig of v1) {
    const got = Buffer.from(sig, "hex");
    if (got.length === expected.length && timingSafeEqual(got, expected)) return { ok: true };
  }
  return { ok: false, reason: "mismatch" };
}

// ─────────────────────────────────────────────── enrichment
/** GET a Stripe REST path (e.g. "/v1/invoices/in_1?expand[]=charge") and return the JSON. */
export type StripeGet = (path: string) => Promise<Record<string, unknown>>;

export function stripeGetter(key: string, fetchImpl: typeof fetch = fetch): StripeGet {
  return async (path) => {
    const res = await fetchImpl(`https://api.stripe.com${path}`, {
      headers: { Authorization: `Bearer ${key}`, "Stripe-Version": STRIPE_API_VERSION },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`stripe_${res.status}`);
    return (await res.json()) as Record<string, unknown>;
  };
}

type Obj = Record<string, unknown>;
export type StripeEvent = { id: string; type: string; livemode: boolean; created: number; data: { object: Obj }; request?: { id?: string | null } | null };
export type Normalized = Record<string, unknown> & { id: string; type: string; livemode: boolean; created: number };
export type Enriched = { status: "forward"; event: Normalized } | { status: "ignored"; reason: string };

const o = (v: unknown): Obj => (v && typeof v === "object" ? (v as Obj) : {});
const s = (v: unknown): string | null => (typeof v === "string" && v ? v : null);
const n = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) ? Math.round(v) : null);
const id = (v: unknown): string | null => s(v) ?? s(o(v).id);

/** Only these metadata keys travel to the ledger. */
function giftMetadata(m: unknown) {
  const md = o(m);
  const out: Record<string, string> = {};
  for (const k of ["anonymous", "frequency", "fund", "give_name"] as const) {
    const v = s(md[k]);
    if (v) out[k] = v.slice(0, k === "give_name" ? 80 : 20);
  }
  return out;
}

/** charge fields: id, amount, fee/net from its balance transaction, card brand + last 4, paid_at. */
function chargeFields(chargeV: unknown) {
  const charge = o(chargeV);
  const bt = o(charge.balance_transaction);
  const card = o(o(charge.payment_method_details).card);
  return {
    charge_id: id(chargeV),
    amount: n(charge.amount),
    fee: n(bt.fee),
    net: n(bt.net),
    card_brand: s(card.brand),
    card_last4: s(card.last4),
    paid_at: n(charge.created),
  };
}

const base = (e: StripeEvent) => ({ id: e.id, type: e.type, livemode: e.livemode === true, created: e.created });
const forward = (event: Normalized): Enriched => ({ status: "forward", event });
const ignored = (reason: string): Enriched => ({ status: "ignored", reason });

/** The id of the event's object (stable across API versions). */
const objectId = (e: StripeEvent) => encodeURIComponent(String(id(o(e.data?.object).id) ?? ""));

export async function enrichEvent(e: StripeEvent, get: StripeGet): Promise<Enriched> {
  if (!isSubscribed(e.type)) return ignored("event type not subscribed");
  if (!id(o(e.data?.object).id)) return ignored("event without an object id");
  const oid = objectId(e);

  switch (e.type) {
    case "checkout.session.completed": {
      const session = await get(`/v1/checkout/sessions/${oid}?expand[]=payment_intent.latest_charge.balance_transaction`);
      if (session.mode === "subscription") {
        return forward({
          ...base(e), kind: "subscription_started",
          subscription_id: id(session.subscription), amount: n(session.amount_total),
          checkout_email: s(o(session.customer_details).email), metadata: giftMetadata(session.metadata),
        });
      }
      if (session.mode !== "payment" || session.payment_status !== "paid") return ignored("checkout not paid");
      const pi = o(session.payment_intent);
      return forward({
        ...base(e), kind: "gift",
        ...chargeFields(pi.latest_charge),
        payment_intent_id: id(session.payment_intent),
        checkout_email: s(o(session.customer_details).email),
        frequency: "once",
        metadata: giftMetadata(session.metadata),
      });
    }

    case "invoice.paid": {
      const inv = await get(`/v1/invoices/${oid}?expand[]=charge.balance_transaction&expand[]=subscription`);
      if (!(n(inv.amount_paid) ?? 0)) return ignored("invoice paid nothing");
      return forward({
        ...base(e), kind: "gift",
        ...chargeFields(inv.charge),
        invoice_id: id(inv.id),
        subscription_id: id(inv.subscription),
        payment_intent_id: id(inv.payment_intent),
        checkout_email: s(inv.customer_email),
        frequency: "monthly",
        metadata: giftMetadata(o(inv.subscription).metadata),
      });
    }

    case "charge.refunded": {
      const [charge, list] = await Promise.all([get(`/v1/charges/${oid}`), get(`/v1/refunds?charge=${oid}&limit=100`)]);
      const req = s(e.request?.id);
      const refunds = ((list.data as unknown[]) ?? [])
        .map(o)
        .filter((r) => r.status !== "failed" && r.status !== "canceled")
        .map((r) => ({ refund_id: id(r.id), amount: n(r.amount), created: n(r.created), request_id: req }));
      return forward({ ...base(e), charge_id: id(charge.id), amount_refunded: n(charge.amount_refunded), refunds });
    }

    case "charge.dispute.created":
    case "charge.dispute.funds_withdrawn":
    case "charge.dispute.funds_reinstated":
    case "charge.dispute.closed": {
      const dp = await get(`/v1/disputes/${oid}`);
      const bts = ((dp.balance_transactions as unknown[]) ?? []).map(o).map((b) => ({ amount: n(b.amount), fee: n(b.fee) }));
      const out: Normalized = {
        ...base(e),
        dispute_id: id(dp.id), charge_id: id(dp.charge), amount: n(dp.amount),
        reason: s(dp.reason), status: s(dp.status), evidence_due_by: n(o(dp.evidence_details).due_by),
      };
      if (e.type === "charge.dispute.funds_withdrawn" || e.type === "charge.dispute.funds_reinstated") {
        out.balance_transactions = bts;
        // the withdrawal's fee (a reinstatement's balance transaction carries a negative fee)
        if (e.type === "charge.dispute.funds_withdrawn") out.dispute_fee = bts.filter((b) => (b.amount ?? 0) < 0).reduce((a, b) => a + Math.max(0, b.fee ?? 0), 0);
      }
      return forward(out);
    }

    case "payout.paid":
    case "payout.failed": {
      const po = await get(`/v1/payouts/${oid}`);
      const out: Normalized = {
        ...base(e),
        payout_id: id(po.id), amount: n(po.amount), arrival_date: n(po.arrival_date),
        status: s(po.status), failure_message: s(po.failure_message),
      };
      if (e.type === "payout.paid") {
        const lines: Obj[] = [];
        let after: string | null = null;
        for (let page = 0; page < 50; page++) {
          const q = `/v1/balance_transactions?payout=${oid}&limit=100${after ? `&starting_after=${encodeURIComponent(after)}` : ""}`;
          const res = await get(q);
          const data = ((res.data as unknown[]) ?? []).map(o);
          for (const b of data) {
            const type = s(b.type);
            const source = id(b.source);
            lines.push({
              balance_transaction_id: id(b.id), type, source_id: source,
              charge_id: type === "charge" || type === "payment" ? source : null,
              amount: n(b.amount), fee: n(b.fee), net: n(b.net),
            });
          }
          if (res.has_more !== true || data.length === 0) break;
          after = id(data[data.length - 1].id);
        }
        out.lines = lines;
      }
      return forward(out);
    }

    default: {
      // customer.subscription.created / updated / deleted (a canceled subscription is still retrievable)
      const sub = await get(`/v1/subscriptions/${oid}`);
      const item = o(((o(sub.items).data as unknown[]) ?? [])[0]);
      const unit = n(o(item.price).unit_amount);
      const qty = n(item.quantity) ?? 1;
      return forward({
        ...base(e),
        subscription_id: id(sub.id), status: s(sub.status),
        amount: unit === null ? null : unit * qty,
        started_at: n(sub.start_date), current_period_end: n(sub.current_period_end), canceled_at: n(sub.canceled_at),
        metadata: giftMetadata(sub.metadata),
      });
    }
  }
}
