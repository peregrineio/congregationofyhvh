import type { Metadata } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LiveBar } from "@/components/layout/live-bar";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { SITE_CONFIG } from "@/lib/constants";
import "./globals.css";

// Self-hosted (src/app/fonts, OFL licences alongside): Vercel builds failed while
// fetching next/font/google, and the /give CSP allows fonts from this site only.
// Variable woff2 files, latin subset (+ hebrew for Frank Ruhl Libre).
const cinzel = localFont({
  src: [{ path: "./fonts/cinzel-latin.woff2", weight: "600 700", style: "normal" }],
  variable: "--font-cinzel",
  display: "swap",
});

const dmSans = localFont({
  src: [{ path: "./fonts/dm-sans-latin.woff2", weight: "400 600", style: "normal" }],
  variable: "--font-dm-sans",
  display: "swap",
});

const sourceSerif = localFont({
  src: [{ path: "./fonts/source-serif-4-latin.woff2", weight: "400 500", style: "normal" }],
  variable: "--font-source-serif",
  display: "swap",
});

const crimsonPro = localFont({
  src: [{ path: "./fonts/crimson-pro-italic-latin.woff2", weight: "400", style: "italic" }],
  variable: "--font-crimson-pro",
  display: "swap",
});

// Latin and Hebrew are separate files; globals.css stacks the two families. No generated
// fallback on the latin one, or the fallback (a system serif) would draw the Hebrew first.
const frankRuhl = localFont({
  src: [{ path: "./fonts/frank-ruhl-libre-latin.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-frank-ruhl",
  display: "swap",
  adjustFontFallback: false,
});

const frankRuhlHebrew = localFont({
  src: [{ path: "./fonts/frank-ruhl-libre-hebrew.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-frank-ruhl-he",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Congregation of YHVH | The Way - The Truth - The Life",
    template: "%s | Congregation of YHVH",
  },
  description:
    "A Messianic congregation devoted to honoring YHVH through faith in Yahshua the Messiah and obedience to His commandments. Join us for Shabbat in Houston, TX.",
  keywords: [
    "Congregation of YHVH",
    "Messianic congregation",
    "Torah observant",
    "Yahshua",
    "Shabbat",
    "Houston Texas",
    "Messianic fellowship",
    "Hebrew roots",
    "Biblical feasts",
  ],
  authors: [{ name: "Congregation of YHVH" }],
  creator: "Peregrine IO",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Congregation of YHVH",
    title: "Congregation of YHVH | The Way - The Truth - The Life",
    description:
      "A Messianic congregation devoted to honoring YHVH through faith in Yahshua the Messiah and obedience to His commandments.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Congregation of YHVH",
    description:
      "A Messianic congregation devoted to honoring YHVH through faith in Yahshua the Messiah.",
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL(SITE_CONFIG.domain),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${dmSans.variable} ${sourceSerif.variable} ${crimsonPro.variable} ${frankRuhl.variable} ${frankRuhlHebrew.variable}`}
    >
      <body className="min-h-screen antialiased">
        {/* Renders only while the channel is actually streaming; otherwise
            it returns null and costs the layout nothing. */}
        <LiveBar />
        <Header />
        <main id="main-content" className="pt-28 md:pt-32 lg:pt-36">{children}</main>
        <Footer />
        {/* Staging-only client feedback. Inert unless the env vars say
            staging AND the host is *.vercel.app — see the component. */}
        {/* Ported from the Aeopic site's assistant. Runs in the browser;
            only a completed visit / prayer / message flow is ever sent. */}
        <ChatWidget />
      </body>
    </html>
  );
}
