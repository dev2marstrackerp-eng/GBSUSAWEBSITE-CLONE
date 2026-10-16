import type { MetadataRoute } from "next";
import { modules } from "@/content/modules";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/solutions", "/industries", "/about", "/contact", "/book-a-demo"];
  return [
    ...pages.map((p) => ({
      url: `${site.url}${p}`,
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : 0.8,
    })),
    ...modules.map((m) => ({
      url: `${site.url}/solutions/${m.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
