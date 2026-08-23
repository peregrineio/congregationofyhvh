"use client";

import { useState, type FormEvent } from "react";
import { SITE_CONFIG } from "@/lib/constants";
import { Send, Mail, User, CheckCircle, AlertCircle } from "@/components/icons";

type State =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "sent" }
  | { status: "unavailable" }
  | { status: "error"; message: string };

const SUBJECTS = [
  "I'd like to visit",
  "A question about what you believe",
  "Children's Shabbat",
  "Prayer request",
  "Serving and getting involved",
  "Something else",
];

export function ContactForm() {
  const [state, setState] = useState<State>({ status: "idle" });
  const [consent, setConsent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.status === "sending") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    setState({ status: "sending" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          subject: data.get("subject"),
          message: data.get("message"),
          website: data.get("website"),
        }),
      });

      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        reason?: string;
      };

      if (result.ok) {
        form.reset();
        setConsent(false);
        setState({ status: "sent" });
        return;
      }

      // Delivery is not wired up yet. Say so plainly and point at the inbox
      // rather than showing a confirmation for a message nobody received.
      if (result.reason === "not-configured") {
        setState({ status: "unavailable" });
        return;
      }

      setState({
        status: "error",
        message:
          result.reason === "missing-fields"
            ? "Please fill in your name, email, and message."
            : result.reason === "bad-email"
              ? "That email address doesn't look right."
              : "Something went wrong sending your message.",
      });
    } catch {
      setState({ status: "error", message: "We couldn't reach the server." });
    }
  }

  if (state.status === "sent") {
    return (
      <div className="parchment-plate rounded-xl p-10 text-center">
        <span className="inline-flex size-14 items-center justify-center rounded-full bg-yhvh-gold/15 text-yhvh-gold-dark">
          <CheckCircle className="size-7" aria-hidden />
        </span>
        <h2 className="mt-4 font-heading text-2xl text-foreground">Message sent</h2>
        <p className="mx-auto mt-3 max-w-sm font-body text-sm leading-relaxed text-muted-foreground">
          Thank you for reaching out. Someone from the congregation will get back to
          you as soon as possible.
        </p>
        <button
          type="button"
          onClick={() => setState({ status: "idle" })}
          className="mt-6 font-subheading text-xs uppercase tracking-widest text-yhvh-gold-dark underline underline-offset-4"
        >
          Send another message
        </button>
      </div>
    );
  }

  const disabled = state.status === "sending" || !consent;

  return (
    <div className="parchment-plate rounded-xl p-7 md:p-9">
      <div className="flex items-center gap-4">
        <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-yhvh-gold/15 text-yhvh-gold-dark">
          <Mail className="size-5" aria-hidden />
        </span>
        <div>
          <h2 className="font-heading text-2xl text-foreground">Send a Message</h2>
          <p className="mt-1 font-body text-sm text-muted-foreground">
            Fill out the form below and we&apos;ll get back to you as soon as possible.
          </p>
        </div>
      </div>

      <span aria-hidden className="mt-6 block h-px w-full bg-yhvh-gold/25" />

      <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
        {/* Honeypot — visually and programmatically hidden from people. */}
        <div aria-hidden className="hidden">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="name"
              className="font-subheading text-xs uppercase tracking-widest text-foreground"
            >
              Your Name <span className="text-destructive">*</span>
            </label>
            <div className="relative mt-2">
              <User
                aria-hidden
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-yhvh-gold-dark/60"
              />
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Your name"
                className="w-full rounded-lg border border-yhvh-gold/25 bg-[#fdfbf6] py-3 pl-10 pr-4 font-body text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-yhvh-gold/60 focus:outline-none focus:ring-2 focus:ring-yhvh-gold/25"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="font-subheading text-xs uppercase tracking-widest text-foreground"
            >
              Email Address <span className="text-destructive">*</span>
            </label>
            <div className="relative mt-2">
              <Mail
                aria-hidden
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-yhvh-gold-dark/60"
              />
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="your@email.com"
                className="w-full rounded-lg border border-yhvh-gold/25 bg-[#fdfbf6] py-3 pl-10 pr-4 font-body text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-yhvh-gold/60 focus:outline-none focus:ring-2 focus:ring-yhvh-gold/25"
              />
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="subject"
            className="font-subheading text-xs uppercase tracking-widest text-foreground"
          >
            Subject
          </label>
          <select
            id="subject"
            name="subject"
            defaultValue=""
            className="mt-2 w-full rounded-lg border border-yhvh-gold/25 bg-[#fdfbf6] px-4 py-3 font-body text-sm text-foreground focus:border-yhvh-gold/60 focus:outline-none focus:ring-2 focus:ring-yhvh-gold/25"
          >
            <option value="">How can we help?</option>
            {SUBJECTS.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="message"
            className="font-subheading text-xs uppercase tracking-widest text-foreground"
          >
            Message <span className="text-destructive">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            placeholder="Your message…"
            className="mt-2 w-full resize-y rounded-lg border border-yhvh-gold/25 bg-[#fdfbf6] px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-yhvh-gold/60 focus:outline-none focus:ring-2 focus:ring-yhvh-gold/25"
          />
        </div>

        <label className="flex items-start gap-3 font-body text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={consent}
            onChange={e => setConsent(e.target.checked)}
            className="mt-0.5 size-4 shrink-0 rounded border-yhvh-gold/40 text-yhvh-gold focus:ring-yhvh-gold/40"
          />
          I agree to be contacted regarding my inquiry.
        </label>

        {state.status === "unavailable" && (
          <p
            role="status"
            className="flex items-start gap-3 rounded-lg border border-yhvh-gold/30 bg-yhvh-gold/[0.08] p-4 font-body text-sm text-foreground"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-yhvh-gold-dark" aria-hidden />
            <span>
              Our contact form isn&apos;t receiving messages just yet. Please email us
              directly at{" "}
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="text-yhvh-gold-dark underline underline-offset-4"
              >
                {SITE_CONFIG.email}
              </a>{" "}
              and we&apos;ll reply as soon as we can.
            </span>
          </p>
        )}

        {state.status === "error" && (
          <p
            role="alert"
            className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/[0.06] p-4 font-body text-sm text-foreground"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
            <span>
              {state.message} You can also email{" "}
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="text-yhvh-gold-dark underline underline-offset-4"
              >
                {SITE_CONFIG.email}
              </a>
              .
            </span>
          </p>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={disabled}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-yhvh-gold px-7 py-3 font-subheading text-sm uppercase tracking-widest text-white transition-colors hover:bg-yhvh-gold-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="size-4" aria-hidden />
            {state.status === "sending" ? "Sending…" : "Send Message"}
          </button>

          <p className="font-body text-sm text-muted-foreground">
            Prefer email?{" "}
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="text-yhvh-gold-dark underline underline-offset-4"
            >
              {SITE_CONFIG.email}
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
