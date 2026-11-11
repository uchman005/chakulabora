import { escapeRegExp } from "@/lib/search-query";

/**
 * Renders text with search terms wrapped in <mark>. Works on plain text only and lets
 * React escape everything, so user content can never inject markup.
 */
export default function Highlight({ text, terms }: { text: string; terms: string[] }) {
  if (!terms.length || !text) return <>{text}</>;
  // Longest first, so "soils" wins over "soil" where both match.
  const sorted = [...terms].sort((a, b) => b.length - a.length);
  const pattern = new RegExp(`(${sorted.map(escapeRegExp).join("|")})`, "gi");
  const lowerTerms = new Set(terms);
  return (
    <>
      {text.split(pattern).map((part, i) =>
        lowerTerms.has(part.toLowerCase()) ? (
          <mark key={i} className="rounded-sm bg-yellow-200 px-0.5 text-inherit">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}
