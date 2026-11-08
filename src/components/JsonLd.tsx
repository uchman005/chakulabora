import { serializeJsonLd } from "@/lib/sanitize";

/**
 * The single, audited place where the app injects raw markup.
 *
 * Why `dangerouslySetInnerHTML` is still needed: React escapes text children
 * (e.g. `"` → `&quot;`), and browsers don't decode entities inside <script>,
 * so children would produce invalid JSON. Next.js documents this pattern for
 * JSON-LD. The risk is mitigated by:
 *   - server-only rendering (this is a Server Component, never given client input),
 *   - `serializeJsonLd`, which escapes `<`, `>`, `&`, U+2028 and U+2029 so the
 *     content cannot close the <script> tag or inject HTML,
 *   - `type="application/ld+json"`, which browsers never execute,
 *   - callers pass plain text only (HTML is stripped with `plainText`).
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
