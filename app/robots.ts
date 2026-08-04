import type { MetadataRoute } from "next"

// Keep the in-progress exercise pages and personal results pages out of search
// engines entirely. The landing page stays crawlable so the tool itself can be
// found; individual sessions and results (which contain participants' names)
// are disallowed.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/exercise/", "/values/"],
    },
  }
}
