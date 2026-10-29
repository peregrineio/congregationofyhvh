import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";
import { PageHero } from "@/components/ui/page-hero";

export const metadata: Metadata = {
  title: "Privacy | Congregation of YHVH",
  description:
    "What the Congregation of YHVH website collects through the contact form and chat assistant, who sees it, and how to ask us to delete it.",
};

// Keep this in step with what the site actually does: the contact form and
// chat flows email the church inbox (no database), the chat keeps its
// conversation in the visitor's own browser for 7 days, and there are no
// analytics or advertising cookies.
const EFFECTIVE = "29 October 2026";

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: "What we collect",
    body: (
      <>
        <p>
          <strong>The contact form.</strong> Your name, email address, the subject you choose and
          your message. It is sent by email to our church inbox ({SITE_CONFIG.email}) so we can
          reply. The website itself does not store it.
        </p>
        <p>
          <strong>The chat assistant.</strong> The assistant runs in your browser. Your
          conversation is kept in your own browser for 7 days so you can pick up where you left
          off, and you can clear it at any time by clearing this site&apos;s data. Nothing is sent
          to us unless you finish a request (such as planning a visit or a prayer request) and
          press <em>Send</em>. Then the details you entered are emailed to the same church inbox.
        </p>
        <p>
          <strong>Prayer requests</strong> are shared only with the pastor and the board. Please
          leave out medical details or anything you would not want written down.
        </p>
      </>
    ),
  },
  {
    title: "What we don't do",
    body: (
      <p>
        We never sell, rent or trade your information, and we don&apos;t use it for advertising.
        This site has no analytics, advertising or tracking cookies. We use what you send us
        only to answer you and to care for you.
      </p>
    ),
  },
  {
    title: "Services that help run the site",
    body: (
      <>
        <p>
          The site is hosted by Vercel, which keeps short-lived technical logs (such as IP
          addresses) to keep the site running and secure. Messages are delivered through an email
          service provider.
        </p>
        <p>
          The map on our home and contact pages is provided by Google Maps. Teaching thumbnails
          come from YouTube, and a teaching video loads from YouTube only when you press play.
          Those services handle your visit under their own privacy policies.
        </p>
      </>
    ),
  },
  {
    title: "How long we keep it",
    body: (
      <p>
        Messages stay in our church inbox only as long as we need them to respond to you and
        care for you.
      </p>
    ),
  },
  {
    title: "Ask us to delete it",
    body: (
      <p>
        Email{" "}
        <a
          href={`mailto:${SITE_CONFIG.email}?subject=Privacy%20request`}
          className="text-yhvh-gold-dark underline underline-offset-4"
        >
          {SITE_CONFIG.email}
        </a>{" "}
        with the subject &ldquo;Privacy request&rdquo; to see, correct or delete anything you
        have sent us. We will delete it and confirm by email.
      </p>
    ),
  },
  {
    title: "Children",
    body: (
      <p>
        This website is not meant for children under 13 to send us information. Parents are
        welcome to contact us on their behalf.
      </p>
    ),
  },
  {
    title: "Changes",
    body: (
      <p>
        If this notice changes, we will update it on this page with a new date. Questions? Visit
        our <Link href="/contact" className="text-yhvh-gold-dark underline underline-offset-4">contact page</Link>.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero title="Privacy" subtitle={`How we handle what you share with us · Effective ${EFFECTIVE}`} />

      <section className="bg-background px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-10">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="font-heading text-2xl text-foreground">{section.title}</h2>
              <span aria-hidden className="mt-3 block h-px w-12 bg-yhvh-gold/50" />
              <div className="mt-4 space-y-4 font-body text-base leading-relaxed text-muted-foreground">
                {section.body}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
