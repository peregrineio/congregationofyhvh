import type { Metadata } from "next";
import Link from "next/link";
import { ACKNOWLEDGMENT, formatUsd } from "@/lib/giving";
import { SITE_CONFIG } from "@/lib/constants";
import { PortalLink } from "@/components/give/donation-form";
import { CheckCircle, ArrowRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "Thank You | Congregation of YHVH",
  robots: { index: false, follow: false },
};

// Read per visit: it shows the gift from this Checkout session.
export const dynamic = "force-dynamic";

interface Session {
  status?: string;
  payment_status?: string;
  mode?: string;
  amount_total?: number;
  customer_details?: { email?: string | null } | null;
  metadata?: { anonymous?: string } | null;
}

/** The Checkout session Stripe sent the giver back with, if it is real and paid. */
async function readSession(id: string | undefined): Promise<Session | null> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || !id || !/^cs_(test|live)_[A-Za-z0-9]+$/.test(id)) return null;
  const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${id}`, {
    headers: { Authorization: `Bearer ${key}`, "Stripe-Version": "2024-06-20" },
    cache: "no-store",
  });
  if (!response.ok) return null;
  const session = (await response.json()) as Session;
  return session.status === "complete" ? session : null;
}

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const session = await readSession(typeof sp.session_id === "string" ? sp.session_id : undefined);
  const monthly = session?.mode === "subscription";
  const anonymous = session?.metadata?.anonymous === "true";
  const email = session?.customer_details?.email ?? null; // rendered as text (React escapes it); never logged
  const amount = session?.amount_total != null ? formatUsd(session.amount_total / 100) : null;
  const portalUrl = process.env.STRIPE_CUSTOMER_PORTAL_URL || undefined;
  const mail = (
    <a href={`mailto:${SITE_CONFIG.email}`} className="font-medium text-yhvh-gold-dark underline underline-offset-2 hover:text-foreground">
      {SITE_CONFIG.email}
    </a>
  );

  return (
    <section className="bg-background px-4 py-20 sm:px-6">
      <div className="parchment-plate mx-auto max-w-xl rounded-xl p-8 text-center md:p-10">
        <span className="inline-flex size-14 items-center justify-center rounded-full border border-yhvh-gold/25 bg-yhvh-gold/[0.07] text-yhvh-gold-dark">
          <CheckCircle className="size-6" aria-hidden />
        </span>
        <h1 className="mt-5 font-heading text-3xl text-foreground">Thank you</h1>

        {session ? (
          <>
            <p className="mt-4 font-body text-base leading-relaxed text-foreground">
              We received your {monthly ? "monthly " : ""}freewill offering
              {amount ? <> of <strong>{amount}</strong></> : null}.
            </p>
            {anonymous ? (
              <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground">
                This gift is recorded anonymously in the church&apos;s records, so it won&apos;t appear on a year-end giving
                statement. Keep Stripe&apos;s emailed receipt for your records.
              </p>
            ) : (
              <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground">
                Stripe is emailing your receipt to {email ? <strong>{email}</strong> : "your email"}. If this email is on your
                church giving account, this gift will appear on your year-end giving statement.
              </p>
            )}
            {monthly && (
              <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground">
                It repeats each month until you cancel.{" "}
                {portalUrl ? <><PortalLink url={portalUrl}>Manage monthly gift</PortalLink> or email </> : "Email "}
                {mail} to stop it.
              </p>
            )}
            <p className="mt-5 border-t border-yhvh-gold/20 pt-5 font-body text-sm text-muted-foreground">{ACKNOWLEDGMENT}</p>
          </>
        ) : (
          <p className="mt-4 font-body text-base leading-relaxed text-muted-foreground">
            If you just gave online, thank you. Your receipt will arrive by email. If you didn&apos;t finish, no gift
            was made, and you can try again from the Give page.
          </p>
        )}
        <p className="mt-3 font-body text-xs text-muted-foreground/80">
          Gave in error? Email {mail} within 30 days and the Treasurer will refund it.
        </p>

        <p className="mt-6 font-scripture text-base italic text-foreground">
          &ldquo;So let each one give as he purposes in his heart, not grudgingly or of necessity; for God loves a cheerful giver.&rdquo;
          <span className="mt-1 block font-subheading text-xs not-italic uppercase tracking-[0.2em] text-yhvh-gold-dark">2 Corinthians 9:7</span>
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/" className="inline-flex items-center gap-2 rounded-md bg-yhvh-gold px-6 py-3 font-subheading text-sm uppercase tracking-widest text-white hover:bg-yhvh-gold-dark">
            Back to home <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
