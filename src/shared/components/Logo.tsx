/**
 * As-Sunnah Skill Development Institute — Logo Component
 *
 * Industry-standard approach: SVG icon + CSS text = crisp at any size,
 * works in light/dark mode, no raster artifacts.
 *
 * Variants:
 *   "full"     — icon + AS-SUNNAH + subtitle (header, footer)
 *   "compact"  — icon + AS-SUNNAH (sidebar, mobile)
 *   "icon"     — icon only (favicon, avatar)
 */

import Link from "next/link";

type LogoVariant = "full" | "compact" | "icon";

interface LogoProps {
  variant?: LogoVariant;
  height?: number;
  dark?: boolean; // true = white text for dark backgrounds
  href?: string;
  className?: string;
}

function LogoIcon({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 140"
      width={size}
      height={size * (140 / 120)}
      className={className}
      aria-hidden="true"
    >
      {/* Upper dark-green S-curve */}
      <path
        fill="#0D8A4A"
        d="M62 2 C40 2, 20 18, 20 44 C20 70, 38 86, 60 86 Q80 86, 80 66 Q80 50, 62 50 Q48 50, 48 62 Z"
      />
      {/* Lower light-green S-curve */}
      <path
        fill="#7CC84E"
        d="M58 138 C80 138, 100 122, 100 96 C100 70, 82 54, 60 54 Q40 54, 40 74 Q40 90, 58 90 Q72 90, 72 78 Z"
      />
      {/* White arrow */}
      <path
        fill="#FFFFFF"
        d="M50 100 L56 72 L48 76 L66 34 L74 52 L66 48 L62 90 Z"
      />
      <polygon fill="#FFFFFF" points="66,34 84,46 72,54" />
    </svg>
  );
}

export default function Logo({
  variant = "full",
  height = 36,
  dark = false,
  href = "/",
  className,
}: LogoProps) {
  const textColor = dark ? "#FFFFFF" : "#0D8A4A";
  const subtitleColor = dark ? "rgba(255,255,255,0.7)" : "#5BBB5E";
  const iconSize = height;

  const content = (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: variant === "icon" ? 0 : height * 0.22,
        textDecoration: "none",
        lineHeight: 1,
      }}
      className={className}
    >
      <LogoIcon size={iconSize} />

      {variant !== "icon" && (
        <span style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <span
            style={{
              fontSize: height * 0.55,
              fontWeight: 700,
              color: textColor,
              letterSpacing: "0.04em",
              fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
              lineHeight: 1.1,
            }}
          >
            AS-SUNNAH
          </span>
          {variant === "full" && (
            <span
              style={{
                fontSize: height * 0.23,
                fontWeight: 500,
                color: subtitleColor,
                letterSpacing: "0.15em",
                fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
                lineHeight: 1.2,
              }}
            >
              SKILL DEVELOPMENT INSTITUTE
            </span>
          )}
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: "none", display: "inline-flex" }} aria-label="আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউট">
        {content}
      </Link>
    );
  }

  return content;
}

export { LogoIcon };
