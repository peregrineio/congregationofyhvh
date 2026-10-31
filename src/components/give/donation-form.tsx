"use client";

import { useState, type FormEvent } from "react";
import { ACKNOWLEDGMENT, MAX_GIFT, MIN_GIFT, PRESETS, formatUsd, parseGift, type Frequency } from "@/lib/giving";
import { AlertCircle, ArrowRight, Shield } from "@/components/icons";
import { cn } from "@/lib/utils";

type State = { status: "idle" } | { status: "sending" } | { status: "unavailable" } | { status: "error"; message: string };

/**
 * Online gift: choose an amount and one-time or monthly, then continue to
 * Stripe's secure Checkout page. No card fields on this site.
 */
export function DonationForm({ canceled = false }: { canceled?: boolean }) {
  const [frequency, setFrequency] = useState<Frequency>("once");
  const [preset, setPreset] = useState<number | null>(50);
  const [other, setOther] = useState("");
  const [state, setState] = useState<State>({ status: "idle" });

  const amount = preset ?? Number(other.replace(/[$,\s]/g, ""));
  const label = Number.isFinite(amount) && amount > 0 ? formatUsd(amount) : null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.status === "sending") return;
    const gift = parseGift({ amount: preset ?? other, frequency });
    if ("error" in gift) {
      setState({ status: "error", message: gift.error });
      return;
    }
    setState({ status: "sending" });
    try {
      const response = await fetch("/api/give/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gift),
      });
      const result = (await response.json().catch(() => ({}))) as { url?: string; reason?: string; message?: string };
      if (response.ok && result.url) {
        window.location.assign(result.url);
        return;
      }
      if (result.reason === "not-configured") setState({ status: "unavailable" });
      else setState({ status: "error", message: result.message ?? "We couldn't start your gift. Please try again in a moment." });
    } catch {
      setState({ status: "error", message: "We couldn't reach the payment page. Check your connection and try again." });
    }
  }

  const sending = state.status === "sending";

  return (
    <form onSubmit={handleSubmit} noValidate className="mx-auto mt-6 max-w-sm text-left" aria-describedby="give-ack">
      {canceled && state.status === "idle" && (
        <p role="status" className="mb-4 rounded-md border border-yhvh-gold/30 bg-yhvh-gold/[0.07] px-4 py-3 font-body text-sm text-foreground">
          No gift was made. You can try again whenever you like.
        </p>
      )}

      <fieldset>
        <legend className="font-subheading text-xs uppercase tracking-widest text-yhvh-gold-dark">How often</legend>
        <div className="mt-2 grid grid-cols-2 gap-2" role="radiogroup">
          {(["once", "monthly"] as const).map((f) => (
            <label
              key={f}
              className={cn(
                "flex cursor-pointer items-center justify-center rounded-md border px-3 py-2.5 font-subheading text-sm uppercase tracking-widest transition-colors focus-within:ring-2 focus-within:ring-yhvh-gold",
                frequency === f ? "border-yhvh-gold bg-yhvh-gold text-white" : "border-yhvh-gold/40 text-yhvh-gold-dark hover:bg-yhvh-gold/10",
              )}
            >
              <input type="radio" name="frequency" value={f} checked={frequency === f} onChange={() => setFrequency(f)} className="sr-only" />
              {f === "once" ? "One time" : "Monthly"}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-5">
        <legend className="font-subheading text-xs uppercase tracking-widest text-yhvh-gold-dark">Amount</legend>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {PRESETS.map((p) => (
            <label
              key={p}
              className={cn(
                "flex cursor-pointer items-center justify-center rounded-md border px-2 py-2.5 font-heading text-base transition-colors focus-within:ring-2 focus-within:ring-yhvh-gold",
                preset === p ? "border-yhvh-gold bg-yhvh-gold text-white" : "border-yhvh-gold/40 text-foreground hover:bg-yhvh-gold/10",
              )}
            >
              <input
                type="radio"
                name="preset"
                value={p}
                checked={preset === p}
                onChange={() => { setPreset(p); setOther(""); if (state.status === "error") setState({ status: "idle" }); }}
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
            onChange={(e) => { setPreset(null); setOther(e.target.value); if (state.status === "error") setState({ status: "idle" }); }}
            aria-invalid={state.status === "error" && preset === null}
            aria-describedby="give-limits"
            className="w-full rounded-md border border-yhvh-gold/40 bg-white py-2.5 pl-7 pr-3 font-body text-base text-foreground focus:border-yhvh-gold focus:outline-none focus:ring-2 focus:ring-yhvh-gold/40"
          />
        </div>
        <p id="give-limits" className="mt-1 font-body text-xs text-muted-foreground/80">
          {formatUsd(MIN_GIFT)} to {formatUsd(MAX_GIFT)} online.
        </p>
      </fieldset>

      {state.status === "error" && (
        <p role="alert" className="mt-4 flex items-start gap-2 font-body text-sm text-red-700">
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

      <button
        type="submit"
        disabled={sending}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-yhvh-gold px-7 py-3 font-subheading text-sm uppercase tracking-widest text-white transition-colors hover:bg-yhvh-gold-dark disabled:cursor-wait disabled:opacity-60"
      >
        {sending ? "Opening secure checkout…" : `Give ${label ?? ""}${label && frequency === "monthly" ? " monthly" : ""}`.trim()}
        {!sending && <ArrowRight className="size-4" aria-hidden />}
      </button>

      <p className="mt-3 flex items-start justify-center gap-1.5 text-center font-body text-xs text-muted-foreground">
        <Shield className="mt-0.5 size-3.5 shrink-0" aria-hidden />
        You&apos;ll enter your card on Stripe&apos;s secure page. We never see or store your card.
        {frequency === "monthly" && " A monthly gift repeats each month until you ask us to stop."}
      </p>
      <p id="give-ack" className="mt-2 text-center font-body text-xs text-muted-foreground/80">
        {ACKNOWLEDGMENT}
      </p>
    </form>
  );
}
