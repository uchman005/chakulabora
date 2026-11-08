import type { Metadata } from "next";
import { OG_IMAGE, SITE_NAME, SITE_SHORT_NAME } from "@/lib/site";

interface PageMetaInput {
  title: string;
  description?: string;
  /** Path beginning with "/" — used for the canonical URL and og:url. */
  path: string;
  /** Hide from search engines (auth, dashboard tools, thank-you pages…). */
  noIndex?: boolean;
  image?: { url: string; width?: number; height?: number; alt?: string };
}

/** Build consistent per-page metadata (canonical, Open Graph, Twitter, robots). */
export function pageMetadata({ title, description, path, noIndex, image }: PageMetaInput): Metadata {
  const images = [image ?? OG_IMAGE];
  // The `title.template` only applies to <title>, so social titles get the suffix explicitly.
  const socialTitle = `${title} | ${SITE_SHORT_NAME}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: SITE_NAME,
      url: path,
      title: socialTitle,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: images.map((i) => i.url),
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}
