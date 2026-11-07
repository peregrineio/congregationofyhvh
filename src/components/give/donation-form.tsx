"use client";

import { useState, type FormEvent } from "react";
import { ACKNOWLEDGMENT, MAX_GIFT, MIN_GIFT, NAME_MAX, PRESETS, cleanEmail, formatUsd, parseGift, type Frequency } from "@/lib/giving";
import { SITE_CONFIG } from "@/lib/constants";
import { AlertCircle, ArrowRight, Shield } from "@/components/icons";
import { cn } from "@/lib/utils";

type State =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "unavailable" }
  | { status: "error"; message: string; field?: "amount" };

const EMAIL = SITE_CONFIG.email;

/** "Manage monthly gift": Stripe's customer portal login (new tab), or nothing when not configured. */
export function PortalLink({ url, children, className }: { url?: string; children: React.ReactNode; className?: string }) {
  if (!url) return null;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={cn("font-medium text-yhvh-gold-dark underline underline-offset-2 hover:text-foreground", className)}>
      {children}
    </a>
  );
}

const MailLink = () => (
  <a href={`mailto:${EMAIL}`} className="font-medium text-yhvh-gold-dark underline underline-offset-2 hover:text-foreground">
    {EMAIL}
  </a>
);

/**
 * Online gift: one-time or monthly, an amount, optional name and email, and an
 * "anonymous" choice; then on to Stripe's secure Checkout page. No card fields,
 * no fund picker and no fee option on this site (every gift goes to the General
 * fund and the church pays the card fee).
 */
