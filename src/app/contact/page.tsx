"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { PageHero } from "@/components/ui/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { GoldButton } from "@/components/ui/gold-button";
import { SITE_CONFIG } from "@/lib/constants";
import { MapPin, Clock, Mail, Phone, Send, CheckCircle } from "@/components/icons";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: Wire up form submission (email via Resend, or Supabase)
    setSubmitted(true);
  }

  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="We would love to hear from you"
      />

      <div className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid gap-10 md:grid-cols-[1fr_auto]">
          {/* Form */}
          <Card className="border-border/40 bg-card">
            <CardContent className="py-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                  <CheckCircle className="size-12 text-success" />
                  <h2 className="font-heading text-2xl text-foreground">
                    Message Sent
                  </h2>
                  <p className="text-muted-foreground max-w-sm">
                    Thank you for reaching out. We will get back to you as soon
                    as possible. Shalom!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="name"
                        className="text-sm font-medium text-foreground"
                      >
                        Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium text-foreground"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="subject"
                      className="text-sm font-medium text-foreground"
                    >
                      Subject
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      placeholder="How can we help?"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium text-foreground"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                      placeholder="Your message..."
                    />
                  </div>
                  <GoldButton type="submit" className="w-full sm:w-auto">
                    <Send className="size-4" />
                    Send Message
                  </GoldButton>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Contact info sidebar */}
          <div className="space-y-6 md:w-64">
            <div className="flex items-start gap-3">
              <MapPin className="size-5 text-primary mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Location
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {SITE_CONFIG.address}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="size-5 text-primary mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Service Times
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {SITE_CONFIG.serviceDay} at {SITE_CONFIG.serviceTime}
                </p>
              </div>
            </div>
            {SITE_CONFIG.email && (
              <div className="flex items-start gap-3">
                <Mail className="size-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Email
                  </h3>
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="text-sm text-secondary hover:text-primary transition-colors mt-1 block"
                  >
                    {SITE_CONFIG.email}
                  </a>
                </div>
              </div>
            )}
            {SITE_CONFIG.phone && (
              <div className="flex items-start gap-3">
                <Phone className="size-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Phone
                  </h3>
                  <a
                    href={`tel:${SITE_CONFIG.phone}`}
                    className="text-sm text-secondary hover:text-primary transition-colors mt-1 block"
                  >
                    {SITE_CONFIG.phone}
                  </a>
                </div>
              </div>
            )}

            {/* Map placeholder */}
            <div className="rounded-lg border border-border/40 bg-card p-4 flex items-center justify-center min-h-[150px]">
              <div className="text-center space-y-1">
                <MapPin className="size-6 text-primary/30 mx-auto" />
                <p className="text-xs text-muted-foreground/50">Map</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
