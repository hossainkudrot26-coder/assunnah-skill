import { describe, it, expect } from "vitest";

// Extract the esc() function logic for testing
// (It's not exported from email.ts, so we test the same logic)
function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

describe("Email HTML Sanitizer (esc)", () => {
  it("escapes script tags", () => {
    const malicious = '<script>alert("xss")</script>';
    const result = esc(malicious);
    expect(result).not.toContain("<script>");
    expect(result).toContain("&lt;script&gt;");
  });

  it("escapes HTML entities", () => {
    expect(esc("&")).toBe("&amp;");
    expect(esc("<")).toBe("&lt;");
    expect(esc(">")).toBe("&gt;");
    expect(esc('"')).toBe("&quot;");
    expect(esc("'")).toBe("&#039;");
  });

  it("handles combined attack vectors", () => {
    const input = `<img src=x onerror="alert('xss')">`;
    const result = esc(input);
    expect(result).not.toContain("<img");
    expect(result).toContain("&lt;img");
    // onerror is safe as plain text once < is escaped — browser won't parse it as HTML
    expect(result).toContain("&lt;img src=x onerror=&quot;alert(&#039;xss&#039;)&quot;&gt;");
  });

  it("leaves safe text unchanged", () => {
    const safe = "মোহাম্মদ আহমেদ — ফোন: 01712345678";
    expect(esc(safe)).toBe(safe);
  });

  it("handles empty string", () => {
    expect(esc("")).toBe("");
  });

  it("handles Bengali text correctly", () => {
    const bengali = "আস-সুন্নাহ স্কিল ডেভেলপমেন্ট";
    expect(esc(bengali)).toBe(bengali);
  });

  it("escapes event handler injection via quotes", () => {
    const input = '" onmouseover="alert(1)" foo="';
    const result = esc(input);
    // The quotes are escaped, so the attribute injection is neutralized
    expect(result).toContain("&quot;");
    expect(result).not.toContain('"');
    expect(result).toBe("&quot; onmouseover=&quot;alert(1)&quot; foo=&quot;");
  });
});
