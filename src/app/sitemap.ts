import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";

// Single source of truth — this used to be hard-coded to congregationyhvh.com,
// which is not a domain we own, so every canonical and every sitemap entry
// pointed at a stranger's namespace.
const baseUrl = SITE_CONFIG.domain;

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/about/vision-mission",
    "/about/statement-of-faith",
    "/about/what-we-believe",
    "/about/core-values",
    "/about/our-team",
    "/shabbat",
    "/events",
    "/resources",
    "/resources/calendar",
    "/resources/torah-portions",
    "/resources/faq",
    "/ministries",
    "/give",
    "/contact",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.split("/").length <= 2 ? 0.8 : 0.6,
  }));
}
