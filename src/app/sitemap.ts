import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { servicePages } from "@/lib/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: site.url,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...servicePages.map((s) => ({
      url: `${site.url}/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      // Service pages are the organic entry points, just below the homepage.
      priority: 0.8,
    })),
  ];
}