export function DonationForm({ canceled = false, portalUrl }: { canceled?: boolean; portalUrl?: string }) {
  const [frequency, setFrequency] = useState<Frequency>("once");
  const [preset, setPreset] = useState<number | null>(50);
  const [other, setOther] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [state, setState] = useState<State>({ status: "idle" });

  const amount = preset ?? Number(other.replace(/[$,\s]/g, ""));
  const label = Number.isFinite(amount) && amount > 0 ? formatUsd(amount) : null;
  const clearError = () => state.status === "error" && setState({ status: "idle" });
  const checkEmail = () => {
    const bad = cleanEmail(email) === null;
    setEmailError(bad);
    return !bad;
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.status === "sending") return;
    if (!checkEmail()) return;
    const gift = parseGift({ amount: preset ?? other, frequency, name, email, anonymous });
    if ("error" in gift) {
      setState({ status: "error", message: gift.error, field: "amount" });
      return;
    }
    setState({ status: "sending" });
    try {
      const response = await fetch("/api/give/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...gift, website }),
      });
      const result = (await response.json().catch(() => ({}))) as { url?: string; reason?: string; message?: string };
      if (response.ok && result.url) {
        window.location.assign(result.url);
        return;
      }
      if (response.status === 503 || result.reason === "not-configured") setState({ status: "unavailable" });
      else if (response.status === 429) setState({ status: "error", message: "Too many attempts. Please wait a few minutes and try again." });
      else if (response.status === 400 && result.message) setState({ status: "error", message: result.message });
      else setState({ status: "error", message: "We couldn't start your gift. Please try again in a moment." });
    } catch {
      setState({ status: "error", message: "We couldn't reach the payment page. Check your connection and try again." });
    }
  }

  const sending = state.status === "sending";
  const amountInvalid = state.status === "error" && state.field === "amount";
  const field =
    "w-full rounded-md border border-yhvh-gold/40 bg-white px-3 py-2.5 font-body text-base text-foreground focus:border-yhvh-gold focus:outline-none focus:ring-2 focus:ring-yhvh-gold/40";
  const legend = "font-subheading text-xs uppercase tracking-widest text-yhvh-gold-dark";

  return (
    <form onSubmit={handleSubmit} noValidate className="mx-auto mt-6 max-w-sm text-left" aria-describedby="give-ack">
      {canceled && state.status === "idle" && (
        <p role="status" className="mb-4 rounded-md border border-yhvh-gold/30 bg-yhvh-gold/[0.07] px-4 py-3 font-body text-sm text-foreground">
          No gift was made. You can try again whenever you like.
        </p>
      )}

      {/* 1. How often */}
      <fieldset>
        <legend className={legend}>How often</legend>
        <div className="mt-2 grid grid-cols-2 gap-2" role="radiogroup">
          {(["once", "monthly"] as const).map((f) => (
            <label
              key={f}
              className={cn(
                "flex min-h-11 cursor-pointer items-center justify-center rounded-md border px-3 py-2.5 font-subheading text-sm uppercase tracking-widest transition-colors focus-within:ring-2 focus-within:ring-yhvh-gold",
                frequency === f ? "border-yhvh-gold bg-yhvh-gold text-white" : "border-yhvh-gold/40 text-yhvh-gold-dark hover:bg-yhvh-gold/10",
              )}
            >
              <input type="radio" name="frequency" value={f} checked={frequency === f} onChange={() => setFrequency(f)} className="sr-only" />
              {f === "once" ? "One time" : "Monthly"}
            </label>
          ))}
        </div>
      </fieldset>

      {/* 2. Amount */}
      <fieldset className="mt-5">
        <legend className={legend}>Amount</legend>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {PRESETS.map((p) => (
            <label
              key={p}
              className={cn(
                "flex min-h-11 cursor-pointer items-center justify-center rounded-md border px-2 py-2.5 font-heading text-base transition-colors focus-within:ring-2 focus-within:ring-yhvh-gold",
                preset === p ? "border-yhvh-gold bg-yhvh-gold text-white" : "border-yhvh-gold/40 text-foreground hover:bg-yhvh-gold/10",
              )}
            >
              <input
                type="radio"
                name="preset"
                value={p}
                checked={preset === p}
                onChange={() => { setPreset(p); setOther(""); clearError(); }}
                className="sr-only"
              />
              ${p}
            </label>
          ))}
        </div>
        <label htmlFor="give-other" className="mt-3 block font-body text-sm text-muted-foreground">
          Or another amount
        </label>
        <div className="relative mt-1">
          <span aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-body text-foreground/60">$</span>
          <input
            id="give-other"
            inputMode="decimal"
            autoComplete="off"
            placeholder="Other"
            value={other}
            onFocus={() => setPreset(null)}
            onChange={(e) => { setPreset(null); setOther(e.target.value); clearError(); }}
            aria-invalid={amountInvalid}
            aria-describedby={amountInvalid ? "give-limits give-error" : "give-limits"}
            className={cn(field, "pl-7")}
          />
        </div>
        <p id="give-limits" className="mt-1 font-body text-xs text-muted-foreground/80">
          {formatUsd(MIN_GIFT)} to {formatUsd(MAX_GIFT)} online.
        </p>
      </fieldset>

      {/* 3. Your details (optional) */}
      <fieldset className="mt-5">
        <legend className={legend}>Your details (optional)</legend>
        <label htmlFor="give-name" className="mt-2 block font-body text-sm text-muted-foreground">Name</label>
        <input id="give-name" autoComplete="name" maxLength={NAME_MAX} value={name} onChange={(e) => setName(e.target.value)} className={cn(field, "mt-1")} />
        <label htmlFor="give-email" className="mt-3 block font-body text-sm text-muted-foreground">Email</label>
        <input
          id="give-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(false); }}
          onBlur={checkEmail}
          aria-invalid={emailError}
          aria-describedby={emailError ? "give-email-help give-email-error" : "give-email-help"}
          className={cn(field, "mt-1", emailError && "border-red-600")}
        />
        {emailError && (
          <p id="give-email-error" role="alert" className="mt-1 font-body text-xs text-red-700">Check the email address.</p>
        )}
        <p id="give-email-help" className="mt-1 font-body text-xs text-muted-foreground/80">
          If you give your email, it&apos;s filled in on Stripe&apos;s page for your receipt.
        </p>
      </fieldset>

      {/* 4. Anonymous (unchecked by default) */}
      <div className="mt-4">
        <label htmlFor="give-anonymous" className="flex min-h-11 cursor-pointer items-start gap-3 font-body text-sm text-foreground">
          <input
            id="give-anonymous"
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
            aria-describedby="give-anonymous-help"
            className="mt-0.5 size-5 shrink-0 accent-yhvh-gold focus:outline-none focus:ring-2 focus:ring-yhvh-gold"
          />
          <span>Don&apos;t link this gift to my giving account (give anonymously)</span>
        </label>
        <p id="give-anonymous-help" className="ml-8 font-body text-xs text-muted-foreground/80">
          Stripe still asks for an email for your receipt.
        </p>
      </div>

      {/* honeypot: people never see or reach it */}
      <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor="give-website">Website</label>
        <input id="give-website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>

      {state.status === "error" && (
        <p id="give-error" role="alert" className="mt-4 flex items-start gap-2 font-body text-sm text-red-700">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          {state.message}
        </p>
      )}
      {state.status === "unavailable" && (
        <p role="alert" className="mt-4 flex items-start gap-2 font-body text-sm text-foreground">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-yhvh-gold-dark" aria-hidden />
          Online giving isn&apos;t available right now. You can give in person on Shabbat or by mail (details on this page).
        </p>
      )}

      {/* 5. Monthly disclosure, directly above the button */}
      {frequency === "monthly" && (
        <p className="mt-5 rounded-md border border-yhvh-gold/30 bg-yhvh-gold/[0.07] px-4 py-3 font-body text-sm text-foreground">
          {label ?? "Your gift"} will be charged to your card each month until you cancel. Cancel any time
          {portalUrl ? <> at <PortalLink url={portalUrl}>Manage monthly gift</PortalLink> or</> : null} by emailing <MailLink />.
        </p>
      )}

      {/* 6. Submit */}
      <button
        type="submit"
        disabled={sending}
        className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-yhvh-gold px-7 py-3 font-subheading text-sm uppercase tracking-widest text-white transition-colors hover:bg-yhvh-gold-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-yhvh-gold focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
      >
        {sending ? "Opening secure checkout…" : `Give ${label ?? ""}${label && frequency === "monthly" ? " monthly" : ""}`.trim()}
        {!sending && <ArrowRight className="size-4" aria-hidden />}
      </button>

      {/* 7. Footer lines */}
      <p className="mt-3 flex items-start justify-center gap-1.5 text-center font-body text-xs text-muted-foreground">
        <Shield className="mt-0.5 size-3.5 shrink-0" aria-hidden />
        You&apos;ll enter your card on Stripe&apos;s secure page. We never see or store your card.
      </p>
      <p id="give-ack" className="mt-2 text-center font-body text-xs text-muted-foreground/80">
        {ACKNOWLEDGMENT}
      </p>
      <p className="mt-2 text-center font-body text-xs text-muted-foreground/80">
        Gave in error? Email <MailLink /> within 30 days and the Treasurer will refund it.
      </p>
    </form>
  );
}
