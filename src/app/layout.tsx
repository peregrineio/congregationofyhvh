import type { Metadata } from "next";
import {
  Cinzel,
  DM_Sans,
  Source_Serif_4,
  Crimson_Pro,
  Frank_Ruhl_Libre,
} from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LiveBar } from "@/components/layout/live-bar";
import { FeedbackWidget } from "@/components/feedback-widget";
import { SITE_CONFIG } from "@/lib/constants";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-cinzel",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-source-serif",
  display: "swap",
});

const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  variable: "--font-crimson-pro",
  display: "swap",
});

const frankRuhl = Frank_Ruhl_Libre({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-frank-ruhl",
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
      className={`${cinzel.variable} ${dmSans.variable} ${sourceSerif.variable} ${crimsonPro.variable} ${frankRuhl.variable}`}
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
        <FeedbackWidget />
      </body>
    </html>
  );
}
