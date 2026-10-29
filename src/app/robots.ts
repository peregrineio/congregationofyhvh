import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";

// Same domain as sitemap.ts.
const baseUrl = SITE_CONFIG.domain;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
