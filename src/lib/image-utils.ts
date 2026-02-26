/**
 * Blur placeholder utilities for Next.js Image component.
 * Generates a tiny SVG shimmer placeholder for loading states.
 */

// Generate a shimmer SVG as base64 for blurDataURL
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#1B8A5015" offset="20%" />
      <stop stop-color="#1B8A5025" offset="50%" />
      <stop stop-color="#1B8A5015" offset="80%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#0F3D2D08" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)">
    <animate attributeName="x" from="-${w}" to="${w}" dur="1.5s" repeatCount="indefinite" />
  </rect>
</svg>`;

function toBase64(str: string) {
  return typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);
}

/** Use as blurDataURL prop on next/image */
export function getBlurPlaceholder(width = 700, height = 475): string {
  return `data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`;
}

/** A solid color placeholder (forest green tint) */
export const solidBlurPlaceholder =
  "data:image/svg+xml;base64," +
  toBase64(
    '<svg width="1" height="1" xmlns="http://www.w3.org/2000/svg"><rect width="1" height="1" fill="#0F3D2D12"/></svg>'
  );
