import "server-only";
import sanitizeHtml from "sanitize-html";

/**
 * Allowlist matching what the Quill toolbar can produce (headers, font/size,
 * bold/italic/underline/strike, blockquote, lists, indent, links). Everything
 * else — <script>, <iframe>, <form>, <style>, <img>, inline styles, event
 * handler attributes, javascript:/data: URLs — is removed.
 */
const QUILL_CLASS = /^ql-(indent-[1-8]|size-(small|large|huge)|font-(serif|monospace)|align-(center|right|justify))$/;

const COLOR = /^(#[0-9a-f]{3,8}|rgba?\(\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*(,\s*(0|1|0?\.\d+))?\s*\)|[a-z]{3,20})$/i;

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ["p", "br", "h1", "h2", "strong", "b", "em", "i", "u", "s", "strike", "blockquote", "ol", "ul", "li", "a", "span", "sub", "sup", "code", "pre"],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    li: ["data-list", "class"],
    p: ["class", "style"],
    span: ["class", "style"],
    strong: ["style"],
    b: ["style"],
    h1: ["class"],
    h2: ["class"],
    ol: ["class"],
    ul: ["class"],
    blockquote: ["class"],
  },
  allowedClasses: { "*": [QUILL_CLASS] },
  // Pasted text keeps simple colour/weight/alignment (seen in real posts); anything that
  // can affect layout or positioning (position, display, url(), expressions…) is dropped.
  allowedStyles: {
    "*": {
      color: [COLOR],
      "background-color": [COLOR],
      "font-weight": [/^(normal|bold|bolder|lighter|[1-9]00)$/],
      "text-align": [/^(left|right|center|justify)$/],
    },
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowProtocolRelative: false,
  // Drop the *contents* of dangerous elements, not just the tags.
  nonTextTags: ["script", "style", "textarea", "option", "noscript", "iframe", "object", "embed", "template", "svg", "math"],
  disallowedTagsMode: "discard",
  transformTags: {
    // User links open safely and pass no SEO credit (user-generated content).
    a: (tagName, attribs) => ({
      tagName,
      attribs: { ...attribs, target: "_blank", rel: "noopener noreferrer nofollow ugc" },
    }),
    // Quill 2 lists use data-list="bullet|ordered|checked|unchecked"; keep only known values.
    li: (tagName, attribs) => {
      const { "data-list": list, ...rest } = attribs;
      const out: sanitizeHtml.Attributes = { ...rest };
      if (list && /^(bullet|ordered|checked|unchecked)$/.test(list)) out["data-list"] = list;
      return { tagName, attribs: out };
    },
  },
};

/** Sanitize user-authored rich text (post bodies and answers). Idempotent. */
export function sanitizeRichText(html: string | undefined | null): string {
  if (!html) return "";
  return sanitizeHtml(html, OPTIONS);
}

/** Escape plain text for interpolation into an HTML string (e.g. emails). */
export function escapeHtml(text: unknown): string {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Serialize data for a `<script type="application/ld+json">` block.
 * Escapes characters that could end the script element or confuse HTML/JS
 * parsers, so user content can never break out of the JSON (OWASP guidance).
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(new RegExp("\u2028", "g"), "\\u2028")
    .replace(new RegExp("\u2029", "g"), "\\u2029");
}
