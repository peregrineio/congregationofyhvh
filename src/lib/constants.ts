// ============================================================
// Congregation of YHVH -- Site Constants
// ============================================================

export const SITE_CONFIG = {
  name: "Congregation of YHVH",
  tagline: "The Way \u2014 The Truth \u2014 The Life",
  description:
    "A Messianic congregation devoted to honoring YHVH through faith in Yahshua the Messiah and obedience to His commandments.",
  // TODO: Update when confirmed by Pastor Frank
  serviceDay: "Saturday",
  serviceTime: "10:00 AM",
  address: "11050 W Little York Rd. Suite A1, Houston, TX 77041",
  addressLine1: "11050 W Little York Rd.",
  addressLine2: "Suite A1",
  city: "Houston",
  state: "TX",
  zip: "77041",
  phone: "", // TODO: From Pastor Frank
  email: "", // TODO: From Pastor Frank
  domain: "", // TODO: Client to provide
} as const;

export interface NavLink {
  label: string;
  href: string;
  children?: NavLink[];
}

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  {
    label: "About Us",
    href: "/about",
    children: [
      { label: "Vision & Mission", href: "/about/vision-mission" },
      { label: "Statement of Faith", href: "/about/statement-of-faith" },
      { label: "What We Believe", href: "/about/what-we-believe" },
      { label: "Core Values", href: "/about/core-values" },
      { label: "Our Team", href: "/about/our-team" },
    ],
  },
  { label: "Weekly Shabbat", href: "/shabbat" },
  {
    label: "Resources",
    href: "/resources",
    children: [
      { label: "Biblical Calendar", href: "/resources/calendar" },
      { label: "Torah Portions", href: "/resources/torah-portions" },
      { label: "FAQ", href: "/resources/faq" },
    ],
  },
  { label: "Ministries", href: "/ministries" },
  { label: "Give", href: "/give" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_LINKS = {
  about: [
    { label: "Vision & Mission", href: "/about/vision-mission" },
    { label: "Statement of Faith", href: "/about/statement-of-faith" },
    { label: "What We Believe", href: "/about/what-we-believe" },
    { label: "Our Team", href: "/about/our-team" },
  ],
  quickLinks: [
    { label: "Weekly Shabbat", href: "/shabbat" },
    { label: "Give", href: "/give" },
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/resources/faq" },
  ],
  resources: [
    { label: "Biblical Calendar", href: "/resources/calendar" },
    { label: "Torah Portions", href: "/resources/torah-portions" },
    { label: "Ministries", href: "/ministries" },
  ],
} as const;

export const SCRIPTURES = {
  footer:
    "Fear Elohim and keep His commandments, for this is the whole duty of man.",
  footerRef: "Ecclesiastes 12:13",
  hero: "Sanctify them by Your truth. Your word is truth.",
  heroRef: "John 17:17",
  giving: "Each one must give as he has decided in his heart, not reluctantly or under compulsion, for Elohim loves a cheerful giver.",
  givingRef: "2 Corinthians 9:7",
} as const;
