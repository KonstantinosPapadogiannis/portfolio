import type { MetadataRoute } from "next";
import { deployment } from "@/config/deployment";
import { siteConfig } from "@/config/site";

// Preview deployments ask every crawler to stay away; their pages also carry
// noindex, in the markup and in the X-Robots-Tag header (next.config.ts).
export default function robots(): MetadataRoute.Robots {
  if (!deployment.indexable) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
