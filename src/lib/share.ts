import { SITE_URL } from "@/lib/site";

/** X counts every link as 23 characters of its 280 limit; leave room for that and a space. */
const X_TITLE_LIMIT = 250;

/** The public, canonical URL of a post (never localhost, so shared links always work). */
export function postUrl(blob: string): string {
  return `${SITE_URL}/post/${encodeURIComponent(blob)}`;
}

export interface ShareLinks {
  whatsapp: string;
  facebook: string;
  x: string;
}

/** Build share URLs for a post. All user text is URL-encoded by URLSearchParams. */
export function shareLinks(title: string, blob: string): ShareLinks {
  const url = postUrl(blob);
  const xTitle = title.length > X_TITLE_LIMIT ? `${title.slice(0, X_TITLE_LIMIT - 1).trimEnd()}…` : title;

  return {
    whatsapp: `https://wa.me/?${new URLSearchParams({ text: title ? `${title}\n${url}` : url })}`,
    // Facebook only accepts the link; it reads the title and image from the page's Open Graph tags.
    facebook: `https://www.facebook.com/sharer/sharer.php?${new URLSearchParams({ u: url })}`,
    x: `https://x.com/intent/post?${new URLSearchParams({ text: xTitle, url })}`,
  };
}
