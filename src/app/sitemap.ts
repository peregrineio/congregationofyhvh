import type { MetadataRoute } from "next";

// TODO: Update baseUrl when domain is confirmed
const baseUrl = "https://congregationyhvh.com";

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
