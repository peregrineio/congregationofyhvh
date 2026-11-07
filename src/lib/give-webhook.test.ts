// node --import tsx --test src/lib/give-webhook.test.ts   (npm test)
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { handleWebhook, type WebhookEnv } from "./give-webhook";
import type { StripeGet } from "./stripe-webhook";

const NOW = 1_793_000_000;
const TOKEN = "ingest-token-0123456789abcdefghijklmnopqrstuv";
const ENV: WebhookEnv = {
  STRIPE_SECRET_KEY: "rk_test_dummy", STRIPE_WEBHOOK_SECRET: "whsec_dummy",
  SUPABASE_URL: "https://db.example.supabase.co", SUPABASE_ANON_KEY: "anon-public-key", GIVING_INGEST_TOKEN: TOKEN,
};

function signed(body: unknown, secret = ENV.STRIPE_WEBHOOK_SECRET!) {
  const raw = JSON.stringify(body);
  const sig = createHmac("sha256", secret).update(`${NOW}.${raw}`).digest("hex");
  return new Request("https://site.example/api/give/webhook", { method: "POST", headers: { "stripe-signature": `t=${NOW},v1=${sig}` }, body: raw });
}

const invoice = (id = "evt_inv") => ({ id, type: "invoice.paid", livemode: false, created: NOW, data: { object: { id: "in_1", amount_paid: 2500 } } });
const stripe: StripeGet = async () => ({
  id: "in_1", customer_email: "Giver.Person@example.com", payment_intent: "pi_1",
  charge: { id: "ch_1", amount: 2500, created: NOW, balance_transaction: { fee: 103, net: 2397 }, payment_method_details: { card: { brand: "visa", last4: "4242" } }, billing_details: { name: "Ruth Ben-Ami" } },
  subscription: { id: "sub_1", metadata: { anonymous: "false", give_name: "Ruth Ben-Ami" } },
});

function harness(dbReply: { status: number; body: unknown }, env = ENV) {
  const calls: { url: string; init: RequestInit }[] = [];
  const logs: string[] = [];
  const fetchFn = (async (url: string, init: RequestInit) => {
    calls.push({ url, init });
    return new Response(JSON.stringify(url.endsWith("log_stripe_ingest_failure") ? null : dbReply.body), { status: url.endsWith("log_stripe_ingest_failure") ? 204 : dbReply.status });
  }) as unknown as typeof fetch;
  return { calls, logs, deps: { env, fetch: fetchFn, now: () => NOW, log: (l: string) => logs.push(l), stripe } };
}

test("503 when any required env var is missing", async () => {
  for (const k of Object.keys(ENV) as (keyof WebhookEnv)[]) {
    const { deps } = harness({ status: 200, body: {} }, { ...ENV, [k]: undefined });
    assert.equal((await handleWebhook(signed(invoice()), deps)).status, 503, k);
  }
});

test("400 on a bad signature, logging only 'bad signature'", async () => {
  const { deps, logs, calls } = harness({ status: 200, body: {} });
  const res = await handleWebhook(signed(invoice(), "whsec_wrong"), deps);
  assert.equal(res.status, 400);
  assert.deepEqual(logs, ["give-webhook: bad signature"]);
  assert.equal(calls.length, 0);
});

test("unsubscribed type → 200 ignored, nothing sent to the database", async () => {
  const { deps, calls } = harness({ status: 200, body: {} });
  const res = await handleWebhook(signed({ id: "evt_x", type: "payment_intent.created", livemode: false, created: NOW, data: { object: {} } }), deps);
  assert.equal(res.status, 200);
  assert.equal((await res.json()).result, "ignored");
  assert.equal(calls.length, 0);
});

test("forwards to site.ingest_stripe_event with anon key + Content-Profile site; recorded/duplicate → 200", async () => {
  for (const status of ["recorded", "duplicate", "ignored"]) {
    const { deps, calls } = harness({ status: 200, body: { status } });
    const res = await handleWebhook(signed(invoice()), deps);
    assert.equal(res.status, 200, status);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, "https://db.example.supabase.co/rest/v1/rpc/ingest_stripe_event");
    const h = calls[0].init.headers as Record<string, string>;
    assert.equal(h["Content-Profile"], "site");
    assert.equal(h.apikey, "anon-public-key");
    const body = JSON.parse(String(calls[0].init.body));
    assert.equal(body.p_token, TOKEN);
    assert.equal(body.p_event.kind, "gift");
    assert.equal(body.p_event.charge_id, "ch_1");
  }
});

test("not_ready → failure logged through the RPC, then 500 so Stripe retries", async () => {
  const { deps, calls } = harness({ status: 400, body: { code: "P0001", message: "not_ready", hint: "not_ready" } });
  const res = await handleWebhook(signed(invoice()), deps);
  assert.equal(res.status, 500);
  assert.equal(calls.length, 2);
  assert.match(calls[1].url, /rpc\/log_stripe_ingest_failure$/);
  const f = JSON.parse(String(calls[1].init.body));
  assert.equal(f.p_code, "not_ready");
  assert.equal(f.p_event_id, "evt_inv");
  assert.equal(f.p_token, TOKEN);
});

test("logs never contain the body, emails, names, the token or keys", async () => {
  for (const reply of [{ status: 200, body: { status: "recorded" } }, { status: 500, body: { message: "boom" } }]) {
    const { deps, logs } = harness(reply);
    await handleWebhook(signed(invoice()), deps);
    const all = logs.join("\n");
    assert.ok(logs.length > 0);
    for (const secret of ["Giver.Person", "@example.com", "Ruth", TOKEN, "anon-public-key", "rk_test", "whsec", "in_1", "ch_1"])
      assert.ok(!all.includes(secret), secret);
    assert.match(all, /"event":"evt_inv"/);
  }
});
