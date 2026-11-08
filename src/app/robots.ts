import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/dashboard$", "/post/"],
        disallow: ["/api/", "/dashboard/", "/auth/signin", "/auth/forgotpassword", "/reset-password/", "/thankyou", "/lostdonor"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
