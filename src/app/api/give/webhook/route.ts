import { handleWebhook } from "@/lib/give-webhook";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * Stripe webhook for online giving (sandbox until go-live). Verifies the Stripe
 * signature, reads the few fields the ledger needs from Stripe, and forwards them to
 * the back office's site.ingest_stripe_event. See src/lib/give-webhook.ts.
 */
export async function POST(request: Request) {
  return handleWebhook(request, {
    env: {
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
      GIVING_INGEST_TOKEN: process.env.GIVING_INGEST_TOKEN,
    },
    fetch,
    now: () => Math.floor(Date.now() / 1000),
    log: (line) => console.log(line),
  });
}
