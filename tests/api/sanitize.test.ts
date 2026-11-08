import { describe, expect, test } from "bun:test";
import { escapeHtml, sanitizeRichText, serializeJsonLd } from "@/lib/sanitize";

describe("sanitizeRichText (user post/answer HTML)", () => {
  const cases: [string, string, RegExp][] = [
    ["script tags and their contents", "<p>hi</p><script>alert(1)</script>", /script|alert/],
    ["inline event handlers", '<p onclick="alert(1)">x</p><img src=x onerror="alert(1)">', /onclick|onerror|<img/],
    ["javascript: URLs", '<a href="javascript:alert(1)">x</a>', /javascript:/],
    ["data: URLs", '<a href="data:text/html;base64,PHNjcmlwdD4=">x</a>', /data:/],
    ["iframes / objects / embeds", '<iframe src="https://evil.example"></iframe><object data="x"></object><embed src="x">', /iframe|object|embed|evil/],
    ["forms and inputs", '<form action="https://evil.example"><input name="pw"></form>', /form|input/],
    ["style tags and inline styles", '<style>body{display:none}</style><p style="position:fixed">x</p>', /style|display|position/],
    ["svg payloads", '<svg onload="alert(1)"><circle /></svg>', /svg|onload/],
    ["meta refresh", '<meta http-equiv="refresh" content="0;url=https://evil.example">', /meta|refresh/],
    ["unknown classes", '<p class="fixed inset-0 ql-indent-2">x</p>', /fixed|inset-0/],
  ];

  for (const [name, input, forbidden] of cases) {
    test(`removes ${name}`, () => {
      expect(sanitizeRichText(input)).not.toMatch(forbidden);
    });
  }

  test("keeps everything the Quill editor produces", () => {
    const quill =
      '<h1>Title</h1><p class="ql-indent-1"><strong>b</strong> <em>i</em> <u>u</u> <s>s</s></p>' +
      '<blockquote>q</blockquote><ol><li data-list="bullet">one</li><li data-list="ordered">two</li></ol>' +
      '<p><span class="ql-size-large ql-font-serif">big</span></p>';
    expect(sanitizeRichText(quill)).toBe(quill);
  });

  test("keeps safe pasted colour/weight styles, drops layout and url() styles", () => {
    const out = sanitizeRichText(
      '<span style="color: rgb(13, 13, 13); background-color: #fff; font-weight: 600; position: fixed; background-image: url(https://evil.example/x.png)">t</span>'
    );
    expect(out).toContain("color:rgb(13, 13, 13)");
    expect(out).toContain("background-color:#fff");
    expect(out).toContain("font-weight:600");
    expect(out).not.toMatch(/position|url\(|evil/);
    expect(sanitizeRichText('<span style="color: expression(alert(1))">x</span>')).not.toMatch(/expression|style/);
  });

  test("links are kept but forced to open safely with ugc rel", () => {
    expect(sanitizeRichText('<a href="https://example.org">x</a>')).toBe(
      '<a href="https://example.org" target="_blank" rel="noopener noreferrer nofollow ugc">x</a>'
    );
  });

  test("drops unexpected data-list values", () => {
    expect(sanitizeRichText('<ol><li data-list="x onmouseover=alert(1)">a</li></ol>')).toBe("<ol><li>a</li></ol>");
  });

  test("is idempotent and handles empty input", () => {
    const once = sanitizeRichText('<p>a<script>x</script></p><a href="https://e.org">l</a>');
    expect(sanitizeRichText(once)).toBe(once);
    expect(sanitizeRichText(undefined)).toBe("");
    expect(sanitizeRichText("")).toBe("");
  });
});

describe("serializeJsonLd", () => {
  const LS = String.fromCharCode(0x2028);
  const PS = String.fromCharCode(0x2029);
  test("cannot close the script element or inject HTML", () => {
    const hostile = `</script><script>alert(1)</script> & <!-- ${LS}${PS}`;
    const out = serializeJsonLd({ name: hostile });
    for (const ch of ["<", ">", "&", LS, PS]) expect(out.includes(ch)).toBe(false);
    // Still valid JSON that round-trips to the original value.
    expect(JSON.parse(out).name).toBe(hostile);
  });
});

describe("escapeHtml", () => {
  test("escapes HTML metacharacters for email templates", () => {
    expect(escapeHtml(`<img src=x onerror="a('b')"> & co`)).toBe("&lt;img src=x onerror=&quot;a(&#39;b&#39;)&quot;&gt; &amp; co");
    expect(escapeHtml(undefined)).toBe("");
  });
});
