import { siteConfig } from "@/data/siteConfig";
import { listings } from "@/data/listings";

export default function sitemap() {
  const baseUrl = siteConfig.url;

  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const listingRoutes = listings.map((item) => ({
    url: `${baseUrl}/listings/${item.slug}`,
    lastModified: new Date(item.createdAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...listingRoutes];
}

