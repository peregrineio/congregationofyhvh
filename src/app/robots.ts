import type { MetadataRoute } from "next";

// TODO: Update when domain is confirmed
const baseUrl = "https://congregationyhvh.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
