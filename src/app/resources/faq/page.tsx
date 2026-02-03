"use client";

import { PageHero } from "@/components/ui/page-hero";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_ITEMS } from "@/lib/content";

export default function FAQPage() {
  return (
    <>
      <PageHero
        title="Frequently Asked Questions"
        subtitle="Common questions about our faith and community"
      />

      <div className="mx-auto max-w-3xl px-4 py-16">
        <Accordion type="single" collapsible className="space-y-3">
          {FAQ_ITEMS.map((item, index) => (
            <AccordionItem
              key={index}
              value={`faq-${index}`}
              className="border border-border/40 rounded-lg bg-card px-4 data-[state=open]:border-primary/30"
            >
              <AccordionTrigger className="font-subheading text-base text-foreground hover:text-primary py-4 [&[data-state=open]]:text-primary">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="font-body text-sm leading-relaxed text-muted-foreground pb-4">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center pt-12">
          <p className="text-sm text-muted-foreground">
            Have another question?{" "}
            <a
              href="/contact"
              className="text-primary hover:underline font-medium"
            >
              Contact us
            </a>{" "}
            and we would be happy to help.
          </p>
        </div>
      </div>
    </>
  );
}
