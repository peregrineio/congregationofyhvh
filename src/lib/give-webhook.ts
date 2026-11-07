// POST /api/give/webhook, as a plain function so it can be tested without Next.
// Stripe → verify signature → enrich from the Stripe API → site.ingest_stripe_event
// (back office, token-gated) → 200 / 400 / 500 / 503. The website holds no service-role
// key: only the public anon key and the single-purpose ingest token.
// Logs carry only event id, type, livemode and result. Never the body, a name, an email,
// the token or a key.
import { enrichEvent, isSubscribed, stripeGetter, verifyStripeSignature, type StripeEvent, type StripeGet } from "./stripe-webhook";

export type WebhookEnv = {
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  GIVING_INGEST_TOKEN?: string;
};

type Deps = {
  env: WebhookEnv;
  fetch: typeof fetch;
  now: () => number; // unix seconds
  log: (line: string) => void;
  stripe?: StripeGet; // injected in tests
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

export async function handleWebhook(request: Request, deps: Deps): Promise<Response> {
  const { env } = deps;
  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_WEBHOOK_SECRET || !env.SUPABASE_URL || !env.SUPABASE_ANON_KEY || !env.GIVING_INGEST_TOKEN) {
    return json({ error: "not-configured" }, 503);
  }

  const raw = await request.text();
  const sig = verifyStripeSignature(raw, request.headers.get("stripe-signature"), env.STRIPE_WEBHOOK_SECRET, deps.now());
  if (!sig.ok) {
    deps.log("give-webhook: bad signature");
    return json({ error: "bad-signature" }, 400);
  }

  let event: StripeEvent;
  try {
    event = JSON.parse(raw) as StripeEvent;
  } catch {
    deps.log("give-webhook: bad signature"); // signed but unparseable: treat as untrusted
    return json({ error: "bad-request" }, 400);
  }
  const tag = { event: String(event.id ?? ""), type: String(event.type ?? ""), livemode: event.livemode === true };
  const done = (result: string, status = 200) => {
    deps.log(`give-webhook: ${JSON.stringify({ ...tag, result })}`);
    return json({ received: true, result }, status);
  };

  if (!isSubscribed(tag.type)) return done("ignored");

  const rpc = (fn: string, body: unknown) =>
    deps.fetch(`${env.SUPABASE_URL!.replace(/\/$/, "")}/rest/v1/rpc/${fn}`, {
      method: "POST",
      headers: {
        apikey: env.SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${env.SUPABASE_ANON_KEY}`,
        "Content-Profile": "site",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  const fail = async (code: string, message: string) => {
    try {
      await rpc("log_stripe_ingest_failure", {
        p_token: env.GIVING_INGEST_TOKEN, p_event_id: tag.event, p_type: tag.type, p_code: code.slice(0, 60), p_message: message.slice(0, 300),
      });
    } catch {
      // the failure log is best effort; Stripe retries either way
    }
    return done(code, 500);
  };

  let enriched;
  try {
    enriched = await enrichEvent(event, deps.stripe ?? stripeGetter(env.STRIPE_SECRET_KEY, deps.fetch));
  } catch (e) {
    return fail("enrich_failed", e instanceof Error ? e.message : "Stripe lookup failed");
  }
  if (enriched.status === "ignored") return done("ignored");

  let res: Response;
  try {
    res = await rpc("ingest_stripe_event", { p_token: env.GIVING_INGEST_TOKEN, p_event: enriched.event });
  } catch {
    return fail("db_unreachable", "Could not reach the ledger");
  }
  const body = (await res.json().catch(() => null)) as { status?: string; message?: string; hint?: string; code?: string } | null;
  if (res.ok && body && ["recorded", "duplicate", "ignored"].includes(String(body.status))) return done(String(body.status));
  const code = body?.hint === "not_ready" || body?.message === "not_ready" ? "not_ready" : body?.hint || body?.code || `http_${res.status}`;
  return fail(code, body?.message ?? `HTTP ${res.status}`);
}
