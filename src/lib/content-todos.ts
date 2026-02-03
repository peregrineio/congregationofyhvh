// ============================================================
// CONTENT REVIEW - Items Needing Client Input
// ============================================================
// This file documents all placeholder content that needs to be
// replaced with actual data from Pastor Frank before launch.
// ============================================================

export const CONTENT_TODOS = [
  // SERVICE INFORMATION
  {
    category: "Service Info",
    item: "Service day",
    file: "src/lib/constants.ts",
    field: "SITE_CONFIG.serviceDay",
    currentValue: "Saturday",
    note: "Confirm day with Pastor Frank",
  },
  {
    category: "Service Info",
    item: "Service time",
    file: "src/lib/constants.ts",
    field: "SITE_CONFIG.serviceTime",
    currentValue: "10:00 AM",
    note: "Confirm time with Pastor Frank",
  },
  {
    category: "Service Info",
    item: "Full address",
    file: "src/lib/constants.ts",
    field: "SITE_CONFIG.address",
    currentValue: "Houston, TX",
    note: "Need full street address for map integration",
  },
  {
    category: "Service Info",
    item: "Phone number",
    file: "src/lib/constants.ts",
    field: "SITE_CONFIG.phone",
    currentValue: "(empty)",
    note: "Need congregation phone number",
  },
  {
    category: "Service Info",
    item: "Email address",
    file: "src/lib/constants.ts",
    field: "SITE_CONFIG.email",
    currentValue: "(empty)",
    note: "Need congregation email address",
  },

  // LEADERSHIP
  {
    category: "Leadership",
    item: "Pastor photo",
    file: "src/components/sections/welcome.tsx",
    currentValue: "User icon placeholder",
    note: "Professional headshot preferred",
  },
  {
    category: "Leadership",
    item: "Pastor full name",
    file: "src/app/about/our-team/page.tsx",
    currentValue: "Pastor Frank",
    note: "Confirm full name and title",
  },
  {
    category: "Leadership",
    item: "Pastor bio",
    file: "src/app/about/our-team/page.tsx",
    currentValue: "Generic bio text",
    note: "Need actual biography from Pastor Frank",
  },
  {
    category: "Leadership",
    item: "Additional team members",
    file: "src/app/about/our-team/page.tsx",
    currentValue: "(none)",
    note: "Elders, deacons - names, roles, photos, bios",
  },

  // BRANDING
  {
    category: "Branding",
    item: "Congregation logo (PNG/SVG)",
    file: "Multiple (header, footer, hero, favicon)",
    currentValue: "Letter 'Y' placeholder",
    note: "Need high-res logo files",
  },
  {
    category: "Branding",
    item: "Favicon",
    file: "src/app/favicon.ico",
    currentValue: "Default Next.js favicon",
    note: "Generate from logo",
  },
  {
    category: "Branding",
    item: "OG image for social sharing",
    file: "src/app/layout.tsx (metadata)",
    currentValue: "(none)",
    note: "1200x630 image for social cards",
  },
  {
    category: "Branding",
    item: "Domain name",
    file: "src/lib/constants.ts, sitemap.ts, robots.ts",
    currentValue: "congregationyhvh.com",
    note: "Client to provide/purchase domain",
  },

  // INTEGRATIONS
  {
    category: "Integration",
    item: "Google Maps embed",
    file: "src/components/sections/location.tsx, contact page",
    currentValue: "Placeholder box",
    note: "Need full address to generate embed",
  },
  {
    category: "Integration",
    item: "Donation platform",
    file: "src/app/give/page.tsx",
    currentValue: "Disabled button placeholder",
    note: "Need Stripe/PayPal decision from client",
  },
  {
    category: "Integration",
    item: "Contact form backend",
    file: "src/app/contact/page.tsx",
    currentValue: "Client-side only (no submission)",
    note: "Wire up via Resend or Supabase",
  },

  // CONTENT
  {
    category: "Content",
    item: "Feast day dates 2026",
    file: "src/lib/content.ts",
    currentValue: "Estimated dates",
    note: "Confirm with observed biblical calendar",
  },
  {
    category: "Content",
    item: "Fellowship photos",
    file: "Future gallery section",
    currentValue: "(none)",
    note: "As available from the congregation",
  },
] as const;
